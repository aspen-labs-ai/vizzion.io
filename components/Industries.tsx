import { Home, TrendingUp, DollarSign, Anchor, Building2, Boxes, Palette, Trees } from 'lucide-react';

export default function Industries() {
  return (
    <section className="py-24 px-6" id="industries">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">
            Built for businesses that sell visual products
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)]">
            If your customers need to see it to believe it, Vizzion is for you.
          </p>
        </div>
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Large Card - Roofing */}
          <div className="md:col-span-2 lg:row-span-2 bg-white rounded-2xl p-8 border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-xl)] transition-all duration-[var(--transition-base)] relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] text-sm font-semibold">
              Most Popular
            </div>
            
            <Home className="w-12 h-12 mb-4 text-[var(--color-accent)]" />
            <h3 className="text-3xl font-bold mb-4 text-[var(--color-primary)]">Roofing</h3>
            <p className="text-lg text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              Let homeowners visualize different roofing materials, colors, and styles on their actual home.
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Asphalt shingles</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Metal roofing</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-[var(--color-accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[var(--color-text-secondary)]">Specialty materials</span>
              </li>
            </ul>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3 bg-[var(--color-gray-50)] rounded-lg p-4">
                <TrendingUp className="w-8 h-8 text-[var(--color-accent)]" />
                <div>
                  <div className="text-2xl font-bold text-[var(--color-primary)]">3.2x</div>
                  <div className="text-sm text-[var(--color-text-muted)]">More qualified leads</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[var(--color-gray-50)] rounded-lg p-4">
                <DollarSign className="w-8 h-8 text-[var(--color-accent)]" />
                <div>
                  <div className="text-2xl font-bold text-[var(--color-primary)]">45%</div>
                  <div className="text-sm text-[var(--color-text-muted)]">Higher close rate</div>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--color-gray-50)] rounded-lg p-4">
              <div className="flex gap-2 mb-2">
                <div className="w-10 h-10 rounded-md" style={{ backgroundColor: '#8B7355' }}></div>
                <div className="w-10 h-10 rounded-md" style={{ backgroundColor: '#2C3E50' }}></div>
                <div className="w-10 h-10 rounded-md" style={{ backgroundColor: '#7F8C8D' }}></div>
                <div className="w-10 h-10 rounded-md" style={{ backgroundColor: '#34495E' }}></div>
                <div className="w-10 h-10 rounded-md" style={{ backgroundColor: '#C0392B' }}></div>
                <div className="w-10 h-10 rounded-md" style={{ backgroundColor: '#27AE60' }}></div>
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">Popular roofing colors</div>
            </div>
          </div>
          
          {/* Medium Card - Marine */}
          <div className="bg-white rounded-2xl p-8 border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-base)] hover:-translate-y-1">
            <Anchor className="w-12 h-12 mb-4 text-[var(--color-accent)]" />
            <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">Marine & Boat Decking</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Visualize different decking materials and patterns before installation.
            </p>
          </div>
          
          {/* Medium Card - Siding */}
          <div className="bg-white rounded-2xl p-8 border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-base)] hover:-translate-y-1">
            <Building2 className="w-12 h-12 mb-4 text-[var(--color-accent)]" />
            <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">Siding & Exteriors</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              See how different siding materials and colors transform a home&apos;s exterior.
            </p>
          </div>
          
          {/* Small Card - Flooring */}
          <div className="bg-white rounded-2xl p-8 border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-base)] hover:-translate-y-1">
            <Boxes className="w-12 h-12 mb-4 text-[var(--color-accent)]" />
            <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">Flooring</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Visualize hardwood, tile, and carpet in actual spaces.
            </p>
          </div>
          
          {/* Small Card - Paint */}
          <div className="bg-white rounded-2xl p-8 border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-base)] hover:-translate-y-1">
            <Palette className="w-12 h-12 mb-4 text-[var(--color-accent)]" />
            <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">Paint & Finishes</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Color confidence before the first brushstroke.
            </p>
          </div>
          
          {/* Small Card - Landscaping */}
          <div className="bg-white rounded-2xl p-8 border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-base)] hover:-translate-y-1">
            <Trees className="w-12 h-12 mb-4 text-[var(--color-accent)]" />
            <h3 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">Landscaping</h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Transform outdoor spaces with visualization.
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
