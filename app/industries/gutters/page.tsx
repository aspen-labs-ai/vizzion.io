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
import { guttersData } from '@/data/industries/gutters';

export const metadata: Metadata = {
  title: 'Gutter Visualization & Lead Gen | Vizzion',
  description: 'Homeowners preview gutter profiles and colors on their actual home. Vizzion turns your website traffic into exclusive gutter leads.',
  openGraph: {
    title: 'Gutter Visualization & Lead Gen | Vizzion',
    description: 'Homeowners preview gutter profiles and colors on their actual home. Vizzion turns your website traffic into exclusive gutter leads.',
    url: '/industries/gutters',
  },
  twitter: {
    title: 'Gutter Visualization & Lead Gen | Vizzion',
    description: 'Homeowners preview gutter profiles and colors on their actual home. Vizzion turns your website traffic into exclusive gutter leads.',
  },
};

export default function GuttersIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={guttersData} />
        <IndustryPageHeader data={guttersData} />
        <IndustryContext data={guttersData} />
        <IndustryShowcase data={guttersData} />
        <IndustrySolution data={guttersData} />
        <IndustryHowItWorks data={guttersData} />
        <IndustryMidCTA data={guttersData} />
        <IndustryBenefits data={guttersData} />
        <IndustryComparison data={guttersData} />
        <IndustryTestimonials data={guttersData} />
        <IndustryFAQ data={guttersData} />
        <IndustryRelatedPages data={guttersData} />
        <IndustryCTA data={guttersData} />
      </main>
      <Footer />
    </>
  );
}
