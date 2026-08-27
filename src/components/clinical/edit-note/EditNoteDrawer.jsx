import React from 'react';
import { Drawer, Box, Typography, IconButton, Button, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { COLORS } from '../../../constants/colors';
import EditNoteForm from './EditNoteForm';

const EditNoteDrawer = ({ open, onClose, noteData, onSave }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 600, md: 700 } }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{
          boxSizing: 'border-box',
          px: '20px',
          py: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: `1px solid ${COLORS.BORDER || '#e2e8f0'}`,
          backgroundColor: '#fff',
          flexShrink: 0,
        }}>
          <IconButton onClick={onClose} size="small" sx={{ color: '#2563eb', p: 0.5 }}>
            <ArrowBackIcon sx={{ fontSize: '20px' }} />
          </IconButton>
          <Typography sx={{ fontSize: '18px', fontWeight: 600, color: COLORS.TEXT_PRIMARY || '#0f172a', flex: 1 }}>
            Edit Note
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ border: '1px solid #e2e8f0', borderRadius: '4px', p: '4px' }}>
            <CloseIcon sx={{ fontSize: '18px', color: '#2563eb' }} />
          </IconButton>
        </Box>
        
        {/* Main Content (Form) */}
        <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#f8fafc' }}>
          <EditNoteForm noteData={noteData} />
        </Box>

        {/* Footer */}
        <Divider />
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 2, bgcolor: '#fff', flexShrink: 0 }}>
          <Button 
            variant="outlined" 
            onClick={onClose} 
            sx={{ 
              textTransform: 'none', 
              borderColor: '#e2e8f0', 
              color: '#2563eb', 
              fontWeight: 600, 
              px: 4, 
              py: 1,
              borderRadius: '6px'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              if (onSave) onSave();
              onClose();
            }}
            sx={{ 
              textTransform: 'none', 
              bgcolor: '#2563eb', 
              boxShadow: 'none', 
              fontWeight: 600, 
              px: 6, 
              py: 1, 
              borderRadius: '6px',
              '&:hover': { bgcolor: '#1a50c7' } 
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EditNoteDrawer;
