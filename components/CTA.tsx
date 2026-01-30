export default function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
          Start Capturing More Leads Today
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Join 200+ businesses generating 3x more qualified leads with Vizzion.
        </p>
        <p className="text-base text-gray-600 mb-12 max-w-2xl mx-auto">
          No credit card. No commitment. Just results.
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
            See a 2-Minute Demo
          </a>
        </div>
      </div>
    </section>
  );
}
