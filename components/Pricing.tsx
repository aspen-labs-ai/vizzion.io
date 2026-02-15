'use client';

import { useMemo, useState } from 'react';
import { Check, Minus } from 'lucide-react';

type FeatureValue = boolean | string;

interface PricingPlanInput {
  code: string;
  name: string;
  tagline: string;
  cta_label: string;
  featured: boolean;
  monthly_price_cents: number | null;
  annual_price_cents: number | null;
  visualization_quota_per_cycle: number | null;
  materials_quota: number | null;
  embed_domains_quota: number | null;
}

interface PricingFeature {
  name: string;
  values: [FeatureValue, FeatureValue, FeatureValue, FeatureValue];
}

interface PricingFeatureGroup {
  label: string;
  features: PricingFeature[];
}

interface PricingProps {
  plans?: PricingPlanInput[];
  featureGroups?: PricingFeatureGroup[];
}

interface PricingPlanCard {
  code: string;
  name: string;
  tagline: string;
  cta: string;
  featured: boolean;
  monthly: number | null;
  annual: number | null;
  highlights: string[];
}

const fallbackPlans: PricingPlanInput[] = [
  {
    code: 'free',
    name: 'Free',
    tagline: 'Everything you need to prove it works.',
    cta_label: 'Get Started',
    featured: false,
    monthly_price_cents: 0,
    annual_price_cents: 0,
    visualization_quota_per_cycle: 25,
    materials_quota: 4,
    embed_domains_quota: 1,
  },
  {
    code: 'growth',
    name: 'Growth',
    tagline: 'For businesses ready to generate real pipeline.',
    cta_label: 'Start Free Trial',
    featured: false,
    monthly_price_cents: 14900,
    annual_price_cents: 11900,
    visualization_quota_per_cycle: 200,
    materials_quota: 10,
    embed_domains_quota: 1,
  },
  {
    code: 'pro',
    name: 'Pro',
    tagline: 'For serious lead generation at scale.',
    cta_label: 'Start Free Trial',
    featured: true,
    monthly_price_cents: 34900,
    annual_price_cents: 27900,
    visualization_quota_per_cycle: 1000,
    materials_quota: 50,
    embed_domains_quota: 3,
  },
  {
    code: 'enterprise',
    name: 'Enterprise',
    tagline: 'For multi-location and high-volume operations.',
    cta_label: 'Contact Sales',
    featured: false,
    monthly_price_cents: null,
    annual_price_cents: null,
    visualization_quota_per_cycle: null,
    materials_quota: null,
    embed_domains_quota: null,
  },
];

const fallbackFeatureGroups: PricingFeatureGroup[] = [
  {
    label: 'Usage',
    features: [
      { name: 'Visualizations / month', values: ['25', '200', '1,000', 'Unlimited'] },
      { name: 'Materials', values: ['4', '10', '50', 'Unlimited'] },
      { name: 'Website embeds', values: ['1', '1', '3', 'Unlimited'] },
    ],
  },
  {
    label: 'Features',
    features: [
      { name: 'Lead capture (email gate)', values: [true, true, true, true] },
      { name: 'Custom branding', values: [false, true, true, true] },
      { name: 'Lead dashboard', values: [true, true, true, true] },
      { name: 'Analytics export', values: [false, true, true, true] },
      { name: 'CRM integration', values: [false, false, true, true] },
      { name: 'API access', values: [false, false, false, true] },
      { name: 'Multi-location support', values: [false, false, false, true] },
    ],
  },
  {
    label: 'Support',
    features: [
      { name: 'Email support', values: [true, true, true, true] },
      { name: 'Priority support', values: [false, false, true, true] },
      { name: 'Dedicated account manager', values: [false, false, false, true] },
    ],
  },
];

const planCodeOrder = ['free', 'growth', 'pro', 'enterprise'] as const;
const extrasByPlanCode: Record<string, [string, string]> = {
  free: ['Lead capture (email gate)', 'Email support'],
  growth: ['Custom branding', 'Lead dashboard + export'],
  pro: ['CRM integration', 'Priority support'],
  enterprise: ['API access + multi-location', 'Dedicated account manager'],
};

const gridCols = 'grid-cols-[200px_repeat(4,1fr)]';

function toDollarAmount(cents: number | null): number | null {
  if (cents === null) {
    return null;
  }
  return cents / 100;
}

function toCountLabel(value: number | null, singular: string, plural: string): string {
  if (value === null) {
    return `Unlimited ${plural}`;
  }

  const label = value === 1 ? singular : plural;
  return `${value.toLocaleString('en-US')} ${label}`;
}

function formatPrice(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(2);
}

function toPlanHighlights(plan: PricingPlanInput): string[] {
  const usageLines = [
    plan.visualization_quota_per_cycle === null
      ? 'Unlimited visualizations'
      : `${plan.visualization_quota_per_cycle.toLocaleString('en-US')} visualizations / month`,
    toCountLabel(plan.materials_quota, 'material', 'materials'),
    toCountLabel(plan.embed_domains_quota, 'website embed', 'website embeds'),
  ];

  const code = plan.code.toLowerCase();
  const extras = extrasByPlanCode[code] ?? ['Lead dashboard', 'Email support'];

  return [...usageLines, ...extras];
}

function CellValue({ value, isFeaturedCol }: { value: FeatureValue; isFeaturedCol: boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="mx-auto h-5 w-5 text-accent" />
    ) : (
      <Minus className="mx-auto h-4 w-4 text-text-tertiary/30" />
    );
  }

  return (
    <span className={`text-sm font-medium ${isFeaturedCol ? 'text-accent' : 'text-text-primary'}`}>
      {value}
    </span>
  );
}

