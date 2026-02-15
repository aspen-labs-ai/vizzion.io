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
import { countertopsData } from '@/data/industries/countertops';

export const metadata: Metadata = {
  title: 'Countertop Visualization & Lead Gen | Vizzion',
  description: 'Customers see granite, quartz, and marble in their actual kitchen. Vizzion captures leads and eliminates material uncertainty.',
  alternates: {
    canonical: getCanonicalUrl('/industries/countertops'),
  },
  openGraph: {
    title: 'Countertop Visualization & Lead Gen | Vizzion',
    description: 'Customers see granite, quartz, and marble in their actual kitchen. Vizzion captures leads and eliminates material uncertainty.',
    url: '/industries/countertops',
  },
  twitter: {
    title: 'Countertop Visualization & Lead Gen | Vizzion',
    description: 'Customers see granite, quartz, and marble in their actual kitchen. Vizzion captures leads and eliminates material uncertainty.',
  },
};

export default function CountertopsIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={countertopsData} />
        <IndustryPageHeader data={countertopsData} />
        <IndustryContext data={countertopsData} />
        <IndustryShowcase data={countertopsData} />
        <IndustrySolution data={countertopsData} />
        <IndustryHowItWorks data={countertopsData} />
        <IndustryMidCTA data={countertopsData} />
        <IndustryBenefits data={countertopsData} />
        <IndustryComparison data={countertopsData} />
        <IndustryTestimonials data={countertopsData} />
        <IndustryFAQ data={countertopsData} />
        <IndustryRelatedPages data={countertopsData} />
        <IndustryCTA data={countertopsData} />
      </main>
      <Footer />
    </>
  );
}
