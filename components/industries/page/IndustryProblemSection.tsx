'use client';

import { motion } from 'motion/react';
import type { IndustryData } from '@/data/industries/types';
import SectionMark from './SectionMark';
import { highlightText } from './highlightText';

export default function IndustryProblemSection({ data }: { data: IndustryData }) {
  const { context } = data;

  return (
    <section className="relative overflow-hidden border-t border-border-subtle px-6 py-28 md:py-32">
      <div className="industry-grid-texture pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />

      <div className="relative mx-auto max-w-[1180px]">
        <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-text-tertiary">
          <SectionMark className="text-accent" />
          <span className="text-accent">01</span>
          <span className="h-px w-8 bg-border-emphasis" />
          <span>The gap</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold leading-[1.08] tracking-tight text-text-primary sm:text-4xl lg:text-[2.75rem]">
              {context.headline}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5"
          >
            {context.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed text-text-secondary">
                {highlightText(paragraph, context.highlights ?? [])}
              </p>
            ))}
          </motion.div>
        </div>

        {context.callout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-16 border-t border-border-subtle pt-12"
          >
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-5 text-center sm:flex-row sm:items-center sm:gap-10 sm:text-left">
              <span className="shrink-0 text-7xl font-bold leading-none tracking-tighter text-accent sm:text-8xl">
                {context.callout.stat}
              </span>
              <p className="text-lg leading-snug text-text-secondary sm:text-xl">
                {context.callout.text}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
