import { useState, useEffect, useCallback, useRef } from 'react';
import { Stage, RouteChoice } from '@/types/game';
import { getZoneIcon } from '@/data/stages';
import { Button } from '@/components/ui/button';
import { Particles } from './Particles';
import { PlayerCar } from './PlayerCar';
import { SideScenery } from './SideScenery';
import { ArrowLeft, Zap, Coins, Star, AlertTriangle, Shield, Rocket, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RaceViewProps {
  stage: Stage;
  onComplete: (coins: number, experience: number) => void;
  onBack: () => void;
  onChoice: (choiceId: string) => void;
}

interface Obstacle {
  id: number;
  lane: number;
  y: number;
  type: 'rock' | 'tree' | 'fire' | 'ice' | 'crate';
}

interface Collectible {
  id: number;
  lane: number;
  y: number;
  type: 'coin' | 'boost';
  collected: boolean;
}

const routeChoices: RouteChoice[] = [
  {
    id: 'safe',
    name: 'Scenic Route',
    description: 'Fewer obstacles, more time to react.',
    risk: 'low',
    reward: 'low',
  },
  {
    id: 'balanced',
    name: 'Main Road',
    description: 'Moderate obstacles. Standard challenge.',
    risk: 'medium',
    reward: 'medium',
  },
  {
    id: 'risky',
    name: 'Shortcut',
    description: 'Many obstacles but huge rewards!',
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

const zoneObstacles: Record<string, string[]> = {
  ocean: ['🥩', '🍖', '🍗'],
  forest: ['🥩', '🍖', '🥓'],
  volcanic: ['🥩', '🍖', '🍗'],
  mystical: ['🥩', '🍖', '🥓'],
  ice: ['🥩', '🍖', '🍗'],
  desert: ['🥩', '🍖', '🥓'],
};

const RACE_DURATION = 60; // seconds
const LANES = 3;
const GAME_HEIGHT = 500;

export function RaceView({ stage, onComplete, onBack, onChoice }: RaceViewProps) {
  const [phase, setPhase] = useState<'intro' | 'choice' | 'countdown' | 'racing' | 'result'>('intro');
  const [selectedRoute, setSelectedRoute] = useState<RouteChoice | null>(null);
  const [playerLane, setPlayerLane] = useState(1); // 0, 1, 2
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [timeLeft, setTimeLeft] = useState(RACE_DURATION);
  const [score, setScore] = useState({ coins: 0, avoided: 0, hits: 0 });
  const [countdown, setCountdown] = useState(3);
  const [speed, setSpeed] = useState(5);
  const [moveDirection, setMoveDirection] = useState<'left' | 'right' | null>(null);
  const obstacleIdRef = useRef(0);
  const gameLoopRef = useRef<number>();
  const lastObstacleTime = useRef(0);
  const lastCollectibleTime = useRef(0);

  // Difficulty based on route choice
  const getDifficulty = useCallback(() => {
    if (selectedRoute?.risk === 'high') return { obstacleRate: 800, speed: 7 };
    if (selectedRoute?.risk === 'medium') return { obstacleRate: 1200, speed: 5 };
    return { obstacleRate: 1800, speed: 4 };
  }, [selectedRoute]);

  // Handle countdown
  useEffect(() => {
    if (phase === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('racing');
        setSpeed(getDifficulty().speed);
      }
    }
  }, [phase, countdown, getDifficulty]);

  // Timer
  useEffect(() => {
    if (phase !== 'racing') return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setPhase('result');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Game loop
  useEffect(() => {
    if (phase !== 'racing') return;

    const difficulty = getDifficulty();
    const zoneObs = zoneObstacles[stage.zone] || zoneObstacles.ocean;

    const gameLoop = () => {
      const now = Date.now();

      // Spawn obstacles
      if (now - lastObstacleTime.current > difficulty.obstacleRate) {
        const newObstacle: Obstacle = {
          id: obstacleIdRef.current++,
          lane: Math.floor(Math.random() * LANES),
          y: -60,
          type: 'rock',
        };
        setObstacles(prev => [...prev, newObstacle]);
        lastObstacleTime.current = now;
      }

      // Spawn collectibles
      if (now - lastCollectibleTime.current > 2500) {
        const newCollectible: Collectible = {
          id: obstacleIdRef.current++,
          lane: Math.floor(Math.random() * LANES),
          y: -60,
          type: Math.random() > 0.7 ? 'boost' : 'coin',
          collected: false,
        };
        setCollectibles(prev => [...prev, newCollectible]);
        lastCollectibleTime.current = now;
      }

      // Move obstacles
      setObstacles(prev => {
        const updated = prev
          .map(obs => ({ ...obs, y: obs.y + speed }))
          .filter(obs => obs.y < GAME_HEIGHT + 100);
        return updated;
      });

      // Move collectibles
      setCollectibles(prev => {
        return prev
          .map(col => ({ ...col, y: col.y + speed }))
          .filter(col => col.y < GAME_HEIGHT + 100);
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [phase, speed, stage.zone, getDifficulty]);

  // Collision detection
  useEffect(() => {
    if (phase !== 'racing') return;

    const playerY = GAME_HEIGHT - 100;
    const hitZone = 50;

    // Check obstacle collisions
    obstacles.forEach(obs => {
      if (obs.lane === playerLane && Math.abs(obs.y - playerY) < hitZone) {
        setScore(prev => ({ ...prev, hits: prev.hits + 1 }));
        setObstacles(prev => prev.filter(o => o.id !== obs.id));
      } else if (obs.y > playerY + hitZone && obs.lane !== playerLane) {
        // Avoided
      }
    });

    // Check collectible collisions
    collectibles.forEach(col => {
      if (!col.collected && col.lane === playerLane && Math.abs(col.y - playerY) < hitZone) {
        if (col.type === 'coin') {
          setScore(prev => ({ ...prev, coins: prev.coins + 10 }));
        } else {
          setSpeed(s => Math.min(s + 1, 10));
          setTimeout(() => setSpeed(getDifficulty().speed), 3000);
        }
        setCollectibles(prev => prev.map(c => c.id === col.id ? { ...c, collected: true } : c));
      }
    });
  }, [obstacles, collectibles, playerLane, phase, getDifficulty]);

  // Keyboard controls
  useEffect(() => {
    if (phase !== 'racing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayerLane(l => Math.max(0, l - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayerLane(l => Math.min(LANES - 1, l + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  // Touch controls
  const handleLaneChange = (direction: 'left' | 'right') => {
    setMoveDirection(direction);
    setTimeout(() => setMoveDirection(null), 300); // Reset sway

    if (direction === 'left') {
      setPlayerLane(l => Math.max(0, l - 1));
    } else {
      setPlayerLane(l => Math.min(LANES - 1, l + 1));
    }
  };

  const handleRouteSelect = (route: RouteChoice) => {
    setSelectedRoute(route);
    onChoice(route.id);
    setPhase('countdown');
    setCountdown(3);
  };

  const calculateFinalScore = () => {
    const multiplier = selectedRoute?.reward === 'high' ? 1.5 : selectedRoute?.reward === 'medium' ? 1.2 : 1;
    const hitPenalty = Math.max(0, 1 - (score.hits * 0.1));
    const baseCoins = stage.rewards.coins + score.coins;
    const baseXp = stage.rewards.experience;

    return {
      coins: Math.round(baseCoins * multiplier * hitPenalty),
      experience: Math.round(baseXp * multiplier * hitPenalty),
    };
  };

  const handleComplete = () => {
    const finalScore = calculateFinalScore();
    onComplete(finalScore.coins, finalScore.experience);
    onBack();
  };

  const zoneObs = zoneObstacles[stage.zone] || zoneObstacles.ocean;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020210]"> {/* Deep Space Black */}

      {/* Stars Background */}
      <div className="absolute inset-0 z-0 opacity-80"
        style={{ background: 'radial-gradient(white 1px, transparent 1px) 0 0 / 50px 50px, radial-gradient(white 1px, transparent 1px) 25px 25px / 100px 100px' }}
      />

      {/* Giant Planet in Background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-purple-500/20 to-blue-500/5 blur-3xl z-0" />
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full border border-white/5 opacity-20 z-0" />


      <Particles count={15} />

      {/* Header - only show when not racing */}
      {phase !== 'racing' && phase !== 'countdown' && (
        <header className="relative z-10 p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Map</span>
          </button>
        </header>
      )}

      <main className="relative z-10 container max-w-2xl mx-auto px-4 pb-8">
        {/* Stage Header - only show in intro/choice phases */}
        {(phase === 'intro' || phase === 'choice') && (
          <div className="text-center mb-8 animate-fade-in">
            <span className="text-6xl mb-4 block">{getZoneIcon(stage.zone)}</span>
            <span className="text-sm text-primary font-medium">Stage {stage.id}</span>
            <h1 className="text-4xl font-display font-bold glow-text mb-2">{stage.name}</h1>
            <p className="text-muted-foreground">{stage.description}</p>
          </div>
        )}

        {/* Phase: Intro */}
        {phase === 'intro' && (
          <div className="glass-card p-6 text-center animate-scale-in">
            <h2 className="text-2xl font-display font-bold mb-4">Ready to Race?</h2>
            <p className="text-muted-foreground mb-4">
              Dodge obstacles and collect coins for 60 seconds!
            </p>
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
              Choose Route
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

        {/* Phase: Countdown */}
        {phase === 'countdown' && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center animate-scale-in">
              <span className="text-9xl font-display font-bold text-primary glow-text">
                {countdown > 0 ? countdown : 'GO!'}
              </span>
            </div>
          </div>
        )}

        {/* Phase: Racing */}
        {phase === 'racing' && (
          <div className="relative">
            {/* HUD */}
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="glass-card px-4 py-2 flex items-center gap-2">
                <span className="text-2xl font-display font-bold text-primary">
                  {timeLeft}s
                </span>
              </div>
              <div className="glass-card px-4 py-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-accent" />
                  <span className="font-bold">{score.coins}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-400">💥</span>
                  <span className="font-bold">{score.hits}</span>
                </div>
              </div>
            </div>

            {/* Full-width Ground Plane (Planet Surface) */}
            <div className="absolute inset-0 z-0">
              {/* Sky/Space - Fade into horizon */}
              <div className="h-[40%] bg-transparent" />
              {/* Ground - Curved Planet Surface */}
              <div className={cn(
                "absolute top-[40%] left-[-50%] right-[-50%] h-[1000px] rounded-[100%] bg-gradient-to-b",
                "transform -translate-y-20 scale-x-150",
                // Dynamic ground color based on zone
                stage.zone === 'ocean' ? 'from-blue-900 to-blue-950' :
                  stage.zone === 'forest' ? 'from-green-900 to-green-950' :
                    stage.zone === 'desert' ? 'from-amber-900 to-amber-950' :
                      'from-slate-800 to-slate-950'
              )}
                style={{ boxShadow: '0 -20px 50px rgba(0,0,0,0.5) inset' }}
              />
            </div>

            <SideScenery zone={stage.zone} speed={speed} />

            {/* Game Area (Road) */}
            <div
              className="relative mx-auto z-10"
              style={{
                width: '100%',
                maxWidth: '800px',
                height: `${GAME_HEIGHT}px`,
                perspective: '800px',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)'
              }}
            >
              {/* 3D Road Container */}
              <div
                className="absolute inset-0 w-full h-[150%] -top-[25%] origin-bottom"
                style={{
                  transform: 'rotateX(55deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Route principale avec effet néon */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(180deg, #0a0f1e 0%, #1a1f2e 50%, #0a0f1e 100%)',
                  boxShadow: `
                    0 0 100px rgba(6, 182, 212, 0.3) inset,
                    0 0 50px rgba(0,0,0,0.8) inset,
                    0 10px 50px rgba(0,0,0,0.5)
                  `
                }}>
                  {/* Grille futuriste de fond */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `
                      repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(6, 182, 212, 0.3) 49px, rgba(6, 182, 212, 0.3) 50px),
                      repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(6, 182, 212, 0.3) 49px, rgba(6, 182, 212, 0.3) 50px)
                    `,
                    backgroundSize: '50px 50px',
                    animation: 'gridMove 2s linear infinite'
                  }} />

                  {/* Bordures néon latérales */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" style={{
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.4)',
                    animation: 'neonPulse 2s ease-in-out infinite'
                  }} />
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" style={{
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.4)',
                    animation: 'neonPulse 2s ease-in-out infinite 1s'
                  }} />
                </div>

                {/* Lanes avec lignes néon */}
                <div className="absolute inset-0 flex px-32">
                  {[0, 1, 2].map(lane => (
                    <div
                      key={lane}
                      className="flex-1 relative overflow-hidden"
                      style={{
                        borderLeft: lane === 0 ? 'none' : '2px solid rgba(34, 211, 238, 0.4)',
                        borderRight: lane === 2 ? 'none' : '2px solid rgba(34, 211, 238, 0.4)',
                        background: lane === 1 ? 'rgba(6, 182, 212, 0.05)' : 'transparent',
                        boxShadow: lane === 1 ? '0 0 30px rgba(6, 182, 212, 0.1) inset' : 'none'
                      }}
                    >
                      {/* Lignes de marquage animées */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'repeating-linear-gradient(to bottom, transparent, transparent 40px, rgba(34, 211, 238, 0.6) 40px, rgba(34, 211, 238, 0.6) 60px, transparent 60px, transparent 100px)',
                          backgroundSize: '100% 100px',
                          animation: `roadMove ${0.8 - (speed * 0.05)}s linear infinite`,
                          filter: 'blur(0.5px)',
                          opacity: 0.8
                        }}
                      />

                      {/* Particules de lumière sur la route */}
                      {lane === 1 && (
                        <div className="absolute inset-0 overflow-hidden">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-sm"
                              style={{
                                left: '50%',
                                top: `${i * 20}%`,
                                animation: `particleFloat ${2 + i * 0.5}s linear infinite`,
                                animationDelay: `${i * 0.4}s`,
                                boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)'
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Effet de profondeur - lignes de perspective */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
                      style={{
                        top: `${i * 10}%`,
                        opacity: 0.3 - (i * 0.02),
                        boxShadow: '0 0 5px rgba(6, 182, 212, 0.3)'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Obstacles - Adjusted for 3D/Perspective feel visually */}
              {obstacles.map(obs => (
                <div
                  key={obs.id}
                  className="absolute text-5xl transition-all duration-75 drop-shadow-lg"
                  style={{
                    left: `${(obs.lane * 33.33) + 16.66}%`,
                    top: `${obs.y}px`,
                    transform: `translateX(-50%) scale(${0.5 + (obs.y / GAME_HEIGHT)})`, // Scale hack for fake 3D
                    opacity: obs.y > GAME_HEIGHT - 50 ? 0 : 1, // Fade out
                    zIndex: Math.floor(obs.y)
                  }}
                >
                  {zoneObs[obs.lane % zoneObs.length]}
                </div>
              ))}

              {/* Collectibles - Adjusted for 3D */}
              {collectibles.filter(c => !c.collected).map(col => (
                <div
                  key={col.id}
                  className="absolute text-5xl transition-all duration-100 drop-shadow-2xl"
                  style={{
                    left: `${(col.lane * 33.33) + 16.66}%`,
                    top: `${col.y}px`,
                    transform: `translateX(-50%) scale(${0.8 + (col.y / GAME_HEIGHT) * 0.5})`,
                    opacity: col.y < 50 ? col.y / 50 : 1,
                    zIndex: Math.floor(col.y),
                    filter: `brightness(${1 + (col.y / GAME_HEIGHT) * 0.3}) drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))`,
                    animation: 'collectibleFloat 1.5s ease-in-out infinite'
                  }}
                >
                  {col.type === 'coin' ? '🍒' : '🍌'}
                </div>
              ))}

              {/* Player - New Component */}
              <div
                className="absolute transition-all duration-150 ease-out z-[1000]"
                style={{
                  left: `${(playerLane * 33.33) + 16.66}%`,
                  bottom: '20px', // Closer to bottom
                  transform: 'translateX(-50%)',
                }}
              >
                <PlayerCar moveDirection={moveDirection} />
              </div>
            </div>

            {/* Touch Controls */}
            <div className="flex justify-center gap-8 mt-6">
              <button
                onClick={() => handleLaneChange('left')}
                className="w-20 h-20 rounded-full glass-card flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-10 h-10 text-primary" />
              </button>
              <button
                onClick={() => handleLaneChange('right')}
                className="w-20 h-20 rounded-full glass-card flex items-center justify-center active:scale-95 transition-transform"
              >
                <ChevronRight className="w-10 h-10 text-primary" />
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Use ← → keys or tap buttons to dodge!
            </p>
          </div>
        )}

        {/* Phase: Result */}
        {phase === 'result' && (
          <div className="glass-card p-8 text-center animate-scale-in">
            <div className="text-6xl mb-4">
              {score.hits < 3 ? '🏆' : score.hits < 6 ? '🥈' : '🎖️'}
            </div>
            <h2 className="text-3xl font-display font-bold glow-text-accent mb-2">
              {score.hits < 3 ? 'Perfect Run!' : score.hits < 6 ? 'Great Job!' : 'Race Complete!'}
            </h2>
            <p className="text-muted-foreground mb-6">
              You completed {stage.name}!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass-card p-3 rounded-xl">
                <div className="text-2xl mb-1">🍒</div>
                <div className="text-lg font-bold text-accent">{score.coins}</div>
                <div className="text-xs text-muted-foreground">Collected</div>
              </div>
              <div className="glass-card p-3 rounded-xl">
                <div className="text-2xl mb-1">💥</div>
                <div className="text-lg font-bold text-red-400">{score.hits}</div>
                <div className="text-xs text-muted-foreground">Hits</div>
              </div>
              <div className="glass-card p-3 rounded-xl">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-lg font-bold text-primary">{selectedRoute?.risk}</div>
                <div className="text-xs text-muted-foreground">Route</div>
              </div>
            </div>

            {/* Final rewards */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-accent">
                  <Coins className="w-6 h-6" />
                  <span>+{calculateFinalScore().coins}</span>
                </div>
                <span className="text-sm text-muted-foreground">Coins</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
                  <Zap className="w-6 h-6" />
                  <span>+{calculateFinalScore().experience}</span>
                </div>
                <span className="text-sm text-muted-foreground">Experience</span>
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-8 h-8 animate-scale-in",
                    i < (3 - Math.floor(score.hits / 3))
                      ? "fill-accent text-accent"
                      : "text-muted-foreground/30"
                  )}
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

      {/* Road animation styles */}
      <style>{`
        @keyframes roadMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(80px); }
        }
      `}</style>
    </div>
  );
}
