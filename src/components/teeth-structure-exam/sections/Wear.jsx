import React from "react";
import { Box, Typography, Stack, Divider, Button, Checkbox } from "@mui/material";
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
      <Checkbox size="small" sx={{ p: 0.25, color: '#fff', '&.Mui-checked': { color: '#fff' } }} />
    </Box>
  </Box>
);

// Reusable component for the wear category rows (Abrasion, Erosion, etc.)
const WearRow = ({ label, options, buttons = ["≤1", "1-2", ">2"] }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
      <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: '#333' }}>{label}</Typography>
      <Stack direction="row" spacing={0.5}>
        {buttons.map((btn) => (
          <Button
            key={btn}
            variant="outlined"
            sx={{
              minWidth: 35,
              height: 24,
              fontSize: fontSize.xs,
              color: '#333',
              borderColor: '#ccc',
              textTransform: 'none',
              px: 0.5,
            }}
          >
            {btn}
          </Button>
        ))}
      </Stack>
    </Box>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0px 12px' }}>
      {options.map((opt) => (
        <input type="checkbox" key={opt} />
      ))}
    </Box>
  </Box>
);

const Wear = () => {
  return (
    <Box sx={{ mb: 0.5 }}>
      <SectionHeader title="Wear (Tooth Structure Loss)" tag="DH" />
      
      <Box sx={{ p: 1.5, border: "1px solid #e0e0e0", borderTop: 0, bgcolor: "#fff" }}>
        <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, mb: 1, color: '#444' }}>
          Wear matching the opposing dentition
        </Typography>
        
        <WearRow label="Attrition/Chewing Envelope" options={[]} />
        
        <Box sx={{ mb: 2 }}>
          <WearRow label="Abnormal Attrition/horizontal (lateral) linear" options={["Sleep bruxism"]} />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, mb: 1, color: '#444' }}>
          Non-cervical wear not matching the opposing dentition
        </Typography>

        <WearRow label="Abrasion" options={["Toothpaste", "Tongue", "Cheek", "Opposing Restoration"]} />
        <WearRow label="Erosion" options={["Extrinsic: Dietary", "Intrinsic: GERD", "Intrinsic: Bulimia"]} />

        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, mb: 1, color: '#444' }}>
          Cervical Wear - NCCL
        </Typography>
        
        <WearRow label="Cervical abrasion" options={["Toothpaste", "Habits", "Cheek"]} />
        <WearRow label="Abfraction" options={["Extrinsic: Dietary", "Intrinsic: Bulimia", "Intrinsic: GERD", "Biomechanical loading force"]} />
      </Box>
    </Box>
  );
};

export default Wear;
