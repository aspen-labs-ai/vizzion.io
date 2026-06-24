import Script from 'next/script';
import { Check } from 'lucide-react';

/**
 * Reusable prospect-facing demo template. Pitches the business owner on the
 * value (more leads from their existing traffic) and lets them try their real
 * widget. Served from our first-party origin, so the widget passes the origin
 * allowlist with no per-prospect setup.
 *
 * To spin up a demo for a new prospect, create app/demo/<slug>/page.tsx:
 *
 *   import type { Metadata } from 'next';
 *   import DemoPage, { type DemoConfig } from '@/components/demo/DemoPage';
 *
 *   const config: DemoConfig = {
 *     companyName: 'The Roof Authority',
 *     logoUrl: 'https://.../logo.png',
 *     embedKey: 'vwk_...',
 *     trade: 'roofing',
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
  /** Business name shown in the header. */
  companyName: string;
  /** Public logo URL (or null to fall back to the company name). */
  logoUrl: string | null;
  /** The widget's embed key (vwk_...). */
  embedKey: string;
  /** Trade word used in the value copy, e.g. "roofing". */
  trade: string;
  /** What a visitor uploads, e.g. "home" (default) or "building". */
  uploadNoun?: string;
}

const WIDGET_TARGET_ID = 'vizzion-widget';

// Queue-safe init mirroring the production embed snippet (inline mode).
function buildInitScript(embedKey: string): string {
  const payload = JSON.stringify({ embedKey, target: `#${WIDGET_TARGET_ID}`, mode: 'inline' });
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

export default function DemoPage({ config }: { config: DemoConfig }) {
  const uploadNoun = config.uploadNoun ?? 'home';
  const benefits = [
    'Turns visitors into leads',
    'Embeds on your existing website',
    'Live in minutes — no developer',
  ];

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      {/* Light header so dark / transparent logos stay visible */}
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3">
        {config.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={config.logoUrl} alt={config.companyName} className="h-9 w-auto" />
        ) : (
          <span className="text-base font-semibold text-slate-900">{config.companyName}</span>
        )}
        <span className="ml-auto text-xs font-medium text-slate-400">Powered by Vizzion</span>
      </header>

      {/* Centered value pitch + live widget */}
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-14 text-center md:py-20">
        <span className="mb-4 inline-flex items-center rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent">
          Live preview
        </span>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
          Turn website visitors into <span className="text-accent">{config.trade} leads</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-text-secondary">
          A visitor uploads a photo of their {uploadNoun}, enters their email, and gets a realistic
          preview of your {config.trade} on it — sent straight to their inbox. You get a new lead
          with every preview.
        </p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-text-secondary">
          {benefits.map((benefit) => (
            <li key={benefit} className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-accent" /> {benefit}
            </li>
          ))}
        </ul>

        <p className="mt-10 mb-4 text-sm font-medium text-text-tertiary">Try it yourself</p>
        <div className="w-full" id={WIDGET_TARGET_ID} />
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
