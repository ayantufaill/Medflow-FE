import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField, Typography } from '@mui/material';

// Your exact 4 colors: Red, Green, Blue, Purple
const FLAG_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#8b5cf6'];

const PatientFlagsDialog = ({ open, mode, formData, onFormChange, onClose, onSubmit }) => {
  const isAddCategory = mode === 'addCategory';
  const title = isAddCategory ? 'Add New Category' : mode === 'addFlag' ? 'Add New Flag' : 'Edit Flag';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Category Name field (only for Add Category) */}
          {isAddCategory && (
            <TextField
              label="Category Name"
              size="small"
              fullWidth
              value={formData.categoryName}
              onChange={(e) => onFormChange('categoryName', e.target.value)}
            />
          )}

          {/* Flag Name field (hidden when adding a category) */}
          {!isAddCategory && (
            <TextField
              label="Flag Name"
              size="small"
              fullWidth
              value={formData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
            />
          )}

          {/* Color Swatches (hidden when adding a category) */}
          {!isAddCategory && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Flag Color:
              </Typography>
              {FLAG_COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => onFormChange('color', color)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: color,
                    cursor: 'pointer',
                    border: formData.color === color ? '3px solid #111' : '2px solid transparent',
                    transition: 'all 0.15s',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                />
              ))}
              <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', ml: 1 }}>
                {formData.color.toUpperCase()}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientFlagsDialog;