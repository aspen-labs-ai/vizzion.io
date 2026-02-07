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
import { tattoosData } from '@/data/industries/tattoos';

export const metadata: Metadata = {
  title: tattoosData.metaTitle,
  description: tattoosData.metaDescription,
};

export default function TattoosIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryPageHeader data={tattoosData} />
        <IndustryContext data={tattoosData} />
        <IndustryShowcase data={tattoosData} />
        <IndustrySolution data={tattoosData} />
        <IndustryHowItWorks data={tattoosData} />
        <IndustryBenefits data={tattoosData} />
        <IndustryComparison data={tattoosData} />
        <IndustryTestimonials data={tattoosData} />
        <IndustryFAQ data={tattoosData} />
        <IndustryCTA data={tattoosData} />
      </main>
      <Footer />
    </>
  );
}
