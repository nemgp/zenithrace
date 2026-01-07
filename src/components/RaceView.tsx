import { useState, useEffect } from 'react';
import { Stage, RouteChoice } from '@/types/game';
import { getZoneIcon } from '@/data/stages';
import { Button } from '@/components/ui/button';
import { Particles } from './Particles';
import { ArrowLeft, Zap, Coins, Star, AlertTriangle, Shield, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RaceViewProps {
  stage: Stage;
  onComplete: (coins: number, experience: number) => void;
  onBack: () => void;
  onChoice: (choiceId: string) => void;
}

const routeChoices: RouteChoice[] = [
  {
    id: 'safe',
    name: 'Scenic Route',
    description: 'A longer but safer path with beautiful views.',
    risk: 'low',
    reward: 'low',
  },
  {
    id: 'balanced',
    name: 'Main Road',
    description: 'The standard path. Moderate challenges ahead.',
    risk: 'medium',
    reward: 'medium',
  },
  {
    id: 'risky',
    name: 'Shortcut',
    description: 'Dangerous but fast. High rewards for the brave!',
    risk: 'high',
    reward: 'high',
  },
];

const riskIcons = {
  low: Shield,
  medium: AlertTriangle,
  high: Rocket,
};

const riskColors = {
  low: 'text-green-400',
  medium: 'text-amber-400',
  high: 'text-red-400',
};

const zoneBackgrounds: Record<string, string> = {
  ocean: 'from-blue-900 via-cyan-900 to-blue-950',
  forest: 'from-green-900 via-emerald-900 to-green-950',
  volcanic: 'from-orange-900 via-red-900 to-orange-950',
  mystical: 'from-purple-900 via-pink-900 to-purple-950',
  ice: 'from-sky-800 via-blue-900 to-sky-950',
  desert: 'from-amber-800 via-orange-900 to-amber-950',
};

export function RaceView({ stage, onComplete, onBack, onChoice }: RaceViewProps) {
  const [phase, setPhase] = useState<'intro' | 'choice' | 'racing' | 'result'>('intro');
  const [selectedRoute, setSelectedRoute] = useState<RouteChoice | null>(null);
  const [progress, setProgress] = useState(0);
  const [finalScore, setFinalScore] = useState({ coins: 0, experience: 0 });

  // Simulate race progress
  useEffect(() => {
    if (phase === 'racing' && progress < 100) {
      const timer = setTimeout(() => {
        setProgress((p) => Math.min(100, p + 2 + Math.random() * 3));
      }, 100);
      return () => clearTimeout(timer);
    }

    if (phase === 'racing' && progress >= 100) {
      // Calculate rewards based on route choice
      const multiplier = selectedRoute?.reward === 'high' ? 1.5 : selectedRoute?.reward === 'medium' ? 1.2 : 1;
      const coins = Math.round(stage.rewards.coins * multiplier);
      const experience = Math.round(stage.rewards.experience * multiplier);
      
      setFinalScore({ coins, experience });
      setPhase('result');
    }
  }, [phase, progress, selectedRoute, stage.rewards]);

  const handleRouteSelect = (route: RouteChoice) => {
    setSelectedRoute(route);
    onChoice(route.id);
    setPhase('racing');
    setProgress(0);
  };

  const handleComplete = () => {
    onComplete(finalScore.coins, finalScore.experience);
    onBack();
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-b",
      zoneBackgrounds[stage.zone],
      "relative overflow-hidden"
    )}>
      <Particles count={30} />

      {/* Header */}
      <header className="relative z-10 p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Map</span>
        </button>
      </header>

      <main className="relative z-10 container max-w-2xl mx-auto px-4 pb-8">
        {/* Stage Header */}
        <div className="text-center mb-8 animate-fade-in">
          <span className="text-6xl mb-4 block">{getZoneIcon(stage.zone)}</span>
          <span className="text-sm text-primary font-medium">Stage {stage.id}</span>
          <h1 className="text-4xl font-display font-bold glow-text mb-2">{stage.name}</h1>
          <p className="text-muted-foreground">{stage.description}</p>
        </div>

        {/* Phase: Intro */}
        {phase === 'intro' && (
          <div className="glass-card p-6 text-center animate-scale-in">
            <h2 className="text-2xl font-display font-bold mb-4">Ready to Race?</h2>
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-accent" />
                <span>Up to {Math.round(stage.rewards.coins * 1.5)} coins</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Up to {Math.round(stage.rewards.experience * 1.5)} XP</span>
              </div>
            </div>
            <Button
              onClick={() => setPhase('choice')}
              className="btn-game text-primary-foreground"
            >
              Start Race
            </Button>
          </div>
        )}

        {/* Phase: Route Choice */}
        {phase === 'choice' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-display font-bold text-center mb-6">
              Choose Your Route
            </h2>
            
            {routeChoices.map((route) => {
              const RiskIcon = riskIcons[route.risk];
              return (
                <button
                  key={route.id}
                  onClick={() => handleRouteSelect(route)}
                  className="glass-card w-full p-5 text-left hover:border-primary/50 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-br from-muted to-muted/50"
                    )}>
                      <RiskIcon className={cn("w-6 h-6", riskColors[route.risk])} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg">{route.name}</h3>
                      <p className="text-sm text-muted-foreground">{route.description}</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className={riskColors[route.risk]}>
                          Risk: {route.risk}
                        </span>
                        <span className="text-accent">
                          Reward: {route.reward}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Phase: Racing */}
        {phase === 'racing' && (
          <div className="glass-card p-8 text-center animate-scale-in">
            <h2 className="text-2xl font-display font-bold mb-2">Racing!</h2>
            <p className="text-muted-foreground mb-6">
              Taking the {selectedRoute?.name.toLowerCase()}...
            </p>

            {/* Progress Bar */}
            <div className="relative h-4 bg-muted rounded-full overflow-hidden mb-4">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
              <div className="absolute inset-0 shimmer" />
            </div>

            <span className="text-4xl font-display font-bold text-primary">
              {Math.round(progress)}%
            </span>

            {/* Animated elements */}
            <div className="mt-6 text-4xl animate-bounce-subtle">
              🏎️
            </div>
          </div>
        )}

        {/* Phase: Result */}
        {phase === 'result' && (
          <div className="glass-card p-8 text-center animate-scale-in">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-display font-bold glow-text-accent mb-2">
              Victory!
            </h2>
            <p className="text-muted-foreground mb-6">
              You completed {stage.name}!
            </p>

            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-accent">
                  <Coins className="w-6 h-6" />
                  <span>+{finalScore.coins}</span>
                </div>
                <span className="text-sm text-muted-foreground">Coins</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
                  <Zap className="w-6 h-6" />
                  <span>+{finalScore.experience}</span>
                </div>
                <span className="text-sm text-muted-foreground">Experience</span>
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-8 h-8 fill-accent text-accent animate-scale-in"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            <Button
              onClick={handleComplete}
              className="btn-accent text-accent-foreground"
            >
              Continue
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
