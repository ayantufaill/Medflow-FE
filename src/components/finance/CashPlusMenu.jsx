import React from 'react';
import { 
  Menu, 
  MenuItem, 
  ListItemText
} from '@mui/material';

const CashPlusMenu = ({ anchorEl, onClose, onSelect }) => {
  const open = Boolean(anchorEl);

  const menuItems = [
    { id: 'broken-appt', label: 'Broken appt' },
    { id: 'late-cancellation', label: 'Late cancellation' },
    { id: 'late-payment-30', label: 'Late payment 30 days' },
    { id: 'late-payment-60', label: 'Late payment 60 days' },
    { id: 'late-payment-90', label: 'Late payment 90 days' },
    { id: 'flat-rate', label: 'Flat rate' },
    { id: 'percentage', label: 'Percentage' }
  ];

  const handleSelect = (item) => {
    if (onSelect) {
      onSelect(item);
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
      {menuItems.map((item, index) => (
        <MenuItem 
          key={item.id} 
          onClick={() => handleSelect(item)}
          sx={{ 
            borderBottom: '1px solid #f0f0f0',
            '&:last-child': {
              borderBottom: 'none'
            }
          }}
        >
          <ListItemText 
            primary={item.label}
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

export default CashPlusMenu;
