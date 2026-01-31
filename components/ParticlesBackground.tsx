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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    // Particle configuration (matching particles.js demo with emerald branding)
    const config = {
      particleCount: 80,
      particleColor: '#10B981', // Emerald green
      lineColor: '#10B981',
      particleOpacity: 0.5,
      lineOpacity: 0.4,
      particleMinRadius: 2,
      particleMaxRadius: 5,
      lineDistance: 150,
      moveSpeed: 6, // Match demo speed
      hoverDistance: 200,
      clickPushCount: 4,
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < config.particleCount; i++) {
        particlesRef.current.push(createParticle());
      }
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

    // Mouse move handler (track on window so it works even when hovering content)
    const handleMouseMove = (e: MouseEvent) => {
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

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls or wrap around
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Mouse repulsion effect (hover mode: repulse)
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distanceToMouse < config.hoverDistance && mouse.x !== -1000) {
          const angle = Math.atan2(dy, dx);
          const force = (config.hoverDistance - distanceToMouse) / config.hoverDistance;
          particle.vx -= Math.cos(angle) * force * 0.5;
          particle.vy -= Math.sin(angle) * force * 0.5;
        }

        // Add slight damping to velocity
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Ensure minimum velocity (keep particles moving)
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

        // Draw lines to nearby particles
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

    // Mouse leave handler
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    // Initialize
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
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
        pointerEvents: 'none', // Allow clicks through to content
      }}
    />
  );
}
