'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Platforms() {
  const orbit1Ref = useRef<HTMLDivElement>(null);
  const orbit2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let angle1 = 0;
    let angle2 = 60;
    let animationFrame: number;

    const animate = () => {
      angle1 += 0.2; // deg per frame
      angle2 -= 0.15;

      if (orbit1Ref.current) {
        const items = orbit1Ref.current.children;
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as HTMLElement;
          const baseAngle = (360 / items.length) * i;
          const currentAngle = baseAngle + angle1;
          const rad = (currentAngle - 90) * (Math.PI / 180);
          const radius = 150;
          
          const x = radius + radius * Math.cos(rad);
          const y = radius + radius * Math.sin(rad);
          
          item.style.left = `${x}px`;
          item.style.top = `${y}px`;
        }
      }

      if (orbit2Ref.current) {
        const items = orbit2Ref.current.children;
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as HTMLElement;
          const baseAngle = (360 / items.length) * i;
          const currentAngle = baseAngle + angle2;
          const rad = (currentAngle - 90) * (Math.PI / 180);
          const radius = 225;
          
          const x = radius + radius * Math.cos(rad);
          const y = radius + radius * Math.sin(rad);
          
          item.style.left = `${x}px`;
          item.style.top = `${y}px`;
        }
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
    <section className="py-24 px-6 bg-gray-50" id="integration">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Works seamlessly with every platform
          </h2>
          <p className="text-xl text-gray-700">
            Embed in minutes. No developers needed.
          </p>
        </div>
        
        {/* Orbiting Circles Container */}
        <div className="relative w-full max-w-2xl mx-auto h-[500px] mb-16">
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-32 h-32 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border-2 border-accent">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M3 9h18M9 21V9"></path>
              </svg>
              <div className="text-sm font-bold text-primary mt-2">Vizzion</div>
            </div>
          </div>
          
          {/* Inner Orbit Path */}
          <div 
            ref={orbit1Ref}
            className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -ml-[150px] -mt-[150px]"
          >
            <div className="absolute w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200 hover:border-accent transition-colors -translate-x-1/2 -translate-y-1/2">
              <Image src="/images/logos/shopify.svg" alt="Shopify" width={40} height={40} />
            </div>
            <div className="absolute w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200 hover:border-accent transition-colors -translate-x-1/2 -translate-y-1/2">
              <Image src="/images/logos/wordpress.svg" alt="WordPress" width={40} height={40} />
            </div>
            <div className="absolute w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200 hover:border-accent transition-colors -translate-x-1/2 -translate-y-1/2">
              <Image src="/images/logos/wix.svg" alt="Wix" width={40} height={40} />
            </div>
          </div>
          
          {/* Outer Orbit Path */}
          <div 
            ref={orbit2Ref}
            className="absolute top-1/2 left-1/2 w-[450px] h-[450px] -ml-[225px] -mt-[225px]"
          >
            <div className="absolute w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200 hover:border-accent transition-colors -translate-x-1/2 -translate-y-1/2">
              <Image src="/images/logos/squarespace.svg" alt="Squarespace" width={40} height={40} />
            </div>
            <div className="absolute w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200 hover:border-accent transition-colors -translate-x-1/2 -translate-y-1/2">
              <Image src="/images/logos/custom-code.svg" alt="Custom" width={40} height={40} />
            </div>
            <div className="absolute w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-gray-200 hover:border-accent transition-colors -translate-x-1/2 -translate-y-1/2">
              <div className="text-sm font-bold text-primary">Custom</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
