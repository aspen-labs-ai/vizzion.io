import Image from 'next/image';
import { IndustryData } from '@/data/industries/types';

export default function IndustryPageHeader({ data }: { data: IndustryData }) {
  return (
    <section className="relative pt-24 pb-24 md:pb-32 px-6 overflow-hidden">
      {/* Background Image — tinted and subtle */}
      <div className="absolute inset-0">
        <Image
          src={`/images/industries/${data.slug}.png`}
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
        {/* Dark tint overlay */}
        <div className="absolute inset-0 bg-bg-primary/70" />
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-[900px] mx-auto pt-12 md:pt-16">
        <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-6">
          {data.header.badge}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-text-primary mb-6">
          {data.header.headline}
        </h1>

        <p className="text-xl text-text-secondary leading-relaxed max-w-3xl">
          {data.header.intro}
        </p>
      </div>
    </section>
  );
}
