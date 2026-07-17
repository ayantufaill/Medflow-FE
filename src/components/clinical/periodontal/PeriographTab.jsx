import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const getToothImage = (num) => {
  if (num >= 1 && num <= 16) {
    return new URL(`../../../assets/Teeth icons/u-${num}.png`, import.meta.url).href;
  }
  return new URL(`../../../assets/Teeth icons/d-${num}.png`, import.meta.url).href;
};

// SVG Overlay for plotting data points
const GraphLines = ({ teeth, chartData, missingTeeth, side, isUpper }) => {
  // Height of the graph area is let's say 140px. 
  // We need to map -20 to 40. Total range = 60 units.
  // Let's use 100px for the 60 units to keep it proportional, or just use percentages.
  // 40 to -20 is 60 units. 
  // For Maxilla (isUpper=true): Y=0 is at the top (value 40). Y=100% is at the bottom (value -20).
  // Baseline (0) is at 40/60 = 66.67% from the top.
  // For Mandible (isUpper=false): Y=0 is at the top (value -20). Y=100% is at the bottom (value 40).
  // Baseline (0) is at 20/60 = 33.33% from the top.

  const columns = 48; // 16 teeth * 3 points
  const colWidth = 100 / columns;

  const points = [];

  teeth.forEach((toothNum, toothIndex) => {
    if (missingTeeth.includes(toothNum)) return; // Skip missing teeth

    const data = chartData[toothNum]?.[side];
    if (!data) return;

    const probeValues = data.probe || ['', '', ''];

    for (let i = 0; i < 3; i++) {
      const probeStr = probeValues[i];
      let probeVal = 0; // Default to 0 if empty
      if (probeStr && probeStr.trim() !== '') {
        probeVal = parseInt(probeStr, 10);
        if (isNaN(probeVal)) probeVal = 0;
      }

      const colIndex = toothIndex * 3 + i;
      const cx = (colIndex + 0.5) * colWidth;

      // Mapping probeVal to Y-coordinate percentage
      let cy;
      if (isUpper) {
        // Range: 40 (top, 0%) to -20 (bottom, 100%)
        // Value V maps to: (40 - V) / 60 * 100
        cy = ((40 - probeVal) / 60) * 100;
      } else {
        // Range: -20 (top, 0%) to 40 (bottom, 100%)
        // Value V maps to: (V - (-20)) / 60 * 100
        cy = ((probeVal + 20) / 60) * 100;
      }

      points.push({
        x: cx,
        y: `${cy}%`,
        colIndex,
        isWarning: probeVal >= 4
      });
    }
  });

  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 10 }}>
      {/* Draw connecting lines */}
      {points.map((pt, i) => {
        if (i === 0) return null;
        const prev = points[i - 1];
        return (
          <line
            key={`line-${i}`}
            x1={`${prev.x}%`} y1={prev.y}
            x2={`${pt.x}%`} y2={pt.y}
            stroke="#F59E0B" // Orange color from screenshot
            strokeWidth={1.5}
          />
        );
      })}

      {/* Draw dots */}
      {points.map((pt, i) => (
        <circle
          key={`pt-${i}`}
          cx={`${pt.x}%`}
          cy={pt.y}
          r={2.5}
          fill="#FFFFFF"
          stroke="#F59E0B"
          strokeWidth={1.5}
        />
      ))}
    </svg>
  );
};

