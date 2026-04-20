import React from "react";
import { Box, Typography, Stack, Checkbox } from "@mui/material";
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { fontSize, fontWeight } from "../../../constants/styles";

const SectionHeader = ({ title, color = "#6b7cb4", tag = "DH" }) => (
  <Box
    sx={{
      bgcolor: color,
      color: "#fff",
      px: 1.5,
      py: 0.4,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold }}>{title}</Typography>
      <Box sx={{ bgcolor: "#ef5350", px: 0.5, borderRadius: "2px" }}>
        <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold }}>{tag}</Typography>
      </Box>
    </Stack>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic', opacity: 0.9 }}>no findings</Typography>
      <Checkbox size="small" sx={{ p: 0.25, color: '#fff', '&.Mui-checked': { color: '#fff' } }} />
    </Box>
  </Box>
);

const Concerns = () => {
  return (
    <Box sx={{ mb: 0.5, border: "1px solid #6b7cb4" }}>
      <SectionHeader title="Concerns" tag="DH" />
      
      <Box sx={{ 
        p: 1.2, 
        bgcolor: "#fff", 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        cursor: 'pointer',
        '&:hover': { bgcolor: '#fcfcfc' }
      }}>
        <Typography sx={{ 
          fontSize: fontSize.sm, 
          color: '#b28c5a', 
          fontWeight: fontWeight.medium,
          fontStyle: 'italic'
        }}>
          Pulpal Concern, Fracture, Future Pulpal Concern
        </Typography>
        <KeyboardArrowDown sx={{ color: '#b28c5a', fontSize: 20 }} />
      </Box>
    </Box>
  );
};

export default Concerns;
