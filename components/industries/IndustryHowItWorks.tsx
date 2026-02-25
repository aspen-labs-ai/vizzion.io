import { IndustryData } from '@/data/industries/types';

export default function IndustryHowItWorks({ data }: { data: IndustryData }) {
  return (
    <section id="how-it-works" className="py-12 md:py-16 px-4 sm:px-6 bg-bg-secondary">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">
          {data.howItWorks.headline}
        </h2>

        <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8 md:mb-10">
          {data.howItWorks.intro}
        </p>

        <div className="space-y-6 md:space-y-8">
          {data.howItWorks.steps.map((step) => (
            <div key={step.number} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent text-primary font-bold flex items-center justify-center text-base sm:text-lg">
                {step.number}
              </div>
              <div className="pt-0 sm:pt-1">
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
