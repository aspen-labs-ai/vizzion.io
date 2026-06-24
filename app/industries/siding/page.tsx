import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { sidingLanding } from '@/data/industries/landing/siding';

export const metadata: Metadata = getIndustryMetadata('siding');

export default function SidingIndustryPage() {
  return <IndustryLanding data={sidingLanding} />;
}
