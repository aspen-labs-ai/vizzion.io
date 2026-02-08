'use client';

import { useState } from 'react';

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
  'Tattoos',
  'Car Wraps',
  'Boat Decking',
  'Other',
];

export default function SignupSection({ defaultIndustry }: { defaultIndustry?: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState(defaultIndustry ?? '');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('https://formsubmit.co/ajax/trey@aspenlabs.ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          industry,
          details,
          _subject: 'New Vizzion Lead',
          _template: 'table',
          _captcha: 'false'
        })
      });

      if (response.ok) {
        setStatus('success');
        // Auto-reset after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setName('');
          setEmail('');
          setIndustry(defaultIndustry ?? '');
          setDetails('');
        }, 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
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
          {status === 'success' ? (
            <div className="animate-success-fade-in space-y-4">
              <svg
                className="w-20 h-20 mx-auto animate-checkmark-draw"
                viewBox="0 0 52 52"
              >
                <circle
                  className="checkmark-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                />
                <path
                  className="checkmark-check"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  d="M14 27l7 7 16-16"
                />
              </svg>
              <h3 className="text-2xl font-bold text-text-primary">
                Thanks! We&apos;ll be in touch soon.
              </h3>
              <p className="text-text-secondary">
                Check your email for next steps.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                  disabled={status === 'submitting'}
                  className="w-full px-6 py-4 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  disabled={status === 'submitting'}
                  className="w-full px-6 py-4 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                  disabled={status === 'submitting'}
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
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell us about your business..."
                  disabled={status === 'submitting'}
                  rows={3}
                  className="w-full px-6 py-4 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                />
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm mb-2">
                    Something went wrong. Please try again.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="text-red-400 underline text-sm hover:text-red-300 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full px-8 py-4 bg-accent hover:bg-accent-hover text-primary text-lg font-semibold rounded-lg transition-all duration-250 hover:shadow-accent-glow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
              >
                {status === 'submitting' ? (
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
          )}
        </div>
      </div>
    </section>
  );
}
