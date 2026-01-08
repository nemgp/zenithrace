import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PlayerCarProps {
  moveDirection: 'left' | 'right' | 'none';
}

export function PlayerCar({ moveDirection }: PlayerCarProps) {
  // Determine rotation based on movement
  const rotation = useMemo(() => {
    if (moveDirection === 'left') return '-15deg';
    if (moveDirection === 'right') return '15deg';
    return '0deg';
  }, [moveDirection]);

  return (
    <div 
      className="relative w-24 h-32 transition-transform duration-300 ease-out"
      style={{ transform: `rotate(${rotation})` }}
    >
      {/* Engine Glow/Trail */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-20 bg-cyan-500/30 blur-xl rounded-full animate-pulse" />
      
      {/* SVG Car */}
      <svg
        viewBox="0 0 100 200"
        className="w-full h-full drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }}
      >
        {/* Rear Wheels */}
        <rect x="10" y="140" width="15" height="30" rx="5" fill="#333" />
        <rect x="75" y="140" width="15" height="30" rx="5" fill="#333" />
        
        {/* Front Wheels */}
        <rect x="10" y="40" width="15" height="30" rx="5" fill="#333" />
        <rect x="75" y="40" width="15" height="30" rx="5" fill="#333" />

        {/* Chassis Body - Main */}
        <path
          d="M30,180 L70,180 L80,140 L85,60 L70,20 L30,20 L15,60 L20,140 Z"
          fill="#f0f0f0"
          stroke="#ccc"
          strokeWidth="2"
        />
        
        {/* Side Accents (Cyan) */}
        <path d="M20,140 L15,60 L25,60 L30,140 Z" fill="#06b6d4" />
        <path d="M80,140 L85,60 L75,60 L70,140 Z" fill="#06b6d4" />

        {/* Cockpit / Glass */}
        <path
          d="M35,100 L65,100 L70,60 L30,60 Z"
          fill="#1e293b"
          opacity="0.9"
        />

        {/* Spoiler */}
        <path
          d="M25,185 L75,185 L80,170 L20,170 Z"
          fill="#06b6d4"
        />
        
        {/* Engine Vents */}
        <rect x="40" y="150" width="20" height="20" fill="#333" rx="2" />
        <circle cx="45" cy="160" r="3" fill="#ef4444" className="animate-pulse" />
        <circle cx="55" cy="160" r="3" fill="#ef4444" className="animate-pulse" style={{ animationDelay: '0.1s' }} />

        {/* Center Stripe */}
        <rect x="48" y="20" width="4" height="160" fill="#ef4444" opacity="0.8" />
      </svg>
    </div>
  );
}
