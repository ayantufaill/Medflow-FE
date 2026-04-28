import React, { useState } from 'react';
import { Box, Typography, Stack, IconButton, styled, Tooltip } from '@mui/material';
import {
  CurrencyExchangeOutlined,
  SavingsOutlined,
  Print,
  CloudUploadOutlined,
  EventOutlined,
} from '@mui/icons-material';
import ShareDropdown from './ShareDropdown';
import QuickPaymentRequestDialog from './QuickPaymentRequestDialog';
import InsurancePaymentDialog from './InsurancePaymentDialog';
import CashPlusMenu from './CashPlusMenu';
import AddPaymentDialog from './AddPaymentDialog';
import AccountNotesDialog from './AccountNotesDialog';

// --- STYLED COMPONENTS ---

const IconContainer = styled(Box)({
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
});

// --- MUI ICON COMPONENTS ---

// 1. Bill/Scroll Icon - Invoices
const IconBill = () => (
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
const IconUserWallet = ({ onClick }) => (
  <Tooltip title="Patient Payment" placement="bottom">
    <IconContainer onClick={onClick} sx={{ cursor: 'pointer' }}>
      <svg width="32" height="32" viewBox="0 0 24 24">
        <rect x="4" y="6" width="16" height="12" rx="2" fill="#8d6e63" stroke="#000" strokeWidth="1" />
        <rect x="14" y="10" width="6" height="4" fill="#6d4c41" stroke="#000" strokeWidth="1" />
        {/* Man icon */}
        <circle cx="8" cy="10" r="2.5" fill="#1de9b6" stroke="#000" strokeWidth="1" />
        <path d="M4 18C4 15.5 5.5 14 8 14C10.5 14 12 15.5 12 18" fill="#1de9b6" stroke="#000" strokeWidth="1" />
      </svg>
    </IconContainer>
  </Tooltip>
);


// 3. Insurance Shield Icon - Add Claim
const IconInsurance = () => (
  <Tooltip title="Add Claim" placement="bottom">
    <IconContainer>
      <svg width="28" height="28" viewBox="0 0 24 24">
        <path d="M12 2L4 5V11C4 16.1 7.4 20.8 12 22C16.6 20.8 20 16.1 20 11V5L12 2Z" fill="#cfd8dc" stroke="#000" strokeWidth="1" />
        <path d="M12 7V17M7 12H17" stroke="#1976d2" strokeWidth="2" />
      </svg>
    </IconContainer>
  </Tooltip>
);


// 4. Insurance Wallet Icon - Insurance Payment
const IconInsuranceWallet = ({ onClick }) => (
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
const IconRefreshCoin = ({ onClick }) => (
  <Tooltip title="Courtesy Refund" placement="bottom">
    <IconContainer onClick={onClick} sx={{ cursor: 'pointer' }}>
      <CurrencyExchangeOutlined sx={{ fontSize: 28, color: '#f57c00' }} />
    </IconContainer>
  </Tooltip>
);

// 6. Piggy Bank Icon - Print
const IconPiggyBank = () => (
  <Tooltip title="Patient Deposit" placement="bottom">
    <IconContainer>
      <SavingsOutlined sx={{ fontSize: 32, color: '#f8bbd0' }} />
    </IconContainer>
  </Tooltip>
);

// 7. Print Icon - Print
const IconPrinter = () => (
  <Tooltip title="Print" placement="bottom">
    <IconContainer>
      <Print sx={{ fontSize: 28, color: '#4dd0e1' }} />
    </IconContainer>
  </Tooltip>
);

// 8. Cloud Upload Icon with Dropdown - Share
const IconCloudUpload = ({ onShareSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (optionId) => {
    if (onShareSelect) {
      onShareSelect(optionId);
    }
    handleClose();
  };

  return (
    <>
      <Tooltip title="Share" placement="bottom">
        <IconContainer 
          onClick={handleClick}
          sx={{ cursor: 'pointer' }}
        >
          <CloudUploadOutlined sx={{ fontSize: 28, color: '#0288d1' }} />
        </IconContainer>
      </Tooltip>
      
      <ShareDropdown
        anchorEl={anchorEl}
        onClose={handleClose}
        onSelect={handleSelect}
      />
    </>
  );
};

// 9. Cash Plus Icon - Account Adjustment
const IconCashPlus = ({ onClick }) => (
  <Tooltip title="Account Adjustment" placement="bottom">
    <IconContainer onClick={onClick} sx={{ cursor: 'pointer', position: 'relative' }}>
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
const IconCashMinus = () => (
  <Tooltip title="Account Adjustment" placement="bottom">
    <IconContainer>
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
const IconCalendar = () => (
  <Tooltip title="Create Payment Plan" placement="bottom">
    <IconContainer>
      <EventOutlined sx={{ fontSize: 28, color: '#0288d1' }} />
    </IconContainer>
  </Tooltip>
);

const PatientFinanceInfo = ({ view, onCalendarClick, onCashMinusClick, onRefreshCoinClick, onAddFlagsClick, onOpenDepositMenu }) => {
  const [showQuickPayment, setShowQuickPayment] = useState(false);
  const [showInsurancePayment, setShowInsurancePayment] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAccountNotes, setShowAccountNotes] = useState(false);
  const [cashPlusAnchorEl, setCashPlusAnchorEl] = useState(null);
  
  const handleShareSelect = (optionId) => {
    if (optionId === 'request-payment') {
      setShowQuickPayment(true);
    } else {
      console.log('Share option selected:', optionId);
    }
  };

  const handleInsuranceWalletClick = () => {
    setShowInsurancePayment(true);
  };

  const handleUserWalletClick = () => {
    setShowAddPayment(true);
  };

  const handlePaymentApply = (paymentData) => {
    console.log('Payment applied:', paymentData);
    // Add logic to handle payment data here
    // This could include API calls, state updates, etc.
  };

  const handleInsurancePaymentSave = (paymentData) => {
    console.log('Insurance payment saved:', paymentData);
    // Add API call or state update logic here
    setShowInsurancePayment(false);
  };

  const handleCashPlusClick = (event) => {
    setCashPlusAnchorEl(event.currentTarget);
  };

  const handleCashPlusClose = () => {
    setCashPlusAnchorEl(null);
  };

  const handleCashPlusSelect = (item) => {
    console.log('Cash Plus option selected:', item);
    // Add logic for handling the selected option here
  };

  const handleAddAccountNoteClick = () => {
    setShowAccountNotes(true);
  };

  const pixelIcons = [
    // { Icon: IconBill }, // Invoices icon disabled
    { Icon: IconUserWallet, onClick: handleUserWalletClick },
    // { Icon: IconInsurance }, // Add Claim icon disabled
    { Icon: IconInsuranceWallet, onClick: handleInsuranceWalletClick },
    { Icon: IconRefreshCoin, onClick: onRefreshCoinClick },
    { Icon: IconPiggyBank, onClick: onOpenDepositMenu },
    // { Icon: IconPrinter }, // Print icon disabled
    { Icon: IconCloudUpload, onShareSelect: handleShareSelect },
    { Icon: IconCashPlus, onClick: handleCashPlusClick },
    { Icon: IconCashMinus, onClick: onCashMinusClick },
    { Icon: IconCalendar, onClick: onCalendarClick }
  ];

  return (
    <Box sx={{ width: '38%', flexShrink: 0, pr: 2 }}>
      <Box sx={{ borderTop: '4px solid #7986cb', width: 'fit-content', minWidth: '80px', textAlign: 'center', p: 1, border: '1px solid #ddd', borderTopWidth: '4px' }}>
        <Typography variant="caption" sx={{ color: '#5c6bc0', fontWeight: 'bold', whiteSpace: 'nowrap' }}>test test</Typography>
      </Box>
      
      <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#5c6bc0', cursor: 'pointer' }}>Billing flags: </Typography>
        <Typography variant="caption" sx={{ color: '#1976d2', cursor: 'pointer' }} onClick={onAddFlagsClick}>+add flags</Typography>
        <Typography variant="caption" sx={{ color: '#1976d2', cursor: 'pointer' }} onClick={handleAddAccountNoteClick}>+add account note</Typography>
      </Stack>

      {/* Custom Pixel Icon Toolbar - Hidden in Family and Individual View */}
      {view !== 'family' && view !== 'individual' && (
        <Stack direction="row" spacing={0.2} sx={{ mb: 2, flexWrap: 'wrap', '& button': { p: 0.25 } }}>
          {pixelIcons.map((item, i) => (
            <IconButton 
              key={i} 
              size="small" 
              onClick={item.onClick}
              sx={{ '&:hover': { bgcolor: 'transparent' } }}
            >
              <item.Icon onShareSelect={item.onShareSelect} onClick={item.onClick} />
            </IconButton>
          ))}
        </Stack>
      )}

      {/* Quick Payment Request Dialog */}
      {showQuickPayment && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowQuickPayment(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '500px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <QuickPaymentRequestDialog 
              onClose={() => setShowQuickPayment(false)}
            />
          </Box>
        </Box>
      )}

      {/* Insurance Payment Dialog */}
      {showInsurancePayment && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowInsurancePayment(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '1200px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <InsurancePaymentDialog 
              onClose={() => setShowInsurancePayment(false)}
              onSave={handleInsurancePaymentSave}
            />
          </Box>
        </Box>
      )}

      {/* Add Payment Dialog */}
      {showAddPayment && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowAddPayment(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '1200px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AddPaymentDialog 
              onClose={() => setShowAddPayment(false)}
              onPaymentApply={handlePaymentApply}
            />
          </Box>
        </Box>
      )}

      {/* Cash Plus Menu */}
      <CashPlusMenu
        anchorEl={cashPlusAnchorEl}
        onClose={handleCashPlusClose}
        onSelect={handleCashPlusSelect}
      />

      {/* Account Notes Dialog */}
      {showAccountNotes && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            bgcolor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setShowAccountNotes(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '800px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '8px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AccountNotesDialog 
              onClose={() => setShowAccountNotes(false)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PatientFinanceInfo;
