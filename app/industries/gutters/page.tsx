import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { guttersLanding } from '@/data/industries/landing/gutters';

export const metadata: Metadata = getIndustryMetadata('gutters');

export default function GuttersIndustryPage() {
  return <IndustryLanding data={guttersLanding} />;
}
