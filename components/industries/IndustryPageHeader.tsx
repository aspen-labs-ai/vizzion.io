import Image from 'next/image';
import { IndustryData } from '@/data/industries/types';
import WidgetMockup from '@/components/WidgetMockup';

function HighlightedHeadline({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight) return <>{text}</>;

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="relative inline-block">
            <span className="relative z-10 text-accent">{part}</span>
            <span className="absolute -bottom-1 left-0 right-0 h-3 bg-accent/15 rounded-sm -skew-x-3" />
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

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

      {/* Content — 2-column grid */}
      <div className="relative max-w-[1400px] mx-auto pt-12 md:pt-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <div>
            <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-6">
              {data.header.badge}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-text-primary mb-6">
              <HighlightedHeadline text={data.header.headline} highlight={data.header.highlightWord} />
            </h1>

            <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mb-8">
              {data.header.intro}
            </p>

            <a
              href={data.header.cta.href}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-accent-glow"
            >
              {data.header.cta.text} →
            </a>
          </div>

          {/* Right — Widget */}
          <div className="lg:block">
            <WidgetMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
