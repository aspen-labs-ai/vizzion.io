import WidgetMockup from './WidgetMockup';
import ParticlesBackground from './ParticlesBackground';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center px-6 bg-bg-primary pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <ParticlesBackground />
      <div className="relative max-w-[1400px] mx-auto w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 lg:space-y-10">
            <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm">
              Trusted by growing businesses
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-text-primary">
              Turn Every Website Visitor Into a Qualified Lead
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl">
              Stop losing customers who can't picture your product in their space. Vizzion lets them see it instantly on their own images—turning curiosity into qualified leads.
            </p>
            
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
          
          {/* Right Column - Widget Mockup */}
          <div className="lg:block">
            <WidgetMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
