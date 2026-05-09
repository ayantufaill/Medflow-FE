import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Language as GlobeIcon,
} from '@mui/icons-material';

const PreviewCampaignModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2, p: 0, minHeight: 400 } }}>
      <DialogContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Placeholder for Header Image */}
        <Box sx={{ width: '80%', height: 100, bgcolor: '#5d4037', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, borderRadius: 1, mb: 4 }}>
          THE DENTAL STUDIO
        </Box>

        {/* Email Body content */}
        <Box sx={{ width: '80%', mb: 4 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#333', mb: 2 }}>
            Hi Yash,
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#333', mb: 2, lineHeight: 1.6 }}>
            I hope you're doing well. I'm reaching out with an important update about your dental membership plan.
            We will be transitioning all membership plans from the FFS platform into our own practice software. This allows us to manage everything in-house so we can take care of your accounting and membership details directly. Our goal is to keep things simple for you and provide an even smoother experience.
            There is nothing you need to do right now. When your plan is approaching renewal, we will reach out to gather any updated billing information that may be needed. You may receive an email that your membership has been terminated with the existing platform in line with the evening platform.
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#333', mb: 2, lineHeight: 1.6 }}>
            All membership updates will be completed by December 31, 2025. If you have any questions in the meantime, please feel free to call or email us. We're always here to help.
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#333', mt: 3 }}>
            Warmly,
            <br/>
            Robin | Front Office Coordinator
          </Typography>
        </Box>

        {/* Footer Area */}
        <Box sx={{ width: '100%', textAlign: 'center', pt: 3, borderTop: '1px solid #eee' }}>
          <Typography sx={{ fontSize: '0.8rem', color: '#666', mb: 1 }}>Follow us</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            <FacebookIcon sx={{ color: '#4267B2', fontSize: '1.2rem' }} />
            <GlobeIcon sx={{ color: '#EA4335', fontSize: '1.2rem' }} />
            <InstagramIcon sx={{ color: '#E1306C', fontSize: '1.2rem' }} />
            <TwitterIcon sx={{ color: '#1DA1F2', fontSize: '1.2rem' }} />
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: '#555', mb: 0.5 }}>
            2301 Olympus Dr, Suite 200 Flower Mound, TX 75028
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#555', mb: 0.5 }}>
            Phone: +1 (214) 555-0298
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#555', mb: 2 }}>
            Email: <span style={{ color: '#1976d2', fontWeight: 600 }}>hello@yourdentalstudio.com</span>
          </Typography>
          
          <Typography sx={{ fontSize: '0.75rem', color: '#555' }}>Office Hours</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#555', fontWeight: 600 }}>Tuesday 8 AM - 3 PM</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#555', fontWeight: 600 }}>Wednesday 8 AM - 3 PM</Typography>
        </Box>
        
      </DialogContent>
    </Dialog>
  );
};

export default PreviewCampaignModal;
