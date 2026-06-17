import React from 'react';
import { Box } from '@mui/material';

// --- Custom SVG Tooth Icons for Headers ---
export const HeaderTooth = ({ variant }) => {
  const colors = {
    plain: "#fff",
    filled: "#f3e5ab",
    sealant: "#4db6ac",
    crown: "#e0e0e0"
  };
  
  return (
    <Box sx={{ 
      width: 22, height: 22, border: '1px solid #999', borderRadius: '4px',
      bgcolor: colors[variant] || '#fff', position: 'relative', overflow: 'hidden'
    }}>
      {variant === 'sealant' && (
        <Box sx={{ position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', border: '2px solid #00796b', borderRadius: '50%' }} />
      )}
      {variant === 'filled' && (
        <Box sx={{ position: 'absolute', top: '25%', left: '25%', width: '50%', height: '50%', bgcolor: '#bca67a', borderRadius: '2px' }} />
      )}
    </Box>
  );
};

// --- Custom Tooth/Clinical Icons ---
export const EndoToothIcon = ({ filled = false }) => (
  <Box sx={{ 
    width: 28, height: 28, border: '1px solid #ccc', borderRadius: 1, 
    position: 'relative', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', bgcolor: filled ? '#fff' : '#ddd', cursor: 'pointer' 
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1">
      <path d="M7 3C4 3 3 6 3 9C3 13 5 21 8 21C10 21 11 19 12 19C13 19 14 21 16 21C19 21 21 13 21 9C21 6 20 3 18 3C15 3 13 4 12 5C11 4 9 3 7 3Z" />
      {filled && <circle cx="15" cy="7" r="3" fill="black" />}
    </svg>
  </Box>
);

export const PerioToolIcon = ({ color }) => (
  <Box sx={{ width: 4, height: 16, bgcolor: color, borderRadius: '2px', border: '1px solid rgba(0,0,0,0.1)' }} />
);

// --- Improved Tooth Icons based on the new screenshot ---
export const RestorationToothIcon = ({ type = "molar", fill = "white", status = "none", sx = {} }) => {
  const isMolar = type === "molar";
  
  return (
    <Box sx={{ 
      width: 32, height: 32, position: 'relative', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...sx 
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24">
        {/* Basic Tooth Shape */}
        <path 
          d={isMolar 
            ? "M6 4C4 4 3 6 3 9C3 13 5 20 8 20C10 20 11 18 12 18C13 18 14 20 16 20C19 20 21 13 21 9C21 6 20 4 18 4H6Z" 
            : "M8 4C6 4 5 6 5 9C5 13 7 20 12 20C17 20 19 13 19 9C19 6 18 4 16 4H8Z"
          } 
          fill={fill} 
          stroke="#555" 
          strokeWidth="1"
        />
        {/* Fill Details for Restorations */}
        {status === 'occlusal' && <path d="M8 8 Q12 11 16 8 Q12 6 8 8" fill="rgba(0,0,0,0.2)" />}
        {status === 'gold' && <path d="M6 5 L18 5 L17 10 L7 10 Z" fill="#FFD700" />}
        {status === 'forbidden' && (
          <g stroke="red" strokeWidth="1.5">
            <circle cx="12" cy="11" r="7" fill="none" />
            <line x1="7" y1="6" x2="17" y2="16" />
          </g>
        )}
      </svg>
    </Box>
  );
};

// --- Custom Clinical Icons for Header ---
export const DentureIcon = ({ color }) => (
  <Box sx={{ 
    width: 22, height: 18, bgcolor: color, borderRadius: '10px 10px 2px 2px',
    border: '1px solid rgba(0,0,0,0.2)', position: 'relative',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  }}>
    <Box sx={{ width: '70%', height: '2px', bgcolor: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
  </Box>
);

export const ImplantIcon = () => (
  <Box sx={{ width: 12, height: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Box sx={{ width: 10, height: 4, bgcolor: '#999', borderRadius: '1px' }} />
    <Box sx={{ width: 6, height: 12, bgcolor: '#bbb', mt: '1px', clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)' }} />
  </Box>
);

export const BridgeIcon = ({ variant }) => (
  <Box sx={{ 
    width: 28, height: 18, position: 'relative', display: 'flex', 
    justifyContent: 'space-between', opacity: variant === 'outline' ? 0.4 : 1 
  }}>
    <Box sx={{ width: 8, height: 12, border: '1px solid #333', borderRadius: '2px', bgcolor: '#fff' }} />
    <Box sx={{ position: 'absolute', top: 0, left: '20%', width: '60%', height: '2px', bgcolor: '#333' }} />
    <Box sx={{ width: 8, height: 12, border: '1px solid #333', borderRadius: '2px', bgcolor: '#fff' }} />
  </Box>
);

// --- Surgical Instrument Icons ---
export const ScalpelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
    <path d="M12 2L15 5L12 8L9 5L12 2Z" fill="#ccc" />
    <path d="M12 8V22" />
    <path d="M9 12H15" />
  </svg>
);

export const HemostatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
    <path d="M7 2C7 2 5 4 5 7C5 10 7 12 7 12V22" />
    <path d="M17 2C17 2 19 4 19 7C19 10 17 12 17 12V22" />
    <circle cx="7" cy="22" r="1.5" fill="#666" />
    <circle cx="17" cy="22" r="1.5" fill="#666" />
    <path d="M7 15C7 15 9 17 12 17C15 17 17 15 17 15" />
  </svg>
);

export const BracesIcon = () => (
  <Box sx={{ 
    width: 24, height: 18, border: '1px solid #999', borderRadius: '3px',
    bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 0.3
  }}>
    <Box sx={{ width: '100%', height: '2px', bgcolor: '#555', position: 'relative' }}>
      {[2, 8, 14, 20].map((left) => (
        <Box key={left} sx={{ 
          position: 'absolute', top: -3, left, width: 4, height: 8, 
          bgcolor: '#90caf9', border: '1px solid #1976d2', borderRadius: '1px' 
        }} />
      ))}
    </Box>
  </Box>
);
