import { useEffect, useState, useRef } from 'react';

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
                const deck = zoneScenery[zone] || cityScenery;
                const type = deck[Math.floor(Math.random() * deck.length)];

                const newItem: SceneryItem = {
                    id: idRef.current++,
                    side,
                    z: DRAW_DISTANCE,
                    type,
                    offset: INITIAL_OFFSET + (Math.random() * 500), // Vary spacing slightly
                };

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
                // scale = focus / (focus + z) ? or standard perspective 1 / z
                // 3D Projection: x = xWorld / z, y = yWorld / z

                const perspective = 300;
                const scale = perspective / (perspective + item.z); // Scale gets bigger as Z gets smaller (closer)

                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                // Pushing items "out" as they get closer (classic arcade racer effect)
                // X position: Center + (Side * Offset * Scale)
                const x = centerX + (item.side * item.offset * scale);

                // Y position: Horizon + (CameraHeight * Scale)
                const horizonY = window.innerHeight * 0.4; // Match road horizon roughly
                const y = horizonY + (CAMERA_HEIGHT * scale);

                return (
                    <div
                        key={item.id}
                        className="absolute text-4xl transform -translate-x-1/2 -translate-y-[100%]"
                        style={{
                            left: x,
                            top: y,
                            fontSize: `${40 * scale}px`, // Scale font size directly
                            zIndex: Math.floor(DRAW_DISTANCE - item.z), // Render back to front
                            opacity: Math.min(1, (DRAW_DISTANCE - item.z) / 500), // Fade in
                        }}
                    >
                        {item.type}
                    </div>
                );
            })}
        </div>
    );
}
