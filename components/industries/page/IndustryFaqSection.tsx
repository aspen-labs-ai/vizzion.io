import type { IndustryData } from '@/data/industries/types';
import IndustryFaqAccordion from './IndustryFaqAccordion';
import SectionMark from './SectionMark';

export default function IndustryFaqSection({ data }: { data: IndustryData }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="border-t border-border-subtle bg-bg-secondary px-6 py-28 md:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-text-tertiary">
            <SectionMark className="text-accent" />
            <span className="text-accent">04</span>
            <span className="h-px w-8 bg-border-emphasis" />
            <span>FAQ</span>
          </div>

          <h2 className="text-3xl font-bold leading-[1.08] tracking-tight text-text-primary sm:text-4xl">
            Common questions
          </h2>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-text-secondary">
            Setup, materials, competitors, photos, pricing, and CRM — everything
            owners ask before adding Vizzion to their site.
          </p>
        </div>

        <IndustryFaqAccordion items={data.faq} />
      </div>
    </section>
  );
}
