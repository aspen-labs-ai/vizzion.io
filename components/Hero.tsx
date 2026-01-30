'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [currentStep] = useState(2);

  // Auto-cycle through steps (placeholder for future enhancement)
  useEffect(() => {
    // Could add auto-cycling here if needed
  }, []);

  return (
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm">
              Join 200+ businesses capturing 3x more leads
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-primary">
              Turn Every Website Visitor Into a Qualified Lead
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed">
              Vizzion captures emails <span className="font-semibold text-primary">before</span> showing visualizations. Your customers see your products on their own images—you get their contact info. It's that simple.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#pricing" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-accent text-primary hover:bg-accent-hover transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md"
              >
                Start Your Free Trial
              </a>
              <a 
                href="#how-it-works" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-primary text-white hover:bg-primary-light transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md"
              >
                See How It Works
              </a>
            </div>
          </div>
          
          {/* Right Visual - Widget Mockup */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Widget Window Header */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
              </div>
              
              {/* Widget Content */}
              <div className="p-8 bg-white">
                <h3 className="text-2xl font-semibold mb-6">Summit Roofing</h3>
                
                {/* House Preview Image */}
                <div className="mb-6 rounded-lg overflow-hidden">
                  <Image 
                    src="/images/demo-house.png" 
                    alt="House preview" 
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                
                {/* Step Progress Indicator */}
                <div className="flex items-center justify-center mb-6 gap-2">
                  <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-accent' : 'bg-gray-300'} transition-colors`}></div>
                  <div className={`h-0.5 w-8 ${currentStep >= 2 ? 'bg-accent' : 'bg-gray-300'} transition-colors`}></div>
                  <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-accent' : 'bg-gray-300'} transition-colors`}></div>
                  <div className={`h-0.5 w-8 ${currentStep >= 3 ? 'bg-accent' : 'bg-gray-300'} transition-colors`}></div>
                  <div className={`w-3 h-3 rounded-full ${currentStep >= 3 ? 'bg-accent' : 'bg-gray-300'} transition-colors`}></div>
                </div>
                
                {/* Step Content */}
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">Step 2 of 3</div>
                  <h4 className="text-xl font-semibold">Choose Your Material</h4>
                  
                  {/* Material Swatches */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Metal Swatch */}
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-accent cursor-pointer transition-all">
                      <Image 
                        src="/images/swatch-metal.png" 
                        alt="Metal" 
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm py-2 text-center">
                        Metal
                      </div>
                    </div>
                    
                    {/* Shingles Swatch (Selected) */}
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-accent cursor-pointer transition-all">
                      <Image 
                        src="/images/swatch-shingles.png" 
                        alt="Shingles" 
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm py-2 text-center">
                        Shingles
                      </div>
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                        ✓
                      </div>
                    </div>
                    
                    {/* Tile Swatch */}
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-accent cursor-pointer transition-all">
                      <Image 
                        src="/images/swatch-tile.png" 
                        alt="Tile" 
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm py-2 text-center">
                        Tile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
