'use client';

import { useState } from 'react';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with your backend/email service
    console.log('Signup email:', email);
    setSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" id="signup-modal">
      <div className="bg-bg-secondary rounded-xl p-8 max-w-md w-full border border-border-default shadow-xl">
        <h3 className="text-2xl font-bold mb-2 text-text-primary">Start Capturing Leads Today</h3>
        <p className="text-text-secondary mb-6">
          Join hundreds of businesses using Vizzion to turn website visitors into qualified leads.
        </p>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-4 py-3 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-6 py-3 bg-accent hover:bg-accent-hover text-primary text-base font-semibold rounded-lg transition-all duration-250 hover:shadow-accent-glow"
            >
              Get Started Free →
            </button>
            
            <p className="text-xs text-text-tertiary text-center">
              No credit card required • Cancel anytime • 14-day free trial
            </p>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-text-primary font-semibold mb-2">Thanks! We'll be in touch soon.</p>
            <p className="text-text-secondary text-sm">Check your email for next steps.</p>
          </div>
        )}
        
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
      </div>
    </div>
  );
}
