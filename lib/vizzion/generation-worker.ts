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
const SHARE_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_PUBLIC_APP_URL = 'https://app.vizzion.io';
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

interface ResultEmailBranding {
  companyName: string;
  logoUrl: string | null;
  brandColor: string;
  materialName: string | null;
  replyToEmail: string | null;
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

function getPublicAppUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (!value) {
    return DEFAULT_PUBLIC_APP_URL;
  }

  try {
    const parsed = new URL(value);
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      return DEFAULT_PUBLIC_APP_URL;
    }
    return parsed.origin;
  } catch {
    return DEFAULT_PUBLIC_APP_URL;
  }
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeBrandColor(value: string | null | undefined): string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value.trim())
    ? value.trim()
    : '#10B981';
}

function sanitizeReplyToEmail(value: string | null | undefined): string | null {
  const email = value?.trim().toLowerCase();
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

interface ResultEmailImageUrls {
  originalUrl: string | null;
  previewUrl: string;
  shareUrl: string | null;
}

function buildImageCard(label: string, imageUrl: string): string {
  return `<td bgcolor="#ffffff" style="width:50%;vertical-align:top;padding:0 6px 12px;background-color:#ffffff;">
    <p style="margin:0 0 8px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">${label}</p>
    <a href="${escapeHtml(imageUrl)}" style="display:block;text-decoration:none;">
      <img src="${escapeHtml(imageUrl)}" alt="${label}" style="display:block;width:100%;max-width:100%;border-radius:14px;border:1px solid #e2e8f0;background:#f8fafc;" />
    </a>
  </td>`;
}

function buildResultEmailHtml(images: ResultEmailImageUrls, branding: ResultEmailBranding): string {
  const companyName = escapeHtml(branding.companyName);
  const materialLine = branding.materialName
    ? `<p style="margin:0;color:#64748b;font-size:14px;">Selected material</p>
       <p style="margin:4px 0 0;color:#0f172a;font-size:16px;font-weight:700;">${escapeHtml(branding.materialName)}</p>`
    : '';
  const logo = branding.logoUrl
    ? `<img src="${escapeHtml(branding.logoUrl)}" alt="${companyName}" style="display:block;max-width:150px;max-height:52px;object-fit:contain;margin:0;" />`
    : '';
  const replyLine = branding.replyToEmail
    ? `<p style="margin:18px 0 0;color:#64748b;font-size:13px;">Questions? Reply to this email and ${companyName} will receive it.</p>`
    : '';
  const originalCard = images.originalUrl ? buildImageCard('Before', images.originalUrl) : '';
  const previewCard = buildImageCard(images.originalUrl ? 'After' : 'Preview', images.previewUrl);
  const compareButton = images.shareUrl
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0 18px;">
        <tr>
          <td align="center" bgcolor="${branding.brandColor}" style="border-radius:14px;background:${branding.brandColor};box-shadow:0 10px 24px rgba(15,23,42,0.16);">
            <a href="${escapeHtml(images.shareUrl)}" style="display:block;padding:15px 20px;color:#07111f;font-size:15px;font-weight:800;text-decoration:none;border-radius:14px;">Open interactive before/after slider</a>
          </td>
        </tr>
      </table>`
    : '';

  return `<div style="margin:0;padding:0;background:#f1f5f9;background-color:#f1f5f9;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f1f5f9" style="background:#f1f5f9;background-color:#f1f5f9;margin:0;padding:0;">
      <tr>
        <td align="center" bgcolor="#f1f5f9" style="padding:28px 14px;background:#f1f5f9;background-color:#f1f5f9;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="max-width:760px;background:#ffffff;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:22px;overflow:hidden;font-family:Arial,sans-serif;color:#0f172a;">
            <tr>
              <td bgcolor="#ffffff" style="padding:26px 28px 18px;background:#ffffff;background-color:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="background:#ffffff;background-color:#ffffff;">
                  <tr>
                    <td style="vertical-align:middle;">${logo || `<p style="margin:0;color:${branding.brandColor};font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">${companyName}</p>`}</td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="display:inline-block;border:1px solid ${branding.brandColor};border-radius:999px;padding:6px 10px;color:${branding.brandColor};font-size:12px;font-weight:700;">Visualization ready</span>
                    </td>
                  </tr>
                </table>
                ${logo ? `<p style="margin:16px 0 0;color:${branding.brandColor};font-size:13px;font-weight:800;">${companyName}</p>` : ''}
                <h1 style="margin:10px 0 8px;color:#0f172a;font-size:28px;line-height:1.15;letter-spacing:-.02em;">Your visualization is ready</h1>
                <p style="margin:0;color:#475569;font-size:15px;line-height:1.6;">Here is the personalized preview created from your uploaded photo.</p>
                ${compareButton}
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" style="padding:0 22px 8px;background:#ffffff;background-color:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="background:#ffffff;background-color:#ffffff;">
                  <tr>${originalCard}${previewCard}</tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" style="padding:4px 28px 26px;background:#ffffff;background-color:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f8fafc" style="background:#f8fafc;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
                  <tr>
                    <td bgcolor="#f8fafc" style="padding:16px 18px;background:#f8fafc;background-color:#f8fafc;border-radius:16px;">
                      ${materialLine}
                      <p style="margin:14px 0 0;color:#64748b;font-size:13px;">Tap either image to view it full size. Preview links expire in 7 days.</p>
                      ${replyLine}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

async function loadResultEmailBranding(
  supabase: SupabaseClient,
  job: GenerationJobRow,
  materialId: string | null | undefined,
): Promise<ResultEmailBranding> {
  const [workspaceResult, widgetResult, materialResult] = await Promise.all([
    supabase
      .from('workspaces')
      .select('name, company_name, logo_url, brand_color, reply_to_email')
      .eq('id', job.workspace_id)
      .maybeSingle(),
    supabase
      .from('widgets')
      .select('brand_color')
      .eq('id', job.widget_id)
      .maybeSingle(),
    materialId
      ? supabase
          .from('materials')
          .select('name')
          .eq('id', materialId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const workspace = workspaceResult.data as {
    name: string;
    company_name: string | null;
    logo_url: string | null;
    brand_color: string | null;
    reply_to_email: string | null;
  } | null;
  const widget = widgetResult.data as { brand_color: string | null } | null;
  const material = materialResult.data as { name: string } | null;

  return {
    companyName: workspace?.company_name?.trim() || workspace?.name?.trim() || 'Vizzion',
    logoUrl: workspace?.logo_url ?? null,
    brandColor: sanitizeBrandColor(widget?.brand_color || workspace?.brand_color),
    materialName: material?.name ?? null,
    replyToEmail: sanitizeReplyToEmail(workspace?.reply_to_email),
  };
}

async function updateLeadEmailStatus(
  supabase: SupabaseClient,
  leadId: string,
  status: 'sent' | 'failed',
): Promise<void> {
  await supabase
    .from('leads')
    .update({
      email_status: status,
      preview_sent_at: status === 'sent' ? new Date().toISOString() : null,
    })
    .eq('id', leadId);
}

async function sendResultEmail(
  supabase: SupabaseClient,
  job: GenerationJobRow,
  originalUploadPath: string,
  generatedPath: string,
  shareUrl: string | null,
): Promise<void> {
  if (!job.lead_id) {
    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;
  if (!resendApiKey || !resendFromEmail) {
    await updateLeadEmailStatus(supabase, job.lead_id, 'failed');
    return;
  }

  const leadResult = await supabase
    .from('leads')
    .select('email')
    .eq('id', job.lead_id)
    .maybeSingle();

  const email = (leadResult.data as { email: string } | null)?.email;
  if (!email) {
    await updateLeadEmailStatus(supabase, job.lead_id, 'failed');
    return;
  }

  const [originalSigned, previewSigned] = await Promise.all([
    supabase.storage
      .from(UPLOADS_BUCKET)
      .createSignedUrl(normalizeStoragePath(originalUploadPath, UPLOADS_BUCKET), RESULT_SIGNED_URL_TTL_SECONDS),
    supabase.storage
      .from(RENDERS_BUCKET)
      .createSignedUrl(generatedPath, RESULT_SIGNED_URL_TTL_SECONDS),
  ]);

  const previewUrl = previewSigned.data?.signedUrl;
  if (!previewUrl) {
    await updateLeadEmailStatus(supabase, job.lead_id, 'failed');
    return;
  }

  const payload = parsePromptPayload(job.prompt);
  const branding = await loadResultEmailBranding(supabase, job, payload.materialId);

  const resend = new Resend(resendApiKey);
  let emailResult: Awaited<ReturnType<typeof resend.emails.send>>;
  try {
    const sendOptions = {
      from: resendFromEmail,
      to: [email],
      subject: `Your ${branding.companyName} visualization is ready`,
      html: buildResultEmailHtml(
        {
          originalUrl: originalSigned.data?.signedUrl ?? null,
          previewUrl,
          shareUrl,
        },
        branding,
      ),
      ...(branding.replyToEmail ? { replyTo: branding.replyToEmail } : {}),
    };

    emailResult = await resend.emails.send({
      ...sendOptions,
    });
  } catch {
    await updateLeadEmailStatus(supabase, job.lead_id, 'failed');
    return;
  }

  await updateLeadEmailStatus(supabase, job.lead_id, emailResult.error ? 'failed' : 'sent');
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
    const shareToken = randomUUID().replace(/-/g, '');
    const shareExpiresAt = new Date(Date.now() + SHARE_LINK_TTL_MS).toISOString();
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
        share_token: shareToken,
        share_expires_at: shareExpiresAt,
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
      await sendResultEmail(supabase, job, uploadPath, generatedPath, `${getPublicAppUrl()}/preview/${shareToken}`);
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
