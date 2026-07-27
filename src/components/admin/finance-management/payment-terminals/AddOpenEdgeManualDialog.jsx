import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button
} from '@mui/material';

const AddOpenEdgeManualDialog = ({ open, onClose, form, setForm, onSubmit }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
      }}
    >
      <form onSubmit={onSubmit}>
        <DialogTitle sx={{ 
          backgroundColor: '#fff',
          color: '#0f172a',
          fontSize: '1.1rem',
          fontWeight: 700,
          py: 3,
          px: 4,
          borderBottom: '1px solid #f1f5f9'
        }}>
          Add OpenEdge Workstation
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              label="Terminal Serial Number"
              variant="outlined"
              size="small"
              fullWidth
              required
              value={form.serialNum}
              onChange={(e) => setForm(prev => ({ ...prev, serialNum: e.target.value }))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="OpenEdge Account Token"
              variant="outlined"
              size="small"
              fullWidth
              required
              value={form.accountToken}
              onChange={(e) => setForm(prev => ({ ...prev, accountToken: e.target.value }))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, pt: 2, gap: 1.5 }}>
          <Button 
            onClick={onClose}
            variant="text"
            sx={{
              textTransform: 'none',
              color: '#475569',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              '&:hover': { backgroundColor: '#f1f5f9' }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{
              textTransform: 'none',
              backgroundColor: '#2563eb',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
            }}
          >
            Add Terminal
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddOpenEdgeManualDialog;
