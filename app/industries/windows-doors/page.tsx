import type { Metadata } from 'next';
import { getCanonicalUrl } from '@/lib/seo/canonical';
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
import { windowsDoorsData } from '@/data/industries/windows-doors';

export const metadata: Metadata = {
  title: 'Window & Door Visualization & Leads | Vizzion',
  description: 'Homeowners preview new windows and doors on their actual home. Vizzion captures qualified leads from your website — no shared leads.',
  alternates: {
    canonical: getCanonicalUrl('/industries/windows-doors'),
  },
  openGraph: {
    title: 'Window & Door Visualization & Leads | Vizzion',
    description: 'Homeowners preview new windows and doors on their actual home. Vizzion captures qualified leads from your website — no shared leads.',
    url: '/industries/windows-doors',
  },
  twitter: {
    title: 'Window & Door Visualization & Leads | Vizzion',
    description: 'Homeowners preview new windows and doors on their actual home. Vizzion captures qualified leads from your website — no shared leads.',
  },
};

export default function WindowsDoorsIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={windowsDoorsData} />
        <IndustryPageHeader data={windowsDoorsData} />
        <IndustryContext data={windowsDoorsData} />
        <IndustryShowcase data={windowsDoorsData} />
        <IndustrySolution data={windowsDoorsData} />
        <IndustryHowItWorks data={windowsDoorsData} />
        <IndustryMidCTA data={windowsDoorsData} />
        <IndustryBenefits data={windowsDoorsData} />
        <IndustryComparison data={windowsDoorsData} />
        <IndustryTestimonials data={windowsDoorsData} />
        <IndustryFAQ data={windowsDoorsData} />
        <IndustryRelatedPages data={windowsDoorsData} />
        <IndustryCTA data={windowsDoorsData} />
      </main>
      <Footer />
    </>
  );
}
