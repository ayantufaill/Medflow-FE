import React, { useState } from 'react';
import { Box, styled, Tooltip, Menu, MenuItem } from '@mui/material';
import {
  CurrencyExchangeOutlined,
  SavingsOutlined,
  Print,
  CloudUploadOutlined,
  EventOutlined
} from '@mui/icons-material';
import ShareDropdown from './ShareDropdown';

// --- STYLED COMPONENTS ---
export const IconContainer = styled(Box)({
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
});

// --- MUI ICON COMPONENTS ---

// 1. Bill/Scroll Icon - Invoices
export const IconBill = () => (
  <Tooltip title="Invoices" placement="bottom">
    <IconContainer>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M4 4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4H6" stroke="#000" strokeWidth="1.2" fill="#fff" />
        <path d="M4 6H18" stroke="#000" strokeWidth="1.2" />
        <text x="8" y="15" fill="#444" fontSize="10" fontWeight="bold" fontFamily="Arial">$</text>
      </svg>
    </IconContainer>
  </Tooltip>
);

// 2. User Wallet Icon - Patient Payment
export const IconUserWallet = ({ onClick }) => (
  <Tooltip title="Patient Payment" placement="bottom">
    <IconContainer onClick={onClick} sx={{ cursor: 'pointer' }}>
      <svg width="32" height="32" viewBox="0 0 24 24">
        <rect x="4" y="6" width="16" height="12" rx="2" fill="#8d6e63" stroke="#000" strokeWidth="1" />
        <rect x="14" y="10" width="6" height="4" fill="#6d4c41" stroke="#000" strokeWidth="1" />
        <circle cx="8" cy="10" r="2.5" fill="#1de9b6" stroke="#000" strokeWidth="1" />
        <path d="M4 18C4 15.5 5.5 14 8 14C10.5 14 12 15.5 12 18" fill="#1de9b6" stroke="#000" strokeWidth="1" />
      </svg>
    </IconContainer>
  </Tooltip>
);

// 3. Insurance Shield Icon - Add Claim
export const IconInsuranceWithDropdown = ({ onClaimSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (option) => {
    if (onClaimSelect) onClaimSelect(option);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Add Claim" placement="bottom">
        <IconContainer onClick={handleClick} sx={{ cursor: 'pointer' }}>
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path d="M12 2L4 5V11C4 16.1 7.4 20.8 12 22C16.6 20.8 20 16.1 20 11V5L12 2Z" fill="#cfd8dc" stroke="#000" strokeWidth="1" />
            <path d="M12 7V17M7 12H17" stroke="#1976d2" strokeWidth="2" />
          </svg>
        </IconContainer>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { boxShadow: '0px 2px 8px rgba(0,0,0,0.1)', minWidth: 150 } }}
      >
        <MenuItem onClick={() => handleSelect('manual')} sx={{ fontSize: '0.875rem' }}>Manual Claims</MenuItem>
        <MenuItem onClick={() => handleSelect('electronic')} sx={{ fontSize: '0.875rem' }}>Electronic Claims</MenuItem>
      </Menu>
    </>
  );
};

// 4. Insurance Wallet Icon - Insurance Payment
export const IconInsuranceWallet = ({ onClick }) => (
  <Tooltip title="Insurance Payment" placement="bottom">
    <IconContainer onClick={onClick} sx={{ cursor: 'pointer' }}>
      <svg width="32" height="32" viewBox="0 0 24 24">
        <rect x="4" y="6" width="16" height="12" rx="2" fill="#8d6e63" stroke="#000" strokeWidth="1" />
        <rect x="14" y="10" width="6" height="4" fill="#6d4c41" stroke="#000" strokeWidth="1" />
        <path d="M8 8L3 10V16C3 19.1 5.4 21.8 8 23C10.6 21.8 13 19.1 13 16V10L8 8Z" fill="#cfd8dc" stroke="#000" strokeWidth="1" />
        <path d="M8 12V20M4 16H12" stroke="#1976d2" strokeWidth="1.5" />
      </svg>
    </IconContainer>
  </Tooltip>
);

