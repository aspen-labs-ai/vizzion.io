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
import { boatDeckingData } from '@/data/industries/boat-decking';

export const metadata: Metadata = {
  title: boatDeckingData.metaTitle,
  description: boatDeckingData.metaDescription,
};

export default function BoatDeckingIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryPageHeader data={boatDeckingData} />
        <IndustryContext data={boatDeckingData} />
        <IndustryShowcase data={boatDeckingData} />
        <IndustrySolution data={boatDeckingData} />
        <IndustryHowItWorks data={boatDeckingData} />
        <IndustryBenefits data={boatDeckingData} />
        <IndustryComparison data={boatDeckingData} />
        <IndustryTestimonials data={boatDeckingData} />
        <IndustryFAQ data={boatDeckingData} />
        <IndustryCTA data={boatDeckingData} />
      </main>
      <Footer />
    </>
  );
}
