import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { boatDeckingLanding } from '@/data/industries/landing/boat-decking';

export const metadata: Metadata = getIndustryMetadata('boat-decking');

export default function BoatDeckingIndustryPage() {
  return <IndustryLanding data={boatDeckingLanding} />;
}
