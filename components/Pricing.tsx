'use client';

import { useState } from 'react';
import { Check, Minus } from 'lucide-react';

/* ── Plan data ── */

const plans = [
  {
    name: 'Free',
    monthly: 0,
    annual: 0,
    tagline: 'Everything you need to prove it works.',
    cta: 'Get Started',
    featured: false,
    highlights: [
      '25 visualizations / month',
      '4 materials',
      '1 website embed',
      'Lead capture (email gate)',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    monthly: 149,
    annual: 119,
    tagline: 'For businesses ready to generate real pipeline.',
    cta: 'Start Free Trial',
    featured: false,
    highlights: [
      '200 visualizations / month',
      '10 materials',
      'Custom branding',
      'Lead dashboard + export',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    monthly: 349,
    annual: 279,
    tagline: 'For serious lead generation at scale.',
    cta: 'Start Free Trial',
    featured: true,
    highlights: [
      '1,000 visualizations / month',
      '50 materials',
      '3 website embeds',
      'CRM integration',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    monthly: null,
    annual: null,
    tagline: 'For multi-location and high-volume operations.',
    cta: 'Contact Sales',
    featured: false,
    highlights: [
      'Unlimited visualizations',
      'Unlimited materials',
      'Unlimited embeds',
      'API access + multi-location',
      'Dedicated account manager',
    ],
  },
];

/* ── Feature comparison data ── */

type FeatureValue = boolean | string;

interface Feature {
  name: string;
  values: [FeatureValue, FeatureValue, FeatureValue, FeatureValue];
}

interface FeatureGroup {
  label: string;
  features: Feature[];
}

const featureGroups: FeatureGroup[] = [
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

const gridCols = 'grid-cols-[200px_repeat(4,1fr)]';

function CellValue({ value, isFeaturedCol }: { value: FeatureValue; isFeaturedCol: boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-accent mx-auto" />
    ) : (
      <Minus className="w-4 h-4 text-text-tertiary/30 mx-auto" />
    );
  }
  return (
    <span className={`text-sm font-medium ${isFeaturedCol ? 'text-accent' : 'text-text-primary'}`}>
      {value}
    </span>
  );
}

/* ── Component ── */

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="py-24 px-6 bg-bg-tertiary" id="pricing">
      <div className="max-w-[1400px] mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Start free. Upgrade when Vizzion is filling your pipeline.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-bg-secondary rounded-full p-1 border border-border-default">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                !isAnnual
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isAnnual
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Annual
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isAnnual ? 'bg-white/20 text-white' : 'bg-accent/15 text-accent'
                }`}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════
            PART 1 — Big Plan Cards
           ══════════════════════════════════════ */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-24">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-7 flex flex-col relative ${
                plan.featured
                  ? 'bg-bg-secondary border-2 border-accent shadow-xl shadow-accent/10'
                  : 'bg-bg-secondary border border-border-default'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-7 px-3 py-1 rounded-full bg-accent text-white text-xs font-bold">
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <div className="text-accent font-semibold text-sm mb-1">{plan.name}</div>

              {/* Tagline */}
              <p className="text-text-secondary text-sm mb-5 leading-relaxed">{plan.tagline}</p>

              {/* Price */}
              <div className="mb-1">
                {plan.monthly === null ? (
                  <span className="text-4xl font-bold text-text-primary">Custom</span>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-text-primary">
                      ${isAnnual ? plan.annual : plan.monthly}
                    </span>
                    <span className="text-text-tertiary text-sm ml-2">per month</span>
                  </div>
                )}
              </div>

              {/* Annual savings */}
              <div className="h-5 mb-6">
                {isAnnual && plan.monthly && plan.monthly > 0 ? (
                  <span className="text-xs text-accent font-medium">
                    Billed annually &mdash; save ${(plan.monthly - plan.annual!) * 12}/yr
                  </span>
                ) : plan.monthly === null ? (
                  <span className="text-xs text-text-tertiary">Tailored to your needs</span>
                ) : null}
              </div>

              {/* CTA */}
              <a
                href="#signup"
                className={`w-full py-3 text-sm font-semibold rounded-lg text-center block transition-all duration-200 hover:-translate-y-0.5 mb-7 ${
                  plan.featured
                    ? 'bg-accent text-white hover:bg-accent-hover shadow-md shadow-accent/20'
                    : 'bg-bg-tertiary text-text-primary border border-border-default hover:border-accent'
                }`}
              >
                {plan.cta}
              </a>

              {/* Highlights */}
              <div className="text-sm text-text-secondary mb-3 font-medium">Includes:</div>
              <ul className="space-y-3">
                {plan.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-secondary leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════
            PART 2 — Detailed Comparison Table
           ══════════════════════════════════════ */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-text-primary text-center mb-10">
            Compare plans in detail
          </h3>

          <div className="overflow-x-auto pb-4">
            <div className="min-w-[780px]">
              {/* Table header — plan names + CTAs */}
              <div className={`grid ${gridCols} gap-3 items-end border-b border-border-default pb-5 mb-2`}>
                <div />
                {plans.map((plan) => (
                  <div key={plan.name} className="text-center">
                    <div className={`text-sm font-semibold mb-2 ${plan.featured ? 'text-accent' : 'text-text-primary'}`}>
                      {plan.name}
                    </div>
                    <a
                      href="#signup"
                      className={`inline-block px-5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 ${
                        plan.featured
                          ? 'bg-accent text-white hover:bg-accent-hover'
                          : 'bg-bg-secondary text-text-primary border border-border-default hover:border-accent'
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                ))}
              </div>

              {/* Feature rows */}
              {featureGroups.map((group) => (
                <div key={group.label}>
                  <div className="pt-6 pb-3 px-1">
                    <span className="text-xs font-semibold text-text-tertiary uppercase tracking-widest">
                      {group.label}
                    </span>
                  </div>

                  {group.features.map((feature, idx) => (
                    <div
                      key={feature.name}
                      className={`grid ${gridCols} gap-3 items-center border-b border-border-subtle/50 ${
                        idx % 2 === 0 ? 'bg-bg-secondary/20' : ''
                      }`}
                    >
                      <div className="px-3 py-3 text-sm text-text-secondary">{feature.name}</div>
                      {feature.values.map((value, i) => (
                        <div
                          key={i}
                          className={`px-2 py-3 text-center ${
                            plans[i].featured ? 'bg-accent/[0.03]' : ''
                          }`}
                        >
                          <CellValue value={value} isFeaturedCol={plans[i].featured} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-text-secondary mt-12">
          <p className="text-base">
            14-day free trial on paid plans &bull; No credit card required &bull; Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
