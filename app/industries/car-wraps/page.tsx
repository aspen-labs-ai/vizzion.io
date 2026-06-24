import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { carWrapsLanding } from '@/data/industries/landing/car-wraps';

export const metadata: Metadata = getIndustryMetadata('car-wraps');

export default function CarWrapsIndustryPage() {
  return <IndustryLanding data={carWrapsLanding} />;
}
