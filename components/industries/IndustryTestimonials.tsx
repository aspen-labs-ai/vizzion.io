import { IndustryData } from '@/data/industries/types';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('');
}

export default function IndustryTestimonials({ data }: { data: IndustryData }) {
  return (
    <section className="py-16 px-6 bg-bg-primary">
      <div className="max-w-[1000px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-text-primary text-center">
          What {data.name} Companies Are Saying
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {data.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-bg-secondary rounded-xl p-6 border border-border-default"
            >
              <p className="text-text-secondary leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-primary font-bold text-xs">
                  {getInitials(testimonial.author)}
                </div>
                <div>
                  <div className="text-text-primary font-semibold text-sm">
                    {testimonial.author}
                  </div>
                  <div className="text-text-tertiary text-xs">
                    {testimonial.company}
                  </div>
                </div>
              </div>

              <div className="text-sm text-accent font-medium">
                {testimonial.result}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
