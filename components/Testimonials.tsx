'use client';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Vizzion transformed how we capture leads. We went from 12 qualified leads per month to 47 in just 60 days. Our close rate jumped from 22% to 41%.",
      author: "Mike Thompson",
      handle: "@mikethompson",
      company: "Thompson Roofing",
      image: "/images/testimonials/avatar-1.jpg"
    },
    {
      quote: "Homeowners see a pool in their backyard and the conversation changes completely. We closed 31% of Vizzion leads vs. 12% on everything else.",
      author: "Sarah Chen",
      handle: "@sarahchen",
      company: "AquaVista Pools",
      image: "/images/testimonials/avatar-2.jpg"
    },
    {
      quote: "Setup took 5 minutes. First lead came in 3 hours later. Best ROI of any tool we've ever implemented.",
      author: "James Martinez",
      handle: "@jamesmartinez",
      company: "Coastal Siding Co",
      image: "/images/testimonials/avatar-3.jpg"
    },
    {
      quote: "Fleet owners see the wrap on their actual vehicle and commit on the spot. Our quote-to-close rate doubled since adding Vizzion.",
      author: "Emily Rodriguez",
      handle: "@emilyrodriguez",
      company: "Precision Auto Wraps",
      image: "/images/testimonials/avatar-4.jpg"
    },
    {
      quote: "In Phoenix, everyone is thinking about turf. Vizzion lets homeowners see it on their yard — we cut our Angi spend entirely.",
      author: "David Park",
      handle: "@davidpark",
      company: "Desert Green Turf",
      image: "/images/testimonials/avatar-5.jpg"
    },
    {
      quote: "The dashboard shows exactly which products customers are interested in. Our sales team follows up with perfect context every time.",
      author: "Lisa Anderson",
      handle: "@lisaanderson",
      company: "Heritage Floors & Design",
      image: "/images/testimonials/avatar-6.jpg"
    }
  ];

  return (
    <section
      className="py-24 px-6 relative overflow-hidden border-t border-accent/10"
      style={{ background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.06) 0%, var(--color-bg-primary) 40%, var(--color-bg-primary) 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 70%)' }}
      />
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            What our customers are saying
          </h2>
          <p className="text-xl text-text-secondary">
            Join hundreds of businesses capturing more qualified leads with visual customization
          </p>
        </div>
        
        {/* Testimonials Grid - Masonry style */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="break-inside-avoid bg-bg-secondary rounded-xl p-6 border border-border-default hover:border-accent transition-all duration-300 hover:shadow-lg"
            >
              {/* Quote */}
              <p className="text-text-secondary leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-primary font-bold">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-text-primary font-semibold text-sm">
                    {testimonial.author}
                  </div>
                  <div className="text-text-tertiary text-xs">
                    {testimonial.handle}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
