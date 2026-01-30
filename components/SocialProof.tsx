'use client';

import { useEffect, useState } from 'react';

export default function SocialProof() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: '3x', label: 'More Qualified Leads' },
    { value: '60%', label: 'Higher Close Rate' },
    { value: '247%', label: 'Average ROI' }
  ];

  return (
    <section className="py-12 px-6 bg-bg-secondary border-y border-border-default">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`text-center transition-all duration-700 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="text-5xl md:text-6xl font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-medium text-text-secondary uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
