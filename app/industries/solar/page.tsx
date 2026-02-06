import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IndustryHero from '@/components/industries/IndustryHero';
import IndustryProblem from '@/components/industries/IndustryProblem';
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
        <IndustryHero data={solarData} />
        <IndustryProblem data={solarData} />
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
