export type ZoneType = 'ocean' | 'forest' | 'volcanic' | 'mystical' | 'ice' | 'desert';

export interface Stage {
  id: number;
  name: string;
  zone: ZoneType;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  isLocked: boolean;
  isCompleted: boolean;
  requiresPayment: boolean;
  rewards: {
    coins: number;
    experience: number;
  };
}

export interface PlayerProgress {
  currentStage: number;
  completedStages: number[];
  totalCoins: number;
  totalExperience: number;
  hasPaid: boolean;
  choices: Record<number, string>;
}

export interface RouteChoice {
  id: string;
  name: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  reward: 'low' | 'medium' | 'high';
}

export interface StepData {
  date: string;
  steps: number;
  distance: number; // in km
  trajectory: Array<{ lat: number; lng: number }>;
}
