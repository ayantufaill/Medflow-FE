import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Your exact 4 colors: Red, Green, Blue, Purple
const FLAG_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#8b5cf6'];

const PatientFlagsDialog = ({ open, mode, formData, onFormChange, onClose, onSubmit }) => {
  const isAddCategory = mode === 'addCategory';
  const title = isAddCategory ? 'Add New Category' : mode === 'addFlag' ? 'Add New Flag' : 'Edit Flag';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ zIndex: 1400 }}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          bgcolor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Category Name field (only for Add Category) */}
          {isAddCategory && (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#64748b', mb: '4px' }}>Category Name</Typography>
              <TextField
                size="small"
                fullWidth
                value={formData.categoryName}
                onChange={(e) => onFormChange('categoryName', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { height: '36px', bgcolor: '#ffffff', borderRadius: '6px', fontSize: '13px' } }}
              />
            </Box>
          )}

          {/* Flag Name field (hidden when adding a category) */}
          {!isAddCategory && (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#64748b', mb: '4px' }}>Flag Name</Typography>
              <TextField
                size="small"
                fullWidth
                value={formData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { height: '36px', bgcolor: '#ffffff', borderRadius: '6px', fontSize: '13px' } }}
              />
            </Box>
          )}

          {/* Color Swatches (hidden when adding a category) */}
          {!isAddCategory && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                Flag Color
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {FLAG_COLORS.map((color) => (
                  <Box
                    key={color}
                    onClick={() => onFormChange('color', color)}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: color,
                      cursor: 'pointer',
                      border: formData.color === color ? '3px solid #11223F' : '2px solid transparent',
                      boxShadow: formData.color === color ? '0 0 0 2px #ffffff inset' : 'none',
                      transition: 'all 0.15s',
                      '&:hover': { transform: 'scale(1.1)' },
                    }}
                  />
                ))}
                <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', ml: 1, fontWeight: 500 }}>
                  {formData.color.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0', bgcolor: '#fff', gap: 1 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            color: '#64748b',
            borderColor: '#cbd5e1',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            px: 3,
            '&:hover': { borderColor: '#94a3b8', bgcolor: '#f1f5f9' },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          variant="contained"
          sx={{
            bgcolor: '#2262EF',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            px: 3,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1a4fc4', boxShadow: 'none' },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientFlagsDialog;