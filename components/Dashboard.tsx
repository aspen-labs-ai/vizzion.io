'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'materials'>('dashboard');

  return (
    <section className="py-24 px-6 bg-bg-secondary" id="dashboard">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Powerful dashboard to track what matters
          </h2>
          <p className="text-xl text-text-secondary">
            Monitor conversions, analyze trends, and manage your product catalog—all from one beautiful interface.
          </p>
        </div>
        
        {/* Dashboard Mockup */}
        <div className="mb-16">
          <div className="bg-bg-secondary rounded-2xl shadow-2xl overflow-hidden border border-border-default max-w-6xl mx-auto">
            {/* Mac-style Header */}
            <div className="bg-bg-tertiary px-4 py-3 flex items-center gap-2 border-b border-border-subtle">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
              <span className="ml-4 text-sm text-text-tertiary">Vizzion Dashboard</span>
            </div>
            
            {/* Dashboard Layout */}
            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 bg-bg-tertiary border-r border-border-default p-6">
                <nav className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === 'dashboard' 
                        ? 'bg-accent/10 text-accent' 
                        : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>Dashboard</span>
                  </button>
                  <div 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium opacity-50 cursor-not-allowed text-text-secondary"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="20" x2="12" y2="10"></line>
                      <line x1="18" y1="20" x2="18" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="16"></line>
                    </svg>
                    <span>Analytics</span>
                  </div>
                  <div 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium opacity-50 cursor-not-allowed text-text-secondary"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 7h-9M14 17H5M17 12h-3M7 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM7 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                    </svg>
                    <span>Materials</span>
                  </div>
                </nav>
              </div>
              
              {/* Main Content - Dashboard View */}
              {activeTab === 'dashboard' && (
                <div className="flex-1 p-8 bg-bg-primary">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-bg-secondary border border-border-default rounded-xl hover:border-accent transition-colors">
                      <div className="text-sm text-text-tertiary mb-2">Total Visualizations</div>
                      <div className="text-3xl font-bold text-text-primary mb-2">2,847</div>
                      <div className="flex items-center gap-2 text-sm text-accent">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>12.5% vs last month</span>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-accent/10 border border-accent rounded-xl shadow-lg shadow-accent/20">
                      <div className="text-sm text-text-tertiary mb-2">Conversion Rate</div>
                      <div className="text-3xl font-bold text-text-primary mb-2">24.3%</div>
                      <div className="flex items-center gap-2 text-sm text-accent">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>8.2% vs last month</span>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-bg-secondary border border-border-default rounded-xl hover:border-accent transition-colors">
                      <div className="text-sm text-text-tertiary mb-2">Active Leads</div>
                      <div className="text-3xl font-bold text-text-primary mb-2">142</div>
                      <div className="text-sm text-text-tertiary">2 new today</div>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <div className="bg-bg-secondary border border-border-default rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-text-primary">Visualizations Over Time</h3>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm rounded bg-bg-tertiary text-text-secondary hover:bg-accent hover:text-primary transition-colors">7D</button>
                        <button className="px-3 py-1 text-sm rounded bg-accent text-primary">30D</button>
                        <button className="px-3 py-1 text-sm rounded bg-bg-tertiary text-text-secondary hover:bg-accent hover:text-primary transition-colors">90D</button>
                      </div>
                    </div>
                    <div className="h-32 flex items-end gap-2">
                      {[60, 75, 55, 80, 70, 90, 85, 95, 88, 92, 87, 98].map((height, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-gradient-to-t from-accent to-accent/60 rounded-t shadow-lg hover:shadow-accent/50 transition-shadow" 
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Materials Trend Line Chart */}
                  <div className="bg-bg-secondary border border-border-default rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-text-primary">Materials Trend</h3>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <span className="text-text-secondary">Asphalt Shingles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                          <span className="text-text-secondary">Metal Roofing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
                          <span className="text-text-secondary">Clay Tiles</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-48 relative">
                      <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="37.5" x2="400" y2="37.5" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle" />
                        <line x1="0" y1="75" x2="400" y2="75" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle" />
                        <line x1="0" y1="112.5" x2="400" y2="112.5" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle" />
                        
                        {/* Asphalt Shingles line - emerald-500 */}
                        <path
                          d="M 0 90 L 30 85 L 60 80 L 90 75 L 120 72 L 150 68 L 180 65 L 210 60 L 240 58 L 270 55 L 300 50 L 330 48 L 360 45 L 390 40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          className="drop-shadow-lg"
                        />
                        
                        {/* Metal Roofing line - emerald-400 */}
                        <path
                          d="M 0 110 L 30 108 L 60 105 L 90 100 L 120 98 L 150 95 L 180 92 L 210 88 L 240 85 L 270 82 L 300 78 L 330 75 L 360 72 L 390 68"
                          fill="none"
                          stroke="#34d399"
                          strokeWidth="3"
                          className="drop-shadow-lg"
                        />
                        
                        {/* Clay Tiles line - emerald-300 */}
                        <path
                          d="M 0 125 L 30 123 L 60 120 L 90 118 L 120 115 L 150 113 L 180 110 L 210 108 L 240 105 L 270 103 L 300 100 L 330 98 L 360 95 L 390 92"
                          fill="none"
                          stroke="#6ee7b7"
                          strokeWidth="3"
                          className="drop-shadow-lg"
                        />
                        
                        {/* Data points for Asphalt Shingles */}
                        {[
                          [0, 90], [30, 85], [60, 80], [90, 75], [120, 72], [150, 68],
                          [180, 65], [210, 60], [240, 58], [270, 55], [300, 50], [330, 48], [360, 45], [390, 40]
                        ].map(([x, y], i) => (
                          <circle key={`asphalt-${i}`} cx={x} cy={y} r="3" fill="#10b981" />
                        ))}
                        
                        {/* Data points for Metal Roofing */}
                        {[
                          [0, 110], [30, 108], [60, 105], [90, 100], [120, 98], [150, 95],
                          [180, 92], [210, 88], [240, 85], [270, 82], [300, 78], [330, 75], [360, 72], [390, 68]
                        ].map(([x, y], i) => (
                          <circle key={`metal-${i}`} cx={x} cy={y} r="3" fill="#34d399" />
                        ))}
                        
                        {/* Data points for Clay Tiles */}
                        {[
                          [0, 125], [30, 123], [60, 120], [90, 118], [120, 115], [150, 113],
                          [180, 110], [210, 108], [240, 105], [270, 103], [300, 100], [330, 98], [360, 95], [390, 92]
                        ].map(([x, y], i) => (
                          <circle key={`clay-${i}`} cx={x} cy={y} r="3" fill="#6ee7b7" />
                        ))}
                      </svg>
                    </div>
                    <div className="flex justify-between text-xs text-text-tertiary mt-4">
                      <span>Day 1</span>
                      <span>Day 15</span>
                      <span>Day 30</span>
                    </div>
                  </div>
                  
                  {/* Popular Materials with Enhanced Progress Bars */}
                  <div className="bg-bg-secondary border border-border-default rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-6 text-text-primary">Most Popular Materials</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-32 text-sm text-text-secondary">Asphalt Shingles</div>
                        <div className="flex-1 h-8 bg-bg-tertiary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full shadow-lg shadow-accent/30" 
                            style={{ width: '85%' }}
                          ></div>
                        </div>
                        <div className="flex-shrink-0 w-16 text-sm font-semibold text-right text-text-primary">1,247</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-32 text-sm text-text-secondary">Metal Roofing</div>
                        <div className="flex-1 h-8 bg-bg-tertiary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full shadow-lg shadow-accent/30" 
                            style={{ width: '68%' }}
                          ></div>
                        </div>
                        <div className="flex-shrink-0 w-16 text-sm font-semibold text-right text-text-primary">992</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-32 text-sm text-text-secondary">Clay Tiles</div>
                        <div className="flex-1 h-8 bg-bg-tertiary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full shadow-lg shadow-accent/30" 
                            style={{ width: '42%' }}
                          ></div>
                        </div>
                        <div className="flex-shrink-0 w-16 text-sm font-semibold text-right text-text-primary">608</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics View */}
              {activeTab === 'analytics' && (
                <div className="flex-1 p-8 bg-bg-primary">
                  <h2 className="text-2xl font-bold mb-6 text-text-primary">Analytics Overview</h2>
                  
                  {/* Line Chart - Conversion Trends */}
                  <div className="bg-bg-secondary border border-border-default rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-6 text-text-primary">Conversion Trend (Last 30 Days)</h3>
                    <div className="h-48 relative">
                      <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="37.5" x2="400" y2="37.5" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle" />
                        <line x1="0" y1="75" x2="400" y2="75" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle" />
                        <line x1="0" y1="112.5" x2="400" y2="112.5" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle" />
                        
                        {/* Line chart */}
                        <path
                          d="M 0 120 L 30 100 L 60 95 L 90 105 L 120 85 L 150 80 L 180 70 L 210 75 L 240 60 L 270 55 L 300 50 L 330 45 L 360 40 L 390 35"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-accent drop-shadow-lg"
                        />
                        {/* Area under curve */}
                        <path
                          d="M 0 120 L 30 100 L 60 95 L 90 105 L 120 85 L 150 80 L 180 70 L 210 75 L 240 60 L 270 55 L 300 50 L 330 45 L 360 40 L 390 35 L 390 150 L 0 150 Z"
                          fill="currentColor"
                          className="text-accent opacity-10"
                        />
                        {/* Data points */}
                        {[
                          [0, 120], [30, 100], [60, 95], [90, 105], [120, 85], [150, 80],
                          [180, 70], [210, 75], [240, 60], [270, 55], [300, 50], [330, 45], [360, 40], [390, 35]
                        ].map(([x, y], i) => (
                          <circle key={i} cx={x} cy={y} r="4" fill="currentColor" className="text-accent" />
                        ))}
                      </svg>
                    </div>
                    <div className="flex justify-between text-xs text-text-tertiary mt-4">
                      <span>Day 1</span>
                      <span>Day 15</span>
                      <span>Day 30</span>
                    </div>
                  </div>

                  {/* Performance Metrics Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-bg-secondary border border-border-default rounded-xl p-6">
                      <h4 className="text-sm font-semibold text-text-tertiary mb-4">Average Session Duration</h4>
                      <div className="text-3xl font-bold text-text-primary mb-2">2m 34s</div>
                      <div className="flex items-center gap-2 text-sm text-accent">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>18% increase</span>
                      </div>
                    </div>
                    
                    <div className="bg-bg-secondary border border-border-default rounded-xl p-6">
                      <h4 className="text-sm font-semibold text-text-tertiary mb-4">Leads per 100 Views</h4>
                      <div className="text-3xl font-bold text-text-primary mb-2">24</div>
                      <div className="flex items-center gap-2 text-sm text-accent">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>12% increase</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Performing Products */}
                  <div className="bg-bg-secondary border border-border-default rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-6 text-text-primary">Top Converting Products</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Premium Asphalt (Dark Gray)</span>
                        <span className="text-accent font-semibold">32% CR</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Standing Seam Metal (Charcoal)</span>
                        <span className="text-accent font-semibold">28% CR</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary">Architectural Shingle (Brown)</span>
                        <span className="text-accent font-semibold">25% CR</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Materials View */}
              {activeTab === 'materials' && (
                <div className="flex-1 p-8 bg-bg-primary">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">Material Library</h2>
                    <button className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-hover transition-colors">
                      + Add Material
                    </button>
                  </div>
                  
                  {/* Material Cards Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-bg-secondary border border-border-default rounded-xl p-6 hover:border-accent transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">Asphalt Shingles</h3>
                          <p className="text-sm text-text-tertiary">12 variants</p>
                        </div>
                        <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">Active</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Total Views:</span>
                          <span className="font-semibold text-text-primary">1,247</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Conversions:</span>
                          <span className="font-semibold text-accent">386</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Conv. Rate:</span>
                          <span className="font-semibold text-accent">31%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-bg-secondary border border-border-default rounded-xl p-6 hover:border-accent transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">Metal Roofing</h3>
                          <p className="text-sm text-text-tertiary">8 variants</p>
                        </div>
                        <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">Active</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Total Views:</span>
                          <span className="font-semibold text-text-primary">992</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Conversions:</span>
                          <span className="font-semibold text-accent">278</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Conv. Rate:</span>
                          <span className="font-semibold text-accent">28%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Material Performance Chart */}
                  <div className="bg-bg-secondary border border-border-default rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-6 text-text-primary">Material Performance Comparison</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-text-secondary">Asphalt Shingles</span>
                          <span className="text-text-primary font-semibold">85%</span>
                        </div>
                        <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-accent via-accent to-accent/70 rounded-full shadow-md shadow-accent/40"
                            style={{ width: '85%' }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-text-secondary">Metal Roofing</span>
                          <span className="text-text-primary font-semibold">68%</span>
                        </div>
                        <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-accent via-accent to-accent/70 rounded-full shadow-md shadow-accent/40"
                            style={{ width: '68%' }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-text-secondary">Clay Tiles</span>
                          <span className="text-text-primary font-semibold">42%</span>
                        </div>
                        <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-accent via-accent to-accent/70 rounded-full shadow-md shadow-accent/40"
                            style={{ width: '42%' }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-text-secondary">Composite</span>
                          <span className="text-text-primary font-semibold">35%</span>
                        </div>
                        <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-accent via-accent to-accent/70 rounded-full shadow-md shadow-accent/40"
                            style={{ width: '35%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Dashboard Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">Real-Time Analytics</h3>
            <p className="text-text-secondary">
              Monitor visualizations, conversions, and lead quality as they happen.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M3 9h18M9 21V9"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">Product Management</h3>
            <p className="text-text-secondary">
              Organize materials, track performance, and optimize your catalog.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">Export & Integrate</h3>
            <p className="text-text-secondary">
              Connect to your CRM, export reports, and automate your workflow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
