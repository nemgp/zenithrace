import { Stage } from '@/types/game';
import { getZoneIcon } from '@/data/stages';
import { Lock, Star, Coins, Zap, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StageCardProps {
  stage: Stage;
  onClick: () => void;
  canAccess: boolean;
}

const zoneGradients: Record<string, string> = {
  ocean: 'from-cyan-500 to-blue-600',
  forest: 'from-green-500 to-emerald-600',
  volcanic: 'from-orange-500 to-red-600',
  mystical: 'from-purple-500 to-pink-600',
  ice: 'from-sky-300 to-blue-400',
  desert: 'from-amber-400 to-orange-500',
};

export function StageCard({ stage, onClick, canAccess }: StageCardProps) {
  const isPaymentLocked = stage.requiresPayment && !canAccess;
  const isLocked = stage.isLocked || isPaymentLocked;

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        "glass-card w-full p-4 text-left transition-all duration-300",
        "hover:scale-[1.02] hover:border-primary/30",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        isLocked && "opacity-60 cursor-not-allowed hover:scale-100",
        stage.isCompleted && "ring-2 ring-accent/50"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Zone Icon */}
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl",
            "bg-gradient-to-br shadow-lg",
            zoneGradients[stage.zone],
            isLocked && "grayscale"
          )}
        >
          {isPaymentLocked ? (
            <Crown className="w-6 h-6 text-white" />
          ) : isLocked ? (
            <Lock className="w-6 h-6 text-white/80" />
          ) : (
            getZoneIcon(stage.zone)
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              Stage {stage.id}
            </span>
            {stage.isCompleted && (
              <span className="px-2 py-0.5 text-xs font-bold bg-accent/20 text-accent rounded-full">
                ✓ Complete
              </span>
            )}
            {isPaymentLocked && (
              <span className="px-2 py-0.5 text-xs font-bold bg-secondary/20 text-secondary rounded-full">
                Premium
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-lg text-foreground truncate">
            {stage.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {stage.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3",
                    i < stage.difficulty
                      ? "fill-accent text-accent"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Coins className="w-3 h-3 text-accent" />
              <span>{stage.rewards.coins}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="w-3 h-3 text-primary" />
              <span>{stage.rewards.experience} XP</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
