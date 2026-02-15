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
import { drivewaysData } from '@/data/industries/driveways';

export const metadata: Metadata = getIndustryMetadata('driveways');


export default function DrivewaysIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={drivewaysData} />
        <IndustryPageHeader data={drivewaysData} />
        <IndustryContext data={drivewaysData} />
        <IndustryShowcase data={drivewaysData} />
        <IndustrySolution data={drivewaysData} />
        <IndustryHowItWorks data={drivewaysData} />
        <IndustryMidCTA data={drivewaysData} />
        <IndustryBenefits data={drivewaysData} />
        <IndustryComparison data={drivewaysData} />
        <IndustryTestimonials data={drivewaysData} />
        <IndustryFAQ data={drivewaysData} />
        <IndustryRelatedPages data={drivewaysData} />
        <IndustryCTA data={drivewaysData} />
      </main>
      <Footer />
    </>
  );
}
