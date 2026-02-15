import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
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
import { artificialTurfData } from '@/data/industries/artificial-turf';

export const metadata: Metadata = getIndustryMetadata('artificial-turf');


export default function ArtificialTurfIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={artificialTurfData} />
        <IndustryPageHeader data={artificialTurfData} />
        <IndustryContext data={artificialTurfData} />
        <IndustryShowcase data={artificialTurfData} />
        <IndustrySolution data={artificialTurfData} />
        <IndustryHowItWorks data={artificialTurfData} />
        <IndustryMidCTA data={artificialTurfData} />
        <IndustryBenefits data={artificialTurfData} />
        <IndustryComparison data={artificialTurfData} />
        <IndustryTestimonials data={artificialTurfData} />
        <IndustryFAQ data={artificialTurfData} />
        <IndustryRelatedPages data={artificialTurfData} />
        <IndustryCTA data={artificialTurfData} />
      </main>
      <Footer />
    </>
  );
}
