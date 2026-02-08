import Image from 'next/image';
import { IndustryData } from '@/data/industries/types';
import { HighlightedHeadline } from './HighlightedHeadline';
import { HighlightedIntro } from './HighlightedIntro';

export default function IndustryPageHeader({ data }: { data: IndustryData }) {
  return (
    <section className="relative pt-24 pb-24 md:pb-32 px-6 overflow-hidden">
      {/* Background Image — tinted */}
      <div className="absolute inset-0">
        <Image
          src={`/images/industries/${data.slug}.png`}
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        {/* Dark tint overlay */}
        <div className="absolute inset-0 bg-bg-primary/50" />
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      {/* Content — single column centered */}
      <div className="relative max-w-3xl mx-auto pt-12 md:pt-16 text-center">
        <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-6">
          {data.header.badge}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-text-primary mb-6">
          <HighlightedHeadline
            text={data.header.headline}
            highlight={data.header.highlightWord}
          />
        </h1>

        <div className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-8">
          <HighlightedIntro
            text={data.header.intro}
            highlight={data.header.introHighlight}
          />
        </div>

        <a
          href={data.header.cta.href}
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-accent-glow"
        >
          {data.header.cta.text} →
        </a>
      </div>
    </section>
  );
}
