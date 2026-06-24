import type { Metadata } from 'next';
import { getIndustryMetadata } from '@/lib/seo/industry-metadata';
import IndustryLanding from '@/components/industries/landing/IndustryLanding';
import { windowsDoorsLanding } from '@/data/industries/landing/windows-doors';

export const metadata: Metadata = getIndustryMetadata('windows-doors');

export default function WindowsDoorsIndustryPage() {
  return <IndustryLanding data={windowsDoorsLanding} />;
}
