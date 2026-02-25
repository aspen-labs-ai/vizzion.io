import { IndustryData } from '@/data/industries/types';

function SolutionIcon({ index }: { index: number }) {
  const iconType = index % 3;

  if (iconType === 0) {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4-8 4-8-4 8-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12l8 4 8-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 17l8 4 8-4" />
      </svg>
    );
  }

  if (iconType === 1) {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20v-6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20v-10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-14" />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  );
}

export default function IndustrySolution({ data }: { data: IndustryData }) {
  return (
    <section className="relative overflow-hidden bg-bg-primary py-20 px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent/10 via-teal-500/5 to-transparent" />

      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary">
          {data.solution.headline}
        </h2>

        <p className="max-w-[900px] text-lg text-text-secondary leading-relaxed mb-12">
          {data.solution.intro}
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.solution.points.map((point, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border-default/80 bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-primary p-6 md:p-7 shadow-md shadow-black/25 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400/70 via-teal-400/70 to-cyan-400/70 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-gradient-to-br from-accent/20 via-teal-400/15 to-cyan-400/15 text-accent shadow-md shadow-accent/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-accent-glow">
                <SolutionIcon index={index} />
              </div>

              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {point.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
