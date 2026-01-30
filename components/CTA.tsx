export default function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">
          Ready to turn visitors into customers?
        </h2>
        <p className="text-xl text-[var(--color-text-secondary)] mb-12 max-w-3xl mx-auto">
          Join hundreds of businesses using Vizzion to boost conversions and close more deals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#pricing" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-hover)] transition-all duration-[var(--transition-base)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
          >
            Get Started Free
          </a>
          <a 
            href="#" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-all duration-[var(--transition-base)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
          >
            Schedule a Demo
          </a>
        </div>
      </div>
    </section>
  );
}
