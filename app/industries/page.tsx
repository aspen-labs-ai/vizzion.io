import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sun, Car, Pen, Waves, Sprout, Ship } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Industries We Serve — Visual Lead Generation for Any Business | Vizzion',
  description: 'Vizzion helps businesses across 17+ industries turn website visitors into qualified leads. See how solar, vehicle wraps, tattoos, pools, turf, and marine companies use Vizzion.',
  openGraph: {
    title: 'Industries We Serve — Visual Lead Generation for Any Business | Vizzion',
    description: 'Vizzion helps businesses across 17+ industries turn website visitors into qualified leads. See how solar, vehicle wraps, tattoos, pools, turf, and marine companies use Vizzion.',
    url: '/industries',
  },
  twitter: {
    title: 'Industries We Serve — Visual Lead Generation for Any Business | Vizzion',
    description: 'Vizzion helps businesses across 17+ industries turn website visitors into qualified leads. See how solar, vehicle wraps, tattoos, pools, turf, and marine companies use Vizzion.',
  },
};

interface LiveIndustry {
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
}

const liveIndustries: LiveIndustry[] = [
  {
    name: 'Solar Energy',
    slug: 'solar',
    icon: Sun,
    description: 'Homeowners preview solar panels on their actual roof before committing to an installation.',
  },
  {
    name: 'Car & Vehicle Wraps',
    slug: 'car-wraps',
    icon: Car,
    description: 'Customers preview wrap colors and designs on their actual vehicle before booking.',
  },
  {
    name: 'Tattoo Studios',
    slug: 'tattoos',
    icon: Pen,
    description: 'Clients see tattoo designs on their actual skin before sitting in the chair.',
  },
  {
    name: 'Swimming Pools',
    slug: 'swimming-pools',
    icon: Waves,
    description: 'Homeowners see a pool installed in their actual backyard before signing a contract.',
  },
  {
    name: 'Artificial Turf',
    slug: 'artificial-turf',
    icon: Sprout,
    description: 'Homeowners see lush turf replacing their existing lawn without a single sprinkler.',
  },
  {
    name: 'Boat Decking',
    slug: 'boat-decking',
    icon: Ship,
    description: 'Boat owners preview new decking materials on their actual vessel before the install.',
  },
];

const comingSoonIndustries = [
  'Roofing',
  'Siding',
  'Windows & Doors',
  'Decking',
  'Fencing',
  'Landscaping',
  'Painting',
  'Gutters',
  'Garage Doors',
  'Outdoor Lighting',
  'Flooring & Countertops',
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Industries Served by Vizzion',
  numberOfItems: 6,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Solar Energy', url: 'https://vizzion.io/industries/solar' },
    { '@type': 'ListItem', position: 2, name: 'Car & Vehicle Wraps', url: 'https://vizzion.io/industries/car-wraps' },
    { '@type': 'ListItem', position: 3, name: 'Tattoo Studios', url: 'https://vizzion.io/industries/tattoos' },
    { '@type': 'ListItem', position: 4, name: 'Swimming Pools', url: 'https://vizzion.io/industries/swimming-pools' },
    { '@type': 'ListItem', position: 5, name: 'Artificial Turf', url: 'https://vizzion.io/industries/artificial-turf' },
    { '@type': 'ListItem', position: 6, name: 'Boat Decking', url: 'https://vizzion.io/industries/boat-decking' },
  ],
};

export default function IndustriesHubPage() {
  return (
    <>
      <Header />
      <main>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero Section */}
        <section className="py-24 px-6 bg-bg-primary">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">
              Industries
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text-primary">
              One Widget. Every Industry That Sells Visual Transformations.
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              If your customers need to <em>see it</em> before they buy it, Vizzion is built for you.
              Embed our visualization widget on your website, capture leads before showing the preview,
              and turn browsers into qualified buyers — no matter what you sell.
            </p>
          </div>
        </section>

        {/* Live Industries Section */}
        <section className="py-24 px-6 bg-bg-primary">
          <div className="max-w-[1400px] mx-auto">
            {/* Section Label with Separator */}
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary whitespace-nowrap">
                Live Industries
              </h2>
              <div className="h-px flex-1 bg-border-default"></div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveIndustries.map((industry) => {
                const Icon = industry.icon;
                return (
                  <Link
                    key={industry.slug}
                    href={`/industries/${industry.slug}`}
                    className="group block bg-bg-secondary rounded-xl border border-border-default hover:border-accent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg p-6"
                  >
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-text-primary">
                      {industry.name}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                      {industry.description}
                    </p>
                    <div className="flex items-center text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-24 px-6 bg-bg-primary">
          <div className="max-w-[1400px] mx-auto">
            {/* Section Label with Separator */}
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary whitespace-nowrap">
                Coming Soon
              </h2>
              <div className="h-px flex-1 bg-border-default"></div>
            </div>

            {/* Pill Tags */}
            <div className="flex flex-wrap gap-3">
              {comingSoonIndustries.map((industry) => (
                <span
                  key={industry}
                  className="px-5 py-2.5 rounded-full bg-bg-secondary border border-border-default text-text-secondary text-sm font-medium"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-24 px-6 bg-bg-secondary">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              Don&apos;t See Your Industry?
            </h2>
            <p className="text-xl text-text-secondary mb-10 leading-relaxed">
              Vizzion works with any business that sells visual transformations. Talk to us about your use case.
            </p>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 bg-accent text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-accent-glow rounded-lg px-8 py-4 font-semibold text-lg"
            >
              Get Started Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
