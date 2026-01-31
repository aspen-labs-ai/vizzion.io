'use client';

export default function ParticleBackground() {
  // Generate particles with random positions and animation delays
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2, // 2-6px
    duration: Math.random() * 20 + 15, // 15-35s
    delay: Math.random() * -20, // Start at different points in animation
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-accent animate-float"
          style={{
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
