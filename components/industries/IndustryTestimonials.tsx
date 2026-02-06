import { IndustryData } from '@/data/industries/types';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function IndustryTestimonials({ data }: { data: IndustryData }) {
  return (
    <section className="py-24 px-6 bg-bg-primary">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Real Results From {data.name} Companies
          </h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {data.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="break-inside-avoid bg-bg-secondary rounded-xl p-6 border border-border-default hover:border-accent transition-all duration-250"
            >
              {testimonial.result && (
                <div className="text-accent font-semibold text-lg mb-3">
                  {testimonial.result}
                </div>
              )}

              <blockquote className="text-text-secondary mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {getInitials(testimonial.author)}
                </div>
                <div>
                  <div className="text-text-primary font-medium text-sm">
                    {testimonial.author}
                  </div>
                  <div className="text-text-tertiary text-sm">
                    {testimonial.company}
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
