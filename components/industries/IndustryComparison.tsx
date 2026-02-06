import { IndustryData } from '@/data/industries/types';

export default function IndustryComparison({ data }: { data: IndustryData }) {
  return (
    <section className="py-24 px-6 bg-bg-primary">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            {data.comparison.headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Old Way */}
          <div className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border-default">
            <h3 className="text-2xl font-bold text-text-primary mb-8">The Old Way</h3>
            <ul className="space-y-5">
              {data.comparison.oldWay.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <svg
                    className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With Vizzion */}
          <div className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-accent">
            <h3 className="text-2xl font-bold text-text-primary mb-8">With Vizzion</h3>
            <ul className="space-y-5">
              {data.comparison.vizzionWay.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <svg
                    className="w-6 h-6 text-accent flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
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
