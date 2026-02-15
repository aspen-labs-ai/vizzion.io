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
import { tattoosData } from '@/data/industries/tattoos';

export const metadata: Metadata = {
  title: 'Tattoo Visualization & Lead Gen | Vizzion',
  description: 'Clients see your tattoo designs on their actual skin before booking. Reduces no-shows and turns browsers into committed leads with Vizzion.',
  alternates: {
    canonical: getCanonicalUrl('/industries/tattoos'),
  },
  openGraph: {
    title: 'Tattoo Visualization & Lead Gen | Vizzion',
    description: 'Clients see your tattoo designs on their actual skin before booking. Reduces no-shows and turns browsers into committed leads with Vizzion.',
    url: '/industries/tattoos',
  },
  twitter: {
    title: 'Tattoo Visualization & Lead Gen | Vizzion',
    description: 'Clients see your tattoo designs on their actual skin before booking. Reduces no-shows and turns browsers into committed leads with Vizzion.',
  },
};

export default function TattoosIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={tattoosData} />
        <IndustryPageHeader data={tattoosData} />
        <IndustryContext data={tattoosData} />
        <IndustryShowcase data={tattoosData} />
        <IndustrySolution data={tattoosData} />
        <IndustryHowItWorks data={tattoosData} />
        <IndustryMidCTA data={tattoosData} />
        <IndustryBenefits data={tattoosData} />
        <IndustryComparison data={tattoosData} />
        <IndustryTestimonials data={tattoosData} />
        <IndustryFAQ data={tattoosData} />
        <IndustryRelatedPages data={tattoosData} />
        <IndustryCTA data={tattoosData} />
      </main>
      <Footer />
    </>
  );
}
