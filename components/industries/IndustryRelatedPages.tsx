import type { IndustryData } from '@/data/industries/types';

const industries = [
  { slug: "solar", name: "Solar Energy", description: "Homeowners preview solar panels on their roof" },
  { slug: "car-wraps", name: "Car & Vehicle Wraps", description: "Customers preview wrap colors on their vehicle" },
  { slug: "tattoos", name: "Tattoo Studios", description: "Clients see designs on their actual skin" },
  { slug: "swimming-pools", name: "Swimming Pools", description: "Homeowners see a pool in their backyard" },
  { slug: "artificial-turf", name: "Artificial Turf", description: "Homeowners see turf replacing their lawn" },
  { slug: "boat-decking", name: "Boat Decking", description: "Boat owners preview new decking materials" },
];

export default function IndustryRelatedPages({ data }: { data: IndustryData }) {
  const otherIndustries = industries.filter((industry) => industry.slug !== data.slug);

  return (
    <section className="py-16 px-6 bg-bg-primary">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-text-primary text-center">
          Vizzion Works Across Industries
        </h2>
        <p className="text-text-secondary text-center mb-10 max-w-2xl mx-auto">
          See how businesses in other industries use Vizzion to turn website visitors into qualified leads.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherIndustries.map((industry) => (
            <a
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              className="block p-5 rounded-xl bg-bg-secondary border border-border-default hover:border-accent transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-text-primary font-semibold group-hover:text-accent transition-colors">
                    {industry.name}
                  </span>
                  <span className="text-sm text-text-tertiary mt-1 block">
                    {industry.description}
                  </span>
                </div>
                <span className="text-text-tertiary group-hover:text-accent transition-colors">
                  &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
