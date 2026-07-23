import React from 'react';
import { Box, Typography } from '@mui/material';

const PracticeSettingCard = ({ title, subtitle, icon, children }) => {
  return (
    <Box 
      sx={{ 
        bgcolor: '#fff', 
        borderRadius: 2, 
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        height: '100%'
      }}
    >
      <Box 
        sx={{ 
          bgcolor: '#F2F6FC', 
          px: 2, 
          py: 1.5, 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}
      >
        {icon && (
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: '#eff6ff', 
              borderRadius: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#3b82f6'
            }}
          >
            {icon}
          </Box>
        )}
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '12px', color: '#11223F', textTransform: 'uppercase' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: '11px', color: '#9ca3af' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      
      <Box sx={{ p: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

export default PracticeSettingCard;
