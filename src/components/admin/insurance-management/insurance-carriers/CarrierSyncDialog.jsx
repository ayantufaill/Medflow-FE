import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';

const CarrierSyncDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
      }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "10px", py: "10px",
        borderBottom: "1px solid #e0e5eb", flexShrink: 0,
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
          <Typography sx={{ 
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            Sync Carrier
          </Typography>
          <Typography sx={{ 
            fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
            textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
          }}>
            Select the offices you would like to sync with the source office.
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ mt: 3, px: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontFamily: "Inter", mb: 1, fontWeight: 600, color: '#374151', fontSize: '12px' }}>
            Source Office:
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value="thedentalstudio"
            disabled
            InputProps={{
              sx: { fontFamily: "Inter", fontSize: "13px", borderRadius: "8px", backgroundColor: "#f1f5f9", color: "#6b7280" }
            }}
            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d0d5dd' } }}
          />
        </Box>
        <Box>
          <Typography sx={{ fontFamily: "Inter", mb: 1, fontWeight: 600, color: '#374151', fontSize: '12px' }}>
            Target Offices
          </Typography>
          <Box sx={{ p: 2, border: '1px solid #d0d5dd', borderRadius: "8px", backgroundColor: '#f8fafc', textAlign: 'center' }}>
            <Typography sx={{ fontFamily: "Inter", color: '#6b7280', fontSize: "13px" }}>
              Select target offices from the list below...
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: "20px", py: "12px", borderTop: '1px solid #e0e5eb', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
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
          variant="contained" 
          onClick={onClose}
          sx={{ 
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            backgroundColor: "#2262ef", color: "#fff",
            px: "20px", py: "7px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#1a50cc", boxShadow: "none" },
          }}
        >
          Sync
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarrierSyncDialog;
