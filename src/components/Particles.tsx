import { useMemo } from 'react';

interface ParticlesProps {
  count?: number;
  className?: string;
}

export function Particles({ count = 20, className = '' }: ParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 4,
      size: 2 + Math.random() * 4,
    }));
  }, [count]);

  return (
    <div className={`particles ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
