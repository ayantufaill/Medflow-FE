import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { radius } from '../../constants/styles';
import { COLORS } from '../../constants/colors';

const ImportedCoverageBanner = ({ onReview }) => {
  return (
    <Box sx={{ 
      bgcolor: COLORS.SURFACE_TINT, 
      p: 2, 
      borderRadius: radius.lg, 
      mb: 2, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      border: `1px solid ${COLORS.BORDER}`
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: '50%', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <DescriptionIcon sx={{ color: COLORS.ACCENT, fontSize: 28 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: COLORS.TEXT_PRIMARY }}>
            Insurance details were imported
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: COLORS.TEXT_SECONDARY }}>
            This patient uploaded their insurance details
          </Typography>
        </Box>
      </Box>
      <Button 
        variant="contained" 
        size="small"
        onClick={onReview}
        sx={{ 
          bgcolor: COLORS.ACCENT, 
          borderRadius: radius.md, 
          textTransform: 'none', 
          px: 3, 
          fontWeight: 700,
          fontSize: '0.8rem',
          boxShadow: 'none',
          '&:hover': { bgcolor: COLORS.ACCENT_HOVER, boxShadow: 'none' }
        }}
      >
        Review
      </Button>
    </Box>
  );
};

export default ImportedCoverageBanner;
