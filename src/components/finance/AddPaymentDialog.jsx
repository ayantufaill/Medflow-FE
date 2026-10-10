import React, { useState, useEffect, useMemo } from 'react';
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
import { useSnackbar } from '../../contexts/SnackbarContext';

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
} from '../../store/slices/billingSlice';

const moneyNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const toLedgerPaymentInvoices = (ledgerItems = []) => {
  return ledgerItems
    .filter((item) => item?.method === "Invoice" && !item.isVoided)
    .map((item) => {
      const patientBalance = moneyNumber(item.summary?.ptBal);
      if (!(patientBalance > 0)) return null;

      const grouped = (item.details || []).find(
        (detail) => detail.isGrouped && Array.isArray(detail.procedures),
      );
      const procedures = grouped?.procedures || [];
      const liveClaims = (item.details || []).filter((detail) => {
        if (!detail.isClaim || detail.isVoided) return false;
        const status = String(detail.status || "").toLowerCase();
        return status !== "void" && status !== "voided";
      });
      const claimedProcedureIds = new Set(
        liveClaims
          .flatMap((claim) => claim.procedures || [])
          .flatMap((proc) => [
            proc.id,
            proc._id,
            proc.ProcNum,
            proc.procedureId,
            proc.itemId,
          ])
          .filter(Boolean)
          .map(String),
      );
      const hasLiveClaim = liveClaims.length > 0;
      const sourceProcedures = procedures.length > 0 ? procedures : [item];
      const allocationProcedures = hasLiveClaim
        ? sourceProcedures.filter(
            (proc) =>
              !claimedProcedureIds.has(
                String(proc.id || proc._id || proc.ProcNum || proc.procedureId),
              ),
          )
        : sourceProcedures;
      const patientProcedures =
        allocationProcedures.length > 0 ? allocationProcedures : sourceProcedures;
      const weights = patientProcedures.map((proc) =>
        Math.max(
          0,
          moneyNumber(proc.ptPortion) ||
            moneyNumber(proc.patientPortion) ||
            moneyNumber(proc.patientAmount) ||
            moneyNumber(proc.fee) ||
            moneyNumber(proc.totalPrice) ||
            moneyNumber(proc.total) ||
            moneyNumber(proc.charge) ||
            moneyNumber(item.amount),
        ),
      );
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      let remaining = patientBalance;

      const lineItems = patientProcedures.map(
        (proc, index, arr) => {
          const isLast = index === arr.length - 1;
          const share = isLast
            ? remaining
            : Math.round(
                patientBalance *
                  ((totalWeight > 0 ? weights[index] : 1) /
                    (totalWeight > 0 ? totalWeight : arr.length)) *
                  100,
              ) / 100;
          remaining = Math.round((remaining - share) * 100) / 100;
          return {
            ...proc,
            id: proc.id || proc._id || proc.ProcNum || `${item.id}-${index}`,
            checked: false,
            payAmount: share.toFixed(2),
            patientBalance: share,
            totalAmount: moneyNumber(
              proc.fee || proc.totalPrice || proc.total || proc.charge || item.amount,
            ),
            writeoffAmount: 0,
            adjustmentAmount: 0,
            insuranceAmount: 0,
          };
        },
      ).filter((proc) => proc.patientBalance > 0);

      if (lineItems.length === 0) return null;
      return {
        id: item.id,
        invoiceNumber: item.invoiceNumber || item.id,
        invoiceDate: item.rawDate || item.date,
        checked: false,
        patientBalance,
        totalBalance: moneyNumber(item.amount || item.totalAmount),
        insuranceBalance: moneyNumber(item.summary?.insBal),
        insWriteoffAmount: moneyNumber(item.summary?.insWo),
        adjustmentAmount: moneyNumber(item.summary?.appliedWo),
        lineItems,
      };
    })
    .filter(Boolean);
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
  const { showSnackbar } = useSnackbar();

  // ── Redux state ──────────────────────────────────────────────────────────
  const invoices = useSelector(selectPaymentInvoicesForPatient(patientId));
  const ledgerItems = useSelector(selectLedgerItemsForPatient(patientId));
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

  useEffect(() => {
    if (!patientId || loading || invoices.length > 0 || ledgerItems.length === 0) {
      return;
    }
    const ledgerInvoices = toLedgerPaymentInvoices(ledgerItems);
    if (ledgerInvoices.length > 0) {
      dispatch(setPaymentInvoicesForPatient({ patientId, invoices: ledgerInvoices }));
    }
  }, [dispatch, patientId, loading, invoices.length, ledgerItems]);

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
  const handleInvoiceToggle = (invoiceId) => {
    if (paymentMethod === 'Account Credit') {
      let invToToggle = invoices.find((inv) => inv.id === invoiceId);
      if (invToToggle && !invToToggle.checked) {
        let sumToAdd = 0;
        invToToggle.lineItems?.forEach((i) => {
          if (!i.checked) sumToAdd += Number(i.payAmount || 0);
        });
        if (totalChecked + sumToAdd > accountCredit) {
          showSnackbar("Cannot select invoice. Total exceeds available deposit balance.", "error");
          return;
        }
      }
    }
    dispatch(togglePaymentInvoiceChecked({ patientId, invoiceId }));
  };

  const handleProcedureToggle = (invoiceId, itemId) => {
    if (paymentMethod === 'Account Credit') {
      let itemToToggle = null;
      invoices.forEach((inv) => {
        if (inv.id === invoiceId) {
          inv.lineItems?.forEach((i) => {
            if (i.id === itemId) itemToToggle = i;
          });
        }
      });
      if (itemToToggle && !itemToToggle.checked) {
        if (totalChecked + Number(itemToToggle.payAmount || 0) > accountCredit) {
          showSnackbar("Cannot select procedure. Total exceeds available deposit balance.", "error");
          return;
        }
      }
    }
    dispatch(togglePaymentLineItemChecked({ patientId, invoiceId, itemId }));
  };

  const handleToggleAll = (checked) => {
    if (checked && paymentMethod === 'Account Credit') {
      let sumToAdd = 0;
      invoices.forEach((inv) => {
        inv.lineItems?.forEach((i) => {
          if (!i.checked) sumToAdd += Number(i.payAmount || 0);
        });
      });
      if (totalChecked + sumToAdd > accountCredit) {
        showSnackbar("Cannot select all. Total exceeds available deposit balance.", "error");
        return;
      }
    }
    setPatientAmountChecked(checked);
    dispatch(toggleAllPaymentInvoices({ patientId, checked }));
  };

  const handleLineItemAmountChange = (invoiceId, procId, amount) => {
    if (paymentMethod === 'Account Credit') {
      let itemToEdit = null;
      invoices.forEach((inv) => {
        if (inv.id === invoiceId) {
          inv.lineItems?.forEach((i) => {
            if (i.id === procId) itemToEdit = i;
          });
        }
      });
      if (itemToEdit && itemToEdit.checked) {
        let diff = Number(amount || 0) - Number(itemToEdit.payAmount || 0);
        if (totalChecked + diff > accountCredit) {
          showSnackbar("Amount exceeds available deposit balance.", "error");
          return;
        }
      }
    }
    dispatch({
      type: 'billing/updatePaymentLineItemAmount',
      payload: { patientId, invoiceId, procId, amount }
    });
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
