import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';

const AddOpenEdgeAutoDialog = ({ open, onClose, onSubmit }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
      }}
    >
      <form onSubmit={onSubmit}>
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
              Connect OpenEdge Device
            </Typography>
            <Typography sx={{ fontWeight: 400, color: "#5c646f", fontFamily: "Inter", fontSize: "11px" }}>
              Automatically search and connect.
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ py: 4, px: 4 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: '#475569', lineHeight: 1.6 }}>
            The system will automatically search for and connect to active OpenEdge devices on your local network. Please ensure the device is powered on and connected.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid #f1f5f9', gap: 1.5 }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{
              fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
              textTransform: "none", borderRadius: "8px",
              border: "1px solid #d0d5dd", color: "#374151",
              px: "16px", py: "7px",
              "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{
              fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
              textTransform: "none", borderRadius: "8px",
              backgroundColor: "#2262ef", color: "#fff",
              px: "20px", py: "7px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
            }}
          >
            Start Scan & Connect
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddOpenEdgeAutoDialog;
