'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function WidgetMockup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState('metal'); // Start with metal selected

  return (
    <div className="bg-bg-secondary rounded-xl shadow-xl overflow-hidden border border-border-default max-w-md lg:max-w-lg mx-auto">
      {/* Widget Window Header */}
      <div className="bg-bg-tertiary px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
        <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
      </div>
      
      {/* Widget Content */}
      <div className="p-6 bg-bg-secondary">
        <h4 className="text-base font-semibold mb-4 text-text-primary">Summit Roofing</h4>
        
        {/* House Preview Image - switches based on selected material */}
        <div className="mb-4 rounded-lg overflow-hidden bg-bg-tertiary relative">
          <Image 
            src={`/images/demo-house-${selectedMaterial}-roof.png`}
            alt="House preview" 
            width={400}
            height={267}
            className="w-full h-auto transition-all duration-500"
            key={selectedMaterial}
            priority
          />
        </div>
        
        {/* Step Progress Indicator - Clickable Numbers */}
        <div className="flex items-center justify-center mb-4 gap-3">
          <button 
            onClick={() => setCurrentStep(1)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 cursor-pointer hover:scale-110 ${
              currentStep === 1 
                ? 'bg-accent text-primary shadow-accent-glow' 
                : 'bg-bg-tertiary text-text-tertiary border border-border-default hover:border-accent'
            }`}
          >
            1
          </button>
          <div className={`h-0.5 w-8 transition-all duration-300 ${currentStep >= 2 ? 'bg-accent' : 'bg-border-default'}`}></div>
          <button 
            onClick={() => setCurrentStep(2)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 cursor-pointer hover:scale-110 ${
              currentStep === 2 
                ? 'bg-accent text-primary shadow-accent-glow' 
                : 'bg-bg-tertiary text-text-tertiary border border-border-default hover:border-accent'
            }`}
          >
            2
          </button>
        </div>
        
        {/* Step Content - Fixed height to prevent jumping */}
        <div className="space-y-3 h-[260px] overflow-hidden">
          {/* Step 1: Select Material */}
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <div className="text-sm text-text-tertiary mb-2">Step 1 of 2</div>
              <h5 className="text-base font-semibold mb-4 text-text-primary">Choose Your Material</h5>
              
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedMaterial('metal')}
                  className={`relative aspect-square rounded overflow-hidden transition-all cursor-pointer ${
                    selectedMaterial === 'metal' 
                      ? 'border-2 border-accent shadow-accent-glow' 
                      : 'border border-border-default hover:border-accent'
                  }`}
                >
                  <Image 
                    src="/images/swatch-metal.png" 
                    alt="Metal" 
                    fill
                    className="object-cover"
                  />
                  {selectedMaterial === 'metal' && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-bg-tertiary/90 py-1.5 text-center">
                    <span className={`text-sm ${selectedMaterial === 'metal' ? 'text-text-primary font-semibold' : 'text-text-primary'}`}>Metal</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedMaterial('shingles')}
                  className={`relative aspect-square rounded overflow-hidden transition-all cursor-pointer ${
                    selectedMaterial === 'shingles' 
                      ? 'border-2 border-accent shadow-accent-glow' 
                      : 'border border-border-default hover:border-accent'
                  }`}
                >
                  <Image 
                    src="/images/swatch-shingles.png" 
                    alt="Shingles" 
                    fill
                    className="object-cover"
                  />
                  {selectedMaterial === 'shingles' && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-bg-tertiary/90 py-1.5 text-center">
                    <span className={`text-sm ${selectedMaterial === 'shingles' ? 'text-text-primary font-semibold' : 'text-text-primary'}`}>Shingles</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedMaterial('tile')}
                  className={`relative aspect-square rounded overflow-hidden transition-all cursor-pointer ${
                    selectedMaterial === 'tile' 
                      ? 'border-2 border-accent shadow-accent-glow' 
                      : 'border border-border-default hover:border-accent'
                  }`}
                >
                  <Image 
                    src="/images/swatch-spanish-tile-v2.png" 
                    alt="Tile" 
                    fill
                    className="object-cover"
                  />
                  {selectedMaterial === 'tile' && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-bg-tertiary/90 py-1.5 text-center">
                    <span className={`text-sm ${selectedMaterial === 'tile' ? 'text-text-primary font-semibold' : 'text-text-primary'}`}>Tile</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedMaterial('wood')}
                  className={`relative aspect-square rounded overflow-hidden transition-all cursor-pointer ${
                    selectedMaterial === 'wood' 
                      ? 'border-2 border-accent shadow-accent-glow' 
                      : 'border border-border-default hover:border-accent'
                  }`}
                >
                  <Image 
                    src="/images/swatch-wood.png" 
                    alt="Wood" 
                    fill
                    className="object-cover"
                  />
                  {selectedMaterial === 'wood' && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-bg-tertiary/90 py-1.5 text-center">
                    <span className={`text-sm ${selectedMaterial === 'wood' ? 'text-text-primary font-semibold' : 'text-text-primary'}`}>Wood</span>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Enter Email */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <div className="text-sm text-text-tertiary mb-2">Step 2 of 2</div>
              <h5 className="text-base font-semibold mb-4 text-text-primary">Get Your Visualization</h5>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-bg-tertiary border border-border-default rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                  />
                </div>
                
                <button className="w-full px-5 py-3 bg-accent hover:bg-accent-hover text-primary text-base font-semibold rounded-md transition-all duration-250 hover:shadow-accent-glow">
                  Send Visualization →
                </button>
                
                <p className="text-sm text-text-tertiary text-center">
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
