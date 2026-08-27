import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Button } from '@mui/material';
import { COLORS } from '../../constants/colors';

const TYPO = {
  fontFamily: 'Inter, sans-serif',
};

const ClearinghouseMessageDialog = ({ open, onClose, claim }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      sx={{ zIndex: 1600 }}
      PaperProps={{
        sx: {
          borderRadius: '14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Typography sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
          Clearinghouse Rejection Reason
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, pt: 0 }}>
        <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: '8px', border: `1px solid ${COLORS.BORDER}` }}>
          <Typography sx={{ fontFamily: TYPO.fontFamily, fontSize: '0.85rem', color: '#334155' }}>
            {claim?.clearingHouseMessage || "No rejection reason provided."}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ 
              textTransform: 'none',
              borderColor: COLORS.BORDER,
              color: COLORS.TEXT_PRIMARY,
              fontWeight: 600,
              borderRadius: '8px',
              px: 3,
              py: 0.75,
              '&:hover': {
                borderColor: COLORS.BORDER_DARK,
                backgroundColor: COLORS.SURFACE_HOVER,
              },
            }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ClearinghouseMessageDialog;
