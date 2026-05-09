import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';

const CreateTemplateDialog = ({ open, onClose, onSave }) => {
  const [templateName, setTemplateName] = useState('');

  const handleSave = () => {
    onSave(templateName);
    setTemplateName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#fff', pb: 1 }}>
        <Typography variant="body1" sx={{ color: '#337ab7', fontWeight: 600 }}>
          Create New Template
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
          Enter the name of the template:
        </Typography>
        <TextField
          autoFocus
          fullWidth
          variant="standard"
          placeholder="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          sx={{ '& .MuiInputBase-input': { fontSize: '0.85rem' } }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button 
          onClick={onClose} 
          size="small"
          sx={{ textTransform: 'none', color: '#666', fontSize: '0.75rem' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          size="small"
          sx={{ 
            textTransform: 'none', 
            backgroundColor: '#d9a366', 
            color: '#fff', 
            fontSize: '0.75rem',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#c89255' }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTemplateDialog;
