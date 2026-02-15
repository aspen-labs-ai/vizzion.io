import { IndustryData } from '@/data/industries/types';
import { HighlightedParagraph } from './HighlightedParagraph';

export default function IndustryContext({ data }: { data: IndustryData }) {
  return (
    <section className="py-16 px-6 bg-bg-secondary">
      <div className="max-w-[900px] mx-auto">
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
          <div className="mt-10 p-8 bg-bg-primary rounded-2xl border border-border-default">
            <div className="flex items-baseline gap-4">
              <span className="text-5xl md:text-6xl font-bold text-accent">
                {data.context.callout.stat}
              </span>
              <span className="text-xl text-text-secondary leading-snug">
                {data.context.callout.text}
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-bg-primary rounded-2xl border border-border-default">
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
