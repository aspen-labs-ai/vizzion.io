import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IndustryBreadcrumb from '@/components/industries/IndustryBreadcrumb';
import IndustryFAQ from '@/components/industries/IndustryFAQ';
import IndustryRelatedPages from '@/components/industries/IndustryRelatedPages';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import { roofingData } from '@/data/industries/roofing';
import HeroSectionSplit from '@/components/industries/roofing-test/HeroSectionSplit';
import StatsGrid from '@/components/industries/roofing-test/StatsGrid';
import HowItWorksCards from '@/components/industries/roofing-test/HowItWorksCards';
import BenefitsSection from '@/components/industries/roofing-test/BenefitsSection';
import ComparisonTable from '@/components/industries/roofing-test/ComparisonTable';
import TestimonialCards from '@/components/industries/roofing-test/TestimonialCards';
import FormSection from '@/components/industries/roofing-test/FormSection';

const baseMetadata = getIndustryMetadata('roofing');

export const metadata: Metadata = {
  ...baseMetadata,
  keywords: [
    'roofing visualizer',
    'roofing visualization software',
    'roofing contractor leads',
    'roofing lead generation',
    'roof design tool',
  ],
};

export default function RoofingTestPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={roofingData} />

        <HeroSectionSplit />
        <StatsGrid />
        <HowItWorksCards />
        <BenefitsSection />
        <ComparisonTable />
        <TestimonialCards />

        <IndustryFAQ data={roofingData} />
        <FormSection />
        <IndustryRelatedPages data={roofingData} />
      </main>
      <Footer />
    </>
  );
}
