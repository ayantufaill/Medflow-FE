import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Stack,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import { Close as CloseIcon } from '@mui/icons-material';
import { COLORS } from "../../constants/colors";

const MENU_PROPS = {
  disablePortal: true,
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  PaperProps: {
    sx: {
      bgcolor: '#fff',
      zIndex: 1600,
      '& .MuiMenuItem-root': { fontSize: '12px', py: 0.5 }
    },
  },
};

const CourtesyCreditComponent = ({
  adjustmentData,
  onSave,
  onCancel,
  onClose,
  showAmountSection = true,
}) => {
  const [adjustmentType, setAdjustmentType] = useState("Un-Collected");
  const [creditAmount, setCreditAmount] = useState("0.00");

  // Determine button label based on context
  const buttonLabel = showAmountSection ? "Add Courtesy" : "Edit Courtesy";

  // Exact options from the provided dropdown screenshot
  const options = [
    "Un-Collected",
    "Professional Courtesy",
    "Immediate Family Courtesy",
    "OON paid",
    "Sunbit Fee",
    "Courtesy 3% for cash pay",
    "Alle Rewards",
    "Uncollect: de-escalate situation",
    "No balance billing",
    "Pro bono",
    "Fee included in Invisalign treatment",
    "Downgrade",
    "Care Credit fee",
    "Employee benefit",
    "Cherry Fee",
    "HFD Fee",
  ];

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...adjustmentData,
        adjustmentType,
        creditAmount: parseFloat(creditAmount) || 0,
        date: adjustmentData?.date || "04/15/2026",
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: "600px",
        bgcolor: "#fff",
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: "14px",
        overflow: "visible",
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
      }}
    >
      {/* Header */}
      <DialogTitle sx={{
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          borderTopLeftRadius: "13px",
          borderTopRightRadius: "13px",
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
      }}>
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Courtesy Credit
        </Typography>
        <IconButton onClick={handleCancel} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Main Selection Row */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'nowrap', 
          gap: 1.5, 
          borderBottom: `1px solid ${COLORS.BORDER}`, 
          pb: 1.5,
          mb: 2 
        }}>
          <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            {adjustmentData?.date || "04/15/2026"}
          </Typography>

          <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '0.85rem', whiteSpace: 'nowrap', ml: 1 }}>
            Adjustment Type
          </Typography>

          <Select
            value={adjustmentType}
            onChange={(e) => setAdjustmentType(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ 
              fontSize: '0.8125rem', minWidth: 220, height: '28px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.ACCENT }
            }}
            MenuProps={MENU_PROPS}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Courtesy Credit Amount - Only show when showAmountSection is true */}
        {showAmountSection && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 1 }}>
            <Typography 
              sx={{ 
                fontSize: '0.85rem', 
                color: '#2c3e50', 
                fontWeight: 500 
              }}
            >
              Courtesy Credit Amount:
            </Typography>

            <Box 
              sx={{ 
                border: '1.5px dashed #666',
                borderRadius: '4px',
                px: 1.5,
                py: 0.5,
                minWidth: '70px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'transparent'
              }}
            >
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a237e', mr: 0.5 }}>$</Typography>
              <input
                type="text"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#1a237e",
                  textAlign: "center",
                  width: "60px",
                  fontFamily: "inherit",
                }}
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Action Buttons - Always visible */}
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto', px: 3, pb: 2, pt: 2, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.SURFACE_TINT, borderBottomLeftRadius: '13px', borderBottomRightRadius: '13px' }}>
        {showAmountSection ? (
          <Typography 
            sx={{ 
              color: COLORS.ACCENT, 
              fontSize: '0.85rem', 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            + Add description
          </Typography>
        ) : (
          <Box />
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ 
              bgcolor: COLORS.ACCENT, 
              color: '#fff',
              textTransform: 'none', 
              fontWeight: 500,
              boxShadow: 'none',
              px: 3,
              '&:hover': { bgcolor: '#1565c0', boxShadow: 'none' } 
            }}
          >
            {buttonLabel}
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleCancel}
            sx={{ 
              color: COLORS.TEXT_SECONDARY, borderColor: COLORS.BORDER, bgcolor: 'white',
              textTransform: 'none', 
              fontWeight: 500,
              boxShadow: 'none',
              px: 3,
              '&:hover': { bgcolor: '#f5f5f5', boxShadow: 'none' } 
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default CourtesyCreditComponent;
