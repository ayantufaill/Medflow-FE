import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { appointmentService } from '../../services/appointment.service';
import { paymentService } from '../../services/payment.service';
import { invoiceService } from '../../services/invoice.service';
import { createInvoice, invalidatePaymentInvoices } from '../../store/slices/billingSlice';
import { Box, Typography, Stack, IconButton, styled, Tooltip, Menu, MenuItem } from '@mui/material';
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
import InvoiceModal from './InvoiceModal';
import PatientPrintOptions from './PatientPrintOptions';
import PrintReceiptDialog from './PrintReceiptDialog';
import ItemizedReceiptPreview from './ItemizedReceiptPreview';
import SimpleStatementDialog from './SimpleStatementDialog';
import DetailedStatementDialog from './DetailedStatementDialog';
import LateFeeDialog from './LateFeeDialog';
import ManualClaimDialog from './ManualClaimDialog';
import apiClient from '../../config/api';

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
const IconInsuranceWithDropdown = ({ onClaimSelect }) => {
  const [anchorEl, React_useState] = React.useState(null);

  const handleClick = (event) => {
    React_useState(event.currentTarget);
  };

  const handleClose = () => {
    React_useState(null);
  };

  const handleSelect = (option) => {
    if (onClaimSelect) {
      onClaimSelect(option);
    }
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
        PaperProps={{
          sx: {
            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
            minWidth: 150,
          }
        }}
      >
        <MenuItem onClick={() => handleSelect('manual')} sx={{ fontSize: '0.875rem' }}>Manual Claims</MenuItem>
        <MenuItem onClick={() => handleSelect('electronic')} sx={{ fontSize: '0.875rem' }}>Electronic Claims</MenuItem>
      </Menu>
    </>
  );
};


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

const flagColorMap = {
  'alert': '#7dab9f',
  'old patient': '#5e5ba8',
  'family & friends': '#bc6c73',
  'late payment': '#d9975b',
  'needs special care': '#88b7d6',
  'TDS Member': '#a6f272',
  'Botox/Filler': '#eef681',
  'Bioclear Patient': '#cf5dbd',
  'Ortho Patient': '#4d39c0',
'Balance Owed': '#d3562f',
  'appointment_reminder': '#94bc74'
};

