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

const paymentLineAmount = (item = {}) => {
  return moneyNumber(item.payAmount ?? item.patientBalance);
};

const roundMoney = (value) => Number(Math.max(0, moneyNumber(value)).toFixed(2));

const procedureKey = (proc = {}) => {
  const key =
    proc.id ||
    proc._id ||
    proc.ProcNum ||
    proc.procedureId ||
    proc.itemId ||
    proc.procId;
  return key ? String(key) : "";
};

const toLedgerPaymentInvoices = (ledgerItems = []) => {
  return ledgerItems
    .filter((item) => item?.method === "Invoice" && !item.isVoided)
    .map((item) => {
      const patientBalance = moneyNumber(item.summary?.ptBal);
      if (!(patientBalance > 0)) return null;
      const invoiceInsuranceBalance = moneyNumber(item.summary?.insBal);

      const grouped = (item.details || []).find(
        (detail) => detail.isGrouped && Array.isArray(detail.procedures),
      );
      const procedures = grouped?.procedures || [];
      const liveClaims = (item.details || []).filter((detail) => {
        if (!detail.isClaim || detail.isVoided) return false;
        const status = String(detail.status || "").toLowerCase();
        return status !== "void" && status !== "voided";
      });

      const paidByProcedure = new Map();
      (item.details || []).forEach((detail) => {
        if (!detail.isPayment || detail.isAdjustment || detail.isVoided) return;
        (detail.procedures || []).forEach((proc) => {
          const key = procedureKey(proc);
          if (!key) return;
          const paid = Math.max(
            moneyNumber(proc.appliedPayment),
            moneyNumber(proc.paymentAmount),
            moneyNumber(proc.paidAmount),
            moneyNumber(proc.payAmount),
          );
          if (paid > 0) {
            paidByProcedure.set(key, (paidByProcedure.get(key) || 0) + paid);
          }
        });
      });

      const claimProcedures = liveClaims.flatMap((claim) =>
        (claim.procedures || []).map((proc) => ({ ...proc, __fromClaim: true })),
      );
      const claimedProcedureIds = new Set(
        claimProcedures.map(procedureKey).filter(Boolean),
      );
      const invoiceProcedures = procedures
        .filter((proc) => !claimedProcedureIds.has(procedureKey(proc)))
        .map((proc) => ({ ...proc, __fromInvoice: true }));
      const patientProcedures =
        invoiceInsuranceBalance <= 0.01 && procedures.length > 0
          ? procedures.map((proc) => ({ ...proc, __fromLedger: true }))
          : claimProcedures.length > 0 || invoiceProcedures.length > 0
            ? [...claimProcedures, ...invoiceProcedures]
            : [item];

      let lineItems = patientProcedures
        .map((proc, index) => {
          const key = procedureKey(proc);
          const totalAmount = moneyNumber(
            proc.fee ||
              proc.totalPrice ||
              proc.total ||
              proc.ProcFee ||
              proc.charge ||
              proc.amount ||
              item.amount,
          );
          const insuranceAmount = moneyNumber(
            invoiceInsuranceBalance <= 0.01
              ? 0
              : proc.insuranceAmount ??
                  proc.insPortion ??
                  proc.totalInsPortion ??
                  proc.primaryInsPortion ??
                  proc.insPayEst ??
                  0,
          );
          const writeoffAmount = moneyNumber(
            proc.writeoffAmount ??
              proc.writeOffAmount ??
              proc.estimatedWriteOff ??
              proc.writeoff ??
              0,
          );
          let procPatientBalance =
            moneyNumber(proc.patientBalance) ||
            moneyNumber(proc.ptPortion) ||
            moneyNumber(proc.patientPortion) ||
            moneyNumber(proc.patientAmount);
          if (
            proc.__fromClaim &&
            totalAmount > 0 &&
            insuranceAmount > 0 &&
            procPatientBalance + insuranceAmount + writeoffAmount > totalAmount
          ) {
            procPatientBalance = Math.max(
              0,
              totalAmount - insuranceAmount - writeoffAmount,
            );
          }
          // Only money that is actually backed by a payment record reduces a
          // line. The stored `patientPaidAmount` is not reliable on its own —
          // one procedure carried 124 there while holding an un-adjudicated
          // 124 insurance estimate and no patient payment at all, which zeroed
          // a $25 balance that the invoice's own patientPortion (182) still
          // counted. The invoice header is computed from payment records too,
          // so the lines now use the same basis.
          const paidAmount = paidByProcedure.get(key) || 0;
          const remainingPatient = roundMoney(procPatientBalance - paidAmount);
          return {
            ...proc,
            id: key || `${item.id}-${index}`,
            checked: false,
            payAmount: remainingPatient.toFixed(2),
            patientBalance: remainingPatient,
            totalAmount,
            writeoffAmount,
            adjustmentAmount: 0,
            insuranceAmount,
          };
        })
        .filter((proc) => proc.patientBalance > 0);

      if (lineItems.length === 0) return null;
      // No reconciliation against `item.summary.ptBal`. These rows come from the
      // ledger's own restated per-procedure balances, so they are the truth.
      // Forcing them to add up to the invoice header was inventing money: on an
      // invoice whose lines owed $157 but whose header still said $182, the
      // mismatch was "corrected" by handing the whole $182 to the one surviving
      // line. The header disagrees because that procedure was already settled
      // (its patientPaidAmount covers its portion) while the invoice-level
      // total still counts it.

      return {
        id: item.id,
        invoiceNumber: item.invoiceNumber || item.id,
        invoiceDate: item.rawDate || item.date,
        checked: false,
        patientBalance,
        totalBalance: moneyNumber(item.amount || item.totalAmount),
        insuranceBalance: invoiceInsuranceBalance,
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
  const ledgerOverrideAppliedRef = useRef(false);

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
      ledgerOverrideAppliedRef.current = false;
      dispatch(invalidatePaymentInvoices(patientId));
      dispatch(fetchPaymentDraftInvoices(patientId));
      
      apiClient.get(`/finance-dashboard/aging/${patientId}`)
        .then(res => setAccountCredit(res.data?.data?.patientAccountCredit || 0))
        .catch(err => console.warn("Failed to fetch account credit", err));
    }
  }, [dispatch, patientId]);

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
    if (ledgerInvoices.length > 0) {
      dispatch(setPaymentInvoicesForPatient({ patientId, invoices: ledgerInvoices }));
      ledgerOverrideAppliedRef.current = true;
    }
  }, [dispatch, patientId, loading, ledgerItems]);

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
          if (!i.checked) sumToAdd += paymentLineAmount(i);
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
          if (!i.checked) sumToAdd += paymentLineAmount(i);
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
        if (item.checked) selectedItems.push({ invoiceId: inv.id, itemId: item.id, amount: paymentLineAmount(item).toFixed(2) });
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
