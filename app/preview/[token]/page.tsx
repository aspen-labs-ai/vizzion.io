import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PreviewComparisonSlider from '@/components/preview/PreviewComparisonSlider';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your Visualization Preview | Vizzion',
  robots: {
    index: false,
    follow: false,
  },
};

const SIGNED_URL_TTL_SECONDS = 60 * 60;

function normalizeStoragePath(path: string, bucket: 'uploads-original' | 'renders-generated'): string {
  const normalized = path.trim().replace(/^\/+/, '');
  return normalized.startsWith(`${bucket}/`)
    ? normalized.slice(bucket.length + 1)
    : normalized;
}

function getMaterialName(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const name = (value as { name?: unknown }).name;
  return typeof name === 'string' && name.trim() ? name.trim() : null;
}

function sanitizeBrandColor(value: string | null | undefined): string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value.trim())
    ? value.trim()
    : '#10B981';
}

export default async function SharedPreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const trimmedToken = token.trim();
  if (!/^[a-zA-Z0-9_-]{24,80}$/.test(trimmedToken)) {
    notFound();
  }

  const supabase = createAdminClient();
  const previewResult = await supabase
    .from('generated_previews')
    .select('id, workspace_id, widget_id, original_upload_path, generated_path, material_snapshot, share_expires_at')
    .eq('share_token', trimmedToken)
    .maybeSingle();

  if (previewResult.error || !previewResult.data) {
    notFound();
  }

  const preview = previewResult.data as {
    id: string;
    workspace_id: string;
    widget_id: string;
    original_upload_path: string | null;
    generated_path: string | null;
    material_snapshot: Record<string, unknown> | null;
    share_expires_at: string | null;
  };

  const expired =
    preview.share_expires_at !== null
    // eslint-disable-next-line react-hooks/purity -- This is a dynamic server page; expiry is evaluated per request.
    && new Date(preview.share_expires_at).getTime() <= Date.now();

  if (!preview.original_upload_path || !preview.generated_path || expired) {
    return <PreviewUnavailable expired={expired} />;
  }

  const [workspaceResult, widgetResult, originalSigned, generatedSigned] = await Promise.all([
    supabase
      .from('workspaces')
      .select('company_name, name, logo_url, brand_color')
      .eq('id', preview.workspace_id)
      .maybeSingle(),
    supabase
      .from('widgets')
      .select('brand_color')
      .eq('id', preview.widget_id)
      .maybeSingle(),
    supabase.storage
      .from('uploads-original')
      .createSignedUrl(
        normalizeStoragePath(preview.original_upload_path, 'uploads-original'),
        SIGNED_URL_TTL_SECONDS,
      ),
    supabase.storage
      .from('renders-generated')
      .createSignedUrl(
        normalizeStoragePath(preview.generated_path, 'renders-generated'),
        SIGNED_URL_TTL_SECONDS,
      ),
  ]);

  if (!originalSigned.data?.signedUrl || !generatedSigned.data?.signedUrl) {
    return <PreviewUnavailable />;
  }

  const workspace = workspaceResult.data as {
    company_name: string | null;
    name: string;
    logo_url: string | null;
    brand_color: string | null;
  } | null;
  const widget = widgetResult.data as { brand_color: string | null } | null;
  const companyName = workspace?.company_name?.trim() || workspace?.name?.trim() || 'Your contractor';
  const brandColor = sanitizeBrandColor(widget?.brand_color || workspace?.brand_color);
  const materialName = getMaterialName(preview.material_snapshot);

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-10 text-slate-950 md:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-7 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            {workspace?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- customer logo URL
              <img
                src={workspace.logo_url}
                alt={companyName}
                className="h-11 w-11 rounded-xl border border-slate-200 bg-white object-contain p-1.5 shadow-sm"
              />
            ) : (
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-bold shadow-sm"
                style={{ color: brandColor }}
              >
                {companyName[0]?.toUpperCase() ?? 'V'}
              </div>
            )}
            <span className="text-base font-bold" style={{ color: brandColor }}>{companyName}</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Your new look is ready
          </h1>
          {materialName ? (
            <p className="text-lg text-slate-600">
              {materialName}
            </p>
          ) : null}
        </header>

        <PreviewComparisonSlider
          beforeUrl={originalSigned.data.signedUrl}
          afterUrl={generatedSigned.data.signedUrl}
          brandColor={brandColor}
        />

        <p className="mt-5 text-center text-sm text-slate-500">
          Questions? Just reply to {companyName}&apos;s email.
        </p>

        <a
          href="https://vizzion.io"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 flex items-center justify-center gap-2 text-slate-400 transition hover:text-slate-600"
        >
          <span className="text-xs font-medium uppercase tracking-[0.18em]">Powered by</span>
          {/* eslint-disable-next-line @next/next/no-img-element -- static marketing logo */}
          <img src="/vizzion-logo.png" alt="Vizzion" className="h-5 w-auto opacity-80" />
        </a>
      </div>
    </main>
  );
}

function PreviewUnavailable({ expired = false }: { expired?: boolean }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-950">
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Preview unavailable</p>
        <h1 className="mt-3 text-3xl font-bold">
          {expired ? 'This preview link has expired' : 'We could not load this preview'}
        </h1>
        <p className="mt-3 text-slate-600">
          {expired
            ? 'For privacy, visualization links are only available for a limited time.'
            : 'The preview may have expired or the images may no longer be available.'}
        </p>
      </div>
    </main>
  );
}
