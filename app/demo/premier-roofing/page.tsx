import type { Metadata } from 'next';
import Script from 'next/script';
import { Monitor, MousePointerClick } from 'lucide-react';

// Customer-specific live demo page. Hosted on our own site so a prospect can
// try their real widget without us touching their site. Because this page is
// served from our first-party origin (app.vizzion.io / vizzion.io), the widget
// passes the origin allowlist automatically.
//
// To spin up a demo for a new prospect, copy this folder to
// app/demo/<prospect-slug>/page.tsx and swap the two constants below.
const EMBED_KEY = 'vwk_3c38fe8aeca73645ef303560512aa450d5c6';
const COMPANY_NAME = 'Premier Roofing & Gutters';
const LOGO_URL =
  'https://xjrcpmnwnfetivxeffzr.supabase.co/storage/v1/object/public/workspace-assets/dc86d7ab-ed2f-4ea1-9fa8-340b5dec3fb6/logos/d685cb80-a61d-4059-aca0-96ffe9d2715b.png';

const INLINE_TARGET_ID = 'vizzion-inline';
const POPUP_TARGET_ID = 'vizzion-popup';

export const metadata: Metadata = {
  title: `${COMPANY_NAME} — Roofing Visualizer (Live Demo)`,
  description:
    'Upload a photo of a home and preview real roofing styles on it in seconds.',
  // Customer-specific demo: keep it out of search engines.
  robots: { index: false, follow: false },
};

// Queue-safe init mirrors the production embed snippet. We mount the SAME widget
// twice with per-embed overrides: once embedded in the page (inline) and once
// behind a button (popup), so the prospect can compare both on one page.
function buildInitScript(): string {
  const inline = JSON.stringify({
    embedKey: EMBED_KEY,
    target: `#${INLINE_TARGET_ID}`,
    mode: 'inline',
  });
  const popup = JSON.stringify({
    embedKey: EMBED_KEY,
    target: `#${POPUP_TARGET_ID}`,
    mode: 'popup',
    autoOpen: false,
  });
  return `(function () {
  var widgets = [${inline}, ${popup}];
  window.__vizzionWidgetQueue = window.__vizzionWidgetQueue || [];
  widgets.forEach(function (config) {
    if (window.VizzionWidget && typeof window.VizzionWidget.init === 'function') {
      window.VizzionWidget.init(config);
    } else {
      window.__vizzionWidgetQueue.push(config);
    }
  });
})();`;
}

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

        <section className="mt-12 max-w-2xl md:mt-16">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
            See a new roof on your <span className="text-accent">actual home</span>
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Upload a photo of the house and preview {COMPANY_NAME}&apos;s real roofing products on
            it in seconds. Below are two ways the tool can appear on your website — try them both
            and tell us which you prefer.
          </p>
        </section>

        <div className="mt-10 grid flex-1 items-start gap-6 md:grid-cols-2">
          {/* Option 1 — inline */}
          <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
            <div className="flex items-center gap-2 text-accent">
              <Monitor className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Option 1</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-text-primary">Built right into the page</h2>
            <p className="mt-2 text-sm text-text-secondary">
              The tool sits directly on your website. Visitors see it the moment they land and can
              start right away — no clicking needed.
            </p>
            <div id={INLINE_TARGET_ID} className="mt-5" />
          </section>

          {/* Option 2 — popup */}
          <section className="rounded-2xl border border-border-default bg-bg-secondary p-6">
            <div className="flex items-center gap-2 text-accent">
              <MousePointerClick className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Option 2</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-text-primary">Opens from a button</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Visitors see a single button instead. When they click it, the tool opens in a pop-up
              window over your site — so it stays tucked away until someone wants to try it.
            </p>
            <div className="mt-5 flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border-default bg-bg-primary/40 p-8 text-center">
              <div id={POPUP_TARGET_ID} />
              <p className="text-xs text-text-tertiary">
                Go ahead — click the button. The tool opens in a pop-up, and closes with the ✕ in
                the corner.
              </p>
            </div>
          </section>
        </div>

        <footer className="mt-12 border-t border-border-subtle pt-6 text-center text-xs text-text-tertiary">
          Powered by Vizzion
        </footer>
      </div>

      {/* Load widget.js from this same origin so the widget's API calls stay
          first-party (passes the origin allowlist without extra config). */}
      <Script src="/widget.js" strategy="afterInteractive" />
      <Script id="vizzion-demo-init" strategy="afterInteractive">
        {buildInitScript()}
      </Script>
    </main>
  );
}
