import React from 'react';
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
import { Close as CloseIcon, Campaign as MegaphoneIcon } from '@mui/icons-material';

const latestTemplates = [
  'Membership Plan-941944290',
  'Membership Plan',
  'Use it or Lose it',
  'Leave Us a Review',
];

const CreateCampaignModal = ({ open, onClose, onCreate }) => {
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
            <MegaphoneIcon sx={{ fontSize: '1.5rem', color: '#3B82F6' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1E293B' }}>
            Create New Campaign
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#1E293B', bgcolor: '#F8FAFC' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider sx={{ borderColor: '#E5E9F2' }} />
      
      <DialogContent sx={{ p: 4, pt: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%', mb: 4, alignItems: 'flex-end' }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>Campaign Name*</Typography>
            <TextField 
              size="small" 
              fullWidth 
              placeholder="E.g., Winter Newsletter"
              sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '0.85rem', borderRadius: 1.5, '& fieldset': { borderColor: '#E5E9F2' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }} 
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>Email Subject</Typography>
            <TextField 
              size="small" 
              fullWidth 
              placeholder="Keep it catchy!"
              sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '0.85rem', borderRadius: 1.5, '& fieldset': { borderColor: '#E5E9F2' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }} 
            />
          </Box>
          <Button 
            variant="contained" 
            onClick={onCreate}
            sx={{ bgcolor: '#3B82F6', textTransform: 'none', fontWeight: 600, borderRadius: 1.5, px: 3, height: 40, boxShadow: 'none', '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' } }}
          >
            Create
          </Button>
        </Box>

        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', mb: 1 }}>Latest Templates</Typography>
          <Divider sx={{ borderColor: '#E5E9F2', mb: 1 }} />
          {latestTemplates.map((template, idx) => (
            <React.Fragment key={idx}>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 1.5, cursor: 'pointer', '&:hover': { bgcolor: '#F8FAFC' } }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                  {template}
                </Typography>
              </Box>
              {idx < latestTemplates.length - 1 && <Divider sx={{ borderColor: '#F1F5F9' }} />}
            </React.Fragment>
          ))}
          <Typography sx={{ fontSize: '0.85rem', color: '#3B82F6', fontWeight: 600, mt: 2, cursor: 'pointer', display: 'inline-block', '&:hover': { color: '#2563EB' } }}>
            View all templates
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignModal;
