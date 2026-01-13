interface BuildingProps {
    height: number;
    width: number;
    color: string;
    x: number;
    y: number;
    scale: number;
    zIndex: number;
}

export function Building({ height, width, color, x, y, scale, zIndex }: BuildingProps) {
    const actualHeight = height * scale;
    const actualWidth = width * scale;

    return (
        <div
            className="absolute"
            style={{
                left: x,
                top: y,
                transform: 'translateX(-50%)',
                zIndex
            }}
        >
            {/* Building body */}
            <div
                className="relative"
                style={{
                    width: `${actualWidth}px`,
                    height: `${actualHeight}px`,
                    background: `linear-gradient(135deg, ${color} 0%, ${adjustBrightness(color, -20)} 100%)`,
                    boxShadow: `
            inset -2px 0 10px rgba(0,0,0,0.3),
            0 ${actualHeight * 0.1}px ${actualHeight * 0.2}px rgba(0,0,0,0.4)
          `,
                    borderRadius: '2px 2px 0 0'
                }}
            >
                {/* Windows */}
                <div className="absolute inset-0 grid grid-cols-3 gap-1 p-1">
                    {Array.from({ length: Math.floor(actualHeight / 20) * 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-yellow-300/80"
                            style={{
                                width: '100%',
                                height: `${Math.min(15, actualHeight / 10)}px`,
                                boxShadow: '0 0 5px rgba(255, 215, 0, 0.6)',
                                opacity: Math.random() > 0.3 ? 0.9 : 0.3
                            }}
                        />
                    ))}
                </div>

                {/* Roof */}
                <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2"
                    style={{
                        width: `${actualWidth * 1.1}px`,
                        height: '8px',
                        background: `linear-gradient(to bottom, ${adjustBrightness(color, 30)}, ${color})`,
                        boxShadow: '0 -2px 5px rgba(0,0,0,0.3)'
                    }}
                />

                {/* Antenna */}
                {Math.random() > 0.7 && (
                    <div
                        className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 bg-gray-400"
                        style={{ height: `${20 * scale}px` }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper function to adjust color brightness
function adjustBrightness(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}
