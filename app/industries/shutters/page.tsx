import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IndustryPageHeader from '@/components/industries/IndustryPageHeader';
import IndustryContext from '@/components/industries/IndustryContext';
import IndustryShowcase from '@/components/industries/IndustryShowcase';
import IndustrySolution from '@/components/industries/IndustrySolution';
import IndustryHowItWorks from '@/components/industries/IndustryHowItWorks';
import IndustryBenefits from '@/components/industries/IndustryBenefits';
import IndustryComparison from '@/components/industries/IndustryComparison';
import IndustryTestimonials from '@/components/industries/IndustryTestimonials';
import IndustryFAQ from '@/components/industries/IndustryFAQ';
import IndustryCTA from '@/components/industries/IndustryCTA';
import IndustryBreadcrumb from '@/components/industries/IndustryBreadcrumb';
import IndustryMidCTA from '@/components/industries/IndustryMidCTA';
import IndustryRelatedPages from '@/components/industries/IndustryRelatedPages';
import { shuttersData } from '@/data/industries/shutters';

export const metadata: Metadata = {
  title: 'Shutter Visualization & Lead Gen | Vizzion',
  description: 'Homeowners preview exterior shutters on their actual home before buying. Vizzion captures qualified shutter leads, not cold traffic.',
  openGraph: {
    title: 'Shutter Visualization & Lead Gen | Vizzion',
    description: 'Homeowners preview exterior shutters on their actual home before buying. Vizzion captures qualified shutter leads, not cold traffic.',
    url: '/industries/shutters',
  },
  twitter: {
    title: 'Shutter Visualization & Lead Gen | Vizzion',
    description: 'Homeowners preview exterior shutters on their actual home before buying. Vizzion captures qualified shutter leads, not cold traffic.',
  },
};

export default function ShuttersIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={shuttersData} />
        <IndustryPageHeader data={shuttersData} />
        <IndustryContext data={shuttersData} />
        <IndustryShowcase data={shuttersData} />
        <IndustrySolution data={shuttersData} />
        <IndustryHowItWorks data={shuttersData} />
        <IndustryMidCTA data={shuttersData} />
        <IndustryBenefits data={shuttersData} />
        <IndustryComparison data={shuttersData} />
        <IndustryTestimonials data={shuttersData} />
        <IndustryFAQ data={shuttersData} />
        <IndustryRelatedPages data={shuttersData} />
        <IndustryCTA data={shuttersData} />
      </main>
      <Footer />
    </>
  );
}
