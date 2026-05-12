import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const actionButtonStyle = {
  color: '#4b71a1',
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 600,
  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
};

const FeeGuideDetailHeader = ({ feeGuideName, onSetProvider, onRoundUp, onUpload }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography variant="body2" sx={{ color: '#4b71a1', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.85rem' }}>
        <Link to="/admin/finance-management" style={{ textDecoration: 'none', color: 'inherit' }}>Finance Management</Link> 
        <Box component="span" sx={{ mx: 0.2, fontWeight: 700 }}>&gt;</Box>
        <Link to="/admin/finance-management/fee-guide" style={{ textDecoration: 'none', color: 'inherit' }}>Fee Guides</Link>
        <Box component="span" sx={{ mx: 0.2, fontWeight: 700 }}>&gt;</Box>
        <Box component="span" sx={{ color: 'inherit', fontWeight: 600 }}>{feeGuideName}</Box>
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
