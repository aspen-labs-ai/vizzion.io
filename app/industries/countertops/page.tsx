import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { countertopsLanding } from '@/data/industries/landing/countertops';

export const metadata: Metadata = getIndustryMetadata('countertops');

export default function CountertopsIndustryPage() {
  return <IndustryLanding data={countertopsLanding} />;
}
