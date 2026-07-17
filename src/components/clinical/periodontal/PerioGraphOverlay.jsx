import React from 'react';
import { Box } from '@mui/material';

const PerioGraphOverlay = ({ teeth, chartData, missingTeeth, isUpper, side = 'facial' }) => {
  // We have 16 teeth per arch. Each tooth has 3 columns (distal, mid, mesial). Total = 48 columns.
  const columns = 48;
  const colWidth = 100 / columns;

  const points = [];

  // TeethImageRow height is 80px.
  // Upper Teeth: Roots are pointing up (y=0). Crowns are pointing down (y=80). Baseline near crown.
  // Lower Teeth: Roots are pointing down (y=80). Crowns are pointing up (y=0). Baseline near crown.
  const baseline = isUpper ? 60 : 20; 
  const scale = 3.5; // 1mm = 3.5px offset

  teeth.forEach((toothNum, toothIndex) => {
    const isMissing = missingTeeth.includes(toothNum);
    
    // We still want to draw the line points even if the tooth is missing, 
    // so we don't return early here anymore.

    const data = chartData[toothNum]?.[side];
    if (!data) return;

    const probeValues = data.probe || ['', '', ''];
    const pcsValues = data.pcs || [];
    const bleedingValues = data.bleeding || [];

    // Distal, mid, mesial
    for (let i = 0; i < 3; i++) {
      const probeStr = probeValues[i];
      if (!probeStr || probeStr.trim() === '') continue;

      const probeVal = parseInt(probeStr, 10);
      if (isNaN(probeVal)) continue;

      const colIndex = toothIndex * 3 + i;
      const cx = (colIndex + 0.5) * colWidth; // Center of the column in percentage

      // Y-coordinate mapping:
      // Upper: larger probe depth -> goes into the root (UPwards, smaller Y)
      // Lower: larger probe depth -> goes into the root (DOWNwards, larger Y)
      const cy = isUpper ? baseline - probeVal * scale : baseline + probeVal * scale;

      const isWarning = probeVal >= 4; // Threshold for red line

      const hasBleeding = bleedingValues.includes(i);
      const hasPCS = pcsValues.includes(i);

      points.push({
        x: cx,
        y: cy,
        colIndex,
        isWarning,
        probeVal,
        hasBleeding,
        hasPCS
      });
    }
  });

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <style>
        {`
          @keyframes point-blink {
            0% { opacity: 1; stroke-width: 1.5px; }
            50% { opacity: 0.5; stroke-width: 6px; }
            100% { opacity: 1; stroke-width: 1.5px; }
          }
          .perio-point-group {
            pointer-events: auto;
            cursor: pointer;
          }
          .perio-point-group:hover .perio-point {
            animation: point-blink 0.8s infinite ease-in-out;
          }
        `}
      </style>
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        
        {/* Draw the baseline reference line */}
        <line x1="0%" y1={baseline} x2="100%" y2={baseline} stroke="#CBD5E1" strokeWidth={1} />

        {/* Draw lines between consecutive points */}
        {points.map((pt, i) => {
          if (i === 0) return null;
          const prev = points[i - 1];
          // We want the line to connect across missing teeth, so we don't return null here.
          
          const isRed = pt.isWarning || prev.isWarning;
          return (
            <line 
              key={`line-${i}`}
              x1={`${prev.x}%`} 
              y1={prev.y} 
              x2={`${pt.x}%`} 
              y2={pt.y} 
              stroke={isRed ? "#EF4444" : "#1E293B"} 
              strokeWidth={1.5}
            />
          );
        })}

        {/* Draw markers and clinical indicators */}
        {points.map((pt, i) => (
          <g key={`pt-${i}`}>
            {/* Draw indicator squares (below baseline for upper, above baseline for lower) */}
            {pt.hasPCS && (
               <rect 
                 x={`calc(${pt.x}% - 3px)`} 
                 y={isUpper ? baseline + 1 : baseline - 7} 
                 width={6} height={6} fill="#FDE047" 
               />
            )}
            {pt.hasBleeding && (
               <rect 
                 x={`calc(${pt.x}% - 3px)`} 
                 y={isUpper ? baseline + (pt.hasPCS ? 8 : 1) : baseline - (pt.hasPCS ? 14 : 7)} 
                 width={6} height={6} fill="#38BDF8" 
               />
            )}

            {/* Draw Data Dot with Hitbox for Hover */}
            <g className="perio-point-group">
              <circle 
                className="perio-point"
                cx={`${pt.x}%`} 
                cy={pt.y} 
                r={2.5} 
                fill="#FFFFFF" 
                stroke={pt.isWarning ? "#EF4444" : "#1E293B"} 
                strokeWidth={1.5} 
              />
              {/* Invisible Hitbox for easier hovering */}
              <circle cx={`${pt.x}%`} cy={pt.y} r={10} fill="transparent" />
            </g>
          </g>
        ))}
      </svg>
    </Box>
  );
};

export default PerioGraphOverlay;
