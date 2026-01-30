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
      quote: "The email capture before visualization is genius. Every customer who uses the widget becomes a lead. No more lost opportunities.",
      author: "Sarah Chen",
      handle: "@sarahchen",
      company: "Elite Exteriors",
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
      quote: "Our customers love seeing products on their actual homes before making a decision. It builds trust instantly.",
      author: "Emily Rodriguez",
      handle: "@emilyrodriguez",
      company: "Premium Roofing Solutions",
      image: "/images/testimonials/avatar-4.jpg"
    },
    {
      quote: "We've tried contact forms, free visualizers, even AR apps. Nothing converts like Vizzion. It's not even close.",
      author: "David Park",
      handle: "@davidpark",
      company: "Modern Exteriors",
      image: "/images/testimonials/avatar-5.jpg"
    },
    {
      quote: "The dashboard shows exactly which products customers are interested in. Our sales team follows up with perfect context.",
      author: "Lisa Anderson",
      handle: "@lisaanderson",
      company: "Anderson Roofing Group",
      image: "/images/testimonials/avatar-6.jpg"
    }
  ];

  return (
    <section className="py-24 px-6 bg-bg-primary">
      <div className="max-w-[1400px] mx-auto">
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
