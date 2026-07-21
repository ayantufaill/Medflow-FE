import React from 'react';
import { Box, Typography } from '@mui/material';

const InfoCard = ({ title, icon, children }) => {
  return (
    <Box 
      sx={{ 
        bgcolor: '#fff', 
        borderRadius: '10px', 
        border: '1px solid #E6E8EC',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box 
        sx={{ 
          bgcolor: '#F2F6FC', 
          px: 2, 
          py: 1.5, 
          borderBottom: '1px solid #E6E8EC',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}
      >
        {icon && (
          <Box 
            sx={{ 
              width: 24, 
              height: 24, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#3B63E0'
            }}
          >
            {icon}
          </Box>
        )}
        <Typography sx={{ fontWeight: 700, fontSize: '12px', color: '#11223F', textTransform: 'uppercase' }}>
          {title}
        </Typography>
      </Box>
      
      <Box sx={{ p: 3, flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default InfoCard;
