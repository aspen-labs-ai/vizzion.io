import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSectionSplit() {
  return (
    <section className="relative overflow-hidden bg-bg-primary px-6 pb-24 pt-28 md:pt-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#60A5FA]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="max-w-2xl">
          <span className="mb-6 inline-flex items-center rounded-full border border-border-default bg-bg-secondary px-4 py-2 text-sm font-medium text-text-secondary">
            Roofing Visualizer Software
          </span>

          <h1 className="text-4xl font-bold leading-tight text-text-primary md:text-5xl lg:text-6xl">
            Roofing Visualizer Software for Contractors — Generate Exclusive Leads
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary md:text-xl">
            Let homeowners see their new roof before you quote. Generate leads from traffic you already have —
            no bidding wars, no shared lists.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 text-base font-semibold text-primary transition-all duration-250 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-accent-glow"
            >
              Start Generating Roofing Leads
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-sm text-text-tertiary">
              Roofing visualization software that converts anonymous traffic.
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border-default bg-bg-secondary/80 shadow-xl">
            <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
              <span className="text-sm font-medium text-text-secondary">Roof Design Tool Preview</span>
              <span className="rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent">
                Live Experience
              </span>
            </div>
            <div className="relative aspect-[5/4] w-full">
              <Image
                src="/images/industries/roofing.png"
                alt="Roofing visualizer software preview"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 46vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
