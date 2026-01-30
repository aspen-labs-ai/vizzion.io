'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Platforms() {
  const orbitRef1 = useRef<HTMLDivElement>(null);
  const orbitRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame: number;
    let angle1 = 0;
    let angle2 = 60;

    const animate = () => {
      // Update angles
      angle1 += 0.3;
      angle2 -= 0.2;

      // Apply rotation to orbit paths
      if (orbitRef1.current) {
        orbitRef1.current.style.transform = `rotate(${angle1}deg)`;
      }
      if (orbitRef2.current) {
        orbitRef2.current.style.transform = `rotate(${angle2}deg)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <section className="py-24 px-6 bg-[var(--color-gray-50)]" id="integration">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">
            Works seamlessly with every platform
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)]">
            Embed in minutes. No developers needed.
          </p>
        </div>
        
        {/* Orbiting Circles Container */}
        <div className="relative w-full max-w-2xl mx-auto h-[500px] mb-16">
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-32 h-32 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border-2 border-[var(--color-accent)]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M3 9h18M9 21V9"></path>
              </svg>
              <div className="text-sm font-bold text-[var(--color-primary)] mt-2">Vizzion</div>
            </div>
          </div>
          
          {/* Orbit Path 1 - Inner */}
          <div 
            ref={orbitRef1}
            className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -ml-[150px] -mt-[150px] rounded-full"
            style={{ transformOrigin: 'center' }}
          >
            {/* Logo at 0 degrees */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateX(-50%) translateY(-50%) rotate(-0deg)' }}>
              <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors" style={{ transform: 'rotate(0deg)' }}>
                <Image src="/images/logos/shopify.svg" alt="Shopify" width={40} height={40} />
              </div>
            </div>
            
            {/* Logo at 120 degrees */}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateX(-50%) translateY(-50%) rotate(-120deg)', transformOrigin: '150px center' }}>
              <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors" style={{ transform: 'rotate(120deg)' }}>
                <Image src="/images/logos/wordpress.svg" alt="WordPress" width={40} height={40} />
              </div>
            </div>
            
            {/* Logo at 240 degrees */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" style={{ transform: 'translateX(-50%) translateY(50%) rotate(-240deg)', transformOrigin: '0 -150px' }}>
              <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors" style={{ transform: 'rotate(240deg)' }}>
                <Image src="/images/logos/wix.svg" alt="Wix" width={40} height={40} />
              </div>
            </div>
          </div>
          
          {/* Orbit Path 2 - Outer */}
          <div 
            ref={orbitRef2}
            className="absolute top-1/2 left-1/2 w-[450px] h-[450px] -ml-[225px] -mt-[225px] rounded-full"
            style={{ transformOrigin: 'center' }}
          >
            {/* Logo at 60 degrees */}
            <div className="absolute top-[12.5%] right-[12.5%]" style={{ transform: 'rotate(-60deg)', transformOrigin: '-125px 100px' }}>
              <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors" style={{ transform: 'rotate(60deg)' }}>
                <Image src="/images/logos/squarespace.svg" alt="Squarespace" width={40} height={40} />
              </div>
            </div>
            
            {/* Logo at 180 degrees */}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateX(-50%) translateY(-50%) rotate(-180deg)', transformOrigin: '225px center' }}>
              <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors" style={{ transform: 'rotate(180deg)' }}>
                <Image src="/images/logos/custom-code.svg" alt="Custom" width={40} height={40} />
              </div>
            </div>
            
            {/* Logo at 300 degrees */}
            <div className="absolute bottom-[12.5%] right-[12.5%]" style={{ transform: 'rotate(-300deg)', transformOrigin: '-125px -100px' }}>
              <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors" style={{ transform: 'rotate(300deg)' }}>
                <div className="text-sm font-bold text-[var(--color-primary)]">Custom</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Code Example with Typing Animation */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-[var(--color-gray-900)] rounded-2xl overflow-hidden shadow-2xl">
            {/* Code Window Header */}
            <div className="bg-[var(--color-gray-800)] px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
            </div>
            
            {/* Code Content */}
            <div className="p-8 font-mono text-sm">
              <pre className="text-[var(--color-gray-300)]">
                <code>
                  <span className="text-[#FF6B6B]">&lt;script</span> <span className="text-[var(--color-accent)]">src</span>=<span className="text-[#FFD93D]">&quot;https://cdn.vizzion.app/widget.js&quot;</span><span className="text-[#FF6B6B]">&gt;&lt;/script&gt;</span>{'\n'}
                  <span className="text-[#FF6B6B]">&lt;div</span> <span className="text-[var(--color-accent)]">id</span>=<span className="text-[#FFD93D]">&quot;vizzion-widget&quot;</span> <span className="text-[var(--color-accent)]">data-products</span>=<span className="text-[#FFD93D]">&quot;roofing&quot;</span><span className="text-[#FF6B6B]">&gt;&lt;/div&gt;</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
