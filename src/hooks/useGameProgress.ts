import { useState, useEffect, useCallback } from 'react';
import { PlayerProgress, Stage } from '@/types/game';
import { stages as initialStages } from '@/data/stages';

const STORAGE_KEY = 'zenith_racer_progress';

const defaultProgress: PlayerProgress = {
  currentStage: 1,
  completedStages: [],
  totalCoins: 0,
  totalExperience: 0,
  hasPaid: false,
  choices: {},
};

export function useGameProgress() {
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProgress;
  });

  const [stages, setStages] = useState<Stage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const savedProgress: PlayerProgress = JSON.parse(saved);
      return initialStages.map((stage) => ({
        ...stage,
        isCompleted: savedProgress.completedStages.includes(stage.id),
        isLocked: stage.id > 1 && !savedProgress.completedStages.includes(stage.id - 1),
      }));
    }
    return initialStages;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeStage = useCallback((stageId: number, coins: number, experience: number) => {
    setProgress((prev) => ({
      ...prev,
      completedStages: [...new Set([...prev.completedStages, stageId])],
      currentStage: Math.max(prev.currentStage, stageId + 1),
      totalCoins: prev.totalCoins + coins,
      totalExperience: prev.totalExperience + experience,
    }));

    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id === stageId) {
          return { ...stage, isCompleted: true };
        }
        if (stage.id === stageId + 1) {
          return { ...stage, isLocked: false };
        }
        return stage;
      })
    );
  }, []);

  const makeChoice = useCallback((stageId: number, choiceId: string) => {
    setProgress((prev) => ({
      ...prev,
      choices: { ...prev.choices, [stageId]: choiceId },
    }));
  }, []);

  const unlockPaidContent = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      hasPaid: true,
    }));
    
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === 20 ? { ...stage, isLocked: false } : stage
      )
    );
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    setStages(initialStages);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const canAccessStage = useCallback((stage: Stage): boolean => {
    if (stage.requiresPayment && !progress.hasPaid) {
      return false;
    }
    return !stage.isLocked;
  }, [progress.hasPaid]);

  return {
    progress,
    stages,
    completeStage,
    makeChoice,
    unlockPaidContent,
    resetProgress,
    canAccessStage,
  };
}
