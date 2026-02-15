import WidgetMockup from './WidgetMockup';
import ParticlesBackground from './ParticlesBackground';
import RotatingIndustry from './RotatingIndustry';

export default function Hero() {
  return (
    <section className="relative px-6 bg-bg-primary overflow-hidden">
      <ParticlesBackground />
      <div className="relative max-w-[1400px] mx-auto w-full z-10">
        {/* Centered viewport area — text fills mobile screen, widget beside it on desktop */}
        <div className="min-h-screen flex items-center pt-24 md:pt-32 pb-16 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
            {/* Left Column - Text Content */}
            <div className="space-y-8 lg:space-y-10">
              <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm">
                Embeddable Visualization Widget
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-text-primary">
                Embeddable Visualizer Widget for Your Website
              </h1>

              <div className="space-y-3 max-w-2xl">
                <p className="text-lg md:text-xl text-text-secondary">
                  Add a visualizer widget to your website in minutes so visitors can preview options on their own photo.
                </p>
                <RotatingIndustry />
                <p className="text-lg md:text-xl text-text-secondary leading-relaxed pt-2">
                  Now your website answers them. Vizzion lets visitors upload a photo and see a realistic preview of your products in their actual space. They get the answer they&apos;re looking for — you get an exclusive, qualified lead.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                <a
                  href="#signup"
                  className="inline-flex items-center justify-center px-8 py-5 text-lg md:text-xl font-semibold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-accent-glow"
                >
                  Get Your First Lead in 24 Hours →
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-8 py-5 text-lg md:text-xl font-semibold rounded-lg bg-bg-tertiary text-text-primary border border-border-default hover:border-accent transition-all duration-250 hover:-translate-y-0.5"
                >
                  See How It Works
                </a>
              </div>
            </div>

            {/* Right Column - Widget Mockup (desktop only) */}
            <div className="hidden lg:block">
              <WidgetMockup />
            </div>
          </div>
        </div>

        {/* Widget Mockup — mobile only, below the fold */}
        <div className="lg:hidden pb-16">
          <div className="max-w-md mx-auto">
            <WidgetMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
