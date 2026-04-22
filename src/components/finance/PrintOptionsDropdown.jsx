import React from 'react';
import { Menu, MenuItem, Typography } from '@mui/material';

const PrintOptionsDropdown = ({ anchorEl, open, onClose, onSelect }) => {
  const handleSelect = (option) => {
    if (onSelect) {
      onSelect(option);
    }
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          mt: 1,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          minWidth: 160
        }
      }}
    >
      <MenuItem onClick={() => handleSelect('Simple Statements')} sx={{ py: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 500, color: '#333' }}>
          Simple Statements
        </Typography>
      </MenuItem>
      <MenuItem onClick={() => handleSelect('Detailed Statement')} sx={{ py: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 500, color: '#333' }}>
          Detailed Statement
        </Typography>
      </MenuItem>
    </Menu>
  );
};

export default PrintOptionsDropdown;
