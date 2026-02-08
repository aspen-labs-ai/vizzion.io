import { IndustryData } from '@/data/industries/types';
import SignupSection from '@/components/SignupSection';

export default function IndustryCTA({ data }: { data: IndustryData }) {
  return (
    <section className="py-20 px-6 bg-bg-primary">
      <div className="max-w-[700px] mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">
          {data.cta.headline}
        </h2>
        <p className="text-text-secondary text-lg mb-8 leading-relaxed">
          {data.cta.subtext}
        </p>
      </div>

      <SignupSection defaultIndustry={data.shortName} />
    </section>
  );
}
