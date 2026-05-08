import React, { useState } from 'react';
import { Menu, MenuItem, Typography } from '@mui/material';

const PrintSubmenu = ({ anchorEl, open, onClose, onSelect, options }) => {
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
          minWidth: 180,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          '& .MuiMenuItem-root': {
            py: 1,
            px: 2,
            '&:hover': {
              bgcolor: '#f5f5f5'
            }
          }
        }
      }}
    >
      {options.map((option) => (
        <MenuItem key={option} onClick={() => { onSelect(option); onClose(); }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>{option}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};

const PatientPrintOptions = ({ anchorEl, open, onClose, onSelect }) => {
  const [statementAnchor, setStatementAnchor] = useState(null);
  const [receiptAnchor, setReceiptAnchor] = useState(null);

  const handleSelect = (option) => {
    if (onSelect) {
      onSelect(option);
    }
    // Only close main menu if it's not a sub-menu trigger
    if (!['Patient Account Statement', 'Print payment receipts'].includes(option)) {
      onClose();
    }
  };

  return (
    <>
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
        <MenuItem 
          onClick={(e) => setStatementAnchor(e.currentTarget)}
          sx={{ py: 1 }}
        >
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
            Patient Account Statement
          </Typography>
        </MenuItem>

        <MenuItem onClick={() => handleSelect('Family open invoices')} sx={{ py: 1 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
            Family open invoices
          </Typography>
        </MenuItem>

        <MenuItem 
          onClick={(e) => setReceiptAnchor(e.currentTarget)}
          sx={{ py: 1 }}
        >
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
            Print payment receipts
          </Typography>
        </MenuItem>

        <MenuItem onClick={() => handleSelect('Itemized receipt')} sx={{ py: 1 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>
            Itemized receipt
          </Typography>
        </MenuItem>
      </Menu>

      <PrintSubmenu
        anchorEl={statementAnchor}
        open={Boolean(statementAnchor)}
        onClose={() => setStatementAnchor(null)}
        onSelect={handleSelect}
        options={['Simple Statement', 'Detailed Statement']}
      />

      <PrintSubmenu
        anchorEl={receiptAnchor}
        open={Boolean(receiptAnchor)}
        onClose={() => setReceiptAnchor(null)}
        onSelect={handleSelect}
        options={['patient payment receipt', 'family patient receipt']}
      />
    </>
  );
};

export default PatientPrintOptions;
