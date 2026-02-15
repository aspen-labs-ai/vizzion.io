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
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import SignupSection from '@/components/SignupSection';
import Footer from '@/components/Footer';
import { buildPricingFeatureGroups, getPublicPricingPlans } from '@/lib/vizzion/billing';
import { getCanonicalUrl } from '@/lib/seo/canonical';

export const metadata: Metadata = {
  title: 'Embeddable Visualizer Widget for Business Websites | Vizzion',
  description: 'Add a visualizer widget to your website so visitors can preview products on their own photo and become qualified leads.',
  alternates: {
    canonical: getCanonicalUrl('/'),
  },
  openGraph: {
    title: 'Embeddable Visualizer Widget for Business Websites | Vizzion',
    description: 'Add a visualizer widget to your website so visitors can preview products on their own photo and become qualified leads.',
    url: '/',
  },
  twitter: {
    title: 'Embeddable Visualizer Widget for Business Websites | Vizzion',
    description: 'Add a visualizer widget to your website so visitors can preview products on their own photo and become qualified leads.',
  },
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
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <WidgetExperience />
        <ThreeSteps />
        <Platforms />
        <Industries />
        <Dashboard />
        <Testimonials />
        <Pricing plans={pricingPlans} featureGroups={pricingFeatureGroups} />
        <SignupSection />
      </main>
      <Footer />
    </>
  );
}
