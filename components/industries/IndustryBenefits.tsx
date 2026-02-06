import { IndustryData } from '@/data/industries/types';

export default function IndustryBenefits({ data }: { data: IndustryData }) {
  return (
    <section className="py-16 px-6 bg-bg-primary">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            The Results
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-bg-secondary rounded-xl p-6 border border-border-default"
            >
              <div className="text-3xl font-bold text-accent mb-1">
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
