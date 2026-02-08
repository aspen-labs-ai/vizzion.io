'use client';

import { useState } from 'react';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
        }, 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" id="signup-modal">
      <div className="bg-bg-secondary rounded-xl p-8 max-w-md w-full border border-border-default shadow-xl relative">
        <button
          onClick={() => {
            const modal = document.getElementById('signup-modal');
            if (modal) modal.style.display = 'none';
          }}
          className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="animate-success-fade-in space-y-4 text-center py-4">
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
          <>
            <h3 className="text-2xl font-bold mb-2 text-text-primary">Start Capturing Leads Today</h3>
            <p className="text-text-secondary mb-6">
              Join hundreds of businesses using Vizzion to turn website visitors into qualified leads.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                  Work Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full px-6 py-3 bg-accent hover:bg-accent-hover text-primary text-base font-semibold rounded-lg transition-all duration-250 hover:shadow-accent-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
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

              <p className="text-xs text-text-tertiary text-center">
                No credit card required • Cancel anytime • 14-day free trial
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
