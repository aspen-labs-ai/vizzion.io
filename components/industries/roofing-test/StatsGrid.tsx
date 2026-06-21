import type { LucideIcon } from 'lucide-react';
import {
  CircleDollarSign,
  Clock3,
  Eye,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';

interface RoofingStat {
  value: string;
  label: string;
  icon: LucideIcon;
}

const roofingStats: RoofingStat[] = [
  {
    value: '95%',
    label: 'of roofing visitors leave before requesting a quote today',
    icon: Eye,
  },
  {
    value: '34%',
    label: 'average close rate on visualizer leads vs shared lead lists',
    icon: TrendingUp,
  },
  {
    value: '$80+',
    label: 'saved per lead compared with aggregator marketplaces',
    icon: CircleDollarSign,
  },
  {
    value: '3.5x',
    label: 'more qualified opportunities from existing website traffic',
    icon: Users,
  },
  {
    value: '12 days',
    label: 'faster quote-to-close cycle after visual confidence is built',
    icon: Clock3,
  },
  {
    value: '100%',
    label: 'exclusive lead ownership with no bidding wars or sharing',
    icon: ShieldCheck,
  },
];

export default function StatsGrid() {
  return (
    <section className="bg-bg-secondary px-6 py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold leading-tight text-text-primary md:text-4xl lg:text-5xl">
            Roofing Contractor Leads Should Come From Your Site, Not a Marketplace Auction
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roofingStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.value + stat.label}
                className="group rounded-2xl border border-border-default bg-bg-primary/70 p-6 transition-all duration-250 hover:-translate-y-1 hover:border-accent/70"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-light text-accent transition-transform duration-250 group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mb-3 text-4xl font-bold leading-none text-text-primary">{stat.value}</p>
                <p className="text-base leading-relaxed text-text-secondary">{stat.label}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
