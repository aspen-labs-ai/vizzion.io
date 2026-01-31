'use client';

import { useEffect, useState } from 'react';

export default function AsteroidBackground() {
  const [impacts, setImpacts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Generate 3-4 asteroids with different trajectories
  const asteroids = [
    {
      id: 1,
      size: 40,
      duration: 8,
      delay: 0,
      startX: -50, // Start off-screen left
      startY: 20,
      travelX: 170, // Travel 170vw to the right
      travelY: 50,  // Travel 50vh down
    },
    {
      id: 2,
      size: 30,
      duration: 10,
      delay: 4,
      startX: -50,
      startY: 60,
      travelX: 170,
      travelY: -30, // Travel up
    },
    {
      id: 3,
      size: 50,
      duration: 12,
      delay: 7,
      startX: 120, // Start off-screen right
      startY: 80,
      travelX: -170, // Travel left
      travelY: -60,
    },
  ];

  useEffect(() => {
    // Create impact effects at intervals
    const impactInterval = setInterval(() => {
      const newImpact = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
      };
      setImpacts((prev) => [...prev, newImpact]);

      // Remove impact after animation completes
      setTimeout(() => {
        setImpacts((prev) => prev.filter((impact) => impact.id !== newImpact.id));
      }, 1000);
    }, 4000); // New impact every 4 seconds

    return () => clearInterval(impactInterval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Asteroids */}
      {asteroids.map((asteroid) => (
        <div
          key={asteroid.id}
          className="absolute animate-asteroid"
          style={{
            width: `${asteroid.size}px`,
            height: `${asteroid.size}px`,
            left: `${asteroid.startX}%`,
            top: `${asteroid.startY}%`,
            animationDuration: `${asteroid.duration}s`,
            animationDelay: `${asteroid.delay}s`,
            '--travel-x': `${asteroid.travelX}vw`,
            '--travel-y': `${asteroid.travelY}vh`,
          } as React.CSSProperties}
        >
          {/* Asteroid shape - irregular rock */}
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
            <path
              d="M50,10 L70,20 L90,40 L85,65 L70,85 L45,90 L20,80 L10,60 L15,35 L35,15 Z"
              fill="#6B7280"
              stroke="#4B5563"
              strokeWidth="2"
              opacity="0.7"
            />
            <circle cx="30" cy="35" r="8" fill="#4B5563" opacity="0.6" />
            <circle cx="65" cy="50" r="6" fill="#4B5563" opacity="0.5" />
            <circle cx="45" cy="70" r="5" fill="#374151" opacity="0.4" />
          </svg>
          
          {/* Trailing particles */}
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute w-2 h-2 rounded-full bg-accent opacity-50" style={{ left: '-10px', top: '50%' }} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-accent opacity-40" style={{ left: '-20px', top: '45%' }} />
            <div className="absolute w-1 h-1 rounded-full bg-accent opacity-30" style={{ left: '-30px', top: '55%' }} />
          </div>
        </div>
      ))}

      {/* Impact effects */}
      {impacts.map((impact) => (
        <div
          key={impact.id}
          className="absolute animate-impact"
          style={{
            left: `${impact.x}%`,
            top: `${impact.y}%`,
          }}
        >
          {/* Expanding ring */}
          <div className="absolute w-16 h-16 rounded-full border-4 border-accent opacity-0 animate-ring-expand" style={{ transform: 'translate(-50%, -50%)' }} />
          
          {/* Particles burst */}
          <div className="absolute" style={{ transform: 'translate(-50%, -50%)' }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-accent animate-burst"
                style={{
                  animationDelay: `${i * 50}ms`,
                  '--angle': `${i * 45}deg`,
                } as React.CSSProperties}
              />
            ))}
          </div>
          
          {/* Flash */}
          <div className="absolute w-8 h-8 rounded-full bg-accent opacity-80 animate-flash" style={{ transform: 'translate(-50%, -50%)' }} />
        </div>
      ))}
    </div>
  );
}
