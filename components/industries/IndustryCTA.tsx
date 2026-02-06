import { IndustryData } from '@/data/industries/types';

export default function IndustryCTA({ data }: { data: IndustryData }) {
  return (
    <section className="py-20 px-6 bg-bg-primary">
      <div className="max-w-[700px] mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">
          {data.cta.headline}
        </h2>
        <p className="text-text-secondary text-lg mb-8 leading-relaxed">
          {data.cta.subtext}
        </p>

        <a
          href={data.cta.href}
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-accent-glow"
        >
          {data.cta.buttonText}
        </a>

        <p className="text-text-tertiary text-sm mt-4">
          No credit card required. Set up in under 5 minutes.
        </p>
      </div>
    </section>
  );
}
