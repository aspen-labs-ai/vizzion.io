'use client';

import Image from 'next/image';
import { OrbitingCircles } from './ui/orbiting-circles';

export default function Platforms() {
  return (
    <section className="py-24 px-6 bg-bg-secondary" id="integration">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">
            Integrations
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Works seamlessly with every platform
          </h2>
          <p className="text-xl text-text-secondary">
            Embed in minutes. No developers needed.
          </p>
        </div>
        
        {/* Orbiting Circles Container */}
        <div className="relative h-[500px] md:h-[600px] w-full max-w-3xl mx-auto flex items-center justify-center">
          {/* Center Circle */}
          <div className="relative z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-bg-tertiary shadow-xl flex flex-col items-center justify-center gap-2 border-2 border-accent p-4">
              <Image 
                src="/vizzion-logo.png" 
                alt="Vizzion" 
                width={80} 
                height={30}
                className="w-16 md:w-20 h-auto"
              />
              <div className="text-xs md:text-sm font-bold text-text-primary tracking-tight">VIZZION.IO</div>
            </div>
          </div>
          
          {/* Inner Orbit - 3 items */}
          <OrbitingCircles
            className="border-none bg-bg-tertiary hover:bg-bg-tertiary/80 shadow-lg"
            duration={20}
            radius={120}
            iconSize={64}
          >
            <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center border border-border-default hover:border-accent transition-colors shadow-lg">
              <Image src="/images/logos/shopify.svg" alt="Shopify" width={32} height={32} />
            </div>
            <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center border border-border-default hover:border-accent transition-colors shadow-lg">
              <Image src="/images/logos/wordpress.svg" alt="WordPress" width={32} height={32} />
            </div>
            <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center border border-border-default hover:border-accent transition-colors shadow-lg">
              <Image src="/images/logos/wix.svg" alt="Wix" width={32} height={32} />
            </div>
          </OrbitingCircles>
          
          {/* Outer Orbit - 3 items (reverse direction) */}
          <OrbitingCircles
            className="border-none bg-bg-tertiary hover:bg-bg-tertiary/80 shadow-lg"
            duration={25}
            radius={200}
            reverse
            iconSize={64}
          >
            <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center border border-border-default hover:border-accent transition-colors shadow-lg">
              <Image src="/images/logos/squarespace.svg" alt="Squarespace" width={32} height={32} />
            </div>
            <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center border border-border-default hover:border-accent transition-colors shadow-lg">
              <Image src="/images/logos/custom-code.svg" alt="Custom" width={32} height={32} />
            </div>
            <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center border border-border-default hover:border-accent transition-colors shadow-lg">
              <div className="text-sm font-bold text-text-primary">Custom</div>
            </div>
          </OrbitingCircles>
        </div>
        
        {/* Platform List - Mobile Friendly */}
        <div className="mt-12 md:hidden">
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-4 bg-bg-tertiary rounded-lg border border-border-default text-center">
              <Image src="/images/logos/shopify.svg" alt="Shopify" width={32} height={32} className="mx-auto mb-2" />
              <div className="text-xs text-text-secondary">Shopify</div>
            </div>
            <div className="p-4 bg-bg-tertiary rounded-lg border border-border-default text-center">
              <Image src="/images/logos/wordpress.svg" alt="WordPress" width={32} height={32} className="mx-auto mb-2" />
              <div className="text-xs text-text-secondary">WordPress</div>
            </div>
            <div className="p-4 bg-bg-tertiary rounded-lg border border-border-default text-center">
              <Image src="/images/logos/wix.svg" alt="Wix" width={32} height={32} className="mx-auto mb-2" />
              <div className="text-xs text-text-secondary">Wix</div>
            </div>
            <div className="p-4 bg-bg-tertiary rounded-lg border border-border-default text-center">
              <Image src="/images/logos/squarespace.svg" alt="Squarespace" width={32} height={32} className="mx-auto mb-2" />
              <div className="text-xs text-text-secondary">Squarespace</div>
            </div>
            <div className="p-4 bg-bg-tertiary rounded-lg border border-border-default text-center">
              <Image src="/images/logos/custom-code.svg" alt="Custom" width={32} height={32} className="mx-auto mb-2" />
              <div className="text-xs text-text-secondary">Custom</div>
            </div>
            <div className="p-4 bg-bg-tertiary rounded-lg border border-border-default text-center flex items-center justify-center">
              <div className="text-sm font-bold text-text-primary">Any site</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
