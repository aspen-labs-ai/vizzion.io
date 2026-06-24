import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { garageDoorsLanding } from '@/data/industries/landing/garage-doors';

export const metadata: Metadata = getIndustryMetadata('garage-doors');

export default function GarageDoorsIndustryPage() {
  return <IndustryLanding data={garageDoorsLanding} />;
}