export default function Pricing({ plans, featureGroups }: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  const resolvedPlans = useMemo(() => {
    const source = plans && plans.length > 0 ? plans : fallbackPlans;
    const planMap = new Map(source.map(plan => [plan.code.toLowerCase(), plan]));
    const orderedPlans = planCodeOrder
      .map(code => planMap.get(code))
      .filter((plan): plan is PricingPlanInput => Boolean(plan));

    if (orderedPlans.length !== planCodeOrder.length) {
      return fallbackPlans;
    }

    return orderedPlans;
  }, [plans]);

  const resolvedFeatureGroups =
    featureGroups && featureGroups.length > 0 ? featureGroups : fallbackFeatureGroups;

  const planCards: PricingPlanCard[] = resolvedPlans.map(plan => ({
    code: plan.code,
    name: plan.name,
    tagline: plan.tagline,
    cta: plan.cta_label,
    featured: plan.featured,
    monthly: toDollarAmount(plan.monthly_price_cents),
    annual: toDollarAmount(plan.annual_price_cents),
    highlights: toPlanHighlights(plan),
  }));

  return (
    <section className="bg-bg-tertiary px-6 py-24" id="pricing">
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-text-primary md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mb-8 text-xl text-text-secondary">
            Start free. Upgrade when Vizzion is filling your pipeline.
          </p>

          <div className="inline-flex items-center rounded-full border border-border-default bg-bg-secondary p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                !isAnnual
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isAnnual
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Annual
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  isAnnual ? 'bg-white/20 text-white' : 'bg-accent/15 text-accent'
                }`}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto mb-24 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {planCards.map(plan => (
            <div
              key={plan.code}
              className={`relative flex flex-col rounded-2xl p-7 ${
                plan.featured
                  ? 'border-2 border-accent bg-bg-secondary shadow-xl shadow-accent/10'
                  : 'border border-border-default bg-bg-secondary'
              }`}
            >
              {plan.featured ? (
                <div className="absolute -top-3.5 left-7 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                  Most Popular
                </div>
              ) : null}

              <div className="mb-1 text-sm font-semibold text-accent">{plan.name}</div>
              <p className="mb-5 text-sm leading-relaxed text-text-secondary">{plan.tagline}</p>

              <div className="mb-1">
                {plan.monthly === null ? (
                  <span className="text-4xl font-bold text-text-primary">Custom</span>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-text-primary">
                      ${formatPrice(isAnnual ? plan.annual ?? plan.monthly : plan.monthly)}
                    </span>
                    <span className="ml-2 text-sm text-text-tertiary">per month</span>
                  </div>
                )}
              </div>

              <div className="mb-6 h-5">
                {isAnnual &&
                plan.monthly !== null &&
                plan.annual !== null &&
                plan.monthly > plan.annual ? (
                  <span className="text-xs font-medium text-accent">
                    Billed annually - save ${Math.round((plan.monthly - plan.annual) * 12)}/yr
                  </span>
                ) : null}
                {plan.monthly === null ? (
                  <span className="text-xs text-text-tertiary">Tailored to your needs</span>
                ) : null}
              </div>

              <a
                href="#signup"
                className={`mb-7 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                  plan.featured
                    ? 'bg-accent text-white shadow-md shadow-accent/20 hover:bg-accent-hover'
                    : 'border border-border-default bg-bg-tertiary text-text-primary hover:border-accent'
                }`}
              >
                {plan.cta}
              </a>

              <div className="mb-3 text-sm font-medium text-text-secondary">Includes:</div>
              <ul className="space-y-3">
                {plan.highlights.map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <span className="text-sm leading-snug text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-5xl">
          <h3 className="mb-10 text-center text-2xl font-bold text-text-primary">
            Compare plans in detail
          </h3>

          <div className="overflow-x-auto pb-4">
            <div className="min-w-[780px]">
              <div className={`mb-2 grid ${gridCols} items-end gap-3 border-b border-border-default pb-5`}>
                <div />
                {planCards.map(plan => (
                  <div key={plan.code} className="text-center">
                    <div
                      className={`mb-2 text-sm font-semibold ${
                        plan.featured ? 'text-accent' : 'text-text-primary'
                      }`}
                    >
                      {plan.name}
                    </div>
                    <a
                      href="#signup"
                      className={`inline-block rounded-lg px-5 py-2 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                        plan.featured
                          ? 'bg-accent text-white hover:bg-accent-hover'
                          : 'border border-border-default bg-bg-secondary text-text-primary hover:border-accent'
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                ))}
              </div>

              {resolvedFeatureGroups.map(group => (
                <div key={group.label}>
                  <div className="px-1 pb-3 pt-6">
                    <span className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
                      {group.label}
                    </span>
                  </div>

                  {group.features.map((feature, idx) => (
                    <div
                      key={feature.name}
                      className={`grid ${gridCols} items-center gap-3 border-b border-border-subtle/50 ${
                        idx % 2 === 0 ? 'bg-bg-secondary/20' : ''
                      }`}
                    >
                      <div className="px-3 py-3 text-sm text-text-secondary">{feature.name}</div>
                      {feature.values.map((value, i) => (
                        <div
                          key={`${feature.name}-${i}`}
                          className={`px-2 py-3 text-center ${
                            planCards[i]?.featured ? 'bg-accent/[0.03]' : ''
                          }`}
                        >
                          <CellValue value={value} isFeaturedCol={Boolean(planCards[i]?.featured)} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-text-secondary">
          <p className="text-base">
            14-day free trial on paid plans &bull; No credit card required &bull; Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
