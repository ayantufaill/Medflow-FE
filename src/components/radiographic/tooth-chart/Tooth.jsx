import React from "react";
import { Box, Typography } from "@mui/material";
import { fontSize, fontWeight } from "../../../constants/styles";

// --- Central Chart Tooth Component with Hover Effects ---
const Tooth = ({ num, isActive = false }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 0.5,
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        zIndex: isHovered ? 1 : 'auto'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography sx={{ fontSize: fontSize.xs, color: isActive || isHovered ? '#1976d2' : '#666', fontWeight: (isActive || isHovered) ? fontWeight.bold : fontWeight.regular }}>
        {num}
      </Typography>
      <Box 
        component="img" 
        src={`/teeth${num}.png`} // Uses actual tooth images from public folder
        alt={`Tooth ${num}`}
        sx={{ 
          width: 30, 
          height: 60, 
          mt: 0.5, 
          opacity: isHovered ? 1 : 0.9,
          filter: isActive || isHovered 
            ? 'drop-shadow(0 0 4px #1976d2) brightness(1.15)' 
            : 'none',
          objectFit: 'contain',
          transition: 'all 0.2s ease-in-out'
        }} 
      />
    </Box>
  );
};

export default Tooth;