const PatientFinanceInfo = ({ view, flags = [], patient = null, onCalendarClick, onCashMinusClick, onRefreshCoinClick, onAddFlagsClick, onOpenDepositMenu }) => {
  const dispatch = useDispatch();
  const [showShare, setShowShare] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [showQuickPayment, setShowQuickPayment] = useState(false);
  const [showInsurancePayment, setShowInsurancePayment] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAccountNotes, setShowAccountNotes] = useState(false);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [cashPlusAnchorEl, setCashPlusAnchorEl] = useState(null);

  const handleInvoiceModalSave = async (data) => {
    const patientId = patient?._id || patient?.id;
    try {
      const payload = {
        patientId: parseInt(patientId, 10) || 1,
        items: data.map(row => {
          let parsedDate = new Date().toISOString();
          if (row.date) {
            const d = new Date(row.date);
            if (!isNaN(d.getTime())) {
              parsedDate = d.toISOString();
            }
          }
          return {
            code: row.code,
            description: row.treatment,
            date: parsedDate,
            site: row.site,
            provider: row.provider,
            writeoff: parseFloat((String(row.writeoff) || '').replace(/[^0-9.-]+/g, '')) || 0,
            ptPortion: parseFloat((String(row.ptPortion) || '').replace(/[^0-9.-]+/g, '')) || 0,
            insPortion: parseFloat((String(row.insPortion) || '').replace(/[^0-9.-]+/g, '')) || 0,
            charge: parseFloat((String(row.charge) || '').replace(/[^0-9.-]+/g, '')) || 0,
            balance: parseFloat((String(row.balance) || '').replace(/[^0-9.-]+/g, '')) || 0,
            dbi: Boolean(row.dbi),
            completed: Boolean(row.completed),
          };
        })
      };

      if (payload.items.length === 0) {
        alert('Please add at least one procedure before saving.');
        return;
      }
      
      await dispatch(createInvoice(payload)).unwrap();
      setShowNewInvoice(false);
      
      // Dispatch custom event so LedgerList can refresh
      window.dispatchEvent(new CustomEvent('refresh-ledger'));
    } catch (err) {
      console.error('Failed to create invoice:', err);
      alert('Failed to create invoice: ' + (err.message || err));
    }
  };
  const [printAnchorEl, setPrintAnchorEl] = useState(null);
  const [showPrintReceipt, setShowPrintReceipt] = useState(false);
  const [showItemizedReceipt, setShowItemizedReceipt] = useState(false);
  const [showSimpleStatement, setShowSimpleStatement] = useState(false);
  const [showDetailedStatement, setShowDetailedStatement] = useState(false);
  const [showLateFee, setShowLateFee] = useState(false);
  const [showManualClaim, setShowManualClaim] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const [isFamilyReceipt, setIsFamilyReceipt] = useState(false);
  
  const handleClaimSelect = (option) => {
    if (option === 'manual') {
      setShowManualClaim(true);
    }
  };

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

  const handlePaymentApply = async (paymentData) => {
    console.log('Payment applied:', paymentData);
    try {
      const patientId = patient?._id || patient?.id;
      if (!patientId) return;

      const totalAmount = parseFloat(paymentData.amount) || 0;
      if (totalAmount <= 0) return;

      // Group by invoice
      for (const invoice of (paymentData.selectedInvoices || [])) {
        const invoiceItems = (paymentData.selectedItems || []).filter(item => item.invoiceId === invoice.id);
        const invoicePaymentAmount = invoiceItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        
        if (invoicePaymentAmount > 0) {
          let methodStr = (paymentData.paymentMethod || 'cash').toLowerCase();
          let backendMethod = 'cash';
          if (methodStr.includes('card')) backendMethod = 'card';
          else if (methodStr.includes('check')) backendMethod = 'check';
          else if (methodStr.includes('insurance')) backendMethod = 'insurance';
          else if (methodStr.includes('ach')) backendMethod = 'ach';
          else if (methodStr.includes('plan')) backendMethod = 'payment_plan';

          const payload = {
            patientId: parseInt(patientId) || patientId,
            invoiceId: invoice.id,
            amount: invoicePaymentAmount,
            paymentMethod: backendMethod,
            paymentDate: new Date().toISOString(),
            status: 'completed',
            notes: paymentData.description || 'Patient payment'
          };
          await paymentService.recordPayment(payload);

          // Mark each individual line item as paid in BillingNote for precise tracking
          await Promise.all(
            invoiceItems.map(item =>
              invoiceService.markItemPaid(invoice.id, item.itemId, parseFloat(item.amount))
                .catch(err => console.warn('markItemPaid failed for item', item.itemId, err))
            )
          );
        }
      }
      
      dispatch(invalidatePaymentInvoices(patientId));
      window.dispatchEvent(new CustomEvent('add-ledger-item'));
      setShowAddPayment(false);
      if (typeof fetchPatientData === 'function') fetchPatientData();
    } catch (err) {
      console.error('Failed to apply payment', err);
    }
  };

  const handleInsurancePaymentSave = (paymentData) => {
    console.log('Insurance payment saved:', paymentData);
    window.dispatchEvent(new CustomEvent('add-ledger-item'));
    setShowInsurancePayment(false);
  };

  const handleCashPlusClick = (event) => {
    setCashPlusAnchorEl(event.currentTarget);
  };

  const handleCashPlusClose = () => {
    setCashPlusAnchorEl(null);
  };

  const createAdjustmentInDb = async (amountVal, notesText) => {
    const patientId = patient?._id || patient?.id;
    if (!patientId) return null;
    
    try {
      const response = await apiClient.post('/adjustments', {
        patientId: parseInt(patientId) || patientId,
        amount: parseFloat(amountVal),
        date: new Date().toISOString(),
        notes: notesText
      });
      return response.data?.data?.adjustment;
    } catch (err) {
      console.error('Error creating backend adjustment:', err);
      return null;
    }
  };

  const handleCashPlusSelect = async (item) => {
    console.log('Cash Plus option selected:', item);
    if (item.id === 'broken-appt' || item.id === 'late-cancellation') {
      const amountVal = 100.00;
      const notesText = item.label || 'Adjustment Fee';
      
      const adjustment = await createAdjustmentInDb(amountVal, notesText);
      const displayedId = adjustment?._id || adjustment?.id || Math.floor(Math.random() * 90000 + 10000).toString();

      const event = new CustomEvent('add-ledger-item', {
        detail: {
          title: `${notesText} (Adj #${displayedId})`,
          amount: `$${amountVal.toFixed(2)}`,
          ptBal: `$${amountVal.toFixed(2)}`,
          invBal: `$${amountVal.toFixed(2)}`,
          useCheckmark: false
        }
      });
      window.dispatchEvent(event);
    } else {
      setSelectedAdjustment(item);
      setShowLateFee(true);
    }
  };

  const handleAddAccountNoteClick = () => {
    setShowAccountNotes(true);
  };

  const handlePrintClick = (event) => {
    setPrintAnchorEl(event.currentTarget);
  };

  const handlePrintClose = () => {
    setPrintAnchorEl(null);
  };

  const handlePrintSelect = (option) => {
    console.log('Print option selected:', option);
    if (option === 'patient payment receipt' || option === 'family patient receipt') {
      setIsFamilyReceipt(option === 'family patient receipt');
      setShowPrintReceipt(true);
    } else if (option === 'Itemized receipt') {
      setShowItemizedReceipt(true);
    } else if (option === 'Simple Statement') {
      setShowSimpleStatement(true);
    } else if (option === 'Detailed Statement') {
      setShowDetailedStatement(true);
    }
  };

  const pixelIcons = [
    { Icon: IconBill, onClick: () => setShowNewInvoice(true) },
    { Icon: IconUserWallet, onClick: handleUserWalletClick },
    { Icon: IconInsuranceWithDropdown, onClaimSelect: handleClaimSelect },
    { Icon: IconInsuranceWallet, onClick: handleInsuranceWalletClick },
    { Icon: IconRefreshCoin, onClick: onRefreshCoinClick },
    { Icon: IconPiggyBank, onClick: onOpenDepositMenu },
    { Icon: IconPrinter, onClick: handlePrintClick },
    { Icon: IconCloudUpload, onShareSelect: handleShareSelect },
    { Icon: IconCashPlus, onClick: handleCashPlusClick },
    { Icon: IconCashMinus, onClick: onCashMinusClick },
    { Icon: IconCalendar, onClick: onCalendarClick }
  ];

  return (
    <Box sx={{ width: '38%', flexShrink: 0, pr: 2 }}>
      <Box sx={{ borderTop: '4px solid #7986cb', width: 'fit-content', minWidth: '80px', textAlign: 'center', p: 1, border: '1px solid #ddd', borderTopWidth: '4px' }}>
        <Typography variant="caption" sx={{ color: '#5c6bc0', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          {patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : 'No Patient Loaded'}
        </Typography>
      </Box>
      
      <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2, alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
        <Typography variant="caption" sx={{ color: '#5c6bc0' }}>Billing flags: </Typography>
        {Array.isArray(flags) && flags.length > 0 ? (
          flags.map((flag) => {
            const color = flagColorMap[flag] || '#bdbdbd';
            return (
              <Tooltip key={flag} title={flag === 'appointment_reminder' ? 'Send reminder earlier' : flag} placement="top">
                <Box
                  onClick={onAddFlagsClick}
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: color,
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'inline-block',
                    '&:hover': { opacity: 0.8 }
                  }}
                />
              </Tooltip>
            );
          })
        ) : (
          <Typography variant="caption" sx={{ color: '#999', fontStyle: 'italic' }}>None</Typography>
        )}
        <Typography variant="caption" sx={{ color: '#1976d2', cursor: 'pointer', ml: 1 }} onClick={onAddFlagsClick}>+add flags</Typography>
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
              <item.Icon onShareSelect={item.onShareSelect} onClaimSelect={item.onClaimSelect} onClick={item.onClick} />
            </IconButton>
          ))}
        </Stack>
      )}

      {/* Quick Payment Request Dialog */}
      {showQuickPayment && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: 'fit-content',
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
              patient={patient}
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
              patient={patient}
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

      {/* Manual Claim Dialog */}
      {showManualClaim && (
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
          onClick={() => setShowManualClaim(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '1200px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '4px',
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ManualClaimDialog patient={patient} onClose={() => setShowManualClaim(false)} />
          </Box>
        </Box>
      )}

      {/* Late Fee Dialog */}
      {showLateFee && (
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
          onClick={() => setShowLateFee(false)}
        >
          <Box onClick={(e) => e.stopPropagation()}>
            <LateFeeDialog 
              onClose={() => setShowLateFee(false)} 
              adjustmentType={selectedAdjustment?.label}
              onAddFee={async (selected, flatRate) => {
                console.log('Adding fee for:', selected, 'Rate:', flatRate);
                setShowLateFee(false);
                const isLatePayment = selectedAdjustment?.id?.startsWith('late-payment');
                
                const amountVal = flatRate ? parseFloat(flatRate) : 100.00;
                const notesText = selectedAdjustment?.label || 'Adjustment Fee';
                
                const adjustment = await createAdjustmentInDb(amountVal, notesText);
                const displayedId = adjustment?._id || adjustment?.id || Math.floor(Math.random() * 90000 + 10000).toString();

                // Dispatch event to add the fee to ledger
                const event = new CustomEvent('add-ledger-item', {
                  detail: {
                    title: `${notesText} (Adj #${displayedId})`,
                    amount: `$${amountVal.toFixed(2)}`,
                    ptBal: `$${amountVal.toFixed(2)}`,
                    invBal: `$${amountVal.toFixed(2)}`,
                    useCheckmark: isLatePayment
                  }
                });
                window.dispatchEvent(event);
              }}
            />
          </Box>
        </Box>
      )}

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

      {/* New Invoice Dialog */}
      {showNewInvoice && (
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
          onClick={() => setShowNewInvoice(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '1000px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <InvoiceModal 
              invoiceData={{ invoiceId: '3125' }}
              onSave={handleInvoiceModalSave}
              onCancel={() => setShowNewInvoice(false)}
            />
          </Box>
        </Box>
      )}

      {/* Patient Print Options Dropdown */}
      <PatientPrintOptions
        anchorEl={printAnchorEl}
        open={Boolean(printAnchorEl)}
        onClose={handlePrintClose}
        onSelect={handlePrintSelect}
      />

      {/* Print Receipt Dialog */}
      {showPrintReceipt && (
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
          onClick={() => setShowPrintReceipt(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '500px', 
              width: '90%',
              bgcolor: '#fff',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <PrintReceiptDialog 
              onClose={() => setShowPrintReceipt(false)}
              initialIncludeFamily={isFamilyReceipt}
            />
          </Box>
        </Box>
      )}

      {/* Itemized Receipt Preview Dialog */}
      {showItemizedReceipt && (
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
          onClick={() => setShowItemizedReceipt(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '1100px', 
              width: '95%',
              bgcolor: '#fff',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ItemizedReceiptPreview 
              onClose={() => setShowItemizedReceipt(false)}
            />
          </Box>
        </Box>
      )}

      {/* Simple Statement Dialog */}
      {showSimpleStatement && (
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
          onClick={() => setShowSimpleStatement(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '1100px', 
              width: '95%',
              maxHeight: '95vh',
              bgcolor: '#fff',
              borderRadius: '4px',
              overflow: 'auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SimpleStatementDialog 
              onClose={() => setShowSimpleStatement(false)}
            />
          </Box>
        </Box>
      )}

      {/* Detailed Statement Dialog */}
      {showDetailedStatement && (
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
          onClick={() => setShowDetailedStatement(false)}
        >
          <Box 
            sx={{ 
              maxWidth: '1100px', 
              width: '95%',
              maxHeight: '95vh',
              bgcolor: '#fff',
              borderRadius: '4px',
              overflow: 'auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <DetailedStatementDialog 
              onClose={() => setShowDetailedStatement(false)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PatientFinanceInfo;
