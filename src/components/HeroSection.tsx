import { Button } from '@/components/ui/button';
import { Particles } from './Particles';
import { Play, Map, Footprints } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
  onOpenMap: () => void;
  currentStage: number;
}

export function HeroSection({ onStart, onOpenMap, currentStage }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <Particles count={25} />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 container max-w-4xl mx-auto px-4 text-center">
        {/* Logo / Title */}
        <div className="mb-8 animate-fade-in">
          <span className="inline-block text-7xl md:text-8xl mb-4 floating">🏎️</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">
            <span className="text-gradient-primary">Zenith</span>
            <span className="text-gradient-accent"> Racer</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Race through exotic worlds. Choose your path. Write your legend.
          </p>
        </div>

        {/* Current progress indicator */}
        {currentStage > 1 && (
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <Footprints className="w-4 h-4 text-primary" />
              <span className="text-sm">
                Continue from <strong className="text-primary">Stage {currentStage}</strong>
              </span>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={onStart}
            className="btn-game text-primary-foreground text-lg px-10 py-6"
          >
            <Play className="w-5 h-5 mr-2" />
            {currentStage > 1 ? 'Continue Race' : 'Start Racing'}
          </Button>

          <Button
            onClick={onOpenMap}
            variant="outline"
            className="px-8 py-6 text-lg border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
          >
            <Map className="w-5 h-5 mr-2" />
            World Map
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {[
            { icon: '🌊', label: '6 Unique Zones' },
            { icon: '🛤️', label: 'Choose Your Path' },
            { icon: '✨', label: '20+ Stages' },
          ].map((feature) => (
            <div key={feature.label} className="text-center">
              <span className="text-3xl mb-2 block">{feature.icon}</span>
              <span className="text-sm text-muted-foreground">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
        </div>
      </div>
    </section>
  );
}
