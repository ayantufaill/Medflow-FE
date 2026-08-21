import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Select, MenuItem, Checkbox, Button, TextField, IconButton, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { COLORS } from '../../constants/colors';

import AddPaymentTopRow from './add-payment/AddPaymentTopRow';
import AddPaymentAmountRow from './add-payment/AddPaymentAmountRow';
import AddPaymentInvoiceList from './add-payment/AddPaymentInvoiceList';
import AddPaymentFooter from './add-payment/AddPaymentFooter';
import apiClient from '../../config/api';

// Redux
import {
  fetchPaymentDraftInvoices,
  togglePaymentInvoiceChecked,
  togglePaymentLineItemChecked,
  selectPaymentInvoicesForPatient,
  selectPaymentInvoicesLoading,
  invalidatePaymentInvoices,
  toggleAllPaymentInvoices,
} from '../../store/slices/billingSlice';

const MENU_PROPS = {
  disablePortal: true,
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  PaperProps: {
    sx: {
      bgcolor: '#fff',
      '& .MuiMenuItem-root': { fontSize: '12px', py: 0.5 },
    },
  },
};

const AddPaymentDialog = ({ patient, onClose, onPaymentApply }) => {
  const dispatch  = useDispatch();
  const patientId = patient?._id || patient?.id;

  // ── Redux state ──────────────────────────────────────────────────────────
  const invoices = useSelector(selectPaymentInvoicesForPatient(patientId));
  const loading  = useSelector(selectPaymentInvoicesLoading);

  // ── Local form state ─────────────────────────────────────────────────────
  const [selectedPatient, setSelectedPatient] = useState(
    patient ? `${patient.firstName} ${patient.lastName}` : 'test test'
  );
  const [paymentMethod,        setPaymentMethod]        = useState('Master Card');
  const [description,          setDescription]          = useState('');
  const [showDescription,      setShowDescription]      = useState(false);
  const [patientAmountChecked, setPatientAmountChecked] = useState(false);
  const [manualAmount,         setManualAmount]         = useState('');
  const [amountType,           setAmountType]           = useState('patient amount');
  const [accountCredit,        setAccountCredit]        = useState(0);

  // ── Fetch draft invoices for this patient (always fresh — invalidate stale cache first) ──
  useEffect(() => {
    if (patientId) {
      dispatch(invalidatePaymentInvoices(patientId));
      dispatch(fetchPaymentDraftInvoices(patientId));
      
      apiClient.get(`/finance-dashboard/aging/${patientId}`)
        .then(res => setAccountCredit(res.data?.data?.patientAccountCredit || 0))
        .catch(err => console.warn("Failed to fetch account credit", err));
    }
  }, [dispatch, patientId]);

  // ── Derived totals ───────────────────────────────────────────────────────
  const { totalChecked } = useMemo(() => {
    let sum = 0;
    invoices.forEach((inv) => {
      (inv.lineItems || []).forEach((item) => {
        if (item.checked) sum += Number(item.payAmount || 0);
      });
    });
    return { totalChecked: sum };
  }, [invoices]);

  const displayAmount   = amountType === 'specific amount'
    ? manualAmount
    : (manualAmount !== '' ? manualAmount : totalChecked.toFixed(2));
  const paymentAmount   = parseFloat(displayAmount) || 0;
  const overpayment     = '0.00';

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleInvoiceToggle = (invoiceId) =>
    dispatch(togglePaymentInvoiceChecked({ patientId, invoiceId }));

  const handleProcedureToggle = (invoiceId, itemId) =>
    dispatch(togglePaymentLineItemChecked({ patientId, invoiceId, itemId }));

  const handleToggleAll = (checked) => {
    setPatientAmountChecked(checked);
    dispatch(toggleAllPaymentInvoices({ patientId, checked }));
  };

  const handleLineItemAmountChange = (invoiceId, procId, amount) => {
    // Optional: Dispatch a Redux action to update the line item amount here
  };

  const handleApplyAndPay = () => {
    const selectedInvoices = invoices.filter(
      (inv) => inv.checked || inv.lineItems?.some((i) => i.checked)
    );
    const selectedItems = [];
    invoices.forEach((inv) => {
      (inv.lineItems || []).forEach((item) => {
        if (item.checked) selectedItems.push({ invoiceId: inv.id, itemId: item.id, amount: item.payAmount });
      });
    });

    onPaymentApply?.({
      amount: paymentAmount,
      patient: selectedPatient,
      paymentMethod,
      paymentType: 'patient amount',
      description,
      paymentAmount,
      overpayment: parseFloat(overpayment),
      selectedInvoices,
      selectedItems,
    });
    onClose();
  };

  const headerBackground = COLORS.SURFACE_TINT;
  const greenHeader      = COLORS.BORDER;
  const greenText        = COLORS.TEXT_PRIMARY;
  const linkBlue         = COLORS.ACCENT;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: '100%', minWidth: '1250px', border: `1px solid ${COLORS.BORDER}`, borderRadius: '14px', overflow: 'hidden', bgcolor: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <DialogTitle sx={{ 
        bgcolor: COLORS.SURFACE_TINT, py: 1.5, px: 3, display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', borderBottom: `1px solid ${COLORS.BORDER}`, m: 0 
      }}>
        <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '15px', fontWeight: 600 }}>Add Payment</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2.5, maxHeight: 'calc(90vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        <AddPaymentTopRow 
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          MENU_PROPS={MENU_PROPS}
        />

        <Box sx={{ borderTop: `1px solid ${COLORS.BORDER}`, mt: 2.5, mb: 2.5 }} />

        <AddPaymentAmountRow 
          patientAmountChecked={patientAmountChecked}
          setPatientAmountChecked={handleToggleAll}
          amountType={amountType}
          setAmountType={setAmountType}
          displayAmount={displayAmount}
          setManualAmount={setManualAmount}
          paymentMethod={paymentMethod}
          accountCredit={accountCredit}
          MENU_PROPS={MENU_PROPS}
        />

        <Box sx={{ borderTop: `1px solid ${COLORS.BORDER}`, my: 2.5 }} />

        <AddPaymentInvoiceList 
          loading={loading}
          invoices={invoices}
          selectedPatient={selectedPatient}
          handleInvoiceToggle={handleInvoiceToggle}
          handleProcedureToggle={handleProcedureToggle}
          handleLineItemAmountChange={handleLineItemAmountChange}
        />
      </DialogContent>

      <AddPaymentFooter 
        showDescription={showDescription}
        setShowDescription={setShowDescription}
        description={description}
        setDescription={setDescription}
        overpayment={parseFloat(overpayment)}
        paymentAmount={paymentAmount}
        handleApplyAndPay={handleApplyAndPay}
        onClose={onClose}
      />
    </Box>
  );
};

export default AddPaymentDialog;
