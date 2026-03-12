import type { LucideIcon } from 'lucide-react';
import { CircleCheck } from 'lucide-react';

interface BenefitSplitProps {
  title: string;
  description: string;
  bullets: string[];
  stat: string;
  icon: LucideIcon;
  reverse?: boolean;
  className?: string;
}

export default function BenefitSplit({
  title,
  description,
  bullets,
  stat,
  icon: Icon,
  reverse = false,
  className = 'bg-bg-primary',
}: BenefitSplitProps) {
  return (
    <section className={`${className} px-6 py-24`}>
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className={reverse ? 'order-2' : 'order-1'}>
          <h3 className="text-3xl font-bold leading-tight text-text-primary md:text-4xl">{title}</h3>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">{description}</p>

          <ul className="mt-7 space-y-3">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-text-secondary">
                <CircleCheck className="mt-1 h-4 w-4 flex-shrink-0 text-accent" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={reverse ? 'order-1' : 'order-2'}>
          <div className="rounded-2xl border border-border-default bg-bg-secondary p-8">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light text-accent">
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-5xl font-bold leading-none text-text-primary">{stat}</p>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              Better pre-sales context for your team and clearer decisions for homeowners.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
