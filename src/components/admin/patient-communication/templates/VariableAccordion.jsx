import React, { useState } from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';

export const VariableAccordion = ({ title, children, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box sx={{ borderBottom: '1px solid #E5E9F2' }}>
      <Box 
        onClick={() => setExpanded(!expanded)}
        sx={{ 
          p: 1.5, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: expanded ? '#F0F5FF' : 'transparent',
          '&:hover': { backgroundColor: expanded ? '#F0F5FF' : '#F8FAFC' },
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <Typography sx={{ 
          fontSize: '0.8rem', 
          fontWeight: expanded ? 600 : 500, 
          color: expanded ? '#3B82F6' : '#64748b' 
        }}>
          {title}
        </Typography>
        <ChevronRight sx={{ 
          fontSize: 18, 
          color: expanded ? '#3B82F6' : '#94a3b8',
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease-in-out'
        }} />
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ p: 1.5, pt: 1, backgroundColor: '#FBFCFE' }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};
