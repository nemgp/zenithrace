import { useState, useEffect, useMemo } from 'react';

export interface PathPoint {
    lat: number;
    lon: number;
    timestamp: number;
    accuracy: number;
    speed: number;
}

export interface DailyStats {
    distance: number;
    duration: number;
    steps: number;
    calories: number;
    avgSpeed: number;
}

// Calculer la distance entre deux points GPS (formule de Haversine)
const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Vérifier si un point doit être ajouté (déplacement > 10m)
const shouldAddPoint = (lastPoint: PathPoint | undefined, newPoint: PathPoint): boolean => {
    if (!lastPoint) return true;

    const distance = haversineDistance(
        lastPoint.lat,
        lastPoint.lon,
        newPoint.lat,
        newPoint.lon
    );

    return distance > 0.01; // 10 mètres
};

export const useGeolocationTracking = () => {
    const [currentPosition, setCurrentPosition] = useState<PathPoint | null>(null);
    const [dailyPath, setDailyPath] = useState<PathPoint[]>([]);
    const [isTracking, setIsTracking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Charger le trajet du jour depuis localStorage
    useEffect(() => {
        const today = new Date().toDateString();
        const stored = localStorage.getItem(`journey_${today}`);
        if (stored) {
            try {
                setDailyPath(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse stored journey', e);
            }
        }
    }, []);

    // Suivre la position en temps réel
    useEffect(() => {
        if (!isTracking) return;

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const newPoint: PathPoint = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    timestamp: Date.now(),
                    accuracy: position.coords.accuracy,
                    speed: position.coords.speed || 0,
                };

                setCurrentPosition(newPoint);
                setError(null);

                // Ajouter au trajet si déplacement significatif (> 10m)
                if (shouldAddPoint(dailyPath[dailyPath.length - 1], newPoint)) {
                    const updated = [...dailyPath, newPoint];
                    setDailyPath(updated);

                    // Sauvegarder dans localStorage
                    const today = new Date().toDateString();
                    localStorage.setItem(`journey_${today}`, JSON.stringify(updated));
                }
            },
            (err) => {
                setError(err.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [isTracking, dailyPath]);

    // Calculer les statistiques du jour
    const stats: DailyStats | null = useMemo(() => {
        if (dailyPath.length < 2) return null;

        let totalDistance = 0;
        let totalDuration = 0;

        for (let i = 1; i < dailyPath.length; i++) {
            const dist = haversineDistance(
                dailyPath[i - 1].lat,
                dailyPath[i - 1].lon,
                dailyPath[i].lat,
                dailyPath[i].lon
            );
            totalDistance += dist;
            totalDuration += dailyPath[i].timestamp - dailyPath[i - 1].timestamp;
        }

        return {
            distance: totalDistance,
            duration: totalDuration,
            steps: Math.round(totalDistance * 1312), // ~1312 pas/km
            calories: Math.round(totalDistance * 60), // ~60 cal/km
            avgSpeed: totalDistance / (totalDuration / 3600000), // km/h
        };
    }, [dailyPath]);

    return {
        currentPosition,
        dailyPath,
        stats,
        isTracking,
        error,
        startTracking: () => setIsTracking(true),
        stopTracking: () => setIsTracking(false),
    };
};
