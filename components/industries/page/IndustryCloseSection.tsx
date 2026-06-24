import { ArrowRight } from 'lucide-react';
import type { IndustryData } from '@/data/industries/types';
import SignupSection from '@/components/SignupSection';
import SectionMark from './SectionMark';

export default function IndustryCloseSection({ data }: { data: IndustryData }) {
  const { cta } = data;

  return (
    <>
      <section className="relative overflow-hidden px-6 py-24 md:py-28">
        <div className="industry-grid-texture pointer-events-none absolute inset-0 opacity-20" aria-hidden />

        <div className="relative mx-auto max-w-[900px] text-center">
          <div className="mx-auto mb-12 h-px w-24 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

          <div className="mb-6 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-text-tertiary">
            <SectionMark className="text-accent" />
            <span>Ready when you are</span>
          </div>

          <h2 className="text-3xl font-bold leading-[1.06] tracking-tight text-text-primary sm:text-5xl md:text-[3.25rem]">
            {cta.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-text-secondary">{cta.subtext}</p>

          <a
            href={cta.href}
            className="group mt-10 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 text-lg font-semibold text-primary transition-all duration-250 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-accent-glow"
          >
            {cta.buttonText}
            <ArrowRight className="h-5 w-5 transition-transform duration-250 group-hover:translate-x-0.5" />
          </a>

          <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-text-tertiary">
            5 min setup · any website · no credit card
          </p>
        </div>
      </section>

      <SignupSection defaultIndustry={data.shortName} />
    </>
  );
}
