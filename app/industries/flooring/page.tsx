import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { flooringLanding } from '@/data/industries/landing/flooring';

export const metadata: Metadata = getIndustryMetadata('flooring');

export default function FlooringIndustryPage() {
  return <IndustryLanding data={flooringLanding} />;
}
