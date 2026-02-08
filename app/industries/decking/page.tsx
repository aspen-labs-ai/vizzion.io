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
import { deckingData } from '@/data/industries/decking';

export const metadata: Metadata = {
  title: 'Deck Visualization & Lead Generation | Vizzion',
  description: 'Homeowners see their dream deck before breaking ground. Vizzion captures exclusive decking leads from your website — they preview, you close.',
  openGraph: {
    title: 'Deck Visualization & Lead Generation | Vizzion',
    description: 'Homeowners see their dream deck before breaking ground. Vizzion captures exclusive decking leads from your website — they preview, you close.',
    url: '/industries/decking',
  },
  twitter: {
    title: 'Deck Visualization & Lead Generation | Vizzion',
    description: 'Homeowners see their dream deck before breaking ground. Vizzion captures exclusive decking leads from your website — they preview, you close.',
  },
};

export default function DeckingIndustryPage() {
  return (
    <>
      <Header />
      <main>
        <IndustryBreadcrumb data={deckingData} />
        <IndustryPageHeader data={deckingData} />
        <IndustryContext data={deckingData} />
        <IndustryShowcase data={deckingData} />
        <IndustrySolution data={deckingData} />
        <IndustryHowItWorks data={deckingData} />
        <IndustryMidCTA data={deckingData} />
        <IndustryBenefits data={deckingData} />
        <IndustryComparison data={deckingData} />
        <IndustryTestimonials data={deckingData} />
        <IndustryFAQ data={deckingData} />
        <IndustryRelatedPages data={deckingData} />
        <IndustryCTA data={deckingData} />
      </main>
      <Footer />
    </>
  );
}
