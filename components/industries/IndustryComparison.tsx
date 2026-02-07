import { IndustryData } from '@/data/industries/types';

export default function IndustryComparison({ data }: { data: IndustryData }) {
  return (
    <section className="py-16 px-6 bg-bg-secondary">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-text-primary text-center">
          {data.comparison.headline}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Old Way */}
          <div className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border-default">
            <h3 className="text-lg font-semibold text-text-tertiary mb-6 uppercase tracking-wide text-sm">
              The Old Way
            </h3>
            <ul className="space-y-4">
              {data.comparison.oldWay.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vizzion Way */}
          <div className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-accent">
            <h3 className="text-lg font-semibold text-accent mb-6 uppercase tracking-wide text-sm">
              With Vizzion
            </h3>
            <ul className="space-y-4">
              {data.comparison.vizzionWay.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
