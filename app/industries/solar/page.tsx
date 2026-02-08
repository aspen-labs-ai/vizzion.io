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
import { solarData } from '@/data/industries/solar';

export const metadata: Metadata = {
  title: 'Solar Visualization & Lead Generation | Vizzion',
  description: 'Homeowners preview solar panels on their actual roof, then hand you their email. Vizzion turns your website traffic into exclusive solar leads.',
  openGraph: {
    title: 'Solar Visualization & Lead Generation | Vizzion',
    description: 'Homeowners preview solar panels on their actual roof, then hand you their email. Vizzion turns your website traffic into exclusive solar leads.',
    url: '/industries/solar',
  },
  twitter: {
    title: 'Solar Visualization & Lead Generation | Vizzion',
    description: 'Homeowners preview solar panels on their actual roof, then hand you their email. Vizzion turns your website traffic into exclusive solar leads.',
  },
};

export default function SolarIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={solarData} />
        <IndustryPageHeader data={solarData} />
        <IndustryContext data={solarData} />
        <IndustryShowcase data={solarData} />
        <IndustrySolution data={solarData} />
        <IndustryHowItWorks data={solarData} />
        <IndustryMidCTA data={solarData} />
        <IndustryBenefits data={solarData} />
        <IndustryComparison data={solarData} />
        <IndustryTestimonials data={solarData} />
        <IndustryFAQ data={solarData} />
        <IndustryRelatedPages data={solarData} />
        <IndustryCTA data={solarData} />
      </main>
      <Footer />
    </>
  );
}
