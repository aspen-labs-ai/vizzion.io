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
import { artificialTurfData } from '@/data/industries/artificial-turf';

export const metadata: Metadata = {
  title: 'Artificial Turf Visualization & Leads | Vizzion',
  description: 'Homeowners see turf on their actual yard, enter their email — you get the lead. Vizzion generates exclusive artificial turf leads. No sharing.',
  openGraph: {
    title: 'Artificial Turf Visualization & Leads | Vizzion',
    description: 'Homeowners see turf on their actual yard, enter their email — you get the lead. Vizzion generates exclusive artificial turf leads. No sharing.',
    url: '/industries/artificial-turf',
  },
  twitter: {
    title: 'Artificial Turf Visualization & Leads | Vizzion',
    description: 'Homeowners see turf on their actual yard, enter their email — you get the lead. Vizzion generates exclusive artificial turf leads. No sharing.',
  },
};

export default function ArtificialTurfIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={artificialTurfData} />
        <IndustryPageHeader data={artificialTurfData} />
        <IndustryContext data={artificialTurfData} />
        <IndustryShowcase data={artificialTurfData} />
        <IndustrySolution data={artificialTurfData} />
        <IndustryHowItWorks data={artificialTurfData} />
        <IndustryMidCTA data={artificialTurfData} />
        <IndustryBenefits data={artificialTurfData} />
        <IndustryComparison data={artificialTurfData} />
        <IndustryTestimonials data={artificialTurfData} />
        <IndustryFAQ data={artificialTurfData} />
        <IndustryRelatedPages data={artificialTurfData} />
        <IndustryCTA data={artificialTurfData} />
      </main>
      <Footer />
    </>
  );
}
