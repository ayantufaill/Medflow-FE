import React from "react";
import { Dialog, Box, Typography, IconButton, Button, Chip } from "@mui/material";
import { Close as CloseIcon, Check as CheckIcon } from "@mui/icons-material";

const ToothSelectionDialog = ({
  open,
  onClose,
  activeSelectionCode,
  isToothSelected,
  onToothToggle,
  selectedTeeth,
  onToggle,
}) => {
  const topTeeth = [
    "1", "2", "3", "4", "5", "6", "7", "8",
    "Q1", "Q2",
    "9", "10", "11", "12", "13", "14", "15", "16",
  ];
  const bottomTeeth = [
    "32", "31", "30", "29", "28", "27", "26", "25",
    "Q4", "Q3",
    "24", "23", "22", "21", "20", "19", "18", "17",
  ];

  const checkIsSelected = (tooth) => {
    const tStr = String(tooth).trim();
    if (typeof isToothSelected === "function") {
      const res = isToothSelected(tooth);
      if (typeof res === "boolean") return res;
    }
    if (Array.isArray(selectedTeeth)) {
      return selectedTeeth.map((t) => String(t).trim()).includes(tStr);
    }
    if (typeof selectedTeeth === "string") {
      return selectedTeeth
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .includes(tStr);
    }
    return false;
  };

  const handleToggle = (tooth) => {
    if (typeof onToothToggle === "function") return onToothToggle(tooth);
    if (typeof onToggle === "function") return onToggle(tooth);
  };

  const getSelectedList = () => {
    if (Array.isArray(selectedTeeth)) {
      return selectedTeeth.map((t) => String(t).trim()).filter(Boolean);
    }
    if (typeof selectedTeeth === "string") {
      return selectedTeeth.split(",").map((t) => t.trim()).filter(Boolean);
    }
    const list = [];
    [...topTeeth, ...bottomTeeth].forEach((t) => {
      if (checkIsSelected(t)) list.push(t);
    });
    return list;
  };

  const currentSelected = getSelectedList();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      PaperProps={{
        sx: {
          borderRadius: "16px",
          p: 2.5,
          minWidth: { xs: "340px", sm: "640px" },
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }
      }}
      sx={{ zIndex: 1500 }}
    >
      <Box sx={{ position: "relative" }}>
        {/* Title Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, pb: 1, borderBottom: "1px solid #E2E8F0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A", fontFamily: "'Inter', sans-serif" }}>
              Select Tooth / Quadrants
            </Typography>
            {activeSelectionCode && (
              <Chip 
                label={`Code: ${activeSelectionCode}`} 
                size="small" 
                sx={{ bgcolor: "#EFF6FF", color: "#2362EF", fontWeight: 600, fontSize: "0.75rem", fontFamily: "'Inter', sans-serif" }} 
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#64748B" }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Arch Labels */}
        <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.5 }}>
          Upper Arch (Maxillary)
        </Typography>

        {/* Top Teeth Row */}
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 0.6, mb: 2 }}>
          {topTeeth.map((t) => {
            const isSelected = checkIsSelected(t);
            const isQ = t.startsWith("Q");
            return (
              <Box
                key={t}
                onClick={() => handleToggle(t)}
                sx={{
                  width: isQ ? "36px" : "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: isSelected || isQ ? 700 : 500,
                  fontFamily: "'Inter', sans-serif",
                  userSelect: "none",
                  transition: "all 0.15s ease",
                  bgcolor: isSelected ? "#2362EF" : isQ ? "#EEF2FF" : "#F8FAFC",
                  color: isSelected ? "#FFFFFF" : isQ ? "#4F46E5" : "#1E293B",
                  border: isSelected
                    ? "1px solid #2362EF"
                    : isQ
                    ? "1px solid #C7D2FE"
                    : "1px solid #CBD5E1",
                  boxShadow: isSelected ? "0 2px 5px rgba(35, 98, 239, 0.3)" : "none",
                  "&:hover": {
                    bgcolor: isSelected ? "#1D4ED8" : isQ ? "#E0E7FF" : "#E2E8F0",
                    transform: "scale(1.06)",
                  },
                  ml: t === "Q1" || t === "9" ? 1.5 : 0,
                  mr: t === "Q2" ? 1.5 : 0,
                }}
              >
                {t}
              </Box>
            );
          })}
        </Box>

        {/* Lower Arch Header */}
        <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.5 }}>
          Lower Arch (Mandibular)
        </Typography>

        {/* Bottom Teeth Row */}
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 0.6, mb: 2.5 }}>
          {bottomTeeth.map((t) => {
            const isSelected = checkIsSelected(t);
            const isQ = t.startsWith("Q");
            return (
              <Box
                key={t}
                onClick={() => handleToggle(t)}
                sx={{
                  width: isQ ? "36px" : "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: isSelected || isQ ? 700 : 500,
                  fontFamily: "'Inter', sans-serif",
                  userSelect: "none",
                  transition: "all 0.15s ease",
                  bgcolor: isSelected ? "#2362EF" : isQ ? "#EEF2FF" : "#F8FAFC",
                  color: isSelected ? "#FFFFFF" : isQ ? "#4F46E5" : "#1E293B",
                  border: isSelected
                    ? "1px solid #2362EF"
                    : isQ
                    ? "1px solid #C7D2FE"
                    : "1px solid #CBD5E1",
                  boxShadow: isSelected ? "0 2px 5px rgba(35, 98, 239, 0.3)" : "none",
                  "&:hover": {
                    bgcolor: isSelected ? "#1D4ED8" : isQ ? "#E0E7FF" : "#E2E8F0",
                    transform: "scale(1.06)",
                  },
                  ml: t === "Q4" || t === "24" ? 1.5 : 0,
                  mr: t === "Q3" ? 1.5 : 0,
                }}
              >
                {t}
              </Box>
            );
          })}
        </Box>

        {/* Active Selection Chips Summary & Footer */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 2, borderTop: "1px solid #E2E8F0", flexWrap: "wrap", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", maxWidth: "450px" }}>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569", fontFamily: "'Inter', sans-serif" }}>
              Selected ({currentSelected.length}):
            </Typography>
            {currentSelected.length > 0 ? (
              currentSelected.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  size="small"
                  onDelete={() => handleToggle(t)}
                  sx={{
                    bgcolor: "#2362EF",
                    color: "#FFFFFF",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    height: "24px",
                    fontFamily: "'Inter', sans-serif",
                    "& .MuiChip-deleteIcon": { color: "#FFFFFF", "&:hover": { color: "#E2E8F0" } }
                  }}
                />
              ))
            ) : (
              <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", fontStyle: "italic", fontFamily: "'Inter', sans-serif" }}>
                Click teeth above to select
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            onClick={onClose}
            startIcon={<CheckIcon sx={{ fontSize: 16 }} />}
            sx={{
              bgcolor: "#2362EF",
              color: "#FFFFFF",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
              borderRadius: "8px",
              px: 2.5,
              py: 0.75,
              boxShadow: "none",
              fontFamily: "'Inter', sans-serif",
              "&:hover": { bgcolor: "#1D4ED8", boxShadow: "none" }
            }}
          >
            Done
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ToothSelectionDialog;
