import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { publicJsonResponse, publicOptionsResponse } from '@/lib/vizzion/cors';
import { isOriginAllowed, resolvePublicWidget } from '@/lib/vizzion/widget-public';

const DEFAULT_SIGNED_URL_TTL_SECONDS = 24 * 60 * 60;

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function normalizeStoragePath(path: string, bucket: 'uploads-original' | 'renders-generated'): string {
  const normalized = path.trim().replace(/^\/+/, '');
  if (!normalized) {
    return normalized;
  }

  if (normalized.startsWith(`${bucket}/`)) {
    return normalized.slice(bucket.length + 1);
  }

  return normalized;
}

function parseRetentionExpiry(metadata: Record<string, unknown> | null | undefined): string | null {
  if (!metadata) {
    return null;
  }

  const candidates = [
    metadata.retention_expires_at,
    metadata.retentionExpiresAt,
    metadata.expires_at,
    metadata.expiresAt,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== 'string') {
      continue;
    }

    const parsed = new Date(candidate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return null;
}

async function createSignedStorageUrl(params: {
  supabase: ReturnType<typeof createAdminClient>;
  bucket: 'uploads-original' | 'renders-generated';
  path: string | null;
}): Promise<{ url: string | null; expiresAt: string | null }> {
  if (!params.path) {
    return { url: null, expiresAt: null };
  }

  const normalizedPath = normalizeStoragePath(params.path, params.bucket);
  if (!normalizedPath) {
    return { url: null, expiresAt: null };
  }

  const signedUrlResult = await params.supabase.storage
    .from(params.bucket)
    .createSignedUrl(normalizedPath, DEFAULT_SIGNED_URL_TTL_SECONDS);

  if (signedUrlResult.error || !signedUrlResult.data?.signedUrl) {
    return { url: null, expiresAt: null };
  }

  return {
    url: signedUrlResult.data.signedUrl,
    expiresAt: new Date(Date.now() + DEFAULT_SIGNED_URL_TTL_SECONDS * 1000).toISOString(),
  };
}

export async function OPTIONS(request: NextRequest) {
  return publicOptionsResponse(request);
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const embedKey = request.nextUrl.searchParams.get('embedKey')?.trim();
  const generationJobId = request.nextUrl.searchParams.get('generationJobId')?.trim();
  const pageUrl =
    request.nextUrl.searchParams.get('pageUrl')?.trim()
    || request.nextUrl.searchParams.get('sourcePage')?.trim()
    || null;

  if (!embedKey || !generationJobId) {
    return publicJsonResponse({ error: 'embedKey and generationJobId are required.' }, 400, origin);
  }

  if (!isValidUuid(generationJobId)) {
    return publicJsonResponse({ error: 'Invalid generationJobId.' }, 400, origin);
  }

  try {
    const supabase = createAdminClient();
    const widget = await resolvePublicWidget(supabase, embedKey);

    if (!widget) {
      return publicJsonResponse({ error: 'Widget not found.' }, 404, origin);
    }

    if (!isOriginAllowed(widget.domain_allowlist, origin, pageUrl)) {
      return publicJsonResponse({ error: 'Origin not allowed.' }, 403, origin);
    }

    const generationResult = await supabase
      .from('generation_jobs')
      .select('id, status, error_message, created_at, completed_at, lead_id, session_id')
      .eq('id', generationJobId)
      .eq('widget_id', widget.id)
      .maybeSingle();

    if (generationResult.error || !generationResult.data) {
      return publicJsonResponse({ error: 'Generation job not found.' }, 404, origin);
    }

    const generationJob = generationResult.data as {
      id: string;
      status: string;
      error_message: string | null;
      created_at: string;
      completed_at: string | null;
      lead_id: string | null;
      session_id: string | null;
    };

    const previewResult = await supabase
      .from('generated_previews')
      .select('id, original_upload_path, generated_path, metadata')
      .eq('generation_job_id', generationJob.id)
      .maybeSingle();

    const preview = previewResult.data as
      | {
          id: string;
          original_upload_path: string | null;
          generated_path: string | null;
          metadata: Record<string, unknown> | null;
        }
      | null;

    let lead: { id: string; email_status: string } | null = null;
    if (generationJob.lead_id) {
      const leadResult = await supabase
        .from('leads')
        .select('id, email_status')
        .eq('id', generationJob.lead_id)
        .eq('widget_id', widget.id)
        .maybeSingle();

      lead = (leadResult.data as { id: string; email_status: string } | null) ?? null;
    }

    const emailOnlyDelivery = widget.delivery_mode === 'email';
    const [originalUpload, generatedPreview] = emailOnlyDelivery
      ? [
          { url: null, expiresAt: null },
          { url: null, expiresAt: null },
        ]
      : await Promise.all([
          createSignedStorageUrl({
            supabase,
            bucket: 'uploads-original',
            path: preview?.original_upload_path ?? null,
          }),
          createSignedStorageUrl({
            supabase,
            bucket: 'renders-generated',
            path: preview?.generated_path ?? null,
          }),
        ]);

    return publicJsonResponse(
      {
        generationJob: {
          id: generationJob.id,
          status: generationJob.status,
          errorMessage:
            generationJob.status === 'failed'
              ? 'Visualization could not be completed. Please try another photo.'
              : null,
          createdAt: generationJob.created_at,
          completedAt: generationJob.completed_at,
          leadId: generationJob.lead_id,
          sessionId: generationJob.session_id,
        },
        lead: lead
          ? {
              id: lead.id,
              emailStatus: lead.email_status,
            }
          : null,
        preview: preview
          ? {
              id: preview.id,
              originalUploadPath: emailOnlyDelivery ? null : preview.original_upload_path,
              generatedPath: emailOnlyDelivery ? null : preview.generated_path,
              originalUploadUrl: originalUpload.url,
              generatedPreviewUrl: generatedPreview.url,
              signedUrlExpiresAt: generatedPreview.expiresAt ?? originalUpload.expiresAt,
              retentionExpiresAt: parseRetentionExpiry(preview.metadata),
              deliveryMode: widget.delivery_mode,
            }
          : null,
      },
      200,
      origin,
    );
  } catch {
    return publicJsonResponse({ error: 'Unable to load generation status.' }, 500, origin);
  }
}
