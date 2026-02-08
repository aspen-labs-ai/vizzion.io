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
import { sidingData } from '@/data/industries/siding';

export const metadata: Metadata = {
  title: sidingData.metaTitle,
  description: sidingData.metaDescription,
  openGraph: {
    title: sidingData.metaTitle,
    description: sidingData.metaDescription,
    url: '/industries/siding',
  },
  twitter: {
    title: sidingData.metaTitle,
    description: sidingData.metaDescription,
  },
};

export default function SidingIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={sidingData} />
        <IndustryPageHeader data={sidingData} />
        <IndustryContext data={sidingData} />
        <IndustryShowcase data={sidingData} />
        <IndustrySolution data={sidingData} />
        <IndustryHowItWorks data={sidingData} />
        <IndustryMidCTA data={sidingData} />
        <IndustryBenefits data={sidingData} />
        <IndustryComparison data={sidingData} />
        <IndustryTestimonials data={sidingData} />
        <IndustryFAQ data={sidingData} />
        <IndustryRelatedPages data={sidingData} />
        <IndustryCTA data={sidingData} />
      </main>
      <Footer />
    </>
  );
}
