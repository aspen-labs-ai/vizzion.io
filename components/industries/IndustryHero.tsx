import { IndustryData } from '@/data/industries/types';

interface IndustryHeroProps {
  data: IndustryData;
}

export default function IndustryHero({ data }: IndustryHeroProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center px-6 bg-bg-primary pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 lg:space-y-10">
            <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm">
              {data.hero.badge}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-text-primary">
              {data.hero.headline}
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl">
              {data.hero.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              <a
                href={data.hero.primaryCTA.href}
                className="inline-flex items-center justify-center px-8 py-5 text-lg md:text-xl font-semibold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-accent-glow"
              >
                {data.hero.primaryCTA.text} →
              </a>
              <a
                href={data.hero.secondaryCTA.href}
                className="inline-flex items-center justify-center px-8 py-5 text-lg md:text-xl font-semibold rounded-lg bg-bg-tertiary text-text-primary border border-border-default hover:border-accent transition-all duration-250 hover:-translate-y-0.5"
              >
                {data.hero.secondaryCTA.text}
              </a>
            </div>
          </div>

          {/* Right Column - Widget Mockup Placeholder */}
          <div className="lg:block">
            <div className="bg-bg-secondary rounded-2xl border border-border-default overflow-hidden">
              <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-bg-secondary to-bg-tertiary">
                <div className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-accent-light flex items-center justify-center">
                    <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-text-primary">
                    {data.name} Visualization Preview
                  </p>
                  <p className="text-sm text-text-tertiary">
                    Interactive widget demo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
