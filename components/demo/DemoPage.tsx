import Script from 'next/script';
import { Monitor, MousePointerClick } from 'lucide-react';

/**
 * Reusable hosted-demo template for prospects. Renders a customer's real widget
 * two ways — embedded inline and behind a popup button — with plain-language
 * labels, served from our first-party origin (so it passes the widget's origin
 * allowlist with no extra setup).
 *
 * To spin up a demo for a new prospect, create app/demo/<slug>/page.tsx:
 *
 *   import type { Metadata } from 'next';
 *   import DemoPage, { type DemoConfig } from '@/components/demo/DemoPage';
 *
 *   const config: DemoConfig = {
 *     companyName: 'Premier Roofing & Gutters',
 *     logoUrl: 'https://.../logo.png',
 *     embedKey: 'vwk_...',
 *     productLabel: 'Roofing Visualizer',
 *     headline: 'See a new roof on your',
 *     headlineHighlight: 'actual home',
 *     intro:
 *       "Upload a photo of the house and preview Premier Roofing & Gutters' real " +
 *       'roofing products on it in seconds.',
 *   };
 *
 *   export const metadata: Metadata = {
 *     title: `${config.companyName} — Live Demo`,
 *     robots: { index: false, follow: false },
 *   };
 *
 *   export default function Page() {
 *     return <DemoPage config={config} />;
 *   }
 */

export interface DemoConfig {
  /** Business name shown in the header + copy. */
  companyName: string;
  /** Public logo URL (or null to fall back to the company name). */
  logoUrl: string | null;
  /** The widget's embed key (vwk_...). */
  embedKey: string;
  /** Subtitle under the company name, e.g. "Roofing Visualizer". */
  productLabel: string;
  /** Headline lead-in, e.g. "See a new roof on your". */
  headline: string;
  /** Accented tail of the headline, e.g. "actual home". */
  headlineHighlight: string;
  /** Industry-specific first sentence of the intro. */
  intro: string;
}

const INLINE_TARGET_ID = 'vizzion-inline';
const POPUP_TARGET_ID = 'vizzion-popup';

// Queue-safe init mirroring the production embed snippet. Mounts the SAME widget
// twice via per-embed overrides: once inline, once as a popup, so the prospect
// can compare both on one page.
function buildInitScript(embedKey: string): string {
  const inline = JSON.stringify({
    embedKey,
    target: `#${INLINE_TARGET_ID}`,
    mode: 'inline',
  });
  const popup = JSON.stringify({
    embedKey,
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

export default function DemoPage({ config }: { config: DemoConfig }) {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
        <header className="flex items-center gap-3">
          {config.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={config.logoUrl} alt={config.companyName} className="h-9 w-auto" />
          ) : null}
          <div className="leading-tight">
            <p className="text-sm font-semibold text-text-primary">{config.companyName}</p>
            <p className="text-xs text-text-tertiary">{config.productLabel}</p>
          </div>
          <span className="ml-auto inline-flex items-center rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent">
            Live demo
          </span>
        </header>

        <section className="mt-12 max-w-2xl md:mt-16">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
            {config.headline} <span className="text-accent">{config.headlineHighlight}</span>
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            {config.intro} Below are two ways the tool can appear on your website — try them both
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
        {buildInitScript(config.embedKey)}
      </Script>
    </main>
  );
}
