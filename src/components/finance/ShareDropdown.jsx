import React, { useState } from 'react';
import { 
  Menu, 
  MenuItem, 
  ListItemText,
  Dialog,
  DialogContent
} from '@mui/material';
import ShareMethodSubmenu from './ShareMethodSubmenu';
import ShareByEmail from './ShareByEmail';

const ShareDropdown = ({ anchorEl, onClose, onSelect }) => {
  const open = Boolean(anchorEl);
  const [statementSubMenuAnchor, setStatementSubMenuAnchor] = useState(null);
  const [receiptSubMenuAnchor, setReceiptSubMenuAnchor] = useState(null);
  const [shareMethodAnchor, setShareMethodAnchor] = useState(null);
  const [shareMethodBaseId, setShareMethodBaseId] = useState('');
  const [shareStatementOpen, setShareStatementOpen] = useState(false);

  const menuOptions = [
    { id: 'share-statement', label: 'Share statement with patient', hasSubmenu: true },
    { id: 'request-payment', label: 'Request a quick payment' },
    { id: 'share-receipt', label: 'Share receipt with patient', hasSubmenu: true }
  ];

  const statementSubOptions = [
    { id: 'share-statement-patient', label: 'Patient Payment Receipt' },
    { id: 'share-statement-family', label: 'Family Payment Receipt' },
    { id: 'share-statement-itemized', label: 'Itemized Receipt' }
  ];

  const handleSelect = (optionId) => {
    if (onSelect) {
      onSelect(optionId);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleStatementClick = (event) => {
    // Directly open the share method submenu for statements
    setShareMethodBaseId('share-statement');
    setShareMethodAnchor(event.currentTarget);
  };

  const handleStatementSubClose = () => {
    setStatementSubMenuAnchor(null);
  };

  const handleReceiptClick = (event) => {
    setReceiptSubMenuAnchor(event.currentTarget);
  };

  const handleReceiptSubClose = () => {
    setReceiptSubMenuAnchor(null);
  };

  const handleReceiptSubSelect = (event, optionId) => {
    // When a receipt option is clicked, open the share method submenu
    setShareMethodBaseId(optionId);
    setShareMethodAnchor(event.currentTarget);
  };

  const handleShareMethodClose = () => {
    setShareMethodAnchor(null);
  };

  const handleShareMethodSelect = (optionId) => {
    // Check if the selected option is "by email"
    if (optionId.includes('-email')) {
      // Close all menus first
      setShareMethodAnchor(null);
      setStatementSubMenuAnchor(null);
      setReceiptSubMenuAnchor(null);
      
      // Use setTimeout to ensure menus close before opening dialog
      setTimeout(() => {
        setShareStatementOpen(true);
      }, 150);
      
      // Don't call onClose() here - let the dialog open independently
      return;
    }
    
    if (onSelect) {
      onSelect(optionId);
    }
    handleShareMethodClose();
    handleStatementSubClose();
    handleReceiptSubClose();
    if (onClose) {
      onClose();
    }
  };

  const handleShareStatementClose = () => {
    setShareStatementOpen(false);
  };

  return (
    <>
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
          onClick={(e) => {
            if (option.id === 'share-statement') {
              handleStatementClick(e);
            } else if (option.id === 'share-receipt') {
              handleReceiptClick(e);
            } else {
              handleSelect(option.id);
            }
          }}
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

      {/* Receipt Sub-menu - Shows receipt options */}
      <Menu
        anchorEl={receiptSubMenuAnchor}
        open={Boolean(receiptSubMenuAnchor)}
        onClose={handleReceiptSubClose}
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
        {statementSubOptions.map((option) => (
          <MenuItem 
            key={option.id} 
            onClick={(e) => handleReceiptSubSelect(e, option.id)}
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

      {/* Share Method Submenu - Reusable for all share options */}
      <ShareMethodSubmenu
        anchorEl={shareMethodAnchor}
        onClose={handleShareMethodClose}
        onSelect={handleShareMethodSelect}
        baseId={shareMethodBaseId}
      />
    </Menu>

      {/* Share By Email Dialog - Outside Menu to prevent closing */}
      <Dialog
        open={shareStatementOpen}
        onClose={handleShareStatementClose}
        maxWidth="sm"
        fullWidth={false}
      >
        <DialogContent sx={{ p: 0 }}>
          <ShareByEmail onClose={handleShareStatementClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareDropdown;
