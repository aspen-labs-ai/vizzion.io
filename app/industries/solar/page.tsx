import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IndustryPageHeader from '@/components/industries/IndustryPageHeader';
import IndustryContext from '@/components/industries/IndustryContext';
import IndustrySolution from '@/components/industries/IndustrySolution';
import IndustryHowItWorks from '@/components/industries/IndustryHowItWorks';
import IndustryBenefits from '@/components/industries/IndustryBenefits';
import IndustryComparison from '@/components/industries/IndustryComparison';
import IndustryTestimonials from '@/components/industries/IndustryTestimonials';
import IndustryFAQ from '@/components/industries/IndustryFAQ';
import IndustryCTA from '@/components/industries/IndustryCTA';
import { solarData } from '@/data/industries/solar';

export const metadata: Metadata = {
  title: solarData.metaTitle,
  description: solarData.metaDescription,
};

export default function SolarIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryPageHeader data={solarData} />
        <IndustryContext data={solarData} />
        <IndustrySolution data={solarData} />
        <IndustryHowItWorks data={solarData} />
        <IndustryBenefits data={solarData} />
        <IndustryComparison data={solarData} />
        <IndustryTestimonials data={solarData} />
        <IndustryFAQ data={solarData} />
        <IndustryCTA data={solarData} />
      </main>
      <Footer />
    </>
  );
}
