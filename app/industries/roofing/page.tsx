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
import { roofingData } from '@/data/industries/roofing';

export const metadata: Metadata = {
  title: 'Roofing Visualization & Lead Generation | Vizzion',
  description: 'Homeowners see new shingles, metal, or tile on their actual roof before calling. Vizzion captures exclusive roofing leads from your site.',
  openGraph: {
    title: 'Roofing Visualization & Lead Generation | Vizzion',
    description: 'Homeowners see new shingles, metal, or tile on their actual roof before calling. Vizzion captures exclusive roofing leads from your site.',
    url: '/industries/roofing',
  },
  twitter: {
    title: 'Roofing Visualization & Lead Generation | Vizzion',
    description: 'Homeowners see new shingles, metal, or tile on their actual roof before calling. Vizzion captures exclusive roofing leads from your site.',
  },
};

export default function RoofingIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={roofingData} />
        <IndustryPageHeader data={roofingData} />
        <IndustryContext data={roofingData} />
        <IndustryShowcase data={roofingData} />
        <IndustrySolution data={roofingData} />
        <IndustryHowItWorks data={roofingData} />
        <IndustryMidCTA data={roofingData} />
        <IndustryBenefits data={roofingData} />
        <IndustryComparison data={roofingData} />
        <IndustryTestimonials data={roofingData} />
        <IndustryFAQ data={roofingData} />
        <IndustryRelatedPages data={roofingData} />
        <IndustryCTA data={roofingData} />
      </main>
      <Footer />
    </>
  );
}
