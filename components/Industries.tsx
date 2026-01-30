import { Home, Anchor, Building2, Palette, Trees, Boxes } from 'lucide-react';

export default function Industries() {
  const industries = [
    {
      icon: Home,
      name: 'Roofing & Exteriors',
      description: 'Help homeowners confidently choose shingles, metal roofing, or tiles by showing realistic visualizations on their actual home. Eliminate decision paralysis and reduce sample requests while dramatically shortening the sales cycle from quote to close.',
      popular: true,
      href: '/industries/roofing'
    },
    {
      icon: Anchor,
      name: 'Marine & Boat Decking',
      description: 'Let boat owners see exactly how different decking materials and colors will look on their vessel before making expensive commitments. Reduce returns and increase buyer confidence with accurate, personalized visualizations.',
      href: '/industries/marine'
    },
    {
      icon: Building2,
      name: 'Siding & Exteriors',
      description: 'Transform the siding selection process by letting customers instantly preview materials, textures, and colors on their home. Remove the guesswork and build trust by showing them exactly what they\'re buying before installation.',
      href: '/industries/siding'
    },
    {
      icon: Palette,
      name: 'Paint & Finishes',
      description: 'Enable customers to experiment with unlimited color combinations and finishes on their actual property photos. Turn browsers into buyers by helping them visualize bold choices with confidence, eliminating costly color regrets.',
      href: '/industries/paint'
    },
    {
      icon: Trees,
      name: 'Landscaping',
      description: 'Bring landscape designs to life by showing clients how plants, hardscaping, and outdoor features will transform their property. Win more bids by helping customers see the full vision before a single shovel hits the ground.',
      href: '/industries/landscaping'
    },
    {
      icon: Boxes,
      name: 'Flooring & Interiors',
      description: 'Let customers see how different flooring materials, patterns, and colors will actually look in their rooms with their existing furniture and lighting. Reduce showroom visits and speed up the decision-making process dramatically.',
      href: '/industries/flooring'
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
