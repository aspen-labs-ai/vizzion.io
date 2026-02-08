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
import { flooringData } from '@/data/industries/flooring';

export const metadata: Metadata = {
  title: flooringData.metaTitle,
  description: flooringData.metaDescription,
  openGraph: {
    title: flooringData.metaTitle,
    description: flooringData.metaDescription,
    url: '/industries/flooring',
  },
  twitter: {
    title: flooringData.metaTitle,
    description: flooringData.metaDescription,
  },
};

export default function FlooringIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={flooringData} />
        <IndustryPageHeader data={flooringData} />
        <IndustryContext data={flooringData} />
        <IndustryShowcase data={flooringData} />
        <IndustrySolution data={flooringData} />
        <IndustryHowItWorks data={flooringData} />
        <IndustryMidCTA data={flooringData} />
        <IndustryBenefits data={flooringData} />
        <IndustryComparison data={flooringData} />
        <IndustryTestimonials data={flooringData} />
        <IndustryFAQ data={flooringData} />
        <IndustryRelatedPages data={flooringData} />
        <IndustryCTA data={flooringData} />
      </main>
      <Footer />
    </>
  );
}
