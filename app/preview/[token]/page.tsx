import type { Metadata } from 'next';
import { after } from 'next/server';
import { notFound } from 'next/navigation';
import PreviewComparisonSlider from '@/components/preview/PreviewComparisonSlider';
import { readableBrandOnLight, readableTextOn, sanitizeBrandColor } from '@/lib/vizzion/brand-color';
import {
  buildDownloadFilename,
  getMaterialName,
  isValidShareToken,
  normalizeStoragePath,
} from '@/lib/vizzion/preview-share';
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

export default async function SharedPreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const trimmedToken = token.trim();
  if (!isValidShareToken(trimmedToken)) {
    notFound();
  }

  const supabase = createAdminClient();
  const previewResult = await supabase
    .from('generated_previews')
    .select('id, workspace_id, widget_id, lead_id, original_upload_path, generated_path, material_snapshot, share_expires_at, created_at')
    .eq('share_token', trimmedToken)
    .maybeSingle();

  if (previewResult.error || !previewResult.data) {
    notFound();
  }

  const preview = previewResult.data as {
    id: string;
    workspace_id: string;
    widget_id: string;
    lead_id: string | null;
    original_upload_path: string | null;
    generated_path: string | null;
    material_snapshot: Record<string, unknown> | null;
    share_expires_at: string | null;
    created_at: string;
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

  // Record a preview view (best effort, non-blocking) so the dashboard can show
  // how often a lead opened their shared visualization.
  after(async () => {
    try {
      await supabase.from('widget_events').insert({
        workspace_id: preview.workspace_id,
        widget_id: preview.widget_id,
        event_type: 'preview_viewed',
        event_data: {
          previewId: preview.id,
          leadId: preview.lead_id,
          shareToken: trimmedToken,
        },
      });
    } catch {
      // Analytics is best effort; never block the preview render.
    }
  });

  const workspace = workspaceResult.data as {
    company_name: string | null;
    name: string;
    logo_url: string | null;
    brand_color: string | null;
  } | null;
  const widget = widgetResult.data as { brand_color: string | null } | null;
  const companyName = workspace?.company_name?.trim() || workspace?.name?.trim() || 'Your contractor';
  const brandColor = sanitizeBrandColor(widget?.brand_color || workspace?.brand_color);
  const brandOnLight = readableBrandOnLight(brandColor);
  const materialName = getMaterialName(preview.material_snapshot);
  const downloadTextColor = readableTextOn(brandColor);
  const downloadFilename = buildDownloadFilename(companyName, materialName);
  // Served through our own route so the customer's logo can be watermarked onto
  // the render before download (the route also sets Content-Disposition).
  const downloadUrl = `/preview/${trimmedToken}/download`;
  const preparedDate = new Date(preview.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 md:py-14">
      <div className="mx-auto max-w-3xl">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_22px_48px_-28px_rgba(15,23,42,0.35)]">
          <div className="h-1.5 w-full" style={{ backgroundColor: brandColor }} aria-hidden="true" />

          <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5 md:px-8">
            <div className="flex items-center gap-3">
              {workspace?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- customer logo URL
                <img
                  src={workspace.logo_url}
                  alt={companyName}
                  className="h-10 w-10 rounded-lg border border-slate-200 bg-white object-contain p-1"
                />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                  style={{ backgroundColor: brandColor, color: downloadTextColor }}
                >
                  {companyName[0]?.toUpperCase() ?? 'V'}
                </div>
              )}
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-900">{companyName}</p>
                <p className="text-xs text-slate-500">Visualization preview</p>
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Prepared</p>
              <p className="mt-0.5 text-xs font-medium text-slate-600">{preparedDate}</p>
            </div>
          </header>

          <div className="px-6 py-7 md:px-8">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: brandOnLight }}
            >
              Before &amp; after
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-[28px]">
              Your new look is ready
            </h1>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-slate-600">
              A realistic preview{' '}
              {materialName ? (
                <>
                  featuring <span className="font-medium text-slate-800">{materialName}</span>,{' '}
                </>
              ) : null}
              created from your photo. Drag the slider to compare before and after.
            </p>

            <div className="mt-6">
              <PreviewComparisonSlider
                beforeUrl={originalSigned.data.signedUrl}
                afterUrl={generatedSigned.data.signedUrl}
                brandColor={brandColor}
              />
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {materialName ? 'Material' : 'Visualization'}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {materialName ?? 'Your personalized preview'}
                </p>
              </div>
              <a
                href={downloadUrl}
                download={downloadFilename}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: brandColor, color: downloadTextColor }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
                </svg>
                Download image
              </a>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-slate-500">
          Questions? Reply to {companyName}&apos;s email.
        </p>

        <div className="mt-5 flex justify-center">
          <a
            href="https://vizzion.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3.5 py-1.5 transition hover:bg-slate-900"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Powered by
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element -- static marketing logo */}
            <img src="/vizzion-logo.png" alt="Vizzion" className="h-4 w-auto" />
          </a>
        </div>
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
