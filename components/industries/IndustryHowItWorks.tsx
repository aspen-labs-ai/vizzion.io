import { IndustryData } from '@/data/industries/types';

interface IndustryHowItWorksProps {
  data: IndustryData;
}

export default function IndustryHowItWorks({ data }: IndustryHowItWorksProps) {
  return (
    <section className="py-24 px-6 bg-bg-primary" id="how-it-works">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            {data.howItWorks.headline}
          </h2>
        </div>

        {/* Step Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-12">
          {data.howItWorks.steps.map((step, index) => (
            <div
              key={index}
              className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border-default hover:border-accent hover:shadow-lg transition-all duration-250 hover:-translate-y-1"
            >
              {/* Step Number */}
              <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center text-lg font-bold mb-6">
                {index + 1}
              </div>

              <h3 className="text-2xl font-bold mb-4 text-text-primary">
                {step.title}
              </h3>

              <p className="text-text-secondary leading-relaxed mb-4">
                {step.description}
              </p>

              <p className="text-sm text-text-tertiary leading-relaxed">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
