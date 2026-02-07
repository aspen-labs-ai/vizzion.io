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
import { carWrapsData } from '@/data/industries/car-wraps';

export const metadata: Metadata = {
  title: carWrapsData.metaTitle,
  description: carWrapsData.metaDescription,
};

export default function CarWrapsIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryPageHeader data={carWrapsData} />
        <IndustryContext data={carWrapsData} />
        <IndustryShowcase data={carWrapsData} />
        <IndustrySolution data={carWrapsData} />
        <IndustryHowItWorks data={carWrapsData} />
        <IndustryBenefits data={carWrapsData} />
        <IndustryComparison data={carWrapsData} />
        <IndustryTestimonials data={carWrapsData} />
        <IndustryFAQ data={carWrapsData} />
        <IndustryCTA data={carWrapsData} />
      </main>
      <Footer />
    </>
  );
}
