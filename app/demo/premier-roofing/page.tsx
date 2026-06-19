import type { Metadata } from 'next';
import Script from 'next/script';
import { Upload, Palette, Sparkles } from 'lucide-react';

// Customer-specific live demo page. Hosted on our own site so a prospect can
// try their real widget without us touching their site. Because this page is
// served from our first-party origin (app.vizzion.io / vizzion.io), the widget
// passes the origin allowlist automatically.
//
// To spin up a demo for a new prospect, copy this folder to
// app/demo/<prospect-slug>/page.tsx and swap the three constants below.
const EMBED_KEY = 'vwk_3c38fe8aeca73645ef303560512aa450d5c6';
const COMPANY_NAME = 'Premier Roofing & Gutters';
const LOGO_URL =
  'https://xjrcpmnwnfetivxeffzr.supabase.co/storage/v1/object/public/workspace-assets/dc86d7ab-ed2f-4ea1-9fa8-340b5dec3fb6/logos/d685cb80-a61d-4059-aca0-96ffe9d2715b.png';

const WIDGET_TARGET_ID = 'vizzion-widget';

export const metadata: Metadata = {
  title: `${COMPANY_NAME} — Roofing Visualizer (Live Demo)`,
  description:
    'Upload a photo of a home and preview real roofing styles on it in seconds.',
  // Customer-specific demo: keep it out of search engines.
  robots: { index: false, follow: false },
};

// Queue-safe init mirrors the production embed snippet: widget.js loads async,
// so the inline script may run before or after it. If VizzionWidget is ready we
// init immediately; otherwise we queue and widget.js drains it on load.
function buildInitScript(embedKey: string): string {
  const payload = JSON.stringify({ embedKey, target: `#${WIDGET_TARGET_ID}` });
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

const STEPS = [
  {
    icon: Upload,
    title: 'Upload a photo',
    body: 'Add a clear photo of the front of the home.',
  },
  {
    icon: Palette,
    title: 'Pick a roofing style',
    body: 'Choose from shingle, cedar shake, and standing-seam metal options.',
  },
  {
    icon: Sparkles,
    title: 'See it on the home',
    body: 'Get a realistic before/after preview in seconds.',
  },
];

export default function PremierRoofingDemoPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
        <header className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_URL} alt={COMPANY_NAME} className="h-9 w-auto" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-text-primary">{COMPANY_NAME}</p>
            <p className="text-xs text-text-tertiary">Roofing Visualizer</p>
          </div>
          <span className="ml-auto inline-flex items-center rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent">
            Live demo
          </span>
        </header>

        <div className="mt-12 grid flex-1 items-start gap-10 md:mt-16 md:grid-cols-2">
          <div className="md:pt-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
              See a new roof on your <span className="text-accent">actual home</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-text-secondary">
              Upload a photo of the house and preview {COMPANY_NAME}&apos;s real roofing
              products on it — no guesswork, no appointment.
            </p>

            <ol className="mt-8 space-y-4">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-bg-tertiary text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-text-primary">
                        {index + 1}. {step.title}
                      </p>
                      <p className="text-sm text-text-tertiary">{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="md:sticky md:top-10">
            <div className="rounded-2xl border border-border-default bg-bg-secondary p-4 shadow-2xl shadow-black/40 sm:p-6">
              <div id={WIDGET_TARGET_ID} />
            </div>
            <p className="mt-3 text-center text-xs text-text-tertiary">
              This is the exact widget that runs on your website.
            </p>
          </div>
        </div>

        <footer className="mt-12 border-t border-border-subtle pt-6 text-center text-xs text-text-tertiary">
          Powered by Vizzion
        </footer>
      </div>

      {/* Load widget.js from this same origin so the widget's API calls stay
          first-party (passes the origin allowlist without extra config). */}
      <Script src="/widget.js" strategy="afterInteractive" />
      <Script id="vizzion-demo-init" strategy="afterInteractive">
        {buildInitScript(EMBED_KEY)}
      </Script>
    </main>
  );
}
