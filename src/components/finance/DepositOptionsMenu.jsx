import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Menu, 
  MenuItem, 
  ListItemText
} from '@mui/material';

const DepositOptionsMenu = ({ anchorEl, onClose, onSelect }) => {
  const open = Boolean(anchorEl);

  const menuOptions = [
    { 
      id: 'patient-deposit', 
      label: 'Add Patient Deposit'
    },
    { 
      id: 'insurance-deposit', 
      label: 'Add Insurance Deposit'
    },
    { 
      id: 'courtesy-credit', 
      label: 'Add Courtesy Credit'
    }
  ];

  const handleSelect = (optionId) => {
    onSelect(optionId);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 220,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          '& .MuiMenuItem-root': {
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: '#f5f5f5'
            }
          }
        }
      }}
    >
      {menuOptions.map((option) => (
        <MenuItem 
          key={option.id} 
          onClick={() => handleSelect(option.id)}
          sx={{ 
            borderBottom: '1px solid #f0f0f0',
            '&:last-child': {
              borderBottom: 'none'
            }
          }}
        >
          <ListItemText 
            primary={option.label}
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          />
        </MenuItem>
      ))}
    </Menu>
  );
};

export default DepositOptionsMenu;
