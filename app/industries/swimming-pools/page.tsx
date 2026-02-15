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
import { swimmingPoolsData } from '@/data/industries/swimming-pools';

export const metadata: Metadata = getIndustryMetadata('swimming-pools');


export default function SwimmingPoolsIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={swimmingPoolsData} />
        <IndustryPageHeader data={swimmingPoolsData} />
        <IndustryContext data={swimmingPoolsData} />
        <IndustryShowcase data={swimmingPoolsData} />
        <IndustrySolution data={swimmingPoolsData} />
        <IndustryHowItWorks data={swimmingPoolsData} />
        <IndustryMidCTA data={swimmingPoolsData} />
        <IndustryBenefits data={swimmingPoolsData} />
        <IndustryComparison data={swimmingPoolsData} />
        <IndustryTestimonials data={swimmingPoolsData} />
        <IndustryFAQ data={swimmingPoolsData} />
        <IndustryRelatedPages data={swimmingPoolsData} />
        <IndustryCTA data={swimmingPoolsData} />
      </main>
      <Footer />
    </>
  );
}
