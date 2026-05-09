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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, p: 2 } }}>
      <IconButton sx={{ position: 'absolute', top: 8, right: 8, color: '#999' }} onClick={onClose} size="small">
        <CloseIcon fontSize="small" />
      </IconButton>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4 }}>
        <MegaphoneIcon sx={{ fontSize: '2.5rem', color: '#4caf50', mb: 1 }} />
        <Typography sx={{ fontWeight: 600, mb: 4 }}>Create New Campaign</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, width: '100%', mb: 4, alignItems: 'flex-end' }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>Campaign Name*</Typography>
            <TextField size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { height: 36 } }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>Email Subject</Typography>
            <TextField size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { height: 36 } }} />
          </Box>
          <Button 
            variant="contained" 
            onClick={onCreate}
            sx={{ bgcolor: '#4caf50', textTransform: 'none', fontWeight: 600, borderRadius: 5, px: 3, height: 36, '&:hover': { bgcolor: '#388e3c' } }}
          >
            Create
          </Button>
        </Box>

        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#333', mb: 1 }}>Latest Templates</Typography>
          <Divider sx={{ mb: 1 }} />
          {latestTemplates.map((template, idx) => (
            <React.Fragment key={idx}>
              <Typography sx={{ fontSize: '0.8rem', color: '#555', py: 0.8, cursor: 'pointer', '&:hover': { color: '#1a3a6b' } }}>
                {template}
              </Typography>
              <Divider />
            </React.Fragment>
          ))}
          <Typography sx={{ fontSize: '0.8rem', color: '#1976d2', fontWeight: 600, mt: 2, cursor: 'pointer' }}>
            View all
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignModal;
