import { randomUUID } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  GeminiGenerationError,
  generateVisualization,
} from '@/lib/vizzion/gemini';
import type { WidgetSubjectType } from '@/lib/vizzion/widget-public';

/**
 * Drains a single queued generation job: loads the uploaded photo + material,
 * calls Gemini, stores the result, records the preview, updates the job, and
 * (if a lead opted in) emails the finished visualization.
 *
 * Designed to be invoked immediately after enqueue via next/server `after()`
 * for a few-seconds turnaround, and also from a cron backstop that recovers
 * jobs which were interrupted mid-flight.
 */

const UPLOADS_BUCKET = 'uploads-original';
const RENDERS_BUCKET = 'renders-generated';
const RESULT_SIGNED_URL_TTL_SECONDS = 7 * 24 * 60 * 60;
/** A job stuck in 'processing' longer than this is assumed dead and recoverable. */
const STALE_PROCESSING_MS = 3 * 60 * 1000;

interface GenerationJobRow {
  id: string;
  workspace_id: string;
  widget_id: string;
  session_id: string | null;
  lead_id: string | null;
  status: string;
  prompt: string | null;
}

interface GenerationPromptPayload {
  uploadId?: string;
  uploadPath?: string;
  materialId?: string | null;
  sourcePage?: string | null;
  subjectType?: WidgetSubjectType;
  requireEmail?: boolean;
}

function parsePromptPayload(prompt: string | null): GenerationPromptPayload {
  if (!prompt) {
    return {};
  }
  try {
    return JSON.parse(prompt) as GenerationPromptPayload;
  } catch {
    return {};
  }
}

function normalizeStoragePath(path: string, bucket: string): string {
  const normalized = path.trim().replace(/^\/+/, '');
  return normalized.startsWith(`${bucket}/`)
    ? normalized.slice(bucket.length + 1)
    : normalized;
}

async function recordEvent(
  supabase: SupabaseClient,
  job: GenerationJobRow,
  eventType: string,
  eventData: Record<string, unknown>,
): Promise<void> {
  await supabase.from('widget_events').insert({
    workspace_id: job.workspace_id,
    widget_id: job.widget_id,
    session_id: job.session_id,
    event_type: eventType,
    event_data: eventData,
  });
}

async function markFailed(
  supabase: SupabaseClient,
  job: GenerationJobRow,
  code: string,
  message: string,
): Promise<void> {
  await supabase
    .from('generation_jobs')
    .update({
      status: 'failed',
      error_message: `${code}: ${message}`.slice(0, 500),
      completed_at: new Date().toISOString(),
    })
    .eq('id', job.id);

  if (job.lead_id) {
    await supabase
      .from('leads')
      .update({ email_status: 'failed' })
      .eq('id', job.lead_id);
  }

  await recordEvent(supabase, job, 'generation_failed', { code, message });
}

function buildResultEmailHtml(previewUrl: string): string {
  return `<div style="font-family:Arial,sans-serif;background:#0d1117;color:#f9fafb;padding:24px;line-height:1.5;">
    <h2 style="margin:0 0 12px;color:#10B981;">Your visualization is ready</h2>
    <p style="margin:0 0 16px;">Here is your personalized preview. Tap the image to view it full size.</p>
    <a href="${previewUrl}" style="display:inline-block;">
      <img src="${previewUrl}" alt="Your visualization" style="max-width:100%;border-radius:12px;border:1px solid #30363d;" />
    </a>
    <p style="margin:16px 0 0;color:#9ca3af;font-size:13px;">This preview link expires in 7 days.</p>
  </div>`;
}

