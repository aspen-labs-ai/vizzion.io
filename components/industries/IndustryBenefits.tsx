import * as icons from 'lucide-react';
import { IndustryData } from '@/data/industries/types';

interface IndustryBenefitsProps {
  data: IndustryData;
}

export default function IndustryBenefits({ data }: IndustryBenefitsProps) {
  return (
    <section className="py-24 px-6 bg-bg-primary">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">
            Why Choose Vizzion
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Results That Speak for Themselves
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.benefits.map((benefit, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Icon = (icons as any)[benefit.iconName] as React.ComponentType<{ className?: string }> | undefined;
            return (
              <div
                key={index}
                className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border-default hover:border-accent hover:shadow-lg transition-all duration-250 hover:-translate-y-1"
              >
                {Icon && <Icon className="w-8 h-8 text-accent mb-4" />}

                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  {benefit.metric}
                </div>

                <div className="text-lg font-semibold text-text-primary mb-2">
                  {benefit.label}
                </div>

                <p className="text-text-secondary leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
