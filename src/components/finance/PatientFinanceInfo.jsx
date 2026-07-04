import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux';
import { appointmentService } from '../../services/appointment.service';
import { paymentService } from '../../services/payment.service';
import { invoiceService } from '../../services/invoice.service';
import { createInvoice, invalidatePaymentInvoices } from '../../store/slices/billingSlice';
import { Box, Typography, Stack, IconButton, Radio, RadioGroup, FormControlLabel, Button } from '@mui/material';
import {
  NoteAdd as NoteAddIcon,
  Add as AddIcon
} from '@mui/icons-material';

import { 
  IconBill, IconUserWallet, IconInsuranceWithDropdown, IconInsuranceWallet, 
  IconRefreshCoin, IconPiggyBank, IconPrinter, IconCloudUpload, 
  IconCashPlus, IconCashMinus, IconCalendar 
} from './FinanceActionIcons';
import FinanceDialogManager from './FinanceDialogManager';
import apiClient from '../../config/api';
import addFlagsIcon from '../../assets/finance icons/add flag.svg';
import addAccountNoteIcon from '../../assets/finance icons/add account note.svg';

// Custom Icons have been extracted to FinanceActionIcons.jsx

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

const PatientFinanceInfo = forwardRef(({ view, flags = [], patient = null, onViewChange, onCalendarClick, onCashMinusClick, onRefreshCoinClick, onAddFlagsClick, onOpenDepositMenu }, ref) => {
  const dispatch = useDispatch();
  const [showShare, setShowShare] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [showQuickPayment, setShowQuickPayment] = useState(false);
  const [showInsurancePayment, setShowInsurancePayment] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAccountNotes, setShowAccountNotes] = useState(false);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [cashPlusAnchorEl, setCashPlusAnchorEl] = useState(null);

  useImperativeHandle(ref, () => ({
    triggerIcon: (iconId, e) => {
      switch (iconId) {
        case 'invoice': setShowNewInvoice(true); break;
        case 'userWallet': handleUserWalletClick(); break;
        case 'claim': handleClaimSelect('manual'); break;
        case 'insuranceWallet': handleInsuranceWalletClick(); break;
        case 'print': handlePrintClick(e); break;
        case 'share': handleShareSelect('request-payment'); break;
        case 'cashPlus': handleCashPlusClick(e); break;
        default: break;
      }
    }
  }));

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
    <>
      <Box
        sx={{
          flex: 1,
          height: '254px',
          border: '1px solid #DFE5EC',
          borderRadius: '22px',
          p: 3,
          bgcolor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          flexShrink: 0
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1A1A1A', mb: 1, letterSpacing: '1px' }}>
          VIEW
        </Typography>
        
        <RadioGroup
          row
          value={view || 'invoices'}
          onChange={onViewChange}
          sx={{ mb: 2 }}
        >
          <FormControlLabel 
            value="invoices" 
            control={<Radio size="small" sx={{ color: '#42C070', '&.Mui-checked': { color: '#42C070' } }} />} 
            label={<Typography sx={{ color: '#4A4A4A', fontSize: '14px' }}>Invoices</Typography>} 
          />
          <FormControlLabel 
            value="individual" 
            control={<Radio size="small" sx={{ color: '#42C070', '&.Mui-checked': { color: '#42C070' } }} />} 
            label={<Typography sx={{ color: '#4A4A4A', fontSize: '14px' }}>Individual Ledger</Typography>} 
            sx={{ ml: 2 }}
          />
          <FormControlLabel 
            value="family" 
            control={<Radio size="small" sx={{ color: '#42C070', '&.Mui-checked': { color: '#42C070' } }} />} 
            label={<Typography sx={{ color: '#4A4A4A', fontSize: '14px' }}>Family Ledger</Typography>} 
            sx={{ ml: 2 }}
          />
        </RadioGroup>

        <Box sx={{ mb: 3, borderBottom: '1px solid #DFE5EC', display: 'flex' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '146px',
              height: '37px',
              border: '1px solid #DFE5EC',
              borderBottom: '4px solid #2362EF',
              borderTopLeftRadius: '6px',
              borderTopRightRadius: '6px',
              bgcolor: '#FFFFFF',
              cursor: 'pointer',
              position: 'relative',
              top: '1px',
            }}
          >
            <Typography fontWeight="bold" sx={{ fontSize: '14px', color: '#1A1A1A' }}>
              {patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : 'Amanda Wilson'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ color: '#1A1A1A', fontSize: '14px', fontWeight: 500, width: '80px' }}>
              Billing flags:
            </Typography>
            <Button 
              variant="text" 
              startIcon={<Box component="img" src={addFlagsIcon} alt="add flags" sx={{ width: 14, height: 14 }} />} 
              onClick={onAddFlagsClick}
              sx={{ textTransform: 'none', color: '#2362EF', fontSize: '14px', p: 0, minWidth: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
            >
              add flags
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: '80px' }} />
            <Button 
              variant="text" 
              startIcon={<Box component="img" src={addAccountNoteIcon} alt="add account note" sx={{ width: 14, height: 14 }} />} 
              onClick={handleAddAccountNoteClick}
              sx={{ textTransform: 'none', color: '#2362EF', fontSize: '14px', p: 0, minWidth: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
            >
              add account note
            </Button>
          </Box>
        </Box>
      </Box>

      <FinanceDialogManager
        patient={patient}
        showQuickPayment={showQuickPayment} setShowQuickPayment={setShowQuickPayment}
        showInsurancePayment={showInsurancePayment} setShowInsurancePayment={setShowInsurancePayment} handleInsurancePaymentSave={handleInsurancePaymentSave}
        showAddPayment={showAddPayment} setShowAddPayment={setShowAddPayment} handlePaymentApply={handlePaymentApply}
        cashPlusAnchorEl={cashPlusAnchorEl} handleCashPlusClose={handleCashPlusClose} handleCashPlusSelect={handleCashPlusSelect}
        showManualClaim={showManualClaim} setShowManualClaim={setShowManualClaim}
        showLateFee={showLateFee} setShowLateFee={setShowLateFee} selectedAdjustment={selectedAdjustment} 
        handleAddLateFee={async (selected, flatRate) => {
          console.log('Adding fee for:', selected, 'Rate:', flatRate);
          setShowLateFee(false);
          const isLatePayment = selectedAdjustment?.id?.startsWith('late-payment');
          const amountVal = flatRate ? parseFloat(flatRate) : 100.00;
          const notesText = selectedAdjustment?.label || 'Adjustment Fee';
          const adjustment = await createAdjustmentInDb(amountVal, notesText);
          const displayedId = adjustment?._id || adjustment?.id || Math.floor(Math.random() * 90000 + 10000).toString();
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
        showAccountNotes={showAccountNotes} setShowAccountNotes={setShowAccountNotes}
        showNewInvoice={showNewInvoice} setShowNewInvoice={setShowNewInvoice} handleInvoiceModalSave={handleInvoiceModalSave}
        printAnchorEl={printAnchorEl} handlePrintClose={handlePrintClose} handlePrintSelect={handlePrintSelect}
        showPrintReceipt={showPrintReceipt} setShowPrintReceipt={setShowPrintReceipt} isFamilyReceipt={isFamilyReceipt}
        showItemizedReceipt={showItemizedReceipt} setShowItemizedReceipt={setShowItemizedReceipt}
        showSimpleStatement={showSimpleStatement} setShowSimpleStatement={setShowSimpleStatement}
        showDetailedStatement={showDetailedStatement} setShowDetailedStatement={setShowDetailedStatement}
      />
    </>
  );
});

export default PatientFinanceInfo;
