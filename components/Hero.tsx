export default function Hero() {
  return (
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm">
              Join 200+ businesses capturing 3x more leads
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-primary">
              Turn Every Website Visitor Into a Qualified Lead
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed">
              Vizzion captures emails <span className="font-semibold text-primary">before</span> showing visualizations. Your customers see your products on their own images—you get their contact info. It's that simple.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#pricing" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md"
              >
                Start Your Free Trial
              </a>
              <a 
                href="#how-it-works" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-primary text-white hover:bg-primary-light transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
