import type { IndustryData } from '@/data/industries/types';
import IndustryProblemSection from './IndustryProblemSection';
import IndustryFlowSection from './IndustryFlowSection';
import IndustryShiftSection from './IndustryShiftSection';
import IndustryFaqSection from './IndustryFaqSection';
import IndustryCloseSection from './IndustryCloseSection';

export default function IndustryPageBody({ data }: { data: IndustryData }) {
  return (
    <div className="industry-page-body">
      <IndustryProblemSection data={data} />
      <IndustryFlowSection data={data} />
      <IndustryShiftSection data={data} />
      <IndustryFaqSection data={data} />
      <IndustryCloseSection data={data} />
    </div>
  );
}
