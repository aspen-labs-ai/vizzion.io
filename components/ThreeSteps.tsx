export default function ThreeSteps() {
  return (
    <section
      className="py-24 px-4 sm:px-6 relative overflow-hidden border-t border-accent/10"
      style={{ background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.06) 0%, var(--color-bg-primary) 40%, var(--color-bg-primary) 100%)' }}
      id="how-it-works"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 70%)' }}
      />
      <div className="max-w-[1400px] mx-auto overflow-hidden relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="vz-eyebrow mb-4">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Embed, Capture, Close
          </h2>
          <p className="text-xl text-text-secondary">
            Three steps take you from a single line of embed code to a pre-qualified lead that&apos;s ready to buy.
          </p>
        </div>
        
        {/* Three Column Layout */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-12">
          
          {/* Step 1: Embed the Widget */}
          <div className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border-default hover:border-accent hover:shadow-lg transition-all duration-250 hover:-translate-y-1">
            <div className="w-16 h-16 mb-6 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-text-primary">Embed the Widget</h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Copy-paste our embed code into your website. Works with Shopify, WordPress, Wix, or any platform. No developer needed.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">5-minute setup</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Works on any website platform</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Customizable to your brand</span>
              </li>
            </ul>
          </div>
          
          {/* Step 2: Capture Every Lead Automatically */}
          <div className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border-default hover:border-accent hover:shadow-lg transition-all duration-250 hover:-translate-y-1">
            <div className="w-16 h-16 mb-6 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-text-primary">Capture Every Lead Automatically</h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Before customers see their visualization, they enter their email. Every interaction becomes a qualified lead. Emails sync automatically to your CRM or inbox.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Email required before visualization</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Automatic lead capture</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">CRM integration (Salesforce, HubSpot)</span>
              </li>
            </ul>
          </div>
          
          {/* Step 3: Close Deals Faster */}
          <div className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border-default hover:border-accent hover:shadow-lg transition-all duration-250 hover:-translate-y-1">
            <div className="w-16 h-16 mb-6 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-text-primary">Close Deals Faster</h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Your leads have already visualized what they want. They're pre-qualified and ready to buy. No cold calls—they came to you excited. Follow up while they're engaged.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Leads arrive pre-qualified and excited</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">They've already seen the product on their property</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Skip the convincing—they're ready to buy</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Strike while the iron is hot</span>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </section>
  );
}
