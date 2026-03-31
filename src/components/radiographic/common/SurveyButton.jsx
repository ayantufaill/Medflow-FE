import React from "react";
import { Box, Typography } from "@mui/material";
import { fontSize, fontWeight } from "../../../constants/styles";

// --- Styled Button Component ---
const SurveyButton = ({ label, color = "white", border = "#ccc", width = 32 }) => (
  <Box sx={{ 
    minWidth: width, height: 24, borderRadius: '6px', border: `1px solid ${border}`,
    bgcolor: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: fontSize.xs, fontWeight: fontWeight.medium, px: 0.5, cursor: 'pointer',
    boxShadow: '0px 1px 1px rgba(0,0,0,0.1)'
  }}>
    {label}
  </Box>
);

export default SurveyButton;
