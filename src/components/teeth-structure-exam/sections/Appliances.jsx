import React from "react";
import { Box, Card, Typography, Checkbox, FormControlLabel, Stack } from "@mui/material";
import { 
  MedicalServices, Healing, Psychology, SelfImprovement, Science, 
  Accessibility, BrightnessHigh, WaterDrop, Face, Nightlight 
} from "@mui/icons-material";
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
      <Typography sx={{ fontSize: fontSize.xs, fontStyle: 'italic' }}>no findings</Typography>
      <Checkbox size="small" sx={{ p: 0.25, color: "#fff", "&.Mui-checked": { color: "#fff" } }} />
    </Box>
  </Box>
);

// --- Appliance Icon Component with Real MUI Icons ---
const ApplianceIcon = ({ name }) => {
  const getIconForAppliance = (applianceName) => {
    const iconMap = {
      'Denture': <MedicalServices sx={{ fontSize: 24, color: '#5c6bc0' }} />,
      'Partial': <Healing sx={{ fontSize: 24, color: '#78909c' }} />,
      'Retainer': <Psychology sx={{ fontSize: 24, color: '#26a69a' }} />,
      'Guard': <SelfImprovement sx={{ fontSize: 24, color: '#ffa726' }} />,
      'Expander': <Science sx={{ fontSize: 24, color: '#ef5350' }} />,
      'Space M.': <Accessibility sx={{ fontSize: 20, color: '#42a5f5' }} />,
      'Invisalign': <BrightnessHigh sx={{ fontSize: 24, color: '#66bb6a' }} />,
      'Bleach': <WaterDrop sx={{ fontSize: 24, color: '#4fc3f7' }} />,
      'Palate': <Face sx={{ fontSize: 24, color: '#ab47bc' }} />,
      'Braces': <MedicalServices sx={{ fontSize: 24, color: '#ec407a' }} />,
      'Bridge': <Healing sx={{ fontSize: 24, color: '#8d6e63' }} />,
      'Sleep': <Nightlight sx={{ fontSize: 24, color: '#5c6bc0' }} />,
    };
    return iconMap[applianceName] || <MedicalServices sx={{ fontSize: 24 }} />;
  };

  return (
    <Box
      sx={{
        width: 45,
        height: 35,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.1s',
        '&:hover': { transform: 'scale(1.1)' },
        border: '1px solid #e0e0e0', 
        borderRadius: '6px',
        bgcolor: '#fafafa'
      }}
    >
      {getIconForAppliance(name)}
    </Box>
  );
};

const Appliances = () => {
  return (
    <Card sx={{ mb: 1, borderRadius: 0, border: '1px solid #6b7cb4', bgcolor: 'white' }}>
      <SectionHeader title="Appliances" tag="DH" />
      <Box sx={{ p: 2, bgcolor: 'white' }}>
        {/* Row 1 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 1.5, 
          mb: 2,
          flexWrap: 'wrap' 
        }}>
          {[
            { id: 1, name: 'Denture' },
            { id: 2, name: 'Partial' },
            { id: 3, name: 'Retainer' },
            { id: 4, name: 'Guard' },
            { id: 5, name: 'Expander' },
          ].map((item) => (
            <ApplianceIcon key={item.id} name={item.name} />
          ))}
        </Box>

        {/* Row 2 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 1.5,
          flexWrap: 'wrap' 
        }}>
          {[
            { id: 7, name: 'Invisalign' },
            { id: 8, name: 'Bleach' },
            { id: 9, name: 'Palate' },
            { id: 10, name: 'Braces' },
            { id: 11, name: 'Bridge' },
          ].map((item) => (
            <ApplianceIcon key={item.id} name={item.name} />
          ))}
        </Box>
      </Box>
    </Card>
  );
};

export default Appliances;
