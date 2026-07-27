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

const ProcedureGroupDialog = ({ open, onClose, isEdit, formData, setFormData, onSave }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#fff',
        color: '#0f172a',
        fontSize: '1.1rem',
        fontWeight: 700,
        py: 3,
        px: 4,
        borderBottom: '1px solid #f1f5f9'
      }}>
        {isEdit ? 'Edit Procedure Group' : 'Add Procedure Group'}
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <TextField
            label="Group Name"
            variant="outlined"
            size="small"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Percentage (%)"
              variant="outlined"
              size="small"
              type="number"
              sx={{ width: '50%', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              value={formData.percentage}
              onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
            />
            <TextField
              label="Color Hex"
              variant="outlined"
              size="small"
              type="color"
              sx={{ width: '50%', '& .MuiOutlinedInput-root': { borderRadius: 2, height: '40px' } }}
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            />
          </Box>
          <TextField
            label="Procedure Codes (comma separated)"
            variant="outlined"
            size="small"
            fullWidth
            multiline
            rows={3}
            value={formData.codes}
            onChange={(e) => setFormData(prev => ({ ...prev, codes: e.target.value }))}
            placeholder="e.g. D1110, D1120"
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
          onClick={onSave}
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
          Save Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcedureGroupDialog;
