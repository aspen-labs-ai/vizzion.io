import Script from 'next/script';
import { IndustryData } from '@/data/industries/types';

const DEMO_WIDGET_EMBED_KEY = process.env.NEXT_PUBLIC_INDUSTRY_DEMO_WIDGET_EMBED_KEY?.trim() || '';
const WIDGET_SCRIPT_SRC =
  process.env.NEXT_PUBLIC_WIDGET_SCRIPT_SRC?.trim() || 'https://app.vizzion.io/widget.js';

function buildInitScript(targetSelector: string, embedKey: string): string {
  const payload = JSON.stringify({
    embedKey,
    target: targetSelector,
  });

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

export default function IndustryLiveWidget({ data }: { data: IndustryData }) {
  if (!DEMO_WIDGET_EMBED_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <section className="px-6 py-12 bg-bg-primary">
          <div className="max-w-[1000px] mx-auto rounded-xl border border-border-default bg-bg-secondary px-5 py-4 text-sm text-text-tertiary">
            Set <code>NEXT_PUBLIC_INDUSTRY_DEMO_WIDGET_EMBED_KEY</code> to render the live widget
            demo section.
          </div>
        </section>
      );
    }
    return null;
  }

  const targetId = `vizzion-widget-${data.slug}`;
  const targetSelector = `#${targetId}`;
  const initScript = buildInitScript(targetSelector, DEMO_WIDGET_EMBED_KEY);
  const scriptId = `vizzion-widget-init-${data.slug}`;

  return (
    <section className="py-20 px-6 bg-bg-primary border-y border-border-default">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-8">
          <p className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">
            Live Demo
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Try the {data.shortName} Visualizer Widget
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Upload intent starts here: visitors enter an email, pick an option, and request a preview in
            under a minute.
          </p>
        </div>

        <div className="max-w-[760px] mx-auto rounded-2xl border border-border-default bg-bg-secondary p-5 md:p-7">
          <div id={targetId} />
        </div>
      </div>

      <Script src={WIDGET_SCRIPT_SRC} strategy="afterInteractive" />
      <Script id={scriptId} strategy="afterInteractive">
        {initScript}
      </Script>
    </section>
  );
}
