import WidgetMockup from './WidgetMockup';
import ParticlesBackground from './ParticlesBackground';
import RotatingIndustry from './RotatingIndustry';

export default function Hero() {
  return (
    <section className="relative px-6 bg-bg-primary overflow-hidden">
      <ParticlesBackground />
      <div className="relative max-w-[1400px] mx-auto w-full z-10">
        {/* Centered viewport area — text fills mobile screen, widget beside it on desktop */}
        <div className="min-h-screen flex items-center pt-28 pb-16 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              <div className="vz-eyebrow">
                Embeddable Visualization Widget
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-text-primary">
                Turn Your Website Into an Interactive Showroom
              </h1>

              <div className="space-y-4 max-w-xl">
                <RotatingIndustry />
                <p className="text-base md:text-lg text-text-secondary leading-relaxed">
                  Visitors upload a photo and see your products in their actual space — they get the answer they&apos;re looking for, and you get an exclusive, qualified lead.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                <a href="#signup" className="vz-btn-primary">
                  Get Your First Lead in 24 Hours →
                </a>
                <a href="#how-it-works" className="vz-btn-ghost">
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
