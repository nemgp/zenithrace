import { PlayerProgress } from '@/types/game';
import { Coins, Zap, Trophy, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerStatsProps {
  progress: PlayerProgress;
  totalStages: number;
}

export function PlayerStats({ progress, totalStages }: PlayerStatsProps) {
  const completedPercentage = (progress.completedStages.length / totalStages) * 100;

  return (
    <div className="glass-card p-4 md:p-6">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Journey Progress</span>
          <span className="font-bold text-primary">
            {progress.completedStages.length}/{totalStages} stages
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${completedPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={Trophy}
          label="Current Stage"
          value={progress.currentStage}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <StatCard
          icon={Coins}
          label="Total Coins"
          value={progress.totalCoins.toLocaleString()}
          color="text-accent"
          bgColor="bg-accent/10"
        />
        <StatCard
          icon={Zap}
          label="Experience"
          value={progress.totalExperience.toLocaleString()}
          color="text-secondary"
          bgColor="bg-secondary/10"
        />
        <StatCard
          icon={Footprints}
          label="Completed"
          value={`${progress.completedStages.length} stages`}
          color="text-green-400"
          bgColor="bg-green-400/10"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

function StatCard({ icon: Icon, label, value, color, bgColor }: StatCardProps) {
  return (
    <div className={cn("rounded-xl p-3", bgColor)}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("w-4 h-4", color)} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={cn("font-display font-bold text-lg", color)}>
        {value}
      </span>
    </div>
  );
}
