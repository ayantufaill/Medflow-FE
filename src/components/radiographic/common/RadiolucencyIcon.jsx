import React from "react";
import { Box, Typography } from "@mui/material";

const RadiolucencyIcon = ({ color = "#fff", level = 1 }) => (
  <Box sx={{ 
    width: 30, height: 25, border: '1px solid #d32f2f', borderRadius: '4px 4px 10px 10px',
    bgcolor: color, position: 'relative', overflow: 'hidden'
  }}>
    <Box sx={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, bgcolor: 'black', borderRadius: '0 0 0 100%' }} />
    <Box sx={{ position: 'absolute', bottom: 2, left: '15%', width: '70%', height: '40%', border: '1px solid #ccc', borderRadius: '50% 50% 0 0' }} />
  </Box>
);

export default RadiolucencyIcon;
