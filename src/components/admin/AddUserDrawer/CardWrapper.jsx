import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const CardWrapper = ({ icon, title, children }) => (
  <Paper elevation={0} sx={{ mb: 3, borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
    {title && (
      <Box sx={{ 
        backgroundColor: '#F3F8FD', 
        px: 3, 
        py: 2, 
        borderBottom: '1px solid #e0e0e0', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5 
      }}>
        {icon && <img src={icon} alt="" style={{ width: 24, height: 24 }} />}
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', lineHeight: '20px', color: '#111' }}>
          {title}
        </Typography>
      </Box>
    )}
    <Box sx={{ p: 3, backgroundColor: '#FFFFFF' }}>
      {children}
    </Box>
  </Paper>
);

export default CardWrapper;
