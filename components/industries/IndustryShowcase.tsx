// Temporarily hidden — before/after images not ready yet. Re-enable when showcase images are prepared.

import { IndustryData } from '@/data/industries/types';

export default function IndustryShowcase({ data }: { data: IndustryData }) {
  return null;

  // import BeforeAfterSlider from './BeforeAfterSlider';
  //
  // if (!data.showcase) return null;
  //
  // return (
  //   <section className="py-16 px-6 bg-bg-primary">
  //     <div className="max-w-[1000px] mx-auto">
  //       <div className="text-center mb-10">
  //         <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">
  //           {data.showcase.headline}
  //         </h2>
  //         {data.showcase.subtext && (
  //           <p className="text-lg text-text-secondary max-w-2xl mx-auto">
  //             {data.showcase.subtext}
  //           </p>
  //         )}
  //       </div>
  //
  //       <BeforeAfterSlider
  //         beforeImage={data.showcase.beforeImage}
  //         afterImage={data.showcase.afterImage}
  //         beforeLabel={data.showcase.beforeLabel || "Before"}
  //         afterLabel={data.showcase.afterLabel || "With Solar"}
  //       />
  //
  //       <p className="text-center text-sm text-text-tertiary mt-4">
  //         Drag the slider to compare
  //       </p>
  //     </div>
  //   </section>
  // );
}
