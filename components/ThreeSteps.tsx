export default function ThreeSteps() {
  return (
    <section className="py-24 px-4 sm:px-6" id="how-it-works">
      <div className="max-w-[1400px] mx-auto overflow-hidden">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">
            Three steps to higher conversions
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)]">
            No developers needed. No complicated setup. Just results.
          </p>
        </div>
        
        {/* Three Column Layout */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-12">
          
          {/* Step 1: Upload & Visualize */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-base)] hover:-translate-y-1">
            <div className="w-16 h-16 mb-6 rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">Upload & Visualize</h3>
            <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              Customers upload a photo of their home, boat, or space. AI instantly shows your products on their image—no mockup needed.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Any image works</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Instant AI rendering</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Photorealistic results</span>
              </li>
            </ul>
            
            <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
              <div className="bg-[var(--color-gray-50)] rounded-lg p-6 flex items-center justify-center aspect-square">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Step 2: Capture Leads */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-base)] hover:-translate-y-1">
            <div className="w-16 h-16 mb-6 rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">Capture Leads</h3>
            <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              Before they see the final result, collect their email. Every visualization becomes a qualified lead in your pipeline.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Built-in lead capture</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Email integration</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">CRM-ready exports</span>
              </li>
            </ul>
            
            <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
              <div className="bg-[var(--color-gray-50)] rounded-lg p-6 flex items-center justify-center aspect-square">
                <div className="w-full max-w-[200px] bg-white border border-[var(--color-border)] rounded-lg p-3 flex items-center gap-2 overflow-hidden">
                  <div className="text-[var(--color-accent)] font-bold text-lg flex-shrink-0">@</div>
                  <div className="text-sm text-[var(--color-text-muted)] truncate">your.email@example.com</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 3: Close More Deals */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-base)] hover:-translate-y-1">
            <div className="w-16 h-16 mb-6 rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">Close More Deals</h3>
            <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              They see it, they love it, they buy it. Vizzion users report 3x more leads and 60% higher close rates.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">3x more leads</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">60% higher close rate</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Confident buyers</span>
              </li>
            </ul>
            
            <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
              <div className="bg-[var(--color-gray-50)] rounded-lg p-6 flex items-center justify-center aspect-square">
                <div className="bg-[var(--color-accent)] text-[var(--color-primary)] rounded-full px-6 py-3 font-bold">
                  <div className="text-3xl">+247%</div>
                  <div className="text-sm mt-1">ROI</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
