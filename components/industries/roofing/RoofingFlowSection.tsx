'use client';

import { motion } from 'motion/react';
import { Code2, Home, Mail } from 'lucide-react';
import type { IndustryData } from '@/data/industries/types';
import RoofMark from './RoofMark';
import RoofingFlowSteps from './RoofingFlowSteps';

const STEP_ICONS = [Code2, Home, Mail];

export default function RoofingFlowSection({ data }: { data: IndustryData }) {
  const { howItWorks } = data;

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howItWorks.headline,
    description: howItWorks.intro,
    step: howItWorks.steps.map((step) => ({
      '@type': 'HowToStep',
      position: step.number,
      name: step.title,
      text: step.description,
    })),
  };

  const stepsWithIcons = howItWorks.steps.map((step, index) => ({
    ...step,
    icon: STEP_ICONS[index] ?? Code2,
  }));

  return (
    <section id="how-it-works" className="relative border-y border-border-subtle bg-bg-secondary px-6 py-28 md:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <div className="relative mx-auto max-w-[1180px]">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-text-tertiary">
            <RoofMark className="text-accent" />
            <span className="text-accent">02</span>
            <span className="h-px w-8 bg-border-emphasis" />
            <span>How it works</span>
          </div>

          <h2 className="text-3xl font-bold leading-[1.08] tracking-tight text-text-primary sm:text-4xl lg:text-[2.75rem]">
            {howItWorks.headline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-text-secondary">
            {howItWorks.intro}
          </p>
        </div>

        <RoofingFlowSteps steps={stepsWithIcons} />
      </div>
    </section>
  );
}
