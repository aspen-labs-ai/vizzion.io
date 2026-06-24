import type { IndustryData } from '@/data/industries/types';
import RoofingProblemSection from './RoofingProblemSection';
import RoofingFlowSection from './RoofingFlowSection';
import RoofingShiftSection from './RoofingShiftSection';
import RoofingFaqSection from './RoofingFaqSection';
import RoofingCloseSection from './RoofingCloseSection';

export default function RoofingPageBody({ data }: { data: IndustryData }) {
  return (
    <div className="roofing-industry-body">
      <RoofingProblemSection data={data} />
      <RoofingFlowSection data={data} />
      <RoofingShiftSection data={data} />
      <RoofingFaqSection data={data} />
      <RoofingCloseSection data={data} />
    </div>
  );
}
