import React from 'react';
import { 
  Menu, 
  MenuItem, 
  ListItemText
} from '@mui/material';

const ShareMethodSubmenu = ({ anchorEl, onClose, onSelect, baseId }) => {
  const open = Boolean(anchorEl);

  const shareMethods = [
    { id: `${baseId}-email`, label: 'By Email' },
    { id: `${baseId}-text`, label: 'By Text' }
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
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          minWidth: 150,
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
      {shareMethods.map((option) => (
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

export default ShareMethodSubmenu;
