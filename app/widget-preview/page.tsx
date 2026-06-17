import type { Metadata } from 'next';
import Script from 'next/script';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getWorkspaceContext } from '@/lib/vizzion/workspace';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Widget preview | Vizzion',
  robots: {
    index: false,
    follow: false,
  },
};

const PREVIEW_TARGET_ID = 'vizzion-widget-preview';

function getSingleParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return value[0] ?? null;
  }
  return null;
}

// Loads widget.js from THIS origin (so the widget calls this deployment's API)
// and inits via the queue-safe pattern, mirroring the customer embed snippet.
function buildInitScript(embedKey: string): string {
  const payload = JSON.stringify({ embedKey, target: `#${PREVIEW_TARGET_ID}` });
  return `(function () {
  var config = ${payload};
  window.__vizzionWidgetQueue = window.__vizzionWidgetQueue || [];
  if (window.VizzionWidget && typeof window.VizzionWidget.init === 'function') {
    window.VizzionWidget.init(config);
  } else {
    window.__vizzionWidgetQueue.push(config);
  }
})();`;
}

export default async function WidgetPreviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const widgetId = getSingleParam(params.widgetId);

  const supabase = await createClient();
  const context = await getWorkspaceContext(supabase, widgetId);

  if (!context) {
    redirect('/auth/sign-in?next=/widget-preview');
  }

  const widget = context.widget;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Widget preview</p>
            <p className="text-xs text-slate-500">
              {widget.name} · {widget.mode === 'popup' ? 'Popup' : 'Inline'} mode · live &amp; interactive
            </p>
          </div>
          <a
            href={`/dashboard/settings?widgetId=${widget.id}`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to settings
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-8">
        <p className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
          This is the exact widget your visitors see. It runs live — completing a generation here counts toward your
          usage and shows up in your leads. Only you can see this page.
        </p>

        {!widget.is_active ? (
          <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            This widget is currently paused. Turn on <span className="font-semibold">Widget active</span> in
            Settings → Behavior to preview it.
          </p>
        ) : null}

        {widget.mode === 'popup' ? (
          <p className="mb-4 text-sm text-slate-600">
            Popup mode: use the launcher button below to open the widget.
          </p>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div id={PREVIEW_TARGET_ID} />
        </div>
      </div>

      <Script src="/widget.js" strategy="afterInteractive" />
      <Script id="vizzion-widget-preview-init" strategy="afterInteractive">
        {buildInitScript(widget.embed_key)}
      </Script>
    </main>
  );
}
