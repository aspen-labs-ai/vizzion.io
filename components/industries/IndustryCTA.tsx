import { IndustryData } from '@/data/industries/types';

export default function IndustryCTA({ data }: { data: IndustryData }) {
  return (
    <section className="py-24 px-6 bg-accent/5 border-t border-accent/20">
      <div className="max-w-[800px] mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
          Ready to Turn Your Website Into a Lead Machine?
        </h2>
        <p className="text-text-secondary text-lg md:text-xl mb-10 leading-relaxed">
          Join hundreds of {data.name.toLowerCase()} companies already using Vizzion to
          convert more visitors into qualified leads.
        </p>

        <a
          href="/signup"
          className="inline-flex items-center justify-center px-10 py-5 text-xl font-semibold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-all duration-250"
        >
          Get Started Free
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>

        <p className="text-text-tertiary text-sm mt-6">
          No credit card required. Set up in under 5 minutes.
        </p>
      </div>
    </section>
  );
}
