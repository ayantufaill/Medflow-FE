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
  DialogTitle,
  DialogActions
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
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        py: 2, 
        px: 3,
        bgcolor: '#F3F8FD',
        borderBottom: '1px solid #E5E9F2',
        m: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Icon badge */}
          <Box sx={{
            width: 40, height: 40, borderRadius: '10px', backgroundColor: '#e2ebfc',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <ClipboardIcon sx={{ fontSize: '20px', color: '#2563EB' }} />
          </Box>
          <Box>
            <Typography sx={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 600, 
              fontSize: '16px', 
              lineHeight: '24px', 
              letterSpacing: '-0.4px', 
              color: '#111' 
            }}>
              Create New Questionnaire
            </Typography>
            <Typography sx={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 400, 
              fontSize: '11.5px', 
              lineHeight: '17.25px', 
              color: '#6B7280' 
            }}>
              Set up a new questionnaire for your patients
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#1E293B', bgcolor: '#F8FAFC' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, pt: 3, bgcolor: '#ffffff' }}>
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
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #E5E7EB',
          bgcolor: '#ffffff',
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '0.875rem',
            borderColor: '#D1D5DB',
            color: '#374151',
            borderRadius: '8px',
            px: 2.5,
            '&:hover': {
              borderColor: '#9CA3AF',
              backgroundColor: '#F9FAFB',
            },
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleCreate}
          disabled={!title.trim()}
          sx={{
            textTransform: 'none',
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: '0.875rem',
            backgroundColor: '#2563EB',
            borderRadius: '8px',
            px: 2.5,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#1d4ed8',
              boxShadow: 'none',
            },
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateQuestionnaireModal;
