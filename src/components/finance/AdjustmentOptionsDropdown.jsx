import React from 'react';
import { Menu, MenuItem, Typography } from '@mui/material';

const AdjustmentOptionsDropdown = ({ anchorEl, open, onClose }) => {
  const options = [
    "Credit (subtraction)",
    "Debit (addition)",
    "Insurance Write-Off",
    "Membership Adjustment"
  ];

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
          minWidth: 200
        }
      }}
    >
      {options.map((option, index) => (
        <MenuItem key={index} onClick={onClose} sx={{ py: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 500, color: '#333' }}>
            {option}
          </Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default AdjustmentOptionsDropdown;
