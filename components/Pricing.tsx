export default function Pricing() {
  return (
    <section className="py-24 px-6 bg-bg-tertiary" id="pricing">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-text-secondary mb-6">
            Choose the plan that fits your business. No hidden fees. Cancel anytime.
          </p>
          
          {/* ROI Framing */}
          <div className="inline-block mt-8 px-6 py-4 bg-accent/10 border border-accent rounded-xl">
            <div className="text-lg font-bold text-text-primary mb-1">
              Pay for itself in 3 leads
            </div>
            <div className="text-sm text-text-secondary">
              At 60% higher close rates, most businesses recover their investment in the first week
            </div>
          </div>
        </div>
        
        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          
          {/* Starter */}
          <div className="bg-bg-secondary rounded-2xl p-8 border border-border-default hover:border-accent transition-all duration-250 hover:shadow-xl">
            <div className="text-lg font-semibold text-text-secondary mb-4">Starter</div>
            <div className="flex items-baseline mb-8">
              <span className="text-2xl font-bold text-text-primary">$</span>
              <span className="text-5xl font-bold text-text-primary">49</span>
              <span className="text-xl text-text-tertiary">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Up to 500 visualizations/month</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>1 website embed</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Basic product library</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Email support</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Analytics dashboard</span>
              </li>
            </ul>
            <a 
              href="#" 
              className="block w-full text-center px-6 py-3 font-semibold rounded-lg bg-bg-tertiary text-text-primary border border-border-default hover:border-accent transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md"
            >
              Start Free Trial
            </a>
          </div>
          
          {/* Professional (Featured) */}
          <div className="bg-bg-secondary rounded-2xl p-8 border-2 border-accent shadow-xl relative transform md:-translate-y-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-text-primary text-sm font-bold">
              Most Popular
            </div>
            <div className="text-lg font-semibold text-text-secondary mb-4">Professional</div>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl font-bold text-text-primary">$</span>
              <span className="text-5xl font-bold text-text-primary">149</span>
              <span className="text-xl text-text-tertiary">/mo</span>
            </div>
            <div className="mb-8 p-3 bg-accent/10 rounded-lg">
              <div className="text-sm font-bold text-text-primary">Average ROI: 247%</div>
              <div className="text-xs text-text-secondary mt-1">
                40+ qualified leads/month = $3.72 per lead
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">Unlimited visualizations</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited website embeds</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Full product library</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Custom branding</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Lead capture forms</span>
              </li>
            </ul>
            <a 
              href="#" 
              className="block w-full text-center px-6 py-3 font-semibold rounded-lg bg-accent text-text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md"
            >
              Start Free Trial
            </a>
          </div>
          
          {/* Enterprise */}
          <div className="bg-bg-secondary rounded-2xl p-8 border border-border-default hover:border-accent transition-all duration-250 hover:shadow-xl">
            <div className="text-lg font-semibold text-text-secondary mb-4">Enterprise</div>
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-bold text-text-primary">Custom</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Everything in Professional</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>White-label solution</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Multi-location support</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Custom integrations</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>SLA guarantee</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Training & onboarding</span>
              </li>
            </ul>
            <a 
              href="#" 
              className="block w-full text-center px-6 py-3 font-semibold rounded-lg bg-bg-tertiary text-text-primary border border-border-default hover:border-accent transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md"
            >
              Contact Sales
            </a>
          </div>
        </div>
        
        {/* Footer Note */}
        <div className="text-center text-text-secondary">
          <p className="text-base">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
