import WidgetMockup from './WidgetMockup';

export default function Hero() {
  return (
    <section className="pt-32 pb-24 px-6 bg-bg-primary">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm">
              Trusted by growing businesses
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-text-primary">
              Turn Every Website Visitor Into a Qualified Lead
            </h1>
            
            <p className="text-xl text-text-secondary leading-relaxed">
              Vizzion captures emails <span className="font-semibold text-accent">before</span> showing visualizations. Your customers see your products on their own images—you get their contact info. It's that simple.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#signup" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-accent-glow"
              >
                Get Your First Lead in 24 Hours →
              </a>
              <a 
                href="#how-it-works" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-bg-tertiary text-text-primary border border-border-default hover:border-accent transition-all duration-250 hover:-translate-y-0.5"
              >
                See How It Works
              </a>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">24%</div>
                <div className="text-sm text-text-tertiary">Avg Conversion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">3x</div>
                <div className="text-sm text-text-tertiary">More Leads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">5 min</div>
                <div className="text-sm text-text-tertiary">Setup Time</div>
              </div>
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
