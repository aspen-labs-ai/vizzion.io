import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { solarLanding } from '@/data/industries/landing/solar';

export const metadata: Metadata = getIndustryMetadata('solar');

export default function SolarIndustryPage() {
  return <IndustryLanding data={solarLanding} />;
}
