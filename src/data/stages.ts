import { Stage } from '@/types/game';

export const stages: Stage[] = [
  {
    id: 1,
    name: "Coral Shores",
    zone: 'ocean',
    description: "Begin your journey on the crystalline beaches where waves dance with light.",
    difficulty: 1,
    isLocked: false,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 50, experience: 100 }
  },
  {
    id: 2,
    name: "Tide Pools",
    zone: 'ocean',
    description: "Navigate through mystical tide pools filled with bioluminescent creatures.",
    difficulty: 1,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 75, experience: 150 }
  },
  {
    id: 3,
    name: "Kelp Highway",
    zone: 'ocean',
    description: "Race through towering kelp forests with swift currents.",
    difficulty: 2,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 100, experience: 200 }
  },
  {
    id: 4,
    name: "Emerald Canopy",
    zone: 'forest',
    description: "Enter the ancient forest where trees touch the clouds.",
    difficulty: 2,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 120, experience: 250 }
  },
  {
    id: 5,
    name: "Bioluminescent Grove",
    zone: 'forest',
    description: "A magical forest that glows with ethereal light.",
    difficulty: 2,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 150, experience: 300 }
  },
  {
    id: 6,
    name: "Root Labyrinth",
    zone: 'forest',
    description: "Navigate the massive root systems of the World Tree.",
    difficulty: 3,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 175, experience: 350 }
  },
  {
    id: 7,
    name: "Ember Fields",
    zone: 'volcanic',
    description: "Cross the smoldering plains where fire meets earth.",
    difficulty: 3,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 200, experience: 400 }
  },
  {
    id: 8,
    name: "Lava Rapids",
    zone: 'volcanic',
    description: "Race alongside rivers of molten rock.",
    difficulty: 3,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 225, experience: 450 }
  },
  {
    id: 9,
    name: "Obsidian Peaks",
    zone: 'volcanic',
    description: "Climb the glass mountains under ash-filled skies.",
    difficulty: 4,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 250, experience: 500 }
  },
  {
    id: 10,
    name: "Spirit Falls",
    zone: 'mystical',
    description: "Discover the waterfalls where spirits gather.",
    difficulty: 3,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 275, experience: 550 }
  },
  {
    id: 11,
    name: "Crystal Caverns",
    zone: 'mystical',
    description: "Explore caves filled with singing crystals.",
    difficulty: 4,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 300, experience: 600 }
  },
  {
    id: 12,
    name: "Floating Islands",
    zone: 'mystical',
    description: "Race across islands that drift in the sky.",
    difficulty: 4,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 325, experience: 650 }
  },
  {
    id: 13,
    name: "Frost Valley",
    zone: 'ice',
    description: "Enter the frozen lands where ice sculptures come alive.",
    difficulty: 4,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 350, experience: 700 }
  },
  {
    id: 14,
    name: "Aurora Path",
    zone: 'ice',
    description: "Follow the dancing lights across frozen lakes.",
    difficulty: 4,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 375, experience: 750 }
  },
  {
    id: 15,
    name: "Glacier Run",
    zone: 'ice',
    description: "Navigate treacherous ice formations at high speed.",
    difficulty: 5,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 400, experience: 800 }
  },
  {
    id: 16,
    name: "Golden Dunes",
    zone: 'desert',
    description: "Race across endless waves of golden sand.",
    difficulty: 4,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 425, experience: 850 }
  },
  {
    id: 17,
    name: "Oasis Temple",
    zone: 'desert',
    description: "Discover the hidden temple in the heart of the desert.",
    difficulty: 4,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 450, experience: 900 }
  },
  {
    id: 18,
    name: "Sandstorm Valley",
    zone: 'desert',
    description: "Battle through fierce sandstorms to reach the end.",
    difficulty: 5,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 475, experience: 950 }
  },
  {
    id: 19,
    name: "Ancient Ruins",
    zone: 'mystical',
    description: "The final trial before the ultimate challenge.",
    difficulty: 5,
    isLocked: true,
    isCompleted: false,
    requiresPayment: false,
    rewards: { coins: 500, experience: 1000 }
  },
  {
    id: 20,
    name: "The Nexus",
    zone: 'mystical',
    description: "Where all paths converge. The ultimate destination awaits.",
    difficulty: 5,
    isLocked: true,
    isCompleted: false,
    requiresPayment: true,
    rewards: { coins: 1000, experience: 2000 }
  }
];

export const getZoneColor = (zone: string): string => {
  const colors: Record<string, string> = {
    ocean: 'zone-ocean',
    forest: 'zone-forest',
    volcanic: 'zone-volcanic',
    mystical: 'zone-mystical',
    ice: 'bg-ice',
    desert: 'bg-desert',
  };
  return colors[zone] || 'zone-ocean';
};

export const getZoneIcon = (zone: string): string => {
  const icons: Record<string, string> = {
    ocean: '🌊',
    forest: '🌳',
    volcanic: '🌋',
    mystical: '✨',
    ice: '❄️',
    desert: '🏜️',
  };
  return icons[zone] || '🌍';
};
