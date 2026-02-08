import type { IndustryData } from '@/data/industries/types';

export default function IndustryMidCTA({ data }: { data: IndustryData }) {
  return (
    <section className="py-12 px-6 bg-bg-secondary">
      <div className="max-w-[900px] mx-auto text-center">
        <p className="text-xl text-text-secondary mb-6">
          Ready to see how Vizzion works for {data.shortName} companies?
        </p>
        <a
          href="#signup"
          className="inline-block bg-accent text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-accent-glow rounded-lg px-8 py-4 font-semibold text-lg"
        >
          Get Started Free &rarr;
        </a>
      </div>
    </section>
  );
}
