import { Home, Building2, DoorOpen, Boxes, Table2, PanelTop } from 'lucide-react';

export default function Industries() {
  const industries = [
    {
      icon: Home,
      name: 'Roofing',
      description: 'Help homeowners make confident roofing decisions by showing exactly how different materials and colors look on their actual home. From traditional asphalt shingles to premium metal roofing, customers can compare options side-by-side before committing to a major investment.',
      popular: true,
      href: '/industries/roofing'
    },
    {
      icon: Building2,
      name: 'Siding',
      description: 'Transform exterior design decisions from guesswork to certainty. Customers visualize vinyl, fiber cement, wood, and stone siding options on their actual home, comparing styles and colors before the first panel is installed.',
      href: '/industries/siding'
    },
    {
      icon: DoorOpen,
      name: 'Windows & Doors',
      description: 'Help customers choose window styles, door colors, and hardware finishes with confidence. Visualize how new windows transform a home\'s character—from modern black frames to classic white trim—on their actual property.',
      href: '/industries/windows-doors'
    },
    {
      icon: PanelTop,
      name: 'Decking',
      description: 'Let customers design their dream outdoor living space by visualizing composite, wood, and PVC decking materials. See how different board widths, colors, and railing styles come together before construction begins.',
      href: '/industries/decking'
    },
    {
      icon: Boxes,
      name: 'Flooring',
      description: 'Eliminate flooring showroom overwhelm by letting customers see hardwood, LVP, tile, and carpet in their actual rooms. Upload a photo, select materials, and instantly compare options in their real lighting and space.',
      href: '/industries/flooring'
    },
    {
      icon: Table2,
      name: 'Countertops',
      description: 'Transform kitchen and bathroom decisions with instant countertop visualization. Customers compare granite, quartz, marble, and butcher block on their actual cabinets—no samples or imagination required.',
      href: '/industries/countertops'
    }
  ];

  return (
    <section className="py-24 px-6 bg-bg-primary" id="industries">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">
            Industries
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Built for businesses that sell visual products
          </h2>
          <p className="text-xl text-text-secondary">
            If your customers need to see it to believe it, Vizzion is for you.
          </p>
        </div>
        
        {/* Compact Industry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <a
                key={index}
                href={industry.href}
                className="group block bg-bg-secondary rounded-xl p-6 border border-border-default hover:border-accent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer relative"
              >
                {industry.popular && (
                  <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-accent text-primary text-xs font-semibold">
                    Popular
                  </div>
                )}
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                
                {/* Industry Name */}
                <h3 className="text-xl font-bold mb-2 text-text-primary group-hover:text-accent transition-colors">
                  {industry.name}
                </h3>
                
                {/* Value Proposition */}
                <p className="text-text-secondary text-sm leading-relaxed">
                  {industry.description}
                </p>
                
                {/* Arrow indicator */}
                <div className="mt-4 flex items-center text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-text-secondary mb-4">
            Don't see your industry? Vizzion works with any visual product.
          </p>
          <a 
            href="#signup" 
            className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold transition-colors"
          >
            Talk to our team
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
