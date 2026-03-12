'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const INDUSTRIES = [
  'Roofing',
  'Siding',
  'Solar',
  'Windows & Doors',
  'Decking',
  'Flooring',
  'Countertops',
  'Garage Doors',
  'Fencing',
  'Gutters',
  'Shutters',
  'Driveways',
  'Swimming Pools',
  'Artificial Turf',
  'Car Wraps',
  'Boat Decking',
  'Other',
];

export default function SignupSection({ 
  defaultIndustry
}: { 
  defaultIndustry?: string;
}) {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('submitted') === 'true') {
      setShowSuccess(true);
      // Clear URL parameter after 5 seconds
      const timer = setTimeout(() => {
        window.history.replaceState({}, '', '/#signup');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSubmit = () => {
    setIsSubmitting(true);
  };

  return (
    <section className="py-24 px-6 bg-bg-secondary border-y border-border-default" id="signup">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
          Ready to capture more leads?
        </h2>
        <p className="text-xl text-text-secondary mb-8">
          Join hundreds of businesses using Vizzion to turn website visitors into qualified leads.
        </p>

        <div className="max-w-md mx-auto">
          {showSuccess && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg">
              <p className="text-accent font-semibold text-center">
                ✓ Thank you for your submission! We'll be in touch soon.
              </p>
            </div>
          )}

          <form 
            action="https://formsubmit.co/trey@vizzion.io"
            method="POST"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Hidden fields for FormSubmit configuration */}
            <input type="hidden" name="_subject" value="New Vizzion Lead" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value="https://vizzion.io/#signup?submitted=true" />

            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="you@company.com"
                required
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <select
                name="industry"
                defaultValue={defaultIndustry || ''}
                required
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-bg-tertiary border border-border-default rounded-lg text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                style={{ colorScheme: 'dark' }}
              >
                <option value="" disabled>Select your industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <textarea
                name="details"
                placeholder="Tell us about your business..."
                disabled={isSubmitting}
                rows={3}
                className="w-full px-6 py-4 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-accent hover:bg-accent-hover text-primary text-lg font-semibold rounded-lg transition-all duration-250 hover:shadow-accent-glow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Get Started Free →'
              )}
            </button>

            <p className="text-sm text-text-tertiary">
              No credit card required • Cancel anytime • 14-day free trial
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
