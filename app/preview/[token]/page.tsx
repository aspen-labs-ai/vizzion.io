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
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-6 text-slate-950 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {workspace?.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- customer logo URL
                  <img
                    src={workspace.logo_url}
                    alt={companyName}
                    className="h-16 w-16 rounded-2xl border border-slate-200 bg-white object-contain p-2 shadow-sm"
                  />
                ) : (
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-xl font-bold shadow-sm"
                    style={{ color: brandColor }}
                  >
                    {companyName[0]?.toUpperCase() ?? 'V'}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold" style={{ color: brandColor }}>{companyName}</p>
                  <p className="text-sm text-slate-500">Personalized visualization preview</p>
                </div>
              </div>

              <div>
                <p className="mb-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                  Ready to review
                </p>
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                  Compare your before and after.
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                  Drag the slider to see how your selected material changes the look of the property.
                  The original photo stays on the left, and the visualization is on the right.
                </p>
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Selected material</p>
              <p className="mt-2 text-xl font-black text-slate-950">{materialName ?? 'Selected material'}</p>
              <div className="mt-5 h-px bg-slate-200" />
              <p className="mt-5 text-sm leading-6 text-slate-600">
                Want to talk through this look or compare other options? Reply to the email you received and
                {` ${companyName} `}will get your message.
              </p>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">How to compare</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Grab the round handle in the middle of the image and drag left or right.
                </p>
              </div>
            </aside>
          </div>
        </header>

        <PreviewComparisonSlider
          beforeUrl={originalSigned.data.signedUrl}
          afterUrl={generatedSigned.data.signedUrl}
          brandColor={brandColor}
        />

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard title="Before" description="The original uploaded photo." />
          <InfoCard title="After" description="The same view with the selected material applied." />
          <InfoCard title="Private link" description="This preview link is temporary and expires automatically." />
        </section>
      </div>
    </main>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-950">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
    </div>
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
