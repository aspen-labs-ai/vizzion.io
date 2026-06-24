import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { swimmingPoolsLanding } from '@/data/industries/landing/swimming-pools';

export const metadata: Metadata = getIndustryMetadata('swimming-pools');

export default function SwimmingPoolsIndustryPage() {
  return <IndustryLanding data={swimmingPoolsLanding} />;
}
