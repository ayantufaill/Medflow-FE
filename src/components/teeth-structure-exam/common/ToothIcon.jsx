import React from "react";
import { Box, Typography } from "@mui/material";

// --- Custom Dental SVG Icons ---
const ToothIcon = ({ color = "#ddd", type = "normal", label = "" }) => (
  <Box sx={{ 
    width: 28, height: 28, border: '1px solid #ccc', borderRadius: 1, 
    position: 'relative', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', bgcolor: color, cursor: 'pointer' 
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1">
      <path d="M7 3C4 3 3 6 3 9C3 13 5 21 8 21C10 21 11 18 12 18C13 18 14 20 16 21C19 21 21 13 21 9C21 6 20 3 17 3C15 3 13 4 12 5C11 4 9 3 7 3Z" />
      {type === 'caries' && <circle cx="15" cy="7" r="3" fill="black" />}
      {type === 'watch' && <path d="M8 8 L16 16 M16 8 L8 16" stroke="red" strokeWidth="2" />}
    </svg>
    {label && <Typography sx={{ position: 'absolute', bottom: -2, right: 1, fontSize: '0.65rem', fontWeight: 700 }}>{label}</Typography>}
  </Box>
);

export default ToothIcon;
