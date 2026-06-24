'use client';

import { motion } from 'motion/react';
import { ArrowRight, Check, X } from 'lucide-react';
import type { IndustryData } from '@/data/industries/types';
import RoofMark from './RoofMark';

export default function RoofingShiftSection({ data }: { data: IndustryData }) {
  const { comparison, solution } = data;

  return (
    <section className="relative overflow-hidden px-6 py-28 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="relative mx-auto max-w-[1180px]">
        <div className="mb-14 max-w-2xl">
          <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-text-tertiary">
            <RoofMark className="text-accent" />
            <span className="text-accent">03</span>
            <span className="h-px w-8 bg-border-emphasis" />
            <span>The shift</span>
          </div>
          <h2 className="text-3xl font-bold leading-[1.08] tracking-tight text-text-primary sm:text-4xl lg:text-[2.75rem]">
            {solution.headline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-text-secondary">{solution.intro}</p>
        </div>

        <div className="relative grid gap-0 overflow-hidden rounded-2xl border border-border-default md:grid-cols-2">
          <div
            className="absolute left-1/2 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-emphasis bg-bg-primary font-mono text-[0.65rem] font-semibold tracking-[0.2em] text-text-tertiary md:flex"
            aria-hidden
          >
            VS
          </div>

          <div className="border-b border-border-default bg-bg-secondary/50 p-7 md:border-b-0 md:border-r md:p-9">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary">
              Without Vizzion
            </p>
            <ul className="space-y-4">
              {comparison.oldWay.map((item, index) => (
                <li key={index} className="flex gap-3 text-text-tertiary">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-tertiary">
                    <X className="h-3 w-3 text-red-400/90" strokeWidth={2.5} />
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative bg-bg-primary p-7 md:p-9">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_55%)]" />
            <p className="relative mb-6 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              With Vizzion
            </p>
            <ul className="relative space-y-4">
              {comparison.vizzionWay.map((item, index) => (
                <li key={index} className="flex gap-3 text-text-secondary">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15">
                    <Check className="h-3 w-3 text-accent" strokeWidth={2.5} />
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {solution.points.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group rounded-xl border border-border-default bg-bg-secondary/40 p-5 transition-colors duration-300 hover:border-accent/40"
            >
              <div className="mb-3 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-accent transition-transform duration-300 group-hover:translate-x-0.5" />
                <h3 className="font-semibold text-text-primary">{point.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-text-secondary">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
