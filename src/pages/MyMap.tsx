import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Locate } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface MyMapProps {
    onBack: () => void;
}

// Component to handle map center updates
function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export function MyMap({ onBack }: MyMapProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [path, setPath] = useState<[number, number][]>([]);
    const [error, setError] = useState<string | null>(null);

    // Initial mock history to demonstrate "path throughout the day"
    // Spawns a path near the user's location once found
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);

                    // Generate a mock "morning path" leading to current location
                    const mockPath: [number, number][] = [];
                    for (let i = 20; i > 0; i--) {
                        mockPath.push([
                            latitude - (i * 0.001) + (Math.random() * 0.0005),
                            longitude - (i * 0.001) + (Math.random() * 0.0005)
                        ]);
                    }
                    mockPath.push([latitude, longitude]);
                    setPath(mockPath);
                },
                (err) => {
                    setError("Unable to retrieve your location. Please allow location access.");
                    // Default location (Rome Coliseum for flavor) if blocked
                    setPosition([41.8902, 12.4922]);
                }
            );

            // Watch position for live updates
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                    setPosition(newPos);
                    setPath(prev => [...prev, newPos]);
                },
                (err) => console.error(err),
                { enableHighAccuracy: true }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);

    return (
        <div className="relative min-h-screen bg-background">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-[1000] p-4 bg-background/80 backdrop-blur-sm border-b">
                <div className="container mx-auto flex items-center justify-between">
                    <Button variant="ghost" onClick={onBack} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <h1 className="text-xl font-bold font-display">My Daily Path</h1>
                    <div className="w-20" /> {/* Spacer */}
                </div>
            </header>

            {/* Map */}
            <div className="absolute inset-0 top-16 z-0">
                {position ? (
                    <MapContainer
                        center={position}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <MapUpdater center={position} />

                        <Marker position={position}>
                            <Popup>
                                You are here! <br /> Tracking your daily steps.
                            </Popup>
                        </Marker>

                        <Polyline
                            positions={path}
                            pathOptions={{ color: '#06b6d4', weight: 5, opacity: 0.7 }}
                        />
                    </MapContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center p-8">
                            {error ? (
                                <p className="text-destructive mb-4">{error}</p>
                            ) : (
                                <div className="animate-pulse flex flex-col items-center">
                                    <Locate className="w-12 h-12 text-primary mb-4 animate-spin-slow" />
                                    <p className="text-muted-foreground">Locating you...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay Info */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] glass-card px-6 py-4 flex gap-8">
                <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{path.length * 15}</div>
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Simulated Steps</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{(path.length * 0.01).toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Km Traveled</div>
                </div>
            </div>
        </div>
    );
}
