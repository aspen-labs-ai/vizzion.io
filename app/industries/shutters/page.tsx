import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { shuttersLanding } from '@/data/industries/landing/shutters';

export const metadata: Metadata = getIndustryMetadata('shutters');

export default function ShuttersIndustryPage() {
  return <IndustryLanding data={shuttersLanding} />;
}
