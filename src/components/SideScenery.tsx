import { useEffect, useState, useRef } from 'react';
import { Building } from './Building';

interface SideSceneryProps {
    zone: string;
    speed: number;
}

interface SceneryItem {
    id: number;
    side: -1 | 1; // -1 for left, 1 for right
    z: number; // Distance from camera (0 to 1000)
    type: string;
    offset: number; // Lateral offset from road center
    isBuilding?: boolean;
    buildingHeight?: number;
    buildingWidth?: number;
    buildingColor?: string;
}

const zoneScenery: Record<string, string[]> = {
    ocean: ['🏝️', '⛵', '🌊', '🌴'],
    forest: ['🌲', '🌳', '⛺', '🦌'],
    volcanic: ['🌋', '🪨', '🔥', '🐲'],
    mystical: ['🏰', '🔮', '🦄', '🌌'],
    ice: ['🏔️', '☃️', '🌨️', '🧊'],
    desert: ['🏜️', '🐫', '🏺', '🌞'],
};

const cityScenery = ['🏢', '🏫', '🏥', '🏪', '🌳', '🚏', '🚕'];

const buildingColors = [
    '#1e3a8a', // blue-900
    '#1e40af', // blue-800
    '#0f766e', // teal-700
    '#0d9488', // teal-600
    '#374151', // gray-700
    '#4b5563', // gray-600
    '#0891b2', // cyan-600
    '#0e7490', // cyan-700
];

// World constants
const DRAW_DISTANCE = 2000;
const INITIAL_OFFSET = 800; // How far from center objects spawn
const CAMERA_HEIGHT = 1000;

export function SideScenery({ zone, speed }: SideSceneryProps) {
    const [items, setItems] = useState<SceneryItem[]>([]);
    const frameRef = useRef<number>();
    const lastSpawnRef = useRef(0);
    const idRef = useRef(0);

    useEffect(() => {
        const loop = () => {
            const now = Date.now();

            // Spawn logic
            // Constant spawn rate based on distance traveled essentially
            const baseSpawnRate = Math.max(50, 400 - (speed * 20));

            if (now - lastSpawnRef.current > baseSpawnRate) {
                const side = Math.random() > 0.5 ? 1 : -1;

                // 70% chance of building, 30% chance of emoji decoration
                const isBuilding = Math.random() > 0.3;

                let newItem: SceneryItem;

                if (isBuilding) {
                    newItem = {
                        id: idRef.current++,
                        side,
                        z: DRAW_DISTANCE,
                        type: 'building',
                        offset: INITIAL_OFFSET + (Math.random() * 200),
                        isBuilding: true,
                        buildingHeight: 80 + Math.random() * 120, // 80-200px
                        buildingWidth: 40 + Math.random() * 40, // 40-80px
                        buildingColor: buildingColors[Math.floor(Math.random() * buildingColors.length)]
                    };
                } else {
                    const deck = zoneScenery[zone] || cityScenery;
                    const type = deck[Math.floor(Math.random() * deck.length)];
                    newItem = {
                        id: idRef.current++,
                        side,
                        z: DRAW_DISTANCE,
                        type,
                        offset: INITIAL_OFFSET + (Math.random() * 500),
                        isBuilding: false
                    };
                }

                setItems(prev => [...prev, newItem]);
                lastSpawnRef.current = now;
            }

            // Move logic
            setItems(prev => {
                return prev
                    .map(item => ({ ...item, z: item.z - (speed * 10) })) // Move towards camera
                    .filter(item => item.z > 10); // Cull behind camera
            });

            frameRef.current = requestAnimationFrame(loop);
        };

        frameRef.current = requestAnimationFrame(loop);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [zone, speed]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
            {items.map(item => {
                // Projection Math
                const perspective = 300;
                const scale = perspective / (perspective + item.z);

                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                const x = centerX + (item.side * item.offset * scale);

                const horizonY = window.innerHeight * 0.4;
                const curvature = Math.pow(item.z, 2) * 0.0002;
                const y = horizonY + (CAMERA_HEIGHT * scale) + curvature;

                const zIndex = Math.floor(DRAW_DISTANCE - item.z);
                const opacity = Math.min(1, (DRAW_DISTANCE - item.z) / 500);

                if (item.isBuilding && item.buildingHeight && item.buildingWidth && item.buildingColor) {
                    return (
                        <Building
                            key={item.id}
                            height={item.buildingHeight}
                            width={item.buildingWidth}
                            color={item.buildingColor}
                            x={x}
                            y={y}
                            scale={scale}
                            zIndex={zIndex}
                        />
                    );
                }

                return (
                    <div
                        key={item.id}
                        className="absolute text-4xl transform -translate-x-1/2 -translate-y-[100%]"
                        style={{
                            left: x,
                            top: y,
                            fontSize: `${40 * scale}px`,
                            zIndex,
                            opacity,
                            transform: `translateX(-50%) translateY(-100%) rotate(${item.side * 10}deg)`
                        }}
                    >
                        {item.type}
                    </div>
                );
            })}
        </div>
    );
}
