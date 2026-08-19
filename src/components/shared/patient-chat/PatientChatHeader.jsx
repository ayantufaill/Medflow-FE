import React from 'react';
import { Box, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const PatientChatHeader = ({ patientName, onClose }) => {
  return (
    <Box
      sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "20px", py: "14px",
        borderBottom: "1px solid #e0e5eb", flexShrink: 0,
        backgroundColor: "#f3f8fd",
      }}
    >
      <Box sx={{
        width: "36px", height: "36px", borderRadius: "8px",
        backgroundColor: "#eff6ff",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Typography sx={{ fontSize: "18px" }}>👤</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
        <Typography sx={{
          fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f"
        }}>
          {patientName || "Karla Pamela"}
        </Typography>
        <Typography sx={{
          color: "#5c646f", fontFamily: "Inter", fontSize: "11px", mt: 0.5
        }}>
          Patient Chat History
        </Typography>
      </Box>
      <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280" }}>
        <Close sx={{ fontSize: "18px" }} />
      </IconButton>
    </Box>
  );
};

export default PatientChatHeader;
