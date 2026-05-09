import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, Assignment as ClipboardIcon } from '@mui/icons-material';

const CreateQuestionnaireModal = ({ open, onClose, onCreate }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, p: 0 } }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#1a3a6b', color: '#fff', px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>Create New Questionnaire</Typography>
        <IconButton sx={{ color: '#fff', p: 0 }} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* Body */}
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 6 }}>
        <ClipboardIcon sx={{ fontSize: '3rem', color: '#4dd0e1', mb: 3 }} />
        
        <Box sx={{ width: '100%', maxWidth: 400, mb: 3 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5, color: '#333' }}>
            Questionnaire Title <span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="Questionnaire Title *"
            sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } } }} 
          />
        </Box>

        <Box sx={{ width: '100%', maxWidth: 400, mb: 5 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5, color: '#333' }}>
            Description
          </Typography>
          <TextField 
            fullWidth 
            multiline
            rows={3}
            placeholder="Description"
            sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } } }} 
          />
        </Box>

        <Button 
          variant="contained" 
          onClick={onCreate}
          sx={{ bgcolor: '#81c784', textTransform: 'none', fontWeight: 600, borderRadius: 5, px: 4, '&:hover': { bgcolor: '#66bb6a' } }}
        >
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestionnaireModal;
