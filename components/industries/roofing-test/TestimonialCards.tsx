import { Building2 } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  company: string;
  result: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'We replaced paid marketplaces with the roofing visualizer on our service pages and our close rate jumped within a quarter.',
    name: 'Mike Tressler',
    company: 'Buckeye Roofing & Exteriors',
    result: '34% close rate on visualizer leads',
  },
  {
    quote:
      'Our reps now start with material choices already made. We spend less time chasing and more time finalizing signed jobs.',
    name: 'Rachel Dominguez',
    company: 'Peak Performance Roofing',
    result: 'Lead costs dropped from $65 to under $15',
  },
  {
    quote:
      'The roof design tool removed the color indecision that used to stall every proposal. Sales cycles are noticeably faster.',
    name: 'Kevin Shaughnessy',
    company: 'Northeast Roofing Pros',
    result: 'Quote-to-close cut from 28 to 11 days',
  },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((segment) => segment[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function TestimonialCards() {
  return (
    <section className="bg-bg-primary px-6 py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold leading-tight text-text-primary md:text-4xl">
            Roofing Teams Using Vizzion See Better-Fit Leads Faster
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="group rounded-2xl border border-border-default bg-bg-secondary p-7 transition-all duration-250 hover:-translate-y-1 hover:border-accent/70"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-light text-sm font-semibold text-accent">
                    {initials(testimonial.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{testimonial.name}</p>
                    <p className="text-xs text-text-tertiary">{testimonial.company}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 rounded-full border border-border-default px-2.5 py-1 text-xs text-text-tertiary">
                  <Building2 className="h-3.5 w-3.5" />
                  Verified
                </div>
              </div>

              <p className="mb-6 text-base leading-relaxed text-text-secondary">&ldquo;{testimonial.quote}&rdquo;</p>
              <p className="text-sm font-semibold text-accent">{testimonial.result}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
