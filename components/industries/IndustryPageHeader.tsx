import Image from 'next/image';
import Link from 'next/link';
import { IndustryData } from '@/data/industries/types';
import { HighlightedHeadline } from './HighlightedHeadline';
import { HighlightedIntro } from './HighlightedIntro';
import WidgetMockup from '@/components/WidgetMockup';

// Industries that ship a product-accurate animated demo in the hero.
// WidgetMockup currently renders roof materials, so only roofing opts in for now.
// Extend per-industry (prop-drive WidgetMockup's materials) before adding more.
const HERO_DEMO_SLUGS = new Set(['roofing']);

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 text-sm text-text-tertiary">
        <li>
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/industries" className="hover:text-accent transition-colors">
            Industries
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-text-secondary font-medium">{name}</li>
      </ol>
    </nav>
  );
}

export default function IndustryPageHeader({ data }: { data: IndustryData }) {
  const hasHeroDemo = HERO_DEMO_SLUGS.has(data.slug);

  return (
    <section className="relative pt-24 pb-24 md:pb-32 px-6 overflow-hidden">
      {/* Background Image — tinted */}
      <div className="absolute inset-0">
        <Image
          src={`/images/industries/${data.slug}.png`}
          alt={data.name}
          fill
          className="object-cover opacity-30"
          priority
        />
        {/* Dark tint overlay */}
        <div className="absolute inset-0 bg-bg-primary/50" />
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      {hasHeroDemo ? (
        // Two-column hero: copy + live product demo
        <div className="relative max-w-[1400px] mx-auto pt-6 md:pt-10">
          <Breadcrumb name={data.name} />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — copy */}
            <div>
              <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-6">
                {data.header.badge}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-text-primary mb-6">
                <HighlightedHeadline
                  text={data.header.headline}
                  highlight={data.header.highlightWord}
                />
              </h1>

              <div className="text-xl text-text-secondary leading-relaxed mb-8">
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

            {/* Right — live demo (desktop) */}
            <div className="hidden lg:block">
              <WidgetMockup />
            </div>
          </div>

          {/* Live demo (mobile, below copy) */}
          <div className="lg:hidden mt-12">
            <div className="max-w-md mx-auto">
              <WidgetMockup />
            </div>
          </div>
        </div>
      ) : (
        // Default centered header
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
      )}
    </section>
  );
}
