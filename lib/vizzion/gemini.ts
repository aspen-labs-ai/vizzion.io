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
const DEFAULT_IMAGE_SIZE = '512';
const SUPPORTED_IMAGE_SIZES = new Set(['512', '1K', '2K', '4K']);
const SUPPORTED_ASPECT_RATIOS = [
  '1:1',
  '1:4',
  '1:8',
  '2:3',
  '3:2',
  '3:4',
  '4:1',
  '4:3',
  '4:5',
  '5:4',
  '8:1',
  '9:16',
  '16:9',
  '21:9',
] as const;
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
  /** What the photo depicts, used to phrase preservation context. */
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

export function getGeminiImageSize(): string {
  const size = process.env.GEMINI_IMAGE_SIZE?.trim() || DEFAULT_IMAGE_SIZE;
  return SUPPORTED_IMAGE_SIZES.has(size) ? size : DEFAULT_IMAGE_SIZE;
}

const SUBJECT_DESCRIPTORS: Record<WidgetSubjectType, string> = {
  home: 'the exterior of a home or building',
  vehicle: 'a vehicle',
  body: "a person's body",
  yard: 'an outdoor yard or property',
  boat: 'a boat',
  room: 'an interior room',
  generic: 'the main subject in the scene',
};

/**
 * Builds the image-edit instruction. The customer describes a material in plain
 * terms (name + optional description + optional reference photo); the widget's
 * target_surface says where it goes; subject_type supplies the realism /
 * preservation context so unrelated parts of the photo stay untouched. No
 * "prompt engineering" is exposed to the customer — this template is the only
 * place the model instruction is assembled.
 */
export function buildVisualizationPrompt(
  subjectType: WidgetSubjectType,
  material: GeminiMaterialInput,
  hasReferenceImage: boolean,
  targetSurface: string | null,
): string {
  const subject = SUBJECT_DESCRIPTORS[subjectType] ?? SUBJECT_DESCRIPTORS.generic;
  const surface = targetSurface?.trim() || 'the primary surface';

  const description = material.promptModifier?.trim();
  const descriptionNote = description ? ` Material details: ${description}.` : '';

  const referenceNote = hasReferenceImage
    ? ` The second image is a real sample of ${material.name} — match its texture, color, and pattern precisely.`
    : '';

  return [
    `Using the uploaded photo of ${subject}, change only ${surface} to ${material.name}.${descriptionNote}${referenceNote}`,
    'Keep everything else in the image exactly the same, preserving the original style, lighting, and composition.',
  ].join('\n');
}

function aspectRatioValue(value: string): number {
  const [width, height] = value.split(':').map(Number);
  return width / height;
}

function getClosestSupportedAspectRatio(width: number, height: number): string {
  const inputRatio = width / height;
  return SUPPORTED_ASPECT_RATIOS.reduce((closest, candidate) => {
    const currentDelta = Math.abs(aspectRatioValue(closest) - inputRatio);
    const candidateDelta = Math.abs(aspectRatioValue(candidate) - inputRatio);
    return candidateDelta < currentDelta ? candidate : closest;
  }, '1:1');
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
  imageSize: string,
  aspectRatio: string,
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
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
            responseFormat: {
              image: {
                aspectRatio,
                imageSize,
              },
            },
          },
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
  const imageSize = getGeminiImageSize();

  // Normalize the input to JPEG before sending it to the image-edit model.
  const inputJpeg = await sharp(input.imageBuffer).jpeg({ quality: 92 }).toBuffer();
  const metadata = await sharp(inputJpeg).metadata();
  const aspectRatio = getClosestSupportedAspectRatio(
    metadata.width ?? 1,
    metadata.height ?? 1,
  );

  const reference = await fetchReferenceImage(
    input.material.swatchUrl ?? input.material.textureUrl,
  );
  const prompt = buildVisualizationPrompt(
    input.subjectType,
    input.material,
    Boolean(reference),
    input.targetSurface,
  );

  const parts: Array<Record<string, unknown>> = [
    { text: prompt },
    { inline_data: { mime_type: 'image/jpeg', data: inputJpeg.toString('base64') } },
  ];
  if (reference) {
    parts.push({
      inline_data: { mime_type: reference.mimeType, data: reference.data },
    });
  }

  let lastError: GeminiGenerationError | null = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const generatedBase64 = await callGeminiOnce(apiKey, model, imageSize, aspectRatio, parts);
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
