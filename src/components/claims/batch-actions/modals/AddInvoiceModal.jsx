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
  MenuItem
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const AddInvoiceModal = ({
  open,
  onClose,
  selectedPatients,
  newInvoiceDelivery,
  setNewInvoiceDelivery,
  handleSaveBatchInvoice
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e6ed', pb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
          Generate New Batch Statements
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#718096' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4a5568', display: 'block', mb: 0.5 }}>
              Preferred Statements Delivery Method:
            </Typography>
            <FormControl size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}>
              <Select value={newInvoiceDelivery} onChange={(e) => setNewInvoiceDelivery(e.target.value)}>
                <MenuItem value="Email & SMS">Digital Delivery (Email & SMS)</MenuItem>
                <MenuItem value="Printed Mail">Post Office Printed Mail</MenuItem>
                <MenuItem value="None">Generate Offline PDF Statements Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ color: '#4a5568', fontWeight: 500 }}>
          This will generate bulk invoices for the {Object.keys(selectedPatients).filter(id => selectedPatients[id]).length} selected patients. Proceed?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #e0e6ed', px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose} sx={{ textTransform: 'none', fontWeight: 600, borderColor: '#cbd5e1' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveBatchInvoice}
          sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#11274c' }, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
        >
          Generate Batch Invoices
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInvoiceModal;
