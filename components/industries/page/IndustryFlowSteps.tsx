'use client';

import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

type FlowStep = {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function IndustryFlowSteps({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="relative mt-16">
      <div
        className="pointer-events-none absolute left-0 right-0 top-[2.75rem] hidden h-px bg-gradient-to-r from-transparent via-border-emphasis to-transparent md:block"
        aria-hidden
      />

      <ol className="grid gap-6 md:grid-cols-3 md:gap-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCenter = index === 1;

          return (
            <motion.li
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className={`relative flex flex-col rounded-2xl border p-6 md:p-7 ${
                isCenter
                  ? 'border-accent/50 bg-bg-primary shadow-[0_0_40px_-12px_var(--color-accent-glow)] md:-translate-y-2'
                  : 'border-border-default bg-bg-primary/60'
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-sm font-medium tracking-widest text-accent">
                  {String(step.number).padStart(2, '0')}
                </span>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    isCenter ? 'bg-accent text-primary' : 'bg-bg-tertiary text-accent'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-3 flex-1 text-[0.975rem] leading-relaxed text-text-secondary">
                {step.description}
              </p>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
