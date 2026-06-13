import { useEffect, useState } from "react";

interface GaugeProps {
  score: number;
  duration?: number;
}

export default function Gauge({ score, duration = 1500 }: GaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentNumber = Math.floor(progress * score);
      setAnimatedScore(currentNumber);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score, duration]);

  // Dash calculations for simple semi-circle (dasharray 440)
  const percent = score;
  const dashArray = 440;
  const offset = dashArray - (dashArray * (percent / 100));

  // Determine semantic color based on score
  let strokeColor = "#405a45"; // Olive-ish Authentic Green
  if (score >= 70) {
    strokeColor = "#8a3324"; // Terra Cotta Alert Red
  } else if (score >= 40) {
    strokeColor = "#a88434"; // Ochre Suspicious Yellow
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-[280px] h-[140px] overflow-hidden select-none">
      <svg viewBox="0 0 300 150" className="w-full h-full">
        {/* Background track */}
        <path
          className="fill-none stroke-[24] stroke-surface-container"
          d="M30,140 A120,120 0 0,1 270,140"
        />
        {/* Fill track */}
        <path
          className="fill-none stroke-[24] stroke-linecap-round transition-all duration-1000 ease-out"
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: isNaN(offset) ? dashArray : offset,
            stroke: strokeColor,
          }}
          d="M30,140 A120,120 0 0,1 270,140"
        />
      </svg>
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center">
        <span 
          style={{ color: strokeColor }}
          className="font-display serif text-6xl font-normal leading-none"
        >
          {animatedScore}%
        </span>
        <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mt-2 opacity-75">
          신뢰도 정량분석
        </span>
      </div>
    </div>
  );
}
