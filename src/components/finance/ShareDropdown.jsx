import React, { useState } from 'react';
import { 
  Menu, 
  MenuItem, 
  ListItemText
} from '@mui/material';

const ShareDropdown = ({ anchorEl, onClose, onSelect }) => {
  const open = Boolean(anchorEl);

  const menuOptions = [
    { id: 'share-statement', label: 'Share statement with patient' },
    { id: 'request-payment', label: 'Request a quick payment' },
    { id: 'share-receipt', label: 'Share receipt with patient' }
  ];

  const handleSelect = (optionId) => {
    if (onSelect) {
      onSelect(optionId);
    }
    if (onClose) {
      onClose();
    }
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

export default ShareDropdown;
