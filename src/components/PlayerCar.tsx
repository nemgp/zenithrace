import { useEffect, useState } from 'react';

interface PlayerCarProps {
  moveDirection: 'left' | 'right' | null;
}

export function PlayerCar({ moveDirection }: PlayerCarProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (moveDirection === 'left') {
      setRotation(-15);
    } else if (moveDirection === 'right') {
      setRotation(15);
    } else {
      setRotation(0);
    }
  }, [moveDirection]);

  return (
    <div
      className="relative w-24 h-32 transition-transform duration-300 ease-out"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Effet de traînée lumineuse */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 bg-gradient-to-b from-cyan-500/30 via-blue-500/20 to-transparent blur-xl animate-pulse" />
      </div>

      {/* Ombre de la voiture */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/40 rounded-full blur-md" />

      <svg
        viewBox="0 0 100 140"
        className="w-full h-full drop-shadow-2xl"
        style={{ filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.6))' }}
      >
        <defs>
          {/* Gradients futuristes */}
          <linearGradient id="carBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#0891b2', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0e7490', stopOpacity: 1 }} />
          </linearGradient>

          <linearGradient id="carGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.4 }} />
          </linearGradient>

          <linearGradient id="windshield" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#67e8f9', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 0.9 }} />
          </linearGradient>

          {/* Effet de brillance */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Corps principal de la voiture - forme aérodynamique */}
        <path
          d="M 30 100 L 20 80 L 25 50 L 35 30 L 50 20 L 65 30 L 75 50 L 80 80 L 70 100 Z"
          fill="url(#carBody)"
          stroke="#0e7490"
          strokeWidth="1.5"
          filter="url(#glow)"
        />

        {/* Pare-brise futuriste */}
        <path
          d="M 35 35 L 40 45 L 60 45 L 65 35 L 50 28 Z"
          fill="url(#windshield)"
          stroke="#22d3ee"
          strokeWidth="1"
          opacity="0.9"
        />

        {/* Lignes néon latérales */}
        <line x1="25" y1="60" x2="25" y2="90" stroke="#22d3ee" strokeWidth="2" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
        </line>
        <line x1="75" y1="60" x2="75" y2="90" stroke="#22d3ee" strokeWidth="2" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
        </line>

        {/* Aileron arrière */}
        <path
          d="M 25 95 L 20 105 L 30 105 Z"
          fill="#0e7490"
          stroke="#22d3ee"
          strokeWidth="1"
        />
        <path
          d="M 75 95 L 80 105 L 70 105 Z"
          fill="#0e7490"
          stroke="#22d3ee"
          strokeWidth="1"
        />

        {/* Roues avec effet lumineux */}
        <g>
          {/* Roue avant gauche */}
          <circle cx="30" cy="40" r="8" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
          <circle cx="30" cy="40" r="4" fill="#06b6d4">
            <animate attributeName="r" values="4;5;4" dur="0.5s" repeatCount="indefinite" />
          </circle>

          {/* Roue avant droite */}
          <circle cx="70" cy="40" r="8" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
          <circle cx="70" cy="40" r="4" fill="#06b6d4">
            <animate attributeName="r" values="4;5;4" dur="0.5s" repeatCount="indefinite" />
          </circle>

          {/* Roue arrière gauche */}
          <circle cx="30" cy="85" r="8" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
          <circle cx="30" cy="85" r="4" fill="#06b6d4">
            <animate attributeName="r" values="4;5;4" dur="0.5s" repeatCount="indefinite" />
          </circle>

          {/* Roue arrière droite */}
          <circle cx="70" cy="85" r="8" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
          <circle cx="70" cy="85" r="4" fill="#06b6d4">
            <animate attributeName="r" values="4;5;4" dur="0.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Phares avant */}
        <ellipse cx="35" cy="25" rx="3" ry="2" fill="#fef08a" opacity="0.9">
          <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="65" cy="25" rx="3" ry="2" fill="#fef08a" opacity="0.9">
          <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
        </ellipse>

        {/* Feux arrière */}
        <ellipse cx="35" cy="100" rx="3" ry="2" fill="#ef4444" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="65" cy="100" rx="3" ry="2" fill="#ef4444" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
        </ellipse>

        {/* Détails chrome */}
        <path
          d="M 45 50 L 50 45 L 55 50"
          stroke="#e0f2fe"
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
      </svg>

      {/* Particules de boost */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 flex justify-between">
        <div className="w-2 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent opacity-70 blur-sm animate-pulse" />
        <div className="w-2 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent opacity-70 blur-sm animate-pulse" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  );
}
