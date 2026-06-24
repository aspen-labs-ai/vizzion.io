import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { fencingLanding } from '@/data/industries/landing/fencing';

export const metadata: Metadata = getIndustryMetadata('fencing');

export default function FencingIndustryPage() {
  return <IndustryLanding data={fencingLanding} />;
}
