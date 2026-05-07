import React from 'react';
import { Menu, MenuItem } from '@mui/material';

const ReEstimateMenu = ({ anchorEl, open, onClose, onOptionClick }) => {
  const reEstimateOptions = [
    'Adjusted Fee Treatment Plan',
    '15% Friends + Family',
    'No Grouping',
    'Grouped By Tooth/Area',
    'Grouped By Code - Non-Contracted Ins',
    'Without Insurance Estimates - Itemized',
    'Grouped By Code - Contracted Ins',
    'With Insurance Estimates Itemized'
  ];

  const handleItemClick = (option) => {
    if (onOptionClick) {
      onOptionClick(option);
    }
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          mt: 0.5,
          bgcolor: '#fff',
          '& .MuiMenuItem-root': {
            fontSize: '12px',
            py: 0.5,
            borderBottom: '1px solid #eee',
            '&:last-child': {
              borderBottom: 'none'
            }
          },
          '& .Mui-selected': {
            bgcolor: '#5c6bc0 !important',
            color: '#fff'
          }
        }
      }}
    >
      {reEstimateOptions.map((option) => (
        <MenuItem key={option} onClick={() => handleItemClick(option)}>
          {option}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ReEstimateMenu;
