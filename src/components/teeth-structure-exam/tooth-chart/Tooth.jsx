import React from "react";
import { Box, Typography } from "@mui/material";
import { fontWeight } from "../../../constants/styles";

// --- Crown View SVG Component representing the 5 surfaces of a tooth ---
const ToothCrown = ({ num, surfaces = [], depth = 'Limited to enamel', size = 32 }) => {
  let dotRadius = 3.5;
  if (depth === "Into dentin") {
    dotRadius = 6;
  } else if (depth === "Deep into dentin") {
    dotRadius = 8.5;
  }

  const hasSurface = (s) => surfaces.includes(s);

  // Midline anatomical mapping
  const isRightSide = (num >= 1 && num <= 8) || (num >= 25 && num <= 32);
  const leftSurface = isRightSide ? "D" : "M";
  const rightSurface = isRightSide ? "M" : "D";

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5, mb: 0.5 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ pointerEvents: 'none' }}>
        {/* Outer tooth contour */}
        <path 
          d="M 25 25 Q 50 15 75 25 Q 85 50 75 75 Q 50 85 25 75 Q 15 50 25 25 Z" 
          fill="#fafafa" 
          stroke="#555" 
          strokeWidth="2" 
        />
        
        {/* Buccal/Facial (Top Surface) */}
        <path 
          d="M 25 25 Q 50 15 75 25 L 68 38 Q 50 28 32 38 Z" 
          fill="#fff" 
          stroke="#777" 
          strokeWidth="1.5" 
        />
        
        {/* Left Surface (Distal for Right side, Mesial for Left side) */}
        <path 
          d="M 25 25 Q 15 50 25 75 L 32 62 Q 24 50 32 38 Z" 
          fill="#fff" 
          stroke="#777" 
          strokeWidth="1.5" 
        />
        
        {/* Lingual (Bottom Surface) */}
        <path 
          d="M 25 75 Q 50 85 75 75 L 68 62 Q 50 72 32 62 Z" 
          fill="#fff" 
          stroke="#777" 
          strokeWidth="1.5" 
        />
        
        {/* Right Surface (Mesial for Right side, Distal for Left side) */}
        <path 
          d="M 75 25 Q 85 50 75 75 L 68 62 Q 76 50 68 38 Z" 
          fill="#fff" 
          stroke="#777" 
          strokeWidth="1.5" 
        />
        
        {/* Center Surface (Occlusal / Incisal) */}
        <path 
          d="M 32 38 Q 50 28 68 38 Q 76 50 68 62 Q 50 72 32 62 Q 24 50 32 38 Z" 
          fill="#fff" 
          stroke="#777" 
          strokeWidth="1.5" 
        />

        {/* --- Black Dots representing Coronal findings --- */}
        {hasSurface("B/F") && (
          <circle cx="50" cy="28" r={dotRadius} fill="black" />
        )}
        {hasSurface(leftSurface) && (
          <circle cx="28" cy="50" r={dotRadius} fill="black" />
        )}
        {hasSurface("L") && (
          <circle cx="50" cy="72" r={dotRadius} fill="black" />
        )}
        {hasSurface(rightSurface) && (
          <circle cx="72" cy="50" r={dotRadius} fill="black" />
        )}
        {hasSurface("O/I") && (
          <circle cx="50" cy="50" r={dotRadius} fill="black" />
        )}
      </svg>
    </Box>
  );
};

// --- Central Chart Tooth Component with Hover Effects & Scaling ---
const Tooth = ({ 
  num, 
  isActive = false, 
  isMissing = false, 
  hasRadiolucency = false,
  hasWatch = false,
  surfaces = [],
  depth = 'Limited to enamel',
  onClick 
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const isUpper = num >= 1 && num <= 16;

  const renderNumber = () => {
    const hasFindings = surfaces.length > 0 || hasWatch;
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18,
        borderRadius: '50%',
        border: hasFindings ? '1.5px solid #e74c3c' : '1.5px solid transparent',
        mt: 0.3,
        mb: 0.3,
        transition: 'border-color 0.2s'
      }}>
        <Typography 
          sx={{ 
            fontSize: '0.72rem', 
            color: isActive || isHovered || isMissing || hasFindings ? '#1976d2' : '#666', 
            fontWeight: (isActive || isHovered || isMissing || hasFindings) ? fontWeight.bold : fontWeight.regular,
            userSelect: 'none',
            textAlign: 'center',
            lineHeight: 1.1
          }}
        >
          {num}
        </Typography>
      </Box>
    );
  };

  const renderImage = () => {
    if (isMissing) {
      return (
        <Box sx={{ 
          width: 30, 
          height: 60, 
          mt: 0.5, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Typography sx={{ fontSize: '1.25rem', color: '#1976d2', fontWeight: 'bold' }}>X</Typography>
        </Box>
      );
    }

    return (
      <Box 
        component="img" 
        src={`/teeth${num}.png`} 
        alt={`Tooth ${num}`}
        sx={{ 
          width: 30, 
          height: 60, 
          mt: 0.5, 
          opacity: isHovered ? 1 : 0.9,
          filter: isActive || isHovered || hasRadiolucency
            ? 'drop-shadow(0 0 4px #1976d2) brightness(1.15)' 
            : 'none',
          objectFit: 'contain',
          transition: 'all 0.2s ease-in-out'
        }} 
      />
    );
  };

  const renderCrown = () => {
    if (isMissing) return null;
    return <ToothCrown num={num} surfaces={surfaces} depth={depth} />;
  };

  return (
    <Box 
      onClick={onClick}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 0.5,
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, z-index 0.2s',
        transform: hasRadiolucency 
          ? 'scale(1.25)' 
          : (isHovered ? 'scale(1.1)' : 'scale(1)'),
        zIndex: hasRadiolucency ? 10 : (isHovered ? 5 : 'auto'),
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isUpper ? (
        <>
          {renderImage()}
          {renderNumber()}
          {renderCrown()}
        </>
      ) : (
        <>
          {renderCrown()}
          {renderNumber()}
          {renderImage()}
        </>
      )}
    </Box>
  );
};

export default Tooth;
