import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { deckingLanding } from '@/data/industries/landing/decking';

export const metadata: Metadata = getIndustryMetadata('decking');

export default function DeckingIndustryPage() {
  return <IndustryLanding data={deckingLanding} />;
}
