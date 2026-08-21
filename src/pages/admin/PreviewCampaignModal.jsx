import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  DialogTitle,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Language as GlobeIcon,
  Close as CloseIcon,
  Campaign as MegaphoneIcon,
} from '@mui/icons-material';

const PreviewCampaignModal = ({ open, onClose, campaign }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
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
              Preview Campaign
            </Typography>
            <Typography sx={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 400, 
              fontSize: '11.5px', 
              lineHeight: '17.25px', 
              color: '#6B7280' 
            }}>
              Preview how the campaign will appear to patients
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8', '&:hover': { color: '#1E293B', bgcolor: '#F8FAFC' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, pt: '32px !important', display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#ffffff' }}>
        
        {/* Email Preview Container */}
        <Box sx={{ width: '100%', maxWidth: 600, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px solid #E5E9F2', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          
          {/* Placeholder for Header Image */}
          <Box sx={{ width: '100%', height: 100, bgcolor: '#1E293B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700 }}>
            MedFlow
          </Box>

          {/* Email Body content */}
          <Box sx={{ p: 4 }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#1E293B', mb: 2, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {campaign?.body || 'No content provided.'}
            </Typography>
          </Box>

          {/* Footer Area */}
          <Box sx={{ width: '100%', textAlign: 'center', py: 4, bgcolor: '#F8FAFC', borderTop: '1px solid #E5E9F2' }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 1, fontWeight: 600 }}>Follow us</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 3 }}>
              <FacebookIcon sx={{ color: '#64748b', fontSize: '1.2rem', cursor: 'pointer', '&:hover': { color: '#3B82F6' } }} />
              <GlobeIcon sx={{ color: '#64748b', fontSize: '1.2rem', cursor: 'pointer', '&:hover': { color: '#3B82F6' } }} />
              <InstagramIcon sx={{ color: '#64748b', fontSize: '1.2rem', cursor: 'pointer', '&:hover': { color: '#E1306C' } }} />
              <TwitterIcon sx={{ color: '#64748b', fontSize: '1.2rem', cursor: 'pointer', '&:hover': { color: '#1DA1F2' } }} />
            </Box>
            
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 0.5 }}>
              2301 Olympus Dr, Suite 200 Flower Mound, TX 75028
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 0.5 }}>
              Phone: +1 (214) 555-0298
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 3 }}>
              Email: <span style={{ color: '#3B82F6', fontWeight: 600 }}>hello@yourdentalstudio.com</span>
            </Typography>
            
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 0.5 }}>Office Hours</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#1E293B', fontWeight: 600 }}>Tuesday 8 AM - 3 PM</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#1E293B', fontWeight: 600 }}>Wednesday 8 AM - 3 PM</Typography>
          </Box>
        </Box>
        
      </DialogContent>
    </Dialog>
  );
};

export default PreviewCampaignModal;
