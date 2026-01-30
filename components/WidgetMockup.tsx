'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function WidgetMockup() {
  const [currentStep] = useState(2);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 max-w-sm mx-auto">
      {/* Widget Window Header */}
      <div className="bg-gray-100 px-3 py-2 flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-[#FF5F57]"></div>
        <div className="w-2 h-2 rounded-full bg-[#FEBC2E]"></div>
        <div className="w-2 h-2 rounded-full bg-[#28C840]"></div>
      </div>
      
      {/* Widget Content */}
      <div className="p-4 bg-white">
        <h4 className="text-sm font-semibold mb-3">Summit Roofing</h4>
        
        {/* House Preview Image */}
        <div className="mb-3 rounded-lg overflow-hidden">
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
          <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-accent' : 'bg-gray-300'}`}></div>
          <div className={`h-0.5 w-4 ${currentStep >= 2 ? 'bg-accent' : 'bg-gray-300'}`}></div>
          <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-accent' : 'bg-gray-300'}`}></div>
          <div className={`h-0.5 w-4 ${currentStep >= 3 ? 'bg-accent' : 'bg-gray-300'}`}></div>
          <div className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-accent' : 'bg-gray-300'}`}></div>
        </div>
        
        {/* Step Content */}
        <div className="space-y-2">
          <div className="text-xs text-gray-600">Step 2 of 3</div>
          <h5 className="text-sm font-semibold">Choose Your Material</h5>
          
          {/* Material Swatches */}
          <div className="grid grid-cols-3 gap-2">
            <div className="relative aspect-square rounded overflow-hidden border border-gray-200">
              <Image 
                src="/images/swatch-metal.png" 
                alt="Metal" 
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded overflow-hidden border-2 border-accent">
              <Image 
                src="/images/swatch-shingles.png" 
                alt="Shingles" 
                fill
                className="object-cover"
              />
              <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-accent flex items-center justify-center text-primary text-xs font-bold">
                ✓
              </div>
            </div>
            <div className="relative aspect-square rounded overflow-hidden border border-gray-200">
              <Image 
                src="/images/swatch-tile.png" 
                alt="Tile" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
