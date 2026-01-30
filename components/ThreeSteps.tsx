'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ThreeSteps() {
  const [currentStep] = useState(2);

  return (
    <section className="py-24 px-4 sm:px-6" id="how-it-works">
      <div className="max-w-[1400px] mx-auto overflow-hidden">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Three Steps to Capturing More Leads
          </h2>
          <p className="text-xl text-gray-700">
            Get up and running in 5 minutes. No developers needed. No complicated setup. Just results.
          </p>
        </div>
        
        {/* Three Column Layout */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-12">
          
          {/* Step 1: Embed the Widget - WITH WIDGET MOCKUP */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 hover:border-accent hover:shadow-lg transition-all duration-250 hover:-translate-y-1">
            <div className="w-16 h-16 mb-6 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-primary">Embed the Widget</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Copy-paste our embed code into your website. Works with Shopify, WordPress, Wix, or any platform. No developer needed.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">5-minute setup</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Works on any website platform</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Customizable to your brand</span>
              </li>
            </ul>
            
            {/* Widget Mockup */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
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
            </div>
          </div>
          
          {/* Step 2: Capture Every Lead Automatically */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 hover:border-accent hover:shadow-lg transition-all duration-250 hover:-translate-y-1">
            <div className="w-16 h-16 mb-6 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-primary">Capture Every Lead Automatically</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Before customers see their visualization, they enter their email. Every interaction becomes a qualified lead. Emails sync automatically to your CRM or inbox.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Email required before visualization</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Automatic lead capture</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">CRM integration (Salesforce, HubSpot)</span>
              </li>
            </ul>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-semibold text-primary">New Lead Captured</span>
                  </div>
                  <div className="text-xs text-gray-600 font-mono truncate">
                    john.smith@email.com
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 3: Convert Hot Leads Into Sales */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 hover:border-accent hover:shadow-lg transition-all duration-250 hover:-translate-y-1">
            <div className="w-16 h-16 mb-6 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-primary">Convert Hot Leads Into Sales</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Your leads have already visualized your product on their property. They're qualified, engaged, and ready to buy. Follow up while they're excited.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">3x more qualified leads</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">60% higher close rate</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Customers come in pre-sold</span>
              </li>
            </ul>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-accent mb-1">+247%</div>
                  <div className="text-sm font-medium text-gray-700">ROI</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
