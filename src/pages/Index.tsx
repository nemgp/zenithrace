import { useState } from 'react';
import { Stage } from '@/types/game';
import { useGameProgress } from '@/hooks/useGameProgress';
import { HeroSection } from '@/components/HeroSection';
import { WorldMap } from '@/components/WorldMap';
import { StageCard } from '@/components/StageCard';
import { PlayerStats } from '@/components/PlayerStats';
import { RaceView } from '@/components/RaceView';
import { PaymentModal } from '@/components/PaymentModal';
import { MyMap } from './MyMap';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';

type View = 'home' | 'map' | 'stages' | 'race' | 'mymap';

const Index = () => {
  const [view, setView] = useState<View>('home');
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    progress,
    stages,
    completeStage,
    makeChoice,
    unlockPaidContent,
    resetProgress,
    canAccessStage,
  } = useGameProgress();

  const handleStageSelect = (stage: Stage) => {
    if (stage.requiresPayment && !progress.hasPaid) {
      setSelectedStage(stage);
      setShowPaymentModal(true);
      return;
    }

    if (canAccessStage(stage)) {
      setSelectedStage(stage);
      setView('race');
    }
  };

  const handleRaceComplete = (coins: number, experience: number) => {
    if (selectedStage) {
      completeStage(selectedStage.id, coins, experience);
    }
  };

  const handlePaymentSuccess = () => {
    unlockPaidContent();
    setShowPaymentModal(false);
    if (selectedStage) {
      setView('race');
    }
  };

  const currentStageData = stages.find((s) => s.id === progress.currentStage) || stages[0];

  // Race View
  if (view === 'race' && selectedStage) {
    return (
      <RaceView
        stage={selectedStage}
        onComplete={handleRaceComplete}
        onBack={() => {
          setView('map');
          setSelectedStage(null);
        }}
        onChoice={makeChoice.bind(null, selectedStage.id)}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero / Home View */}
      {view === 'home' && (
        <HeroSection
          onStart={() => {
            setSelectedStage(currentStageData);
            if (currentStageData.requiresPayment && !progress.hasPaid) {
              setShowPaymentModal(true);
            } else {
              setView('race');
            }
          }}
          onOpenMap={() => setView('map')}
          onOpenMyMap={() => setView('mymap')}
          currentStage={progress.currentStage}
        />
      )}

      {/* My Map View */}
      {view === 'mymap' && (
        <MyMap onBack={() => setView('home')} />
      )}

      {/* Map View */}
      {view === 'map' && (
        <div className="min-h-screen py-8">
          <div className="container max-w-6xl mx-auto px-4">
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
              <button
                onClick={() => setView('home')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Home</span>
              </button>

              <h1 className="text-2xl font-display font-bold">World Map</h1>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('stages')}
                className="text-muted-foreground hover:text-foreground"
              >
                List View
              </Button>
            </header>

            {/* Player Stats */}
            <div className="mb-8">
              <PlayerStats progress={progress} totalStages={stages.length} />
            </div>

            {/* World Map */}
            <WorldMap
              stages={stages}
              currentStage={progress.currentStage}
              hasPaid={progress.hasPaid}
              onSelectStage={handleStageSelect}
            />

            {/* Quick access to current stage */}
            <div className="mt-8 text-center">
              <Button
                onClick={() => handleStageSelect(currentStageData)}
                className="btn-game text-primary-foreground"
              >
                Continue: {currentStageData.name}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stages List View */}
      {view === 'stages' && (
        <div className="min-h-screen py-8">
          <div className="container max-w-2xl mx-auto px-4">
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
              <button
                onClick={() => setView('map')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Map</span>
              </button>

              <h1 className="text-2xl font-display font-bold">All Stages</h1>

              <Button
                variant="ghost"
                size="icon"
                onClick={resetProgress}
                className="text-muted-foreground hover:text-destructive"
                title="Reset Progress"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </header>

            {/* Stages List */}
            <div className="space-y-4">
              {stages.map((stage) => (
                <StageCard
                  key={stage.id}
                  stage={stage}
                  onClick={() => handleStageSelect(stage)}
                  canAccess={canAccessStage(stage)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {selectedStage && (
        <PaymentModal
          stage={selectedStage}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedStage(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Index;
