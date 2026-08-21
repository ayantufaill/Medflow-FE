import React from 'react';
import { Box, Typography, IconButton } from "@mui/material";
import { Close as CloseIcon, History } from "@mui/icons-material";
import { COLORS } from "../../../constants/colors";

const AuditHistoryHeader = ({ onClose }) => {
  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: "12px",
      px: "20px", py: "14px",
      borderBottom: `1px solid ${COLORS.BORDER}`, flexShrink: 0,
      backgroundColor: "#f3f8fd",
    }}>
      <Box sx={{
        width: "36px", height: "36px", borderRadius: "8px",
        backgroundColor: "#eff6ff",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <History sx={{ fontSize: "20px", color: "#2262ef" }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
        <Typography sx={{
          fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f"
        }}>
          Audit Patient History
        </Typography>
        <Typography sx={{
          color: "#5c646f", fontFamily: "Inter", fontSize: "11px", mt: 0.5
        }}>
          Review a detailed log of changes and actions taken on this patient's profile.
        </Typography>
      </Box>
      <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280" }}>
        <CloseIcon sx={{ fontSize: "18px" }} />
      </IconButton>
    </Box>
  );
};

export default AuditHistoryHeader;
