'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Marquee } from '@/components/ui/marquee';
import type { IndustryData } from '@/data/industries/types';

const allIndustries = [
  { slug: 'roofing', name: 'Roofing' },
  { slug: 'siding', name: 'Siding' },
  { slug: 'solar', name: 'Solar Energy' },
  { slug: 'windows-doors', name: 'Windows & Doors' },
  { slug: 'decking', name: 'Decking' },
  { slug: 'flooring', name: 'Flooring' },
  { slug: 'countertops', name: 'Countertops' },
  { slug: 'garage-doors', name: 'Garage Doors' },
  { slug: 'fencing', name: 'Fencing' },
  { slug: 'gutters', name: 'Gutters' },
  { slug: 'shutters', name: 'Shutters' },
  { slug: 'driveways', name: 'Driveways' },
  { slug: 'swimming-pools', name: 'Swimming Pools' },
  { slug: 'artificial-turf', name: 'Artificial Turf' },
  { slug: 'tattoos', name: 'Tattoo Studios' },
  { slug: 'car-wraps', name: 'Car Wraps' },
  { slug: 'boat-decking', name: 'Boat Decking' },
];

function IndustryCard({ slug, name }: { slug: string; name: string }) {
  return (
    <a
      href={`/industries/${slug}`}
      className={cn(
        'group/card relative block h-full w-36 sm:w-44 cursor-pointer overflow-hidden rounded-xl border',
        'border-border-default hover:border-accent',
        'transition-all duration-300 hover:scale-105'
      )}
    >
      {/* Industry image */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={`/images/industries/${slug}.png`}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 144px, 176px"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* Accent glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-accent/10" />
      </div>

      {/* Industry name */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <span className="text-white font-semibold text-sm drop-shadow-lg group-hover/card:text-accent transition-colors">
          {name}
        </span>
      </div>

      {/* Arrow on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
        <span className="text-accent text-sm">→</span>
      </div>
    </a>
  );
}

export default function IndustryRelatedPages({ data }: { data: IndustryData }) {
  const industries = allIndustries.filter((i) => i.slug !== data.slug);

  // Split industries into 4 roughly equal columns
  const colSize = Math.ceil(industries.length / 4);
  const col1 = industries.slice(0, colSize);
  const col2 = industries.slice(colSize, colSize * 2);
  const col3 = industries.slice(colSize * 2, colSize * 3);
  const col4 = industries.slice(colSize * 3);

  return (
    <section className="py-16 bg-bg-primary overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-text-primary text-center">
          Vizzion Works Across Industries
        </h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto">
          See how businesses in other industries use Vizzion to turn website visitors into qualified leads.
        </p>
      </div>

      {/* 3D Marquee */}
      <div className="relative flex h-[500px] w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">
        <div
          className="flex flex-row items-center gap-4"
          style={{
            transform:
              'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
          }}
        >
          <Marquee pauseOnHover vertical className="[--duration:20s]">
            {col1.map((industry) => (
              <IndustryCard key={industry.slug} {...industry} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
            {col2.map((industry) => (
              <IndustryCard key={industry.slug} {...industry} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
            {col3.map((industry) => (
              <IndustryCard key={industry.slug} {...industry} />
            ))}
          </Marquee>
          <Marquee pauseOnHover vertical className="[--duration:20s]">
            {col4.map((industry) => (
              <IndustryCard key={industry.slug} {...industry} />
            ))}
          </Marquee>
        </div>

        {/* Edge fade overlays */}
        <div className="from-bg-primary pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b" />
        <div className="from-bg-primary pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t" />
        <div className="from-bg-primary pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r" />
        <div className="from-bg-primary pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l" />
      </div>
    </section>
  );
}
