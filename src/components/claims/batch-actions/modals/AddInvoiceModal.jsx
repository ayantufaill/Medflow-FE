import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { Close as CloseIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { COLORS } from '../../../../constants/colors';

const AddInvoiceModal = ({
  open,
  onClose,
  selectedPatients,
  newInvoiceDelivery,
  setNewInvoiceDelivery,
  handleSaveBatchInvoice
}) => {
  const selectedCount = Object.keys(selectedPatients).filter(id => selectedPatients[id]).length;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      sx={{ zIndex: 130000 }} 
      PaperProps={{ 
        sx: { 
          borderRadius: '14px', 
          overflow: 'hidden', 
          bgcolor: 'white', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
          border: `1px solid ${COLORS.BORDER}`
        } 
      }}
    >
      <DialogTitle sx={{ 
        boxSizing: "border-box", 
        px: "25px", 
        py: "8px", 
        display: "flex", 
        alignItems: "center", 
        gap: "8px", 
        borderBottom: `1px solid ${COLORS.BORDER}`, 
        backgroundColor: COLORS.SURFACE_TINT, 
        m: 0, 
        flexShrink: 0 
      }}>
        <ReceiptIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Generate New Batch Statements
        </Typography>
        
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 4, pb: 3, px: 3, bgcolor: 'white' }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mt: 2
        }}>
          <Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.TEXT_PRIMARY, mb: 1 }}>
              Preferred Delivery Method
            </Typography>
            <FormControl size="small" fullWidth sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: '8px',
                fontSize: '0.85rem',
                backgroundColor: COLORS.SURFACE_INPUT,
                '& fieldset': { borderColor: COLORS.BORDER },
                '&:hover fieldset': { borderColor: COLORS.TEXT_MUTED },
                '&.Mui-focused fieldset': { borderColor: COLORS.ACCENT }
              } 
            }}>
              <Select 
                value={newInvoiceDelivery} 
                onChange={(e) => setNewInvoiceDelivery(e.target.value)}
                MenuProps={{ sx: { zIndex: 140000 } }}
              >
                <MenuItem value="Email & SMS" sx={{ fontSize: '0.85rem' }}>Digital Delivery (Email & SMS)</MenuItem>
                <MenuItem value="Printed Mail" sx={{ fontSize: '0.85rem' }}>Post Office Printed Mail</MenuItem>
                <MenuItem value="None" sx={{ fontSize: '0.85rem' }}>Generate Offline PDF Statements Only</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ p: 2, bgcolor: COLORS.SURFACE_FOOTER, borderRadius: '8px', border: `1px dashed ${COLORS.BORDER}` }}>
            <Typography sx={{ fontSize: '0.85rem', color: COLORS.TEXT_SECONDARY, fontWeight: 500, textAlign: 'center' }}>
              This will generate bulk invoices for the <Typography component="span" sx={{ fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>{selectedCount}</Typography> selected patient{selectedCount !== 1 ? 's' : ''}.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: `1px solid ${COLORS.BORDER}`, px: 3, py: 2, bgcolor: COLORS.SURFACE_TINT }}>
        <Button 
          variant="outlined" 
          onClick={onClose} 
          sx={{ 
            textTransform: 'none', 
            fontWeight: 600, 
            borderRadius: '8px', 
            borderColor: COLORS.BORDER, 
            color: COLORS.TEXT_SECONDARY, 
            '&:hover': { bgcolor: COLORS.SURFACE_HOVER, borderColor: COLORS.TEXT_SECONDARY },
            py: 0.5,
            px: 2
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveBatchInvoice}
          disabled={selectedCount === 0}
          sx={{ 
            bgcolor: COLORS.ACCENT, 
            textTransform: 'none', 
            fontWeight: 600, 
            borderRadius: '8px', 
            '&:hover': { bgcolor: COLORS.ACCENT_HOVER }, 
            boxShadow: 'none',
            py: 0.5,
            px: 2
          }}
        >
          Generate Invoices
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInvoiceModal;
