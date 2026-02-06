import { IndustryData } from '@/data/industries/types';

export default function IndustrySolution({ data }: { data: IndustryData }) {
  return (
    <section className="py-16 px-6 bg-bg-primary">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary">
          {data.solution.headline}
        </h2>

        <p className="text-lg text-text-secondary leading-relaxed mb-10">
          {data.solution.intro}
        </p>

        <div className="space-y-6">
          {data.solution.points.map((point, index) => (
            <div
              key={index}
              className="flex gap-4 p-6 bg-bg-secondary rounded-xl border border-border-default"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-light flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {point.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
