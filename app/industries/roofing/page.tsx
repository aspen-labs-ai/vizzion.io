import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { roofingLanding } from '@/data/industries/landing/roofing';

export const metadata: Metadata = getIndustryMetadata('roofing');

export default function RoofingIndustryPage() {
  return <IndustryLanding data={roofingLanding} />;
}
