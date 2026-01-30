'use client';

import { useState } from 'react';
import Image from 'next/image';
import EmbedCodePreview from './EmbedCodePreview';

export default function ThreeSteps() {
  const [currentStep] = useState(2);

  return (
    <section className="py-24 px-4 sm:px-6 bg-bg-primary" id="how-it-works">
      <div className="max-w-[1400px] mx-auto overflow-hidden">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full bg-accent-light text-accent font-medium text-sm mb-4">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Three Steps to Capturing More Leads
          </h2>
          <p className="text-xl text-text-secondary">
            Get up and running in 5 minutes. No developers needed. No complicated setup. Just results.
          </p>
        </div>
        
        {/* Three Column Layout */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-12">
          
          {/* Step 1: Embed the Widget */}
          <div className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border-default hover:border-accent hover:shadow-lg transition-all duration-250 hover:-translate-y-1">
            <div className="w-16 h-16 mb-6 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-text-primary">Embed the Widget</h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Copy-paste our embed code into your website. Works with Shopify, WordPress, Wix, or any platform. No developer needed.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">5-minute setup</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Works on any website platform</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Customizable to your brand</span>
              </li>
            </ul>
            
            {/* Embed Code Preview */}
            <EmbedCodePreview />
          </div>
          
          {/* Step 2: Capture Every Lead Automatically */}
          <div className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border-default hover:border-accent hover:shadow-lg transition-all duration-250 hover:-translate-y-1">
            <div className="w-16 h-16 mb-6 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-text-primary">Capture Every Lead Automatically</h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Before customers see their visualization, they enter their email. Every interaction becomes a qualified lead. Emails sync automatically to your CRM or inbox.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Email required before visualization</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Automatic lead capture</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">CRM integration (Salesforce, HubSpot)</span>
              </li>
            </ul>
            
            <div className="mt-8 pt-8 border-t border-border-subtle">
              <div className="bg-bg-tertiary rounded-lg p-6">
                <div className="bg-bg-primary border border-border-default rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    <span className="text-sm font-semibold text-primary">New Lead Captured</span>
                  </div>
                  <div className="text-xs text-text-tertiary font-mono truncate">
                    john.smith@email.com
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 3: Convert Hot Leads Into Sales */}
          <div className="bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border-default hover:border-accent hover:shadow-lg transition-all duration-250 hover:-translate-y-1">
            <div className="w-16 h-16 mb-6 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-text-primary">Convert Hot Leads Into Sales</h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Your leads have already visualized your product on their property. They're qualified, engaged, and ready to buy. Follow up while they're excited.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">3x more qualified leads</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">60% higher close rate</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Customers come in pre-sold</span>
              </li>
            </ul>
            
            <div className="mt-8 pt-8 border-t border-border-subtle">
              <div className="bg-bg-tertiary rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-accent mb-1">+247%</div>
                  <div className="text-sm font-medium text-text-secondary">ROI</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
