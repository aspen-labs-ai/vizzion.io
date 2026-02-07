import { IndustryData } from '@/data/industries/types';

export default function IndustryContext({ data }: { data: IndustryData }) {
  return (
    <section className="py-16 px-6 bg-bg-secondary">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-text-primary">
          {data.context.headline}
        </h2>

        <div className="space-y-6">
          {data.context.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg text-text-secondary leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {data.context.callout && (
          <div className="mt-10 p-8 bg-bg-secondary rounded-2xl border border-border-default">
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
      </div>
    </section>
  );
}
