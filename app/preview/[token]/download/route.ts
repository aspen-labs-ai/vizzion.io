import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  buildDownloadFilename,
  getMaterialName,
  isValidShareToken,
  normalizeStoragePath,
} from '@/lib/vizzion/preview-share';
import { applyLogoWatermark } from '@/lib/vizzion/watermark';

export const dynamic = 'force-dynamic';

const RENDERS_BUCKET = 'renders-generated';
const LOGO_FETCH_TIMEOUT_MS = 4000;

function notFound(): Response {
  return new Response('Not found', { status: 404 });
}

async function fetchLogo(url: string): Promise<Buffer | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LOGO_FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      return null;
    }
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType && !contentType.startsWith('image/')) {
      return null;
    }
    return Buffer.from(await response.arrayBuffer());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const trimmedToken = token.trim();
  if (!isValidShareToken(trimmedToken)) {
    return notFound();
  }

  const supabase = createAdminClient();
  const previewResult = await supabase
    .from('generated_previews')
    .select('workspace_id, generated_path, material_snapshot, share_expires_at')
    .eq('share_token', trimmedToken)
    .maybeSingle();

  if (previewResult.error || !previewResult.data) {
    return notFound();
  }

  const preview = previewResult.data as {
    workspace_id: string;
    generated_path: string | null;
    material_snapshot: Record<string, unknown> | null;
    share_expires_at: string | null;
  };

  const expired =
    preview.share_expires_at !== null
    && new Date(preview.share_expires_at).getTime() <= Date.now();

  if (!preview.generated_path || expired) {
    return notFound();
  }

  const download = await supabase.storage
    .from(RENDERS_BUCKET)
    .download(normalizeStoragePath(preview.generated_path, RENDERS_BUCKET));

  if (download.error || !download.data) {
    return notFound();
  }

  const baseBuffer = Buffer.from(await download.data.arrayBuffer());

  const workspaceResult = await supabase
    .from('workspaces')
    .select('company_name, name, logo_url')
    .eq('id', preview.workspace_id)
    .maybeSingle();

  const workspace = workspaceResult.data as {
    company_name: string | null;
    name: string;
    logo_url: string | null;
  } | null;

  const companyName =
    workspace?.company_name?.trim() || workspace?.name?.trim() || 'visualization';
  const filename = buildDownloadFilename(companyName, getMaterialName(preview.material_snapshot));

  let outputBuffer: Buffer = baseBuffer;
  if (workspace?.logo_url) {
    try {
      const logoBuffer = await fetchLogo(workspace.logo_url);
      if (logoBuffer) {
        outputBuffer = await applyLogoWatermark(baseBuffer, logoBuffer);
      }
    } catch {
      // Watermarking is a nice-to-have; never block the download on it.
      outputBuffer = baseBuffer;
    }
  }

  return new Response(new Uint8Array(outputBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, max-age=0, no-store',
    },
  });
}
