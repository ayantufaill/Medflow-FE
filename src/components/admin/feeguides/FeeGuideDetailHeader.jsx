import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const actionButtonStyle = {
  color: '#2262ef',
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 600,
  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
};

const FeeGuideDetailHeader = ({ feeGuideName, onSetProvider, onRoundUp, onUpload }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: 700 }}>
        {feeGuideName}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button sx={actionButtonStyle} onClick={onSetProvider}>Set Provider Fee Guide</Button>
        <Button sx={{ ...actionButtonStyle, color: '#999' }}>Reset Fee Guide</Button>
        <Button sx={actionButtonStyle} onClick={onRoundUp}>Round Up Fee Guide</Button>
        <Button sx={actionButtonStyle} endIcon={<HelpOutlineIcon sx={{ fontSize: '0.85rem' }} />} onClick={onUpload}>Upload Fee Guide</Button>
      </Box>
    </Box>
  );
};

export default FeeGuideDetailHeader;
