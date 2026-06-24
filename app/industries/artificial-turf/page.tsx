import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { artificialTurfLanding } from '@/data/industries/landing/artificial-turf';

export const metadata: Metadata = getIndustryMetadata('artificial-turf');

export default function ArtificialTurfIndustryPage() {
  return <IndustryLanding data={artificialTurfLanding} />;
}
