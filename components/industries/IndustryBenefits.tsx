import { IndustryData } from '@/data/industries/types';

function BenefitIcon({ index }: { index: number }) {
  const iconType = index % 3;

  if (iconType === 0) {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20v-7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20v-11" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-5" />
      </svg>
    );
  }

  if (iconType === 1) {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7-7 7 7" />
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

export default function IndustryBenefits({ data }: { data: IndustryData }) {
  return (
    <section className="relative overflow-hidden bg-bg-primary py-20 px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent" />

      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            The Results
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.benefits.map((benefit, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border-default/80 bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-primary p-6 md:p-7 shadow-md shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-gradient-to-br from-accent/20 via-teal-400/15 to-cyan-400/15 text-accent shadow-md shadow-accent/10 transition-transform duration-300 group-hover:scale-105">
                <BenefitIcon index={index} />
              </div>

              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent mb-1">
                {benefit.metric}
              </div>
              <div className="text-base font-semibold text-text-primary mb-2">
                {benefit.label}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
