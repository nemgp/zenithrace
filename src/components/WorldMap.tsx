import { Stage } from '@/types/game';
import { getZoneIcon } from '@/data/stages';
import { Lock, Crown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorldMapProps {
  stages: Stage[];
  currentStage: number;
  hasPaid: boolean;
  onSelectStage: (stage: Stage) => void;
}

const nodePositions = [
  { x: 15, y: 85 },  // 1
  { x: 28, y: 78 },  // 2
  { x: 40, y: 70 },  // 3
  { x: 55, y: 75 },  // 4
  { x: 68, y: 65 },  // 5
  { x: 80, y: 58 },  // 6
  { x: 88, y: 48 },  // 7
  { x: 78, y: 38 },  // 8
  { x: 65, y: 32 },  // 9
  { x: 50, y: 28 },  // 10
  { x: 35, y: 25 },  // 11
  { x: 22, y: 18 },  // 12
  { x: 12, y: 28 },  // 13
  { x: 18, y: 42 },  // 14
  { x: 30, y: 48 },  // 15
  { x: 45, y: 45 },  // 16
  { x: 58, y: 50 },  // 17
  { x: 70, y: 42 },  // 18
  { x: 82, y: 25 },  // 19
  { x: 50, y: 12 },  // 20
];

const zoneColors: Record<string, { bg: string; glow: string }> = {
  ocean: { bg: 'from-cyan-400 to-blue-500', glow: 'shadow-cyan-500/50' },
  forest: { bg: 'from-green-400 to-emerald-500', glow: 'shadow-green-500/50' },
  volcanic: { bg: 'from-orange-400 to-red-500', glow: 'shadow-orange-500/50' },
  mystical: { bg: 'from-purple-400 to-pink-500', glow: 'shadow-purple-500/50' },
  ice: { bg: 'from-sky-300 to-blue-400', glow: 'shadow-sky-400/50' },
  desert: { bg: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/50' },
};

export function WorldMap({ stages, currentStage, hasPaid, onSelectStage }: WorldMapProps) {
  const canAccess = (stage: Stage) => {
    if (stage.requiresPayment && !hasPaid) return false;
    return !stage.isLocked;
  };

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-3xl glass-card">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-[60%] left-[10%] w-40 h-40 rounded-full bg-ocean/20 blur-3xl" />
        <div className="absolute top-[30%] left-[50%] w-60 h-60 rounded-full bg-forest/20 blur-3xl" />
        <div className="absolute top-[20%] right-[15%] w-48 h-48 rounded-full bg-volcanic/20 blur-3xl" />
        <div className="absolute top-[10%] left-[30%] w-52 h-52 rounded-full bg-mystical/20 blur-3xl" />
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        {stages.slice(0, -1).map((stage, i) => {
          const start = nodePositions[i];
          const end = nodePositions[i + 1];
          const isCompleted = stage.isCompleted;
          
          return (
            <line
              key={`line-${stage.id}`}
              x1={`${start.x}%`}
              y1={`${start.y}%`}
              x2={`${end.x}%`}
              y2={`${end.y}%`}
              stroke={isCompleted ? 'hsl(175, 80%, 50%)' : 'hsl(220, 20%, 25%)'}
              strokeWidth="3"
              strokeDasharray={isCompleted ? '0' : '8 4'}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>

      {/* Stage nodes */}
      {stages.map((stage, index) => {
        const pos = nodePositions[index];
        const accessible = canAccess(stage);
        const isCurrent = stage.id === currentStage;
        const isPaymentLocked = stage.requiresPayment && !hasPaid;
        const colors = zoneColors[stage.zone];

        return (
          <button
            key={stage.id}
            onClick={() => onSelectStage(stage)}
            disabled={!accessible && !isPaymentLocked}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2",
              "transition-all duration-300 group",
              accessible && "hover:scale-110",
              isCurrent && "animate-bounce-subtle"
            )}
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: 1 }}
          >
            {/* Glow ring for current/completed */}
            {(isCurrent || stage.isCompleted) && (
              <div
                className={cn(
                  "absolute inset-0 rounded-full animate-pulse-glow",
                  "scale-150 opacity-50",
                  stage.isCompleted ? 'bg-accent/20' : 'bg-primary/20'
                )}
              />
            )}

            {/* Node */}
            <div
              className={cn(
                "w-10 h-10 md:w-14 md:h-14 rounded-full",
                "flex items-center justify-center",
                "bg-gradient-to-br shadow-lg",
                colors.bg, colors.glow,
                !accessible && !isPaymentLocked && "grayscale opacity-50",
                isPaymentLocked && "ring-2 ring-secondary"
              )}
            >
              {stage.isCompleted ? (
                <Check className="w-5 h-5 md:w-6 md:h-6 text-white" />
              ) : isPaymentLocked ? (
                <Crown className="w-5 h-5 md:w-6 md:h-6 text-white" />
              ) : !accessible ? (
                <Lock className="w-4 h-4 md:w-5 md:h-5 text-white/80" />
              ) : (
                <span className="text-lg md:text-xl">{getZoneIcon(stage.zone)}</span>
              )}
            </div>

            {/* Stage number */}
            <span
              className={cn(
                "absolute -bottom-5 left-1/2 -translate-x-1/2",
                "text-xs font-bold",
                accessible ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {stage.id}
            </span>

            {/* Tooltip */}
            <div
              className={cn(
                "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
                "px-3 py-2 rounded-xl glass-card",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "pointer-events-none whitespace-nowrap",
                "text-sm font-medium"
              )}
            >
              {stage.name}
            </div>
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3 justify-center text-xs">
        {Object.entries(zoneColors).map(([zone, colors]) => (
          <div key={zone} className="flex items-center gap-1.5">
            <div className={cn("w-3 h-3 rounded-full bg-gradient-to-br", colors.bg)} />
            <span className="text-muted-foreground capitalize">{zone}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
