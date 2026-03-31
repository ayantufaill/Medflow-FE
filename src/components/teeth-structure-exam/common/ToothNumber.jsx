import React from "react";
import { Box, Typography } from "@mui/material";
import { fontSize, fontWeight } from "../../../constants/styles";

const ToothNumber = ({ label, active = false, disabled = false }) => (
  <Box sx={{ 
    px: 0.6, py: 0.1, border: '1px solid',
    borderColor: active ? '#4a69bd' : '#ddd',
    bgcolor: active ? '#4a69bd' : 'white',
    color: active ? 'white' : (disabled ? '#ccc' : '#333'),
    fontSize: fontSize.xs, fontWeight: active ? fontWeight.bold : fontWeight.regular,
    borderRadius: '2px', minWidth: '20px', textAlign: 'center'
  }}>
    {label}
  </Box>
);

export default ToothNumber;
