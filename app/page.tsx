import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import WidgetExperience from '@/components/WidgetExperience';
import ThreeSteps from '@/components/ThreeSteps';
import Platforms from '@/components/Platforms';
import Industries from '@/components/Industries';
import Dashboard from '@/components/Dashboard';
import Pricing from '@/components/Pricing';
import SignupSection from '@/components/SignupSection';
import Footer from '@/components/Footer';
import { buildPricingFeatureGroups, getPublicPricingPlans } from '@/lib/vizzion/billing';
import { getCanonicalUrl } from '@/lib/seo/canonical';

const HOME_TITLE = 'Embeddable Visualizer Widget for Business Websites | Vizzion';
const HOME_DESC =
  "Add Vizzion's visualizer widget to your website so visitors preview your products on a photo of their own home or vehicle and become exclusive, qualified leads.";
const HOME_OG_IMAGE = 'https://vizzion.io/images/vizzion-og-image.png';

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESC,
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESC,
    url: '/',
    images: [{ url: HOME_OG_IMAGE, width: 1200, height: 630, alt: 'Vizzion' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESC,
    images: [HOME_OG_IMAGE],
  },
};

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://vizzion.io/#webpage',
      url: 'https://vizzion.io/',
      name: HOME_TITLE,
      description: HOME_DESC,
      isPartOf: { '@id': 'https://vizzion.io/#website' },
      about: { '@id': 'https://vizzion.io/#app' },
      inLanguage: 'en-US',
      dateModified: '2026-06-19',
      primaryImageOfPage: { '@type': 'ImageObject', url: HOME_OG_IMAGE },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://vizzion.io/#app',
      name: 'Vizzion',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://vizzion.io/',
      description:
        'Embeddable visualization widget that lets website visitors preview products on a photo of their own home, vehicle, or space, turning traffic into exclusive leads.',
      publisher: { '@id': 'https://vizzion.io/#organization' },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free tier available. Premium plans based on visualization volume.',
      },
      featureList: [
        'Customer photo upload visualization',
        'Configurable product catalog and custom uploads',
        'Embeddable website widget',
        'White-label branding',
        'Exclusive lead capture',
        '5-minute setup',
      ],
    },
  ],
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSingleParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0] ?? null;
  }

  return null;
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const code = getSingleParam(params.code);

  if (code) {
    const callbackParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'string') {
        callbackParams.set(key, value);
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((entry) => callbackParams.append(key, entry));
      }
    });

    redirect(`/auth/callback?${callbackParams.toString()}`);
  }

  const pricingPlans = await getPublicPricingPlans();
  const pricingFeatureGroups = buildPricingFeatureGroups(pricingPlans);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <WidgetExperience />
        <ThreeSteps />
        <Platforms />
        <Industries />
        <Dashboard />
        <Pricing plans={pricingPlans} featureGroups={pricingFeatureGroups} />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
}
