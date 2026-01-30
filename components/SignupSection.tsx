'use client';

import { useState } from 'react';

export default function SignupSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with your backend/email service
    console.log('Signup email:', email);
    setSubmitted(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 5000);
  };

  return (
    <section className="py-24 px-6 bg-bg-secondary border-y border-border-default" id="signup">
      <div className="max-w-2xl mx-auto text-center">
        {!submitted ? (
          <>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              Ready to capture more leads?
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Join hundreds of businesses using Vizzion to turn website visitors into qualified leads.
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full px-6 py-4 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-lg"
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-8 py-4 bg-accent hover:bg-accent-hover text-primary text-lg font-semibold rounded-lg transition-all duration-250 hover:shadow-accent-glow hover:-translate-y-0.5"
              >
                Get Started Free →
              </button>
              
              <p className="text-sm text-text-tertiary">
                No credit card required • Cancel anytime • 14-day free trial
              </p>
            </form>
          </>
        ) : (
          <div className="py-12">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-text-primary mb-4">Thanks! We'll be in touch soon.</h3>
            <p className="text-text-secondary text-lg">Check your email for next steps to get started with Vizzion.</p>
          </div>
        )}
      </div>
    </section>
  );
}
