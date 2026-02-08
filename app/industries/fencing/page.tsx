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
import { fencingData } from '@/data/industries/fencing';

export const metadata: Metadata = {
  title: fencingData.metaTitle,
  description: fencingData.metaDescription,
  openGraph: {
    title: fencingData.metaTitle,
    description: fencingData.metaDescription,
    url: '/industries/fencing',
  },
  twitter: {
    title: fencingData.metaTitle,
    description: fencingData.metaDescription,
  },
};

export default function FencingIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={fencingData} />
        <IndustryPageHeader data={fencingData} />
        <IndustryContext data={fencingData} />
        <IndustryShowcase data={fencingData} />
        <IndustrySolution data={fencingData} />
        <IndustryHowItWorks data={fencingData} />
        <IndustryMidCTA data={fencingData} />
        <IndustryBenefits data={fencingData} />
        <IndustryComparison data={fencingData} />
        <IndustryTestimonials data={fencingData} />
        <IndustryFAQ data={fencingData} />
        <IndustryRelatedPages data={fencingData} />
        <IndustryCTA data={fencingData} />
      </main>
      <Footer />
    </>
  );
}
