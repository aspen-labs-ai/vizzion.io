import { IndustryData } from '@/data/industries/types';

interface IndustryProblemProps {
  data: IndustryData;
}

export default function IndustryProblem({ data }: IndustryProblemProps) {
  return (
    <section className="py-24 px-6 bg-bg-primary">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">
            The Problem
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            {data.problems.headline}
          </h2>
          <p className="text-xl text-text-secondary">
            {data.problems.subheadline}
          </p>
        </div>

        {/* Pain Point Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {data.problems.items.map((item, index) => (
            <div
              key={index}
              className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border-default hover:border-accent hover:shadow-lg transition-all duration-250 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-3">
                {item.stat}
              </div>
              <p className="text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
