import React from "react";
import { Box, Typography } from "@mui/material";
import { fontWeight } from "../../../constants/styles";

// --- Crown View SVG Component representing the 5 surfaces of a tooth ---
const ToothCrown = ({ num, surfaces = [], depth = 'Limited to enamel', size = 32, onSurfaceClick }) => {
  // Determine radius of the black dot based on radiolucency depth
  // Reduced sizes so they fit perfectly inside the SVG paths without overlapping boundaries
  let dotRadius = 3.5;
  if (depth === "Into dentin") {
    dotRadius = 6;
  } else if (depth === "Deep into dentin") {
    dotRadius = 8.5;
  }

  const hasSurface = (s) => {
    if (s === "B") return surfaces.includes("B") || surfaces.includes("B/F") || surfaces.includes("F");
    if (s === "O") return surfaces.includes("O") || surfaces.includes("O/I") || surfaces.includes("I");
    return surfaces.includes(s);
  };

  // Midline anatomical mapping
  const isRightSide = (num >= 1 && num <= 8) || (num >= 25 && num <= 32);
  const leftSurface = isRightSide ? "D" : "M";
  const rightSurface = isRightSide ? "M" : "D";

  const getPathProps = (surfaceCode) => {
    const isSelected = hasSurface(surfaceCode);
    return {
      fill: isSelected ? "rgba(239, 68, 68, 0.15)" : "#fff",
      stroke: isSelected ? "#ef4444" : "#777",
      strokeWidth: isSelected ? "2.5" : "1.5",
      style: onSurfaceClick ? { cursor: 'pointer', pointerEvents: 'auto' } : undefined,
      onClick: onSurfaceClick ? (e) => {
        e.stopPropagation();
        onSurfaceClick(surfaceCode);
      } : undefined
    };
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5, mb: 0.5 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={onSurfaceClick ? undefined : { pointerEvents: 'none' }}>
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
          {...getPathProps("B")}
        />
        
        {/* Left Surface (Distal for Right side, Mesial for Left side) */}
        <path 
          d="M 25 25 Q 15 50 25 75 L 32 62 Q 24 50 32 38 Z" 
          {...getPathProps(leftSurface)}
        />
        
        {/* Lingual (Bottom Surface) */}
        <path 
          d="M 25 75 Q 50 85 75 75 L 68 62 Q 50 72 32 62 Z" 
          {...getPathProps("L")}
        />
        
        {/* Right Surface (Mesial for Right side, Distal for Left side) */}
        <path 
          d="M 75 25 Q 85 50 75 75 L 68 62 Q 76 50 68 38 Z" 
          {...getPathProps(rightSurface)}
        />
        
        {/* Center Surface (Occlusal / Incisal) */}
        <path 
          d="M 32 38 Q 50 28 68 38 Q 76 50 68 62 Q 50 72 32 62 Q 24 50 32 38 Z" 
          {...getPathProps("O")}
        />

        {/* --- Black Dots representing Coronal Radiolucency findings --- */}
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
  surfaces = [],
  depth = 'Limited to enamel',
  onClick,
  onSurfaceClick
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const isUpper = num >= 1 && num <= 16;

  // Render Tooth Number below the tooth (reverted back to only show the plain number)
  const renderNumber = () => {
    const hasFindings = surfaces.length > 0;
    
    return (
      <Typography 
        sx={{ 
          fontSize: '0.72rem', 
          color: isActive || isHovered || isMissing || hasFindings ? '#1976d2' : '#666', 
          fontWeight: (isActive || isHovered || isMissing || hasFindings) ? fontWeight.bold : fontWeight.regular,
          userSelect: 'none',
          textAlign: 'center',
          mt: 0.5,
          lineHeight: 1.1
        }}
      >
        {num}
      </Typography>
    );
  };

  // Render Tooth Image component
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
          width: isActive ? 40 : 30, 
          height: isActive ? 75 : 60, 
          mt: 0.5, 
          opacity: isHovered ? 1 : 0.9,
          filter: isActive || isHovered || hasRadiolucency
            ? 'drop-shadow(0 0 6px #1976d2) brightness(1.15)' 
            : 'none',
          objectFit: 'contain',
          transition: 'all 0.2s ease-in-out'
        }} 
      />
    );
  };

  // Render Crown View component
  const renderCrown = () => {
    if (isMissing) return null;
    return <ToothCrown num={num} surfaces={surfaces} depth={depth} onSurfaceClick={onSurfaceClick} />;
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
        transform: isActive
          ? 'scale(1.2)'
          : hasRadiolucency 
            ? 'scale(1.25)' 
            : (isHovered ? 'scale(1.1)' : 'scale(1)'),
        zIndex: isActive ? 10 : (hasRadiolucency ? 10 : (isHovered ? 5 : 'auto')),
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
