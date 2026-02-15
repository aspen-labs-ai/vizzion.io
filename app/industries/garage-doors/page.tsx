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
import { garageDoorsData } from '@/data/industries/garage-doors';

export const metadata: Metadata = {
  title: 'Garage Door Visualization & Leads | Vizzion',
  description: 'Homeowners preview new garage doors on their actual home. Vizzion captures exclusive leads from your website traffic — no shared lists.',
  alternates: {
    canonical: getCanonicalUrl('/industries/garage-doors'),
  },
  openGraph: {
    title: 'Garage Door Visualization & Leads | Vizzion',
    description: 'Homeowners preview new garage doors on their actual home. Vizzion captures exclusive leads from your website traffic — no shared lists.',
    url: '/industries/garage-doors',
  },
  twitter: {
    title: 'Garage Door Visualization & Leads | Vizzion',
    description: 'Homeowners preview new garage doors on their actual home. Vizzion captures exclusive leads from your website traffic — no shared lists.',
  },
};

export default function GarageDoorsIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={garageDoorsData} />
        <IndustryPageHeader data={garageDoorsData} />
        <IndustryContext data={garageDoorsData} />
        <IndustryShowcase data={garageDoorsData} />
        <IndustrySolution data={garageDoorsData} />
        <IndustryHowItWorks data={garageDoorsData} />
        <IndustryMidCTA data={garageDoorsData} />
        <IndustryBenefits data={garageDoorsData} />
        <IndustryComparison data={garageDoorsData} />
        <IndustryTestimonials data={garageDoorsData} />
        <IndustryFAQ data={garageDoorsData} />
        <IndustryRelatedPages data={garageDoorsData} />
        <IndustryCTA data={garageDoorsData} />
      </main>
      <Footer />
    </>
  );
}
