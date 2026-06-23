import sharp from 'sharp';
import type { WidgetSubjectType } from '@/lib/vizzion/widget-public';

/**
 * Gemini image-generation client for Vizzion visualizations.
 *
 * Takes a customer-uploaded photo plus a tenant-defined material and produces a
 * realistic "after" image showing the material applied to the photo's subject.
 * Provider/model and image size are configurable via env so quality/cost can be
 * tuned without code changes.
 */

const GENERATE_CONTENT_BASE =
  'https://generativelanguage.googleapis.com/v1/models';

const DEFAULT_IMAGE_MODEL = 'gemini-3.1-flash-image';
const REQUEST_TIMEOUT_MS = 55_000;
const MAX_ATTEMPTS = 2;

export interface GeminiMaterialInput {
  name: string;
  promptModifier: string | null;
  swatchUrl: string | null;
  textureUrl: string | null;
}

export interface GenerateVisualizationInput {
  /** Raw bytes of the customer's uploaded photo. */
  imageBuffer: Buffer;
  /** MIME type of the uploaded photo (image/jpeg, image/png, image/webp). */
  imageMimeType: string;
  /** What the photo depicts. Stored as run metadata; not used in the prompt. */
  subjectType: WidgetSubjectType;
  /**
   * Plain phrase for the surface this widget changes (e.g. "the roof", "the
   * siding"). Configured once per widget so materials only carry their own
   * name/description. Falls back to "the primary surface" when unset.
   */
  targetSurface: string | null;
  material: GeminiMaterialInput;
}

export interface GenerateVisualizationResult {
  /** JPEG bytes of the generated visualization, resized to the input dimensions. */
  imageBuffer: Buffer;
  mimeType: 'image/jpeg';
  model: string;
  prompt: string;
}

export class GeminiGenerationError extends Error {
  readonly code: string;
  readonly retryable: boolean;

  constructor(message: string, code: string, retryable = false) {
    super(message);
    this.name = 'GeminiGenerationError';
    this.code = code;
    this.retryable = retryable;
  }
}

export function getGeminiApiKey(): string | null {
  const key =
    process.env.GOOGLE_GEMINI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    '';

  if (!key || key === 'your_regenerated_gemini_api_key_here') {
    return null;
  }

  return key;
}

export function getGeminiImageModel(): string {
  return process.env.GEMINI_IMAGE_MODEL?.trim() || DEFAULT_IMAGE_MODEL;
}

/**
 * Builds the image-edit instruction. Kept deliberately short and literal so the
 * model has little room to reinterpret the scene: name the surface to change,
 * the material to apply (and the reference image when present), then a hard
 * instruction to leave everything else untouched. The customer supplies the
 * material name + optional plain description; target_surface says where it goes.
 * No "prompt engineering" is exposed to the customer — this template is the only
 * place the model instruction is assembled.
 */
export function buildVisualizationPrompt(
  material: GeminiMaterialInput,
  hasReferenceImage: boolean,
  targetSurface: string | null,
): string {
  const surface = targetSurface?.trim() || 'the primary surface';
  const description = material.promptModifier?.trim();
  const photo = hasReferenceImage ? 'the first image' : 'the image';

  let instruction = `Using ${photo}, change only ${surface} to a new material: ${material.name}.`;
  if (description) {
    instruction += ` The material is ${description}.`;
  }
  if (hasReferenceImage) {
    instruction += ` You can see this exact material in the second image — match its color, texture, and pattern.`;
  }

  return [
    instruction,
    `Make ${surface} look freshly installed and brand-new.`,
    `Keep everything else in the image exactly the same. Only ${surface} should change.`,
  ].join('\n');
}

async function fetchReferenceImage(
  url: string | null,
): Promise<{ data: string; mimeType: string } | null> {
  if (!url) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    return { data: buffer.toString('base64'), mimeType };
  } catch {
    return null;
  }
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: { mimeType?: string; data?: string };
        inline_data?: { mime_type?: string; data?: string };
      }>;
    };
  }>;
}

function extractImageBase64(data: GeminiResponse): string | null {
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const inline = part.inlineData ?? part.inline_data;
    const value =
      (inline as { data?: string } | undefined)?.data ?? undefined;
    if (value) {
      return value;
    }
  }
  return null;
}

async function callGeminiOnce(
  apiKey: string,
  model: string,
  parts: Array<Record<string, unknown>>,
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(
      `${GENERATE_CONTENT_BASE}/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts }],
        }),
        signal: controller.signal,
      },
    );
  } catch (error) {
    throw new GeminiGenerationError(
      error instanceof Error ? error.message : 'Network error calling Gemini.',
      'network_error',
      true,
    );
  } finally {
    clearTimeout(timeout);
  }

  const responseText = await response.text();

  if (!response.ok) {
    const retryable = response.status === 429 || response.status >= 500;
    throw new GeminiGenerationError(
      `Gemini API error ${response.status}: ${responseText.slice(0, 300)}`,
      `api_error_${response.status}`,
      retryable,
    );
  }

  let data: GeminiResponse;
  try {
    data = JSON.parse(responseText) as GeminiResponse;
  } catch {
    throw new GeminiGenerationError(
      'Failed to parse Gemini response.',
      'parse_error',
      true,
    );
  }

  const imageBase64 = extractImageBase64(data);
  if (!imageBase64) {
    throw new GeminiGenerationError(
      'Gemini returned no image in the response.',
      'no_image',
      true,
    );
  }

  return imageBase64;
}

/**
 * Generates a visualization image. Throws GeminiGenerationError on failure so
 * the caller (worker) can record a structured error and mark the job failed.
 */
export async function generateVisualization(
  input: GenerateVisualizationInput,
): Promise<GenerateVisualizationResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new GeminiGenerationError(
      'Gemini API key is not configured (set GOOGLE_GEMINI_API_KEY).',
      'missing_api_key',
      false,
    );
  }

  const model = getGeminiImageModel();

  // Normalize the input to JPEG before sending it to the image-edit model.
  // .rotate() with no args bakes in EXIF orientation first, so phone photos
  // (often stored sideways with an orientation flag) aren't sent rotated.
  const inputJpeg = await sharp(input.imageBuffer).rotate().jpeg({ quality: 92 }).toBuffer();

  const reference = await fetchReferenceImage(
    input.material.swatchUrl ?? input.material.textureUrl,
  );
  const prompt = buildVisualizationPrompt(
    input.material,
    Boolean(reference),
    input.targetSurface,
  );

  const parts: Array<Record<string, unknown>> = [
    { text: prompt },
    { inlineData: { mimeType: 'image/jpeg', data: inputJpeg.toString('base64') } },
  ];
  if (reference) {
    parts.push({
      inlineData: { mimeType: reference.mimeType, data: reference.data },
    });
  }

  let lastError: GeminiGenerationError | null = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const generatedBase64 = await callGeminiOnce(apiKey, model, parts);
      const resized = await sharp(Buffer.from(generatedBase64, 'base64'))
        .jpeg({ quality: 90 })
        .toBuffer();

      return {
        imageBuffer: resized,
        mimeType: 'image/jpeg',
        model,
        prompt,
      };
    } catch (error) {
      lastError =
        error instanceof GeminiGenerationError
          ? error
          : new GeminiGenerationError(
              error instanceof Error ? error.message : 'Unknown error.',
              'unknown',
              false,
            );

      if (!lastError.retryable || attempt === MAX_ATTEMPTS) {
        break;
      }
    }
  }

  throw lastError ?? new GeminiGenerationError('Generation failed.', 'unknown');
}
