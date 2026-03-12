import type { LucideIcon } from 'lucide-react';
import { MailCheck, PlugZap, Upload } from 'lucide-react';

interface StepCard {
  title: string;
  description: string;
  icon: LucideIcon;
}

const steps: StepCard[] = [
  {
    title: 'Embed widget on your website',
    description:
      'Paste one snippet on your roofing pages. The visualizer inherits your branding and loads in minutes.',
    icon: PlugZap,
  },
  {
    title: 'Homeowner uploads a photo',
    description:
      'They preview shingles, metal, or tile directly on their home and explore options with confidence.',
    icon: Upload,
  },
  {
    title: 'You get an exclusive lead',
    description:
      'When they save their result, you capture contact info plus material preference for faster follow-up.',
    icon: MailCheck,
  },
];

export default function HowItWorksCards() {
  return (
    <section id="how-it-works" className="bg-bg-primary px-6 py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">How It Works</p>
          <h2 className="text-3xl font-bold leading-tight text-text-primary md:text-4xl">
            Roofing Visualization Software Built for Quick Adoption
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="group rounded-2xl border border-border-default bg-bg-secondary p-7 transition-all duration-250 hover:-translate-y-1 hover:border-accent/70"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-light text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-text-tertiary">0{index + 1}</span>
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-text-primary">{step.title}</h3>
                <p className="text-base leading-relaxed text-text-secondary">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
