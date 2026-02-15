import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCanonicalUrl } from '@/lib/seo/canonical';

export const metadata: Metadata = {
  title: 'Industry Visualizer Widgets for Business Websites | Vizzion',
  description: 'Explore visualizer widgets by industry and see how contractors and local businesses turn website traffic into qualified leads.',
  alternates: {
    canonical: getCanonicalUrl('/industries'),
  },
  openGraph: {
    title: 'Industry Visualizer Widgets for Business Websites | Vizzion',
    description: 'Explore visualizer widgets by industry and see how contractors and local businesses turn website traffic into qualified leads.',
    url: '/industries',
  },
  twitter: {
    title: 'Industry Visualizer Widgets for Business Websites | Vizzion',
    description: 'Explore visualizer widgets by industry and see how contractors and local businesses turn website traffic into qualified leads.',
  },
};

interface IndustryLink {
  name: string;
  slug: string;
  description: string;
}

interface IndustryGroup {
  label: string;
  industries: IndustryLink[];
}

const industryGroups: IndustryGroup[] = [
  {
    label: 'Home Improvement',
    industries: [
      {
        name: 'Roofing',
        slug: 'roofing',
        description: 'Show homeowners new shingles, metal, or tile on their actual roof before they request an estimate.',
      },
      {
        name: 'Siding',
        slug: 'siding',
        description: 'Help customers compare siding options on their own home before committing to a project.',
      },
      {
        name: 'Solar Energy',
        slug: 'solar',
        description: 'Turn solar research traffic into qualified leads by showing panel previews on real rooftops.',
      },
      {
        name: 'Windows & Doors',
        slug: 'windows-doors',
        description: 'Let homeowners preview frame styles and color combinations on their existing facade.',
      },
      {
        name: 'Decking',
        slug: 'decking',
        description: 'Visualize deck materials and finishes in the exact outdoor space the customer already has.',
      },
      {
        name: 'Flooring',
        slug: 'flooring',
        description: 'Replace sample-board guesswork with room-level previews to speed up flooring decisions.',
      },
      {
        name: 'Countertops',
        slug: 'countertops',
        description: 'Show countertop materials in context on existing cabinets before a consultation call.',
      },
      {
        name: 'Garage Doors',
        slug: 'garage-doors',
        description: 'Preview garage door styles and colors on the customer\'s actual home exterior.',
      },
      {
        name: 'Fencing',
        slug: 'fencing',
        description: 'Visualize fence styles around the customer\'s real property layout before quoting.',
      },
      {
        name: 'Gutters',
        slug: 'gutters',
        description: 'Capture urgent repair and replacement leads with on-home gutter style previews.',
      },
      {
        name: 'Shutters',
        slug: 'shutters',
        description: 'Help homeowners compare shutter styles and colors directly on their facade.',
      },
      {
        name: 'Driveways & Pavement',
        slug: 'driveways',
        description: 'Turn visual driveway design decisions into qualified paving leads from site traffic.',
      },
      {
        name: 'Swimming Pools',
        slug: 'swimming-pools',
        description: 'Show backyard pool layouts in real context so shoppers move from browsing to booking.',
      },
      {
        name: 'Artificial Turf',
        slug: 'artificial-turf',
        description: 'Let homeowners see turf transformation on their current yard before speaking with sales.',
      },
    ],
  },
  {
    label: 'Beyond the Home',
    industries: [
      {
        name: 'Car & Vehicle Wraps',
        slug: 'car-wraps',
        description: 'Help customers preview wrap concepts on their own vehicle before requesting design support.',
      },
      {
        name: 'Tattoos',
        slug: 'tattoos',
        description: 'Reduce hesitation by letting clients preview tattoo designs on their own body placement.',
      },
      {
        name: 'Boat Decking',
        slug: 'boat-decking',
        description: 'Show marine decking options on the owner\'s vessel before they contact your shop.',
      },
    ],
  },
];

const allIndustries = industryGroups.flatMap((group) => group.industries);

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Industries Served by Vizzion',
  numberOfItems: allIndustries.length,
  itemListElement: allIndustries.map((industry, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: industry.name,
    url: `https://vizzion.io/industries/${industry.slug}`,
  })),
};

export default function IndustriesHubPage() {
  return (
    <>
      <Header />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="py-24 px-6 bg-bg-primary">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">
              Industries
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text-primary">
              Visualizer Widgets for Industries That Sell Visual Transformations
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Explore every live Vizzion industry page. If your customers need to see the end result before they buy,
              these playbooks show how to turn your existing website traffic into qualified leads.
            </p>
          </div>
        </section>

        <section className="py-24 px-6 bg-bg-primary">
          <div className="max-w-[1400px] mx-auto">
            {industryGroups.map((group) => (
              <div key={group.label} className="mb-16 last:mb-0">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary whitespace-nowrap">
                    {group.label}
                  </h2>
                  <div className="h-px flex-1 bg-border-default" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.industries.map((industry) => (
                    <Link
                      key={industry.slug}
                      href={`/industries/${industry.slug}`}
                      className="group block bg-bg-secondary rounded-xl border border-border-default hover:border-accent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg p-6"
                    >
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
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 px-6 bg-bg-secondary">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              Don&apos;t See Your Industry?
            </h2>
            <p className="text-xl text-text-secondary mb-10 leading-relaxed">
              Vizzion works with any business that sells visual transformations. Talk to us about your use case.
            </p>
            <Link
              href="/#signup"
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
