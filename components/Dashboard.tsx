export default function Dashboard() {
  return (
    <section className="py-24 px-6" id="dashboard">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">
            Powerful dashboard to track what matters
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)]">
            Monitor conversions, analyze trends, and manage your product catalog—all from one beautiful interface.
          </p>
        </div>
        
        {/* Dashboard Mockup */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[var(--color-border)] max-w-6xl mx-auto">
            {/* Mac-style Header */}
            <div className="bg-[var(--color-gray-100)] px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
              <span className="ml-4 text-sm text-[var(--color-text-muted)]">Vizzion Dashboard</span>
            </div>
            
            {/* Dashboard Layout */}
            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 bg-[var(--color-gray-50)] border-r border-[var(--color-border)] p-6">
                <nav className="space-y-2">
                  <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)] font-medium">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>Dashboard</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-gray-100)] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="20" x2="12" y2="10"></line>
                      <line x1="18" y1="20" x2="18" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="16"></line>
                    </svg>
                    <span>Analytics</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-gray-100)] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 7h-9M14 17H5M17 12h-3M7 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM7 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                    </svg>
                    <span>Materials</span>
                  </a>
                </nav>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-8 bg-white">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="p-6 bg-white border border-[var(--color-border)] rounded-xl">
                    <div className="text-sm text-[var(--color-text-muted)] mb-2">Total Visualizations</div>
                    <div className="text-3xl font-bold text-[var(--color-primary)] mb-2">2,847</div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>12.5% vs last month</span>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-[var(--color-accent-light)] border border-[var(--color-accent)] rounded-xl">
                    <div className="text-sm text-[var(--color-text-muted)] mb-2">Conversion Rate</div>
                    <div className="text-3xl font-bold text-[var(--color-primary)] mb-2">24.3%</div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>8.2% vs last month</span>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white border border-[var(--color-border)] rounded-xl">
                    <div className="text-sm text-[var(--color-text-muted)] mb-2">Active Leads</div>
                    <div className="text-3xl font-bold text-[var(--color-primary)] mb-2">142</div>
                    <div className="text-sm text-[var(--color-text-muted)]">2 new today</div>
                  </div>
                </div>
                
                {/* Chart */}
                <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Visualizations Over Time</h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm rounded bg-[var(--color-gray-100)]">7D</button>
                      <button className="px-3 py-1 text-sm rounded bg-[var(--color-accent)] text-[var(--color-primary)]">30D</button>
                      <button className="px-3 py-1 text-sm rounded bg-[var(--color-gray-100)]">90D</button>
                    </div>
                  </div>
                  <div className="h-32 flex items-end gap-2">
                    {[60, 75, 55, 80, 70, 90, 85, 95, 88, 92, 87, 98].map((height, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-t" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                </div>
                
                {/* Popular Materials */}
                <div className="bg-white border border-[var(--color-border)] rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">Most Popular Materials</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-32 text-sm text-[var(--color-text-secondary)]">Asphalt Shingles</div>
                      <div className="flex-1 h-8 bg-[var(--color-gray-100)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-accent)] rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <div className="flex-shrink-0 w-16 text-sm font-semibold text-right">1,247</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-32 text-sm text-[var(--color-text-secondary)]">Metal Roofing</div>
                      <div className="flex-1 h-8 bg-[var(--color-gray-100)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-accent)] rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      <div className="flex-shrink-0 w-16 text-sm font-semibold text-right">992</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-32 text-sm text-[var(--color-text-secondary)]">Clay Tiles</div>
                      <div className="flex-1 h-8 bg-[var(--color-gray-100)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-accent)] rounded-full" style={{ width: '42%' }}></div>
                      </div>
                      <div className="flex-shrink-0 w-16 text-sm font-semibold text-right">608</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h4 className="text-xl font-bold mb-2 text-[var(--color-primary)]">Real-Time Analytics</h4>
            <p className="text-[var(--color-text-secondary)]">Track engagement, conversions, and user behavior as it happens.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M3 9h18M9 21V9"></path>
              </svg>
            </div>
            <h4 className="text-xl font-bold mb-2 text-[var(--color-primary)]">Material Management</h4>
            <p className="text-[var(--color-text-secondary)]">Add, edit, and organize your product catalog with ease.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h4 className="text-xl font-bold mb-2 text-[var(--color-primary)]">Custom Branding</h4>
            <p className="text-[var(--color-text-secondary)]">White-label the experience with your logo, colors, and style.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
