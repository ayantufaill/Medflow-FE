import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box, Typography, Select, MenuItem, Checkbox, Button, TextField, IconButton, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../constants/colors';

import AddPaymentTopRow from './add-payment/AddPaymentTopRow';
import AddPaymentAmountRow from './add-payment/AddPaymentAmountRow';
import AddPaymentInvoiceList from './add-payment/AddPaymentInvoiceList';
import AddPaymentFooter from './add-payment/AddPaymentFooter';
import apiClient from '../../config/api';
import { toLedgerPaymentInvoices } from '../../utils/paymentDraftFromLedger';

// Redux
import {
  fetchPaymentDraftInvoices,
  togglePaymentInvoiceChecked,
  togglePaymentLineItemChecked,
  setPaymentInvoicesForPatient,
  selectLedgerItemsForPatient,
  selectPaymentInvoicesForPatient,
  selectPaymentInvoicesLoading,
  invalidatePaymentInvoices,
  toggleAllPaymentInvoices,
  selectBillingConfiguration,
} from '../../store/slices/billingSlice';

const moneyNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const paymentLineAmount = (item = {}) => {
  return moneyNumber(item.payAmount ?? item.patientBalance);
};

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
  const ledgerItems = useSelector(selectLedgerItemsForPatient(patientId));
  const loading  = useSelector(selectPaymentInvoicesLoading);
  const ledgerOverrideAppliedRef = useRef(false);

  // ── Local form state ─────────────────────────────────────────────────────
  const billingConfig = useSelector(selectBillingConfiguration);
  const [selectedPatient, setSelectedPatient] = useState(
    patient ? `${patient.firstName} ${patient.lastName}` : 'test test'
  );
  const [paymentMethod,        setPaymentMethod]        = useState('Master Card');
  const [description,          setDescription]          = useState('');
  const [showDescription,      setShowDescription]      = useState(false);
  const [patientAmountChecked, setPatientAmountChecked] = useState(false);
  const [manualAmount,         setManualAmount]         = useState('');
  const [amountType,           setAmountType]           = useState('patient amount');
  const [patientCredit,        setPatientCredit]        = useState(0);
  const [familyCredit,         setFamilyCredit]         = useState(0);
  const [addFamilyCredit,      setAddFamilyCredit]      = useState(false);

  // Family credit total already includes the patient's own credit. When the
  // patient's own credit is spent first, the family pool only has to cover the
  // remainder, so the spendable amount is unchanged but the source order is
  // patient → family.
  const familyOnlyCredit = Math.max(0, moneyNumber(familyCredit) - moneyNumber(patientCredit));
  const availableCredit = paymentMethod === 'Account Credit'
    ? moneyNumber(patientCredit) + (addFamilyCredit ? familyOnlyCredit : 0)
    : 0;

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'Account Credit') {
      const defaultUseFamily = billingConfig?.useFamilyCredit ?? false;
      setAddFamilyCredit(defaultUseFamily);
    } else {
      setAddFamilyCredit(false);
    }
  };

  // ── Fetch draft invoices for this patient (always fresh — invalidate stale cache first) ──
  useEffect(() => {
    if (patientId) {
      ledgerOverrideAppliedRef.current = false;
      dispatch(invalidatePaymentInvoices(patientId));
      dispatch(fetchPaymentDraftInvoices(patientId));
      
      apiClient.get(`/finance-dashboard/aging/${patientId}`)
        .then(res => {
          const data = res.data?.data;
          const pCredit = Number(data?.patientCredit ?? data?.patientAccountCredit ?? 0);
          const fCredit = Number(data?.familyCredit ?? pCredit);
          setPatientCredit(pCredit);
          setFamilyCredit(fCredit);
        })
        .catch(err => console.warn("Failed to fetch account credit", err));
    }
  }, [dispatch, patientId]);
  
  // ── Derived totals ───────────────────────────────────────────────────────
  const { totalChecked } = useMemo(() => {
    let sum = 0;
    invoices.forEach((inv) => {
      (inv.lineItems || []).forEach((item) => {
        if (item.checked) sum += paymentLineAmount(item);
      });
    });
    return { totalChecked: sum };
  }, [invoices]);

  // Account credit is spent procedure-by-procedure until it runs out. Selecting
  // a line whose balance exceeds the remaining credit is allowed — the excess
  // simply stays on the patient balance (e.g. $50 procedure with $10 credit
  // applies $10 and leaves $40 owed). The patient's own credit is applied before
  // any family credit, which is why the cap here is the full available pool.
  const creditAppliedByItem = useMemo(() => {
    if (paymentMethod !== 'Account Credit') return null;
    const applied = {};
    let remaining = availableCredit;
    invoices.forEach((inv) => {
      (inv.lineItems || []).forEach((item) => {
        if (!item.checked) return;
        const wanted = paymentLineAmount(item);
        const use = remaining > 0 ? Math.min(wanted, remaining) : 0;
        applied[item.id] = Number(use.toFixed(2));
        remaining = Number((remaining - use).toFixed(2));
      });
    });
    return applied;
  }, [invoices, paymentMethod, availableCredit]);

  const accountCreditApplied = creditAppliedByItem
    ? Object.values(creditAppliedByItem).reduce((sum, v) => sum + v, 0)
    : 0;

  // The draft-invoice fetch and the patient ledger are two independent async
  // sources. Whichever resolves last used to win the cache, so the dialog
  // could show its own stale arithmetic until a hard refresh. The reducer now
  // refuses to let the draft fetch overwrite ledger-derived rows once they have
  // been seeded (see paymentInvoicesOverridden), so this effect only has to
  // publish those rows — it no longer has to race the fetch to do it.
  useEffect(() => {
    if (
      !patientId ||
      ledgerOverrideAppliedRef.current ||
      ledgerItems.length === 0
    ) {
      return;
    }
    const ledgerInvoices = toLedgerPaymentInvoices(ledgerItems);
    dispatch(setPaymentInvoicesForPatient({ patientId, invoices: ledgerInvoices }));
    ledgerOverrideAppliedRef.current = true;
  }, [dispatch, patientId, loading, ledgerItems]);

  const displayAmount   = paymentMethod === 'Account Credit'
    ? accountCreditApplied.toFixed(2)
    : amountType === 'specific amount'
      ? manualAmount
      : (manualAmount !== '' ? manualAmount : totalChecked.toFixed(2));
  const paymentAmount   = parseFloat(displayAmount) || 0;
  const overpayment     = '0.00';

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleInvoiceToggle = (invoiceId) => {
    dispatch(togglePaymentInvoiceChecked({ patientId, invoiceId }));
  };

  const handleProcedureToggle = (invoiceId, itemId) => {
    dispatch(togglePaymentLineItemChecked({ patientId, invoiceId, itemId }));
  };

  const handleToggleAll = (checked) => {
    setPatientAmountChecked(checked);
    dispatch(toggleAllPaymentInvoices({ patientId, checked }));
  };

  const handleLineItemAmountChange = (invoiceId, procId, amount) => {
    dispatch({
      type: 'billing/updatePaymentLineItemAmount',
      payload: { patientId, invoiceId, procId, amount }
    });
  };

  const handleApplyAndPay = () => {
    const isAccountCredit = paymentMethod === 'Account Credit';
    const selectedInvoices = invoices.filter(
      (inv) => inv.checked || inv.lineItems?.some((i) => i.checked)
    );
    const selectedItems = [];
    invoices.forEach((inv) => {
      (inv.lineItems || []).forEach((item) => {
        if (!item.checked) return;
        // Account credit may only cover part of a line, so the amount sent is
        // the capped credit applied — the rest stays on the patient balance.
        const itemAmount = isAccountCredit
          ? Number(creditAppliedByItem?.[item.id] ?? 0)
          : paymentLineAmount(item);
        if (itemAmount <= 0) return;
        selectedItems.push({ invoiceId: inv.id, itemId: item.id, amount: itemAmount.toFixed(2) });
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
      addFamilyCredit: isAccountCredit ? addFamilyCredit : false,
      isPartialPayment: isAccountCredit && accountCreditApplied < totalChecked,
      selectedInvoices,
      selectedItems,
    });
    onClose();
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: '100%', minWidth: '1250px', border: `1px solid ${COLORS.BORDER}`, borderRadius: '14px', overflow: 'hidden', bgcolor: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <DialogTitle sx={{ 
        bgcolor: COLORS.SURFACE_TINT, py: 1.5, px: 3, display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', borderBottom: `1px solid ${COLORS.BORDER}`, m: 0 
      }}>
        <Typography sx={{ color: COLORS.TEXT_PRIMARY, fontSize: '15px', fontWeight: 600 }}>Patient Payment</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2.5, maxHeight: 'calc(90vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        <AddPaymentTopRow 
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          paymentMethod={paymentMethod}
          setPaymentMethod={handlePaymentMethodChange}
          addFamilyCredit={addFamilyCredit}
          setAddFamilyCredit={setAddFamilyCredit}
          MENU_PROPS={MENU_PROPS}
          patientCredit={patientCredit}
          familyCredit={familyCredit}
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
          accountCredit={availableCredit}
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
          isAccountCredit={paymentMethod === 'Account Credit'}
          accountCreditAppliedByItem={creditAppliedByItem}
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
