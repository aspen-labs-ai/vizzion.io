import { IndustryData } from '@/data/industries/types';

export default function IndustryPageHeader({ data }: { data: IndustryData }) {
  return (
    <section className="pt-32 pb-16 px-6 bg-bg-primary">
      <div className="max-w-[900px] mx-auto">
        <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-6">
          {data.header.badge}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-text-primary mb-6">
          {data.header.headline}
        </h1>

        <p className="text-xl text-text-secondary leading-relaxed">
          {data.header.intro}
        </p>
      </div>
    </section>
  );
}
