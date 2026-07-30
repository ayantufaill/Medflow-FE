import React, { useState } from 'react';
import { feeService } from '../../../services/fee.service';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';

const ClearLockedFeeDialog = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await feeService.clearLockedFees();
      onClose();
    } catch (error) {
      console.error('Failed to clear locked fees:', error);
      alert('Failed to clear locked fees.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{ sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "20px", py: "16px",
        borderBottom: "1px solid #e0e5eb",
        backgroundColor: "#f3f8fd",
      }}>
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f" }}>
            Clear Locked Fee
          </Typography>
          <Typography sx={{ fontWeight: 400, color: "#5c646f", fontFamily: "Inter", fontSize: "11px" }}>
            Confirm to clear locked fee.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ py: 3, px: 4 }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "14px", mb: 3, fontWeight: 500, color: '#374151', textAlign: 'center' }}>
          Are you sure you want to clear locked fee?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            sx={{ 
              fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
              textTransform: "none", borderRadius: "8px",
              border: "1px solid #d0d5dd", color: "#374151",
              px: "16px", py: "7px",
              minWidth: 100,
              "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
            }}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
              textTransform: "none", borderRadius: "8px",
              backgroundColor: "#2262ef", color: "#fff",
              px: "20px", py: "7px",
              minWidth: 100,
              boxShadow: "none",
              "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
              "&.Mui-disabled": { backgroundColor: "#e0e5eb", color: "#9aa3ae" }
            }}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Clearing...' : 'Proceed'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ClearLockedFeeDialog;
