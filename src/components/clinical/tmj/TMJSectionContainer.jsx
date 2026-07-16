import React from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const TMJSectionContainer = ({ title, isExpanded, onToggle, children, statusColor = '#10b981' }) => {
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '10px', mb: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box 
        onClick={onToggle}
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2, 
          px: 3,
          backgroundColor: '#f8fafc',
          cursor: 'pointer', 
          userSelect: 'none',
          borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            backgroundColor: statusColor, 
            border: statusColor === '#10b981' ? '3px solid #d1fae5' : '3px solid #fee2e2',
            boxSizing: 'content-box',
            mr: 1.5 
          }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
            {title}
          </Typography>
        </Box>
        <IconButton size="small">
          {isExpanded ? (
            <KeyboardArrowUpIcon sx={{ color: '#64748b', fontSize: 20 }} />
          ) : (
            <KeyboardDoubleArrowDownIcon sx={{ color: '#64748b', fontSize: 20 }} />
          )}
        </IconButton>
      </Box>

      {/* Body */}
      {isExpanded && (
        <Box sx={{ p: 3, backgroundColor: '#ffffff' }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default TMJSectionContainer;
