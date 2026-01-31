'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const initializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mobile = window.innerWidth < 768 || 'ontouchstart' in window;

    // Particle configuration - more subtle on mobile
    const config = mobile ? {
      // Mobile: subtle, non-interactive floating particles
      particleCount: 40,
      particleColor: '#10B981',
      lineColor: '#10B981',
      particleOpacity: 0.3,
      lineOpacity: 0.2,
      particleMinRadius: 1.5,
      particleMaxRadius: 3,
      lineDistance: 100,
      moveSpeed: 2,
      hoverDistance: 0,
    } : {
      // Desktop: full interactive experience
      particleCount: 80,
      particleColor: '#10B981',
      lineColor: '#10B981',
      particleOpacity: 0.5,
      lineOpacity: 0.4,
      particleMinRadius: 2,
      particleMaxRadius: 5,
      lineDistance: 150,
      moveSpeed: 6,
      hoverDistance: 200,
    };

    // Create a single particle
    const createParticle = (): Particle => {
      const radius = Math.random() * (config.particleMaxRadius - config.particleMinRadius) + config.particleMinRadius;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (config.moveSpeed / 10),
        vy: (Math.random() - 0.5) * (config.moveSpeed / 10),
        radius: radius,
      };
    };

    // Initialize particles (only once)
    const initParticles = () => {
      if (initializedRef.current && mobile) return; // Don't reinit on mobile
      particlesRef.current = [];
      for (let i = 0; i < config.particleCount; i++) {
        particlesRef.current.push(createParticle());
      }
      initializedRef.current = true;
    };

    // Set canvas size - on mobile, don't reinit particles
    const resize = () => {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      if (mobile && initializedRef.current && oldWidth > 0 && oldHeight > 0) {
        // On mobile, scale existing particle positions instead of reinitializing
        const scaleX = canvas.width / oldWidth;
        const scaleY = canvas.height / oldHeight;
        particlesRef.current.forEach(p => {
          p.x *= scaleX;
          p.y *= scaleY;
        });
      } else {
        initParticles();
      }
    };

    // Mouse move handler - only for desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (mobile) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((particle, i) => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Mouse repulsion - desktop only
        if (!mobile && config.hoverDistance > 0) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

          if (distanceToMouse < config.hoverDistance && mouse.x !== -1000) {
            const angle = Math.atan2(dy, dx);
            const force = (config.hoverDistance - distanceToMouse) / config.hoverDistance;
            particle.vx -= Math.cos(angle) * force * 0.5;
            particle.vy -= Math.sin(angle) * force * 0.5;
          }
        }

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Maintain minimum velocity
        const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        const minSpeed = config.moveSpeed / 20;
        if (currentSpeed < minSpeed) {
          const angle = Math.random() * Math.PI * 2;
          particle.vx = Math.cos(angle) * minSpeed;
          particle.vy = Math.sin(angle) * minSpeed;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = config.particleColor;
        ctx.globalAlpha = config.particleOpacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw connection lines
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.lineDistance) {
            const opacity = (1 - distance / config.lineDistance) * config.lineOpacity;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = config.lineColor;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resize();
    
    // Desktop: listen to resize and mouse events
    // Mobile: only listen to orientation changes (not scroll-triggered resizes)
    if (!mobile) {
      window.addEventListener('resize', resize);
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      // On mobile, only handle actual orientation changes
      window.addEventListener('orientationchange', resize);
    }
    
    animate();

    // Cleanup
    return () => {
      if (!mobile) {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', handleMouseMove);
      } else {
        window.removeEventListener('orientationchange', resize);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ 
        width: '100%', 
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
