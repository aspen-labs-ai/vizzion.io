'use client';

import { useState } from 'react';
import { IndustryData } from '@/data/industries/types';

export default function IndustryFAQ({ data }: { data: IndustryData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
    <section className="relative overflow-hidden py-24 px-6 bg-bg-secondary">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-accent/10 via-teal-500/5 to-transparent" />
      <div className="pointer-events-none absolute -left-20 bottom-8 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-[860px] mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full border border-accent/30 bg-gradient-to-r from-accent/15 via-teal-400/10 to-cyan-400/10 text-accent font-medium text-sm mb-4">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-5">
          {data.faq.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;
            const triggerId = `faq-trigger-${index}`;

            return (
              <div
                key={index}
                className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-accent/45 bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-primary shadow-lg shadow-accent/10'
                    : 'border-border-default/80 bg-bg-secondary/70 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md hover:shadow-black/20'
                }`}
              >
                <button
                  id={triggerId}
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="w-full flex items-start justify-between gap-6 px-6 py-6 md:px-7 md:py-7 text-left cursor-pointer"
                >
                  <span className="text-text-primary font-semibold text-lg leading-snug">
                    {item.question}
                  </span>
                  <span
                    className={`mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border text-text-tertiary transition-all duration-300 ${
                      isOpen
                        ? 'rotate-45 border-accent/40 bg-accent/15 text-accent shadow-md shadow-accent/20'
                        : 'border-border-default bg-bg-primary/80 group-hover:text-accent group-hover:border-accent/30'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>

                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-7 md:px-7 text-text-secondary leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
