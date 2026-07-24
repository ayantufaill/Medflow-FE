import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Divider,
  DialogTitle
} from '@mui/material';
import { Close as CloseIcon, Assignment as ClipboardIcon } from '@mui/icons-material';

const CreateQuestionnaireModal = ({ open, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    onCreate({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      sx={{ zIndex: 9999 }}
      PaperProps={{ 
        sx: { 
          borderRadius: 3, 
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
        } 
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ bgcolor: '#F0F5FF', p: 1, borderRadius: 2, display: 'flex' }}>
            <ClipboardIcon sx={{ fontSize: '1.5rem', color: '#3B82F6' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1E293B' }}>
            Create New Questionnaire
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#1E293B', bgcolor: '#F8FAFC' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider sx={{ borderColor: '#E5E9F2' }} />
      
      <DialogContent sx={{ p: 4, pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', mb: 1 }}>
          <Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>Questionnaire Title <span style={{ color: 'red' }}>*</span></Typography>
            <TextField 
              size="small" 
              fullWidth 
              placeholder="E.g., Initial Health Intake"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem', borderRadius: 1.5, '& fieldset': { borderColor: '#E5E9F2' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }} 
            />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>Description</Typography>
            <TextField 
              size="small" 
              fullWidth 
              multiline
              rows={3}
              placeholder="Brief description of the questionnaire's purpose..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.85rem', borderRadius: 1.5, '& fieldset': { borderColor: '#E5E9F2' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }} 
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button 
              variant="contained" 
              onClick={handleCreate}
              disabled={!title.trim()}
              sx={{ bgcolor: '#3B82F6', textTransform: 'none', fontWeight: 600, borderRadius: 1.5, px: 4, py: 1, boxShadow: 'none', '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' } }}
            >
              Create
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestionnaireModal;