async function sendResultEmail(
  supabase: SupabaseClient,
  job: GenerationJobRow,
  generatedPath: string,
): Promise<void> {
  if (!job.lead_id) {
    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;
  if (!resendApiKey || !resendFromEmail) {
    return;
  }

  const leadResult = await supabase
    .from('leads')
    .select('email')
    .eq('id', job.lead_id)
    .maybeSingle();

  const email = (leadResult.data as { email: string } | null)?.email;
  if (!email) {
    return;
  }

  const signed = await supabase.storage
    .from(RENDERS_BUCKET)
    .createSignedUrl(generatedPath, RESULT_SIGNED_URL_TTL_SECONDS);

  const previewUrl = signed.data?.signedUrl;
  if (!previewUrl) {
    return;
  }

  const resend = new Resend(resendApiKey);
  const emailResult = await resend.emails.send({
    from: resendFromEmail,
    to: [email],
    subject: 'Your Vizzion visualization is ready',
    html: buildResultEmailHtml(previewUrl),
  });

  await supabase
    .from('leads')
    .update({
      email_status: emailResult.error ? 'failed' : 'sent',
      preview_sent_at: emailResult.error ? null : new Date().toISOString(),
    })
    .eq('id', job.lead_id);
}

/**
 * Processes one job by id. Safe to call more than once: it atomically claims the
 * job by flipping queued/stale->processing, so concurrent invocations (eager
 * trigger + cron backstop) won't double-generate.
 */
export async function processGenerationJob(
  jobId: string,
  client?: SupabaseClient,
): Promise<{ ok: boolean; status: string; reason?: string }> {
  const supabase = client ?? createAdminClient();

  const jobResult = await supabase
    .from('generation_jobs')
    .select('id, workspace_id, widget_id, session_id, lead_id, status, prompt')
    .eq('id', jobId)
    .maybeSingle();

  if (jobResult.error || !jobResult.data) {
    return { ok: false, status: 'not_found' };
  }

  const job = jobResult.data as GenerationJobRow;

  // Atomically claim the job — flip queued -> processing, or reclaim a row that
  // has been stuck in processing past the stale window. Done as two simple
  // equality updates (a combined .or() filter with an embedded timestamp does
  // not match reliably on UPDATE). The row-level update guards against two
  // workers generating the same job.
  const nowIso = new Date().toISOString();
  const staleBefore = new Date(Date.now() - STALE_PROCESSING_MS).toISOString();

  let claim = await supabase
    .from('generation_jobs')
    .update({ status: 'processing', updated_at: nowIso })
    .eq('id', job.id)
    .eq('status', 'queued')
    .select('id')
    .maybeSingle();

  if (!claim.error && !claim.data) {
    claim = await supabase
      .from('generation_jobs')
      .update({ status: 'processing', updated_at: nowIso })
      .eq('id', job.id)
      .eq('status', 'processing')
      .lt('updated_at', staleBefore)
      .select('id')
      .maybeSingle();
  }

  if (claim.error || !claim.data) {
    return { ok: false, status: 'already_claimed' };
  }

  const payload = parsePromptPayload(job.prompt);
  const uploadPath = payload.uploadPath;
  const subjectType = payload.subjectType ?? 'home';

  if (!uploadPath) {
    await markFailed(supabase, job, 'missing_upload', 'No upload path on job.');
    return { ok: false, status: 'failed', reason: 'missing_upload' };
  }

  try {
    // 1. Download the customer's original photo.
    const download = await supabase.storage
      .from(UPLOADS_BUCKET)
      .download(normalizeStoragePath(uploadPath, UPLOADS_BUCKET));

    if (download.error || !download.data) {
      await markFailed(supabase, job, 'upload_unreadable', 'Could not download upload.');
      return { ok: false, status: 'failed', reason: 'upload_unreadable' };
    }

    const imageBuffer = Buffer.from(await download.data.arrayBuffer());
    const imageMimeType = download.data.type || 'image/jpeg';

    // 2a. Resolve the widget's target surface (where materials get applied).
    const widgetResult = await supabase
      .from('widgets')
      .select('target_surface')
      .eq('id', job.widget_id)
      .maybeSingle();
    const targetSurface =
      (widgetResult.data as { target_surface: string | null } | null)?.target_surface ?? null;

    // 2b. Resolve the selected material (name + plain description + reference image).
    let material = {
      name: 'the selected material',
      promptModifier: null as string | null,
      swatchUrl: null as string | null,
      textureUrl: null as string | null,
    };

    if (payload.materialId) {
      const materialResult = await supabase
        .from('materials')
        .select('name, prompt_modifier, swatch_url, texture_url')
        .eq('id', payload.materialId)
        .maybeSingle();

      if (materialResult.data) {
        const row = materialResult.data as {
          name: string;
          prompt_modifier: string | null;
          swatch_url: string | null;
          texture_url: string | null;
        };
        material = {
          name: row.name,
          promptModifier: row.prompt_modifier,
          swatchUrl: row.swatch_url,
          textureUrl: row.texture_url,
        };
      }
    }

    // 3. Generate the visualization.
    const result = await generateVisualization({
      imageBuffer,
      imageMimeType,
      subjectType,
      targetSurface,
      material,
    });

    // 4. Store the rendered image.
    const generatedPath = `${job.workspace_id}/${job.widget_id}/${job.session_id ?? 'anon'}/${job.id}-${randomUUID()}.jpg`;
    const upload = await supabase.storage
      .from(RENDERS_BUCKET)
      .upload(generatedPath, result.imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (upload.error) {
      await markFailed(supabase, job, 'render_store_failed', upload.error.message);
      return { ok: false, status: 'failed', reason: 'render_store_failed' };
    }

    // 5. Record the preview + 6. mark the job succeeded.
    await supabase.from('generated_previews').upsert(
      {
        workspace_id: job.workspace_id,
        widget_id: job.widget_id,
        lead_id: job.lead_id,
        generation_job_id: job.id,
        original_upload_path: uploadPath,
        generated_path: generatedPath,
        material_snapshot: {
          materialId: payload.materialId ?? null,
          name: material.name,
          promptModifier: material.promptModifier,
        },
        metadata: {
          model: result.model,
          subjectType,
          retentionExpiresAt: new Date(
            Date.now() + RESULT_SIGNED_URL_TTL_SECONDS * 1000,
          ).toISOString(),
        },
      },
      { onConflict: 'generation_job_id' },
    );

    await supabase
      .from('generation_jobs')
      .update({
        status: 'succeeded',
        provider_model: result.model,
        completed_at: new Date().toISOString(),
        error_message: null,
      })
      .eq('id', job.id);

    await recordEvent(supabase, job, 'generation_succeeded', {
      model: result.model,
      generatedPath,
    });

    // 7. Email the finished visualization to the captured lead (best effort).
    try {
      await sendResultEmail(supabase, job, generatedPath);
    } catch {
      // Email failure must not fail an otherwise successful generation.
    }

    return { ok: true, status: 'succeeded' };
  } catch (error) {
    const code =
      error instanceof GeminiGenerationError ? error.code : 'worker_error';
    const message = error instanceof Error ? error.message : 'Unknown error.';
    await markFailed(supabase, job, code, message);
    return { ok: false, status: 'failed', reason: code };
  }
}

/**
 * Backstop sweep: claims and processes any jobs that are still queued, or stuck
 * in processing beyond the stale threshold. Returns how many it handled.
 */
export async function processStuckGenerationJobs(
  limit = 5,
): Promise<{ processed: number; results: Array<{ id: string; status: string }> }> {
  const supabase = createAdminClient();
  const staleBefore = new Date(Date.now() - STALE_PROCESSING_MS).toISOString();

  const candidates = await supabase
    .from('generation_jobs')
    .select('id, status, updated_at')
    .or(`status.eq.queued,and(status.eq.processing,updated_at.lt.${staleBefore})`)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (candidates.error || !candidates.data) {
    return { processed: 0, results: [] };
  }

  const results: Array<{ id: string; status: string }> = [];
  for (const row of candidates.data as Array<{ id: string }>) {
    const outcome = await processGenerationJob(row.id, supabase);
    results.push({ id: row.id, status: outcome.status });
  }

  return { processed: results.length, results };
}