// Reusable row for graph (Facial or Lingual)
// Reusable row for graph
const GraphRow = ({ teeth, chartData, missingTeeth, isUpper, side }) => {
  // Y-axis grid lines. For Maxilla: 40 down to -20. For Mandible: -20 up to 40.
  const yValues = isUpper ? [40, 30, 20, 10, 0, -10, -20] : [-20, -10, 0, 10, 20, 30, 40];

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      {/* Y-Axis Labels & Grid */}
      <Box sx={{ width: '40px', flexShrink: 0, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pr: 1 }}>
        {yValues.map(val => (
          <Typography key={val} sx={{ fontSize: '10px', color: '#64748B', textAlign: 'right', transform: 'translateY(-50%)', lineHeight: 1 }}>
            {val}
          </Typography>
        ))}
      </Box>

      {/* Main Graph Area */}
      <Box sx={{ flex: 1, position: 'relative', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>

        {/* Horizontal Grid Lines */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 1 }}>
          {yValues.map(val => (
            <Box
              key={val}
              sx={{
                width: '100%',
                height: 0,
                borderTop: val === 0 ? '1px solid #94A3B8' : '1px dashed #93C5FD',
                opacity: val === 0 ? 1 : 0.6
              }}
            />
          ))}
        </Box>

        {/* Teeth Images */}
        <Box sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '5%',
          bottom: '5%',
          display: 'flex',
          zIndex: 5
        }}>
          {teeth.map(num => {
            const isMissing = missingTeeth.includes(num);
            return (
              <Box key={num} sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  src={getToothImage(num)}
                  alt={`Tooth ${num}`}
                  style={{
                    height: '100%',
                    objectFit: 'contain',
                    opacity: isMissing ? 0.3 : 1,
                    transform: 'scale(1.8)',
                    transformOrigin: 'center'
                  }}
                />
              </Box>
            );
          })}
        </Box>

        {/* Graph Overlay */}
        <GraphLines teeth={teeth} chartData={chartData} missingTeeth={missingTeeth} side={side} isUpper={isUpper} />
      </Box>
    </Box>
  );
};

// Container for a complete arch (Maxilla or Mandible)
const ArchContainer = ({ title, teeth, chartData, missingTeeth, isUpper }) => {
  return (
    <Box sx={{ display: 'flex', mb: 6, bgcolor: '#F8FAFC', p: 2, borderRadius: '8px', border: '1px solid #E2E8F0' }}>

      {/* Left Sidebar Label (MAXILLA / MANDIBLE) */}
      <Box sx={{ width: '40px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography sx={{
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          fontSize: '13px',
          fontWeight: 700,
          color: '#0F172A',
          letterSpacing: '4px'
        }}>
          {title}
        </Typography>
      </Box>

      {/* Main Column */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {isUpper ? (
          <>
            {/* Single Graph Row */}
            <Box sx={{ height: '100px' }}>
              <GraphRow teeth={teeth} chartData={chartData} missingTeeth={missingTeeth} isUpper={isUpper} side="facial" />
            </Box>
            {/* Tooth Numbers (Below for Maxilla) */}
            <Box sx={{ display: 'flex', ml: '40px', pt: 7, pb: 0 }}>
              {teeth.map(num => {
                const isMissing = missingTeeth.includes(num);
                return (
                  <Typography key={num} sx={{ flex: 1, textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#334155', opacity: isMissing ? 0.3 : 1 }}>
                    {num}
                  </Typography>
                );
              })}
            </Box>
          </>
        ) : (
          <>
            {/* Tooth Numbers (Above for Mandible) */}
            <Box sx={{ display: 'flex', ml: '40px', pt: 0, pb: 7 }}>
              {teeth.map(num => {
                const isMissing = missingTeeth.includes(num);
                return (
                  <Typography key={num} sx={{ flex: 1, textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#334155', opacity: isMissing ? 0.3 : 1 }}>
                    {num}
                  </Typography>
                );
              })}
            </Box>
            {/* Single Graph Row */}
            <Box sx={{ height: '100px' }}>
              <GraphRow teeth={teeth} chartData={chartData} missingTeeth={missingTeeth} isUpper={isUpper} side="facial" />
            </Box>
          </>
        )}

      </Box>
    </Box>
  );
};

const PeriographTab = ({ chartData, missingTeeth }) => {
  const upperTeeth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const lowerTeeth = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <ArchContainer title="MAXILLA" teeth={upperTeeth} chartData={chartData} missingTeeth={missingTeeth} isUpper={true} />
      <ArchContainer title="MANDIBLE" teeth={lowerTeeth} chartData={chartData} missingTeeth={missingTeeth} isUpper={false} />
    </Box>
  );
};

export default PeriographTab;
