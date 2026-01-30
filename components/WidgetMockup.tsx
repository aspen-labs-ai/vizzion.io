'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WidgetMockup() {
  const [currentStep, setCurrentStep] = useState(1);

  // Auto-cycle through steps every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev === 3 ? 1 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-bg-secondary rounded-xl shadow-xl overflow-hidden border border-border-default max-w-sm mx-auto">
      {/* Widget Window Header */}
      <div className="bg-bg-tertiary px-3 py-2 flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-[#FF5F57]"></div>
        <div className="w-2 h-2 rounded-full bg-[#FEBC2E]"></div>
        <div className="w-2 h-2 rounded-full bg-[#28C840]"></div>
      </div>
      
      {/* Widget Content */}
      <div className="p-4 bg-bg-secondary">
        <h4 className="text-sm font-semibold mb-3 text-text-primary">Summit Roofing</h4>
        
        {/* House Preview Image */}
        <div className="mb-3 rounded-lg overflow-hidden bg-bg-tertiary">
          <Image 
            src="/images/demo-house.png" 
            alt="House preview" 
            width={300}
            height={200}
            className="w-full h-auto"
          />
        </div>
        
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-center mb-3 gap-1">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'bg-accent' : 'bg-border-default'}`}></div>
          <div className={`h-0.5 w-4 transition-all duration-300 ${currentStep >= 2 ? 'bg-accent' : 'bg-border-default'}`}></div>
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-accent' : 'bg-border-default'}`}></div>
          <div className={`h-0.5 w-4 transition-all duration-300 ${currentStep >= 3 ? 'bg-accent' : 'bg-border-default'}`}></div>
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStep >= 3 ? 'bg-accent' : 'bg-border-default'}`}></div>
        </div>
        
        {/* Step Content - Fixed height to prevent jumping */}
        <div className="space-y-2 h-[220px] overflow-hidden">
          {/* Step 1: Upload Photo */}
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <div className="text-xs text-text-tertiary mb-1">Step 1 of 3</div>
              <h5 className="text-sm font-semibold mb-3 text-text-primary">Upload Your Photo</h5>
              
              <div className="border-2 border-dashed border-border-default rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer bg-bg-tertiary">
                <svg className="w-8 h-8 mx-auto mb-2 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-text-secondary">Click to upload or drag & drop</p>
                <p className="text-xs text-text-tertiary mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          )}
          
          {/* Step 2: Select Material */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <div className="text-xs text-text-tertiary mb-1">Step 2 of 3</div>
              <h5 className="text-sm font-semibold mb-3 text-text-primary">Choose Your Material</h5>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="relative aspect-square rounded overflow-hidden border border-border-default hover:border-accent transition-colors cursor-pointer">
                  <Image 
                    src="/images/swatch-metal.png" 
                    alt="Metal" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-bg-tertiary/90 py-1 text-center">
                    <span className="text-xs text-text-primary">Metal</span>
                  </div>
                </div>
                <div className="relative aspect-square rounded overflow-hidden border-2 border-accent shadow-accent-glow">
                  <Image 
                    src="/images/swatch-shingles.png" 
                    alt="Shingles" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-bg-tertiary/90 py-1 text-center">
                    <span className="text-xs text-text-primary font-semibold">Shingles</span>
                  </div>
                </div>
                <div className="relative aspect-square rounded overflow-hidden border border-border-default hover:border-accent transition-colors cursor-pointer">
                  <Image 
                    src="/images/swatch-tile.png" 
                    alt="Tile" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-bg-tertiary/90 py-1 text-center">
                    <span className="text-xs text-text-primary">Tile</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Enter Email */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <div className="text-xs text-text-tertiary mb-1">Step 3 of 3</div>
              <h5 className="text-sm font-semibold mb-3 text-text-primary">Get Your Visualization</h5>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 bg-bg-tertiary border border-border-default rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                  />
                </div>
                
                <button className="w-full px-4 py-2 bg-accent hover:bg-accent-hover text-primary text-sm font-semibold rounded-md transition-all duration-250 hover:shadow-accent-glow">
                  Send Visualization →
                </button>
                
                <p className="text-xs text-text-tertiary text-center">
                  We'll email your visualization instantly
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
