export default function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[1400px] mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">
          Start Capturing More Leads Today
        </h2>
        <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-3xl mx-auto">
          Join 200+ businesses generating 3x more qualified leads with Vizzion.
        </p>
        <p className="text-base text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
          No credit card. No commitment. Just results.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#pricing" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-hover)] transition-all duration-[var(--transition-base)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
          >
            Start Your Free Trial
          </a>
          <a 
            href="#how-it-works" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-all duration-[var(--transition-base)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
          >
            See a 2-Minute Demo
          </a>
        </div>
      </div>
    </section>
  );
}
