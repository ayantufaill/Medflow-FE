import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import BaseDialog from '../../shared/BaseDialog';

const CreateTemplateDialog = ({ open, onClose, onSave }) => {
  const [templateName, setTemplateName] = useState('');

  const handleSave = () => {
    onSave(templateName);
    setTemplateName('');
    onClose();
  };

  const handleClose = () => {
    setTemplateName('');
    onClose();
  };

  const actions = (
    <>
      <Button 
        onClick={handleClose} 
        sx={{ 
          textTransform: 'none', 
          color: '#64748b', 
          fontSize: '0.85rem',
          fontWeight: 500,
        }}
      >
        Cancel
      </Button>
      <Button 
        onClick={handleSave} 
        variant="contained"
        disabled={!templateName.trim()}
        sx={{ 
          textTransform: 'none', 
          backgroundColor: '#3b82f6', 
          color: '#fff', 
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: 'none',
          px: 3,
          borderRadius: '8px',
          '&:hover': { backgroundColor: '#2563eb', boxShadow: 'none' }
        }}
      >
        Save Template
      </Button>
    </>
  );

  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      title="Create New Template"
      maxWidth="xs"
      showCloseButton={true}
      actions={actions}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
          Enter the name of the template:
        </Typography>
        <TextField
          autoFocus
          fullWidth
          variant="outlined"
          size="small"
          placeholder="e.g. Monthly Recare Summary"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && templateName.trim()) {
              handleSave();
            }
          }}
          sx={{ 
            '& .MuiOutlinedInput-root': { 
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              '& fieldset': { borderColor: '#e2e8f0' },
              '&:hover fieldset': { borderColor: '#cbd5e1' },
              '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
            },
            '& .MuiInputBase-input': { 
              fontSize: '0.85rem',
              color: '#1e293b'
            } 
          }}
        />
      </Box>
    </BaseDialog>
  );
};

export default CreateTemplateDialog;
