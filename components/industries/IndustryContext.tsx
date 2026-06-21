import { IndustryData } from '@/data/industries/types';
import { HighlightedParagraph } from './HighlightedParagraph';

export default function IndustryContext({ data }: { data: IndustryData }) {
  return (
    <section className="relative overflow-hidden bg-bg-secondary py-20 px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent" />
      <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="max-w-[960px] mx-auto rounded-3xl border border-border-default/80 bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-primary p-8 md:p-12 shadow-xl shadow-black/30">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-text-primary">
          {data.context.headline}
        </h2>

        <div className="space-y-6">
          {data.context.paragraphs.map((paragraph, index) => (
            <HighlightedParagraph
              key={index}
              text={paragraph}
              highlights={data.context.highlights || []}
            />
          ))}
        </div>

        {data.context.callout && (
          <div className="mt-10 rounded-2xl border border-accent/25 bg-gradient-to-r from-accent/15 via-teal-400/10 to-cyan-400/10 p-6 md:p-8 shadow-lg shadow-accent/10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                {data.context.callout.stat}
              </span>
              <span className="text-xl text-text-secondary leading-snug">
                {data.context.callout.text}
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-border-default/80 bg-bg-primary/80 p-6 shadow-md shadow-black/20">
          <p className="text-xs uppercase tracking-wider text-text-tertiary font-semibold">
            Evidence Notes
          </p>
          <p className="mt-1 text-sm text-text-tertiary">
            Last updated: {data.lastUpdated}
          </p>
          <ul className="mt-4 space-y-2 list-disc pl-5">
            {data.evidenceNotes.map((note, index) => (
              <li key={index} className="text-sm text-text-secondary leading-relaxed">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
