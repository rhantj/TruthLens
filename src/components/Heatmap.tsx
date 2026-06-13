import { useState } from "react";

interface Hotspot {
  x: number;
  y: number;
  radius: number;
  reason: string;
}

interface HeatmapProps {
  imageUrl: string;
  hotspots?: Hotspot[];
}

export default function Heatmap({ imageUrl, hotspots = [] }: HeatmapProps) {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow rounded-lg overflow-hidden border border-outline-variant/30 select-none bg-black min-h-[300px]">
        {/* Moving scanning line */}
        <div className="scanning-anim absolute left-0 w-full z-20 pointer-events-none" />

        {/* Real base forensic image */}
        <img
          src={imageUrl}
          alt="Forensic Scan Base"
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />

        {/* Diagnostic heatmap overlay with red/yellow blur regions */}
        <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay z-10 pointer-events-none" />

        {/* Dynamic heatmap spots based on analysis coordinates */}
        {hotspots.map((spot, index) => {
          // Cycle colors between alert and warning based on coordinate structure
          const isHigh = spot.x % 2 === 0;
          return (
            <div
              key={index}
              style={{
                top: `${spot.y}%`,
                left: `${spot.x}%`,
                width: `${spot.radius * 2}px`,
                height: `${spot.radius * 2}px`,
                transform: "translate(-50%, -50%)",
              }}
              className={`absolute rounded-full blur-xl animate-pulse z-10 pointer-events-none ${
                isHigh ? "bg-alert-red/35" : "bg-suspicious-yellow/30"
              }`}
            />
          );
        })}

        {/* Interactive interactive markers */}
        {hotspots.map((spot, index) => {
          return (
            <button
              key={index}
              style={{
                top: `${spot.y}%`,
                left: `${spot.x}%`,
              }}
              onClick={() => setActiveHotspot(spot)}
              onMouseEnter={() => setActiveHotspot(spot)}
              onMouseLeave={() => setActiveHotspot(null)}
              className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group z-30 focus:outline-none"
            >
              <span className="absolute inline-flex h-full w-full rounded-full bg-electric-blue/40 animate-ping" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-electric-blue border-2 border-white" />
            </button>
          );
        })}

        {/* Hover/Click detailed bubble */}
        {activeHotspot && (
          <div className="absolute bottom-4 left-4 right-4 bg-deep-navy/90 border border-white/10 text-white rounded p-3 text-xs z-40 backdrop-blur-md">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-electric-blue">
              <span className="material-symbols-outlined text-xs">radar</span>
              <span>특이 구역 탐지 (x: {activeHotspot.x}%, y: {activeHotspot.y}%)</span>
            </div>
            <p className="text-gray-200">{activeHotspot.reason}</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-between items-center text-xs">
        <span className="font-mono text-on-surface-variant font-medium">
          역역 스캔 v4.5 • AI Filter Engine
        </span>
        <span className="text-gray-400">마커를 눌러 상세 정보를 확인하세요</span>
      </div>
    </div>
  );
}
