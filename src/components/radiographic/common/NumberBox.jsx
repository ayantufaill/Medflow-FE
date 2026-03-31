import React from "react";
import { Box, Typography } from "@mui/material";
import { fontSize, fontWeight } from "../../../constants/styles";

const NumberBox = ({ label, active = false }) => (
  <Box sx={{ 
    px: 0.6, py: 0.1, border: '1px solid #eee', fontSize: fontSize.xs, 
    color: active ? '#4a69bd' : '#333', borderRadius: '2px', bgcolor: 'white' 
  }}>
    {label}
  </Box>
);

export default NumberBox;
