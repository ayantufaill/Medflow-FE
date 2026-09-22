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

import apiClient from "../../config/api";

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
  const [adjustmentType, setAdjustmentType] = useState("");
  const [creditAmount, setCreditAmount] = useState("0.00");

  // Determine button label based on context
  const buttonLabel = showAmountSection ? "Add Courtesy" : "Edit Courtesy";

  const [options, setOptions] = useState([]);

  React.useEffect(() => {
    const fetchDefinitions = async () => {
      try {
        const res = await apiClient.get('/admin-finance/definitions/1');
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setOptions(data);
          if (!adjustmentType && data[0]) {
            setAdjustmentType(data[0].type);
          }
        }
      } catch (err) {
        console.error("Failed to fetch adjustment definitions:", err);
      }
    };
    fetchDefinitions();
  }, []);

  const handleSave = () => {
    if (onSave) {
      const selected = options.find(o => o.type === adjustmentType);
      onSave({
        ...adjustmentData,
        adjustmentType: selected?.type || adjustmentType,
        typeId: selected?.id || "",
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
              <MenuItem key={option.id || option.type} value={option.type}>
                {option.type}
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
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto', px: 3, pb: 2, pt: 2, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: '#fff', borderBottomLeftRadius: '13px', borderBottomRightRadius: '13px' }}>
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
              fontWeight: 600,
              borderRadius: '8px',
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
              color: '#64748b',
              borderColor: '#cbd5e1',
              borderRadius: '8px',
              '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f1f5f9' },
              textTransform: 'none',
              px: 2,
              fontWeight: 600
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
