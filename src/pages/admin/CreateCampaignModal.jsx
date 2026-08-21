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
import { Close as CloseIcon, Campaign as MegaphoneIcon } from '@mui/icons-material';

const latestTemplates = [
  'Membership Plan-941944290',
  'Membership Plan',
  'Use it or Lose it',
  'Leave Us a Review',
];

const CreateCampaignModal = ({ open, onClose, onCreate }) => {
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');

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
            <MegaphoneIcon sx={{ fontSize: '20px', color: '#2563EB' }} />
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
              Create New Campaign
            </Typography>
            <Typography sx={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 400, 
              fontSize: '11.5px', 
              lineHeight: '17.25px', 
              color: '#6B7280' 
            }}>
              Set up a new email campaign for your patients
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#1E293B', bgcolor: '#F8FAFC' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4, pt: '32px !important', bgcolor: '#ffffff' }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%', mb: 4, alignItems: 'flex-end' }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>Campaign Name*</Typography>
            <TextField 
              size="small" 
              fullWidth 
              placeholder="E.g., Winter Newsletter"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '0.85rem', borderRadius: 1.5, '& fieldset': { borderColor: '#E5E9F2' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }} 
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>Email Subject</Typography>
            <TextField 
              size="small" 
              fullWidth 
              placeholder="Keep it catchy!"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { height: 40, fontSize: '0.85rem', borderRadius: 1.5, '& fieldset': { borderColor: '#E5E9F2' }, '&:hover fieldset': { borderColor: '#cbd5e1' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }} 
            />
          </Box>
          <Button 
            variant="contained" 
            onClick={() => onCreate({ name: campaignName, subject })}
            disabled={!campaignName.trim()}
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