// 5. Refresh Coin Icon - Courtesy Refund
export const IconRefreshCoin = ({ onClick }) => (
  <Tooltip title="Courtesy Refund" placement="bottom">
    <IconContainer onClick={onClick} sx={{ cursor: 'pointer' }}>
      <CurrencyExchangeOutlined sx={{ fontSize: 28, color: '#f57c00' }} />
    </IconContainer>
  </Tooltip>
);

// 6. Piggy Bank Icon - Print (Wait, the original code had a comment "Piggy Bank Icon - Print" but tooltip says Patient Deposit)
export const IconPiggyBank = ({ onClick }) => (
  <Tooltip title="Patient Deposit" placement="bottom">
    <IconContainer onClick={onClick} sx={{ cursor: 'pointer' }}>
      <SavingsOutlined sx={{ fontSize: 32, color: '#f8bbd0' }} />
    </IconContainer>
  </Tooltip>
);

// 7. Print Icon - Print
export const IconPrinter = ({ onClick }) => (
  <Tooltip title="Print" placement="bottom">
    <IconContainer onClick={onClick} sx={{ cursor: 'pointer' }}>
      <Print sx={{ fontSize: 28, color: '#4dd0e1' }} />
    </IconContainer>
  </Tooltip>
);

// 8. Cloud Upload Icon with Dropdown - Share
export const IconCloudUpload = ({ onShareSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (optionId) => {
    if (onShareSelect) onShareSelect(optionId);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Share" placement="bottom">
        <IconContainer onClick={handleClick} sx={{ cursor: 'pointer' }}>
          <CloudUploadOutlined sx={{ fontSize: 28, color: '#0288d1' }} />
        </IconContainer>
      </Tooltip>
      <ShareDropdown anchorEl={anchorEl} onClose={handleClose} onSelect={handleSelect} />
    </>
  );
};

// 9. Cash Plus Icon - Account Adjustment
export const IconCashPlus = ({ onClick }) => (
  <Tooltip title="Account Adjustment" placement="bottom">
    <IconContainer onClick={onClick} sx={{ cursor: 'pointer' }}>
      <svg width="30" height="30" viewBox="0 0 24 24">
        <rect x="2" y="7" width="14" height="10" rx="1" fill="#a5d6a7" stroke="#000" strokeWidth="1" />
        <text x="9" y="14" fill="#2e7d32" fontSize="8" fontWeight="bold">$</text>
        <circle cx="18" cy="16" r="5" fill="#81d4fa" stroke="#000" strokeWidth="1" />
        <path d="M18 13V19M15 16H21" stroke="#0288d1" strokeWidth="2" />
      </svg>
    </IconContainer>
  </Tooltip>
);

// 10. Cash Minus Icon - Account Adjustment
export const IconCashMinus = ({ onClick }) => (
  <Tooltip title="Account Adjustment" placement="bottom">
    <IconContainer onClick={onClick} sx={{ cursor: 'pointer' }}>
      <svg width="30" height="30" viewBox="0 0 24 24">
        <rect x="2" y="7" width="14" height="10" rx="1" fill="#a5d6a7" stroke="#000" strokeWidth="1" />
        <text x="9" y="14" fill="#2e7d32" fontSize="8" fontWeight="bold">$</text>
        <circle cx="18" cy="16" r="5" fill="#81d4fa" stroke="#000" strokeWidth="1" />
        <path d="M15 16H21" stroke="#0288d1" strokeWidth="2" />
      </svg>
    </IconContainer>
  </Tooltip>
);

// 11. Calendar Icon - Create Payment Plan
export const IconCalendar = ({ onClick }) => (
  <Tooltip title="Create Payment Plan" placement="bottom">
    <IconContainer onClick={onClick} sx={{ cursor: 'pointer' }}>
      <EventOutlined sx={{ fontSize: 28, color: '#0288d1' }} />
    </IconContainer>
  </Tooltip>
);
