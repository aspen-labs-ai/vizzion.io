import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { drivewaysLanding } from '@/data/industries/landing/driveways';

export const metadata: Metadata = getIndustryMetadata('driveways');

export default function DrivewaysIndustryPage() {
  return <IndustryLanding data={drivewaysLanding} />;
}
