import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

// Redux
import {
  createInvoice,
  fetchLedgerItems,
  fetchInvoiceDetails,
  backdateTransaction,
  voidTransaction,
  applyCourtesyCredit,
  undoCourtesyCredit,
  selectLedgerItemsForPatient,
  selectLedgerLoading,
  selectAdjustmentTypeMap,
  setAdjustmentTypeForItem,
} from '../../store/slices/billingSlice';

import LedgerItemCard from './LedgerItemCard';
import LedgerDialogManager from './LedgerDialogManager';

const LedgerList = ({ patient, expanded }) => {
  const dispatch = useDispatch();
  const patientId = patient?._id || patient?.id;

  // ── Redux state ──────────────────────────────────────────────────────────
  const ledgerItems    = useSelector(selectLedgerItemsForPatient(patientId));
  const ledgerLoading  = useSelector(selectLedgerLoading);
  const adjustmentTypeMap = useSelector(selectAdjustmentTypeMap);

  // ── Local UI state (dialogs / menus — no data) ───────────────────────────
  const [expandedItems,          setExpandedItems]          = useState({});
  const [anchorEl,               setAnchorEl]               = useState(null);
  const [calendarTarget,         setCalendarTarget]         = useState(null);
  const [adjItem,                setAdjItem]                = useState(null);
  const [printItem,              setPrintItem]              = useState(null);
  const [printAnchorEl,          setPrintAnchorEl]          = useState(null);
  const [adjAnchorEl,            setAdjAnchorEl]            = useState(null);
  const [showAdjustDialog,       setShowAdjustDialog]       = useState(false);
  const [showDebitDialog,        setShowDebitDialog]        = useState(false);
  const [showMembershipDialog,   setShowMembershipDialog]   = useState(false);
  const [showWriteOffDialog,     setShowWriteOffDialog]     = useState(false);
  const [showVoidDialog,         setShowVoidDialog]         = useState(false);
  const [voidTarget,             setVoidTarget]             = useState(null);
  const [showCourtesyCredit,     setShowCourtesyCredit]     = useState(false);
  const [editTarget,             setEditTarget]             = useState(null);
  const [showUndoDialog,         setShowUndoDialog]         = useState(false);
  const [undoTarget,             setUndoTarget]             = useState(null);
  const [showSimpleStatement,    setShowSimpleStatement]    = useState(false);
  const [showDetailedStatement,  setShowDetailedStatement]  = useState(false);
  const [showEditDeposit,        setShowEditDeposit]        = useState(false);
  const [editDepositTarget,      setEditDepositTarget]      = useState(null);
  const [showTransferConfirmation, setShowTransferConfirmation] = useState(false);
  const [showEditInvoice,        setShowEditInvoice]        = useState(false);
  const [editInvoiceTarget,      setEditInvoiceTarget]      = useState(null);
  const [showInvoiceModal,       setShowInvoiceModal]       = useState(false);
  const [invoiceModalData,       setInvoiceModalData]       = useState(null);
  const [magicStickAnchorEl,     setMagicStickAnchorEl]     = useState(null);
  // Local deposit edits (not server-persisted in the original code either)
  const [depositOverrides,       setDepositOverrides]       = useState({});

  // ── Fetch on mount / patientId change ────────────────────────────────────
  const refreshLedger = useCallback(() => {
    if (patientId) dispatch(fetchLedgerItems(patientId));
  }, [dispatch, patientId]);

  useEffect(() => {
    refreshLedger();
    window.addEventListener('refresh-ledger', refreshLedger);
    window.addEventListener('add-ledger-item', refreshLedger);
    return () => {
      window.removeEventListener('refresh-ledger', refreshLedger);
      window.removeEventListener('add-ledger-item', refreshLedger);
    };
  }, [refreshLedger]);

  const prevExpandedRef = React.useRef(expanded);
  useEffect(() => {
    // Only reset if the `expanded` prop itself changed (e.g. parent toggled expand-all)
    if (expanded !== undefined && expanded !== prevExpandedRef.current) {
      prevExpandedRef.current = expanded;
      const all = {};
      ledgerItems.forEach((item, idx) => { 
        all[idx] = expanded; 
        // If expanding all, automatically fetch details for any invoices missing them
        if (expanded && item.method === 'Invoice' && !item.details) {
          dispatch(fetchInvoiceDetails({ patientId, invoiceId: item.id }));
        }
      });
      setExpandedItems(all);
    }
  }, [expanded, ledgerItems, dispatch, patientId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleItemClick = (idx) => {
    setExpandedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
    const targetItem = ledgerItems[idx];
    // condition() in the thunk guards against duplicate/in-flight fetches
    if (targetItem?.method === 'Invoice') {
      dispatch(fetchInvoiceDetails({ patientId, invoiceId: targetItem.id }));
    }
  };

  const handleCalendarClick = (item, event) => {
    setAnchorEl(event.currentTarget);
    setCalendarTarget(item);
  };

  const handleBackdateDone = async (date) => {
    if (calendarTarget && date) {
      dispatch(backdateTransaction({
        patientId,
        itemId: calendarTarget.id,
        date,
        isAdjustment: calendarTarget.isAdjustment,
      }));
    }
    setCalendarTarget(null);
    setAnchorEl(null);
  };

  const handleVoidClick  = (item) => { setVoidTarget(item); setShowVoidDialog(true); };
  const handleVoidCancel = () => { setShowVoidDialog(false); setVoidTarget(null); };
  const handleVoidConfirm = async () => {
    if (voidTarget) {
      dispatch(voidTransaction({
        patientId,
        invoiceId: voidTarget.invoiceId,
        itemId:    voidTarget.id,
        isAdjustment: voidTarget.isAdjustment,
        isGrouped:    voidTarget.isGrouped,
      }));
    }
    setShowVoidDialog(false);
    setVoidTarget(null);
  };

  const handleEditClick = (item) => { setEditTarget(item); setShowCourtesyCredit(true); };

  const handleCourtesyCreditSave = async (data) => {
    await dispatch(applyCourtesyCredit({
      patientId,
      procedureId:    data.id,
      invoiceId:      data.invoiceId,
      adjustmentType: data.adjustmentType,
      creditAmount:   data.creditAmount,
    }));
    // Optimistically update the local adjustmentTypeMap via dispatch (slice handles it too)
    dispatch(setAdjustmentTypeForItem({ key: `${data.invoiceId}-${data.id}`, adjustmentType: data.adjustmentType }));
    setShowCourtesyCredit(false);
    setEditTarget(null);
  };

  const handleCourtesyCreditCancel = () => { setShowCourtesyCredit(false); setEditTarget(null); };

  const handleRefreshClick = (data) => { setUndoTarget(data); setShowUndoDialog(true); };
  const handleUndoCancel   = () => { setShowUndoDialog(false); setUndoTarget(null); };
  const handleUndoConfirm  = async () => {
    if (undoTarget) {
      dispatch(undoCourtesyCredit({ patientId, procedureId: undoTarget.id, invoiceId: undoTarget.invoiceId }));
    }
    setShowUndoDialog(false);
    setUndoTarget(null);
  };

  const handleCollapsedEditClick = (item) => { setEditDepositTarget(item); setShowEditDeposit(true); };
  const handleEditDepositSave    = (data) => {
    if (editDepositTarget) {
      setDepositOverrides((prev) => ({ ...prev, [editDepositTarget.id]: data }));
    }
    setShowEditDeposit(false);
    setEditDepositTarget(null);
  };
  const handleEditDepositCancel = () => { setShowEditDeposit(false); setEditDepositTarget(null); };

  const handlePrintSelect = (option) => {
    if (option === 'Simple Statements') setShowSimpleStatement(true);
    else if (option === 'Detailed Statement') setShowDetailedStatement(true);
  };

  const handleAdjustmentSelect = (option) => {
    if (option === 'Credit (subtraction)')     setShowAdjustDialog(true);
    else if (option === 'Debit (addition)')    setShowDebitDialog(true);
    else if (option === 'Membership Adjustment') setShowMembershipDialog(true);
    else if (option === 'Insurance Write-Off') setShowWriteOffDialog(true);
  };

  const handleAddProcedureClick = (item) => { setInvoiceModalData(item); setShowInvoiceModal(true); };
  const handleInvoiceModalCancel = () => { setShowInvoiceModal(false); setInvoiceModalData(null); };

  const handleInvoiceModalSave = async (data) => {
    const payload = {
      patientId: parseInt(patientId, 10) || 1,
      items: data.map((row) => {
        let parsedDate = new Date().toISOString();
        if (row.date) { const d = new Date(row.date); if (!isNaN(d.getTime())) parsedDate = d.toISOString(); }
        return {
          code: row.code, description: row.treatment, date: parsedDate, site: row.site,
          provider: row.provider,
          writeoff:   parseFloat((String(row.writeoff   || '')).replace(/[^0-9.-]+/g, '')) || 0,
          ptPortion:  parseFloat((String(row.ptPortion  || '')).replace(/[^0-9.-]+/g, '')) || 0,
          insPortion: parseFloat((String(row.insPortion || '')).replace(/[^0-9.-]+/g, '')) || 0,
          charge:     parseFloat((String(row.charge     || '')).replace(/[^0-9.-]+/g, '')) || 0,
          balance:    parseFloat((String(row.balance    || '')).replace(/[^0-9.-]+/g, '')) || 0,
          dbi:       Boolean(row.dbi), completed: Boolean(row.completed),
        };
      }),
    };
    if (payload.items.length === 0) { alert('Please add at least one procedure before saving.'); return; }
    try {
      await dispatch(createInvoice(payload)).unwrap();
      setShowInvoiceModal(false);
      setInvoiceModalData(null);
      refreshLedger();
    } catch (err) {
      alert('Failed to create invoice: ' + (err.message || err));
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: 1, bgcolor: '#FFFFFF' }}>
      {ledgerItems.map((item, idx) => {
        const isExpanded = expandedItems[idx] || false;
        // Apply any local deposit overrides (method/provider edits)
        const displayItem = depositOverrides[item.id]
          ? { ...item, method: depositOverrides[item.id].paymentType || item.method }
          : item;

        return (
          <LedgerItemCard
            key={idx}
            idx={idx}
            displayItem={displayItem}
            isExpanded={isExpanded}
            adjustmentTypeMap={adjustmentTypeMap}
            handleItemClick={handleItemClick}
            handleCalendarClick={handleCalendarClick}
            handleVoidClick={handleVoidClick}
            handleEditClick={handleEditClick}
            handleRefreshClick={handleRefreshClick}
            setMagicStickAnchorEl={setMagicStickAnchorEl}
            setEditInvoiceTarget={setEditInvoiceTarget}
            setShowEditInvoice={setShowEditInvoice}
            setAdjAnchorEl={setAdjAnchorEl}
            setAdjItem={setAdjItem}
            setPrintAnchorEl={setPrintAnchorEl}
            setPrintItem={setPrintItem}
            handleAddProcedureClick={handleAddProcedureClick}
          />
        );
      })}

      <LedgerDialogManager
        anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleBackdateDone={handleBackdateDone}
        printAnchorEl={printAnchorEl} setPrintAnchorEl={setPrintAnchorEl} handlePrintSelect={handlePrintSelect}
        adjAnchorEl={adjAnchorEl} setAdjAnchorEl={setAdjAnchorEl} handleAdjustmentSelect={handleAdjustmentSelect}
        showAdjustDialog={showAdjustDialog} setShowAdjustDialog={setShowAdjustDialog}
        showDebitDialog={showDebitDialog} setShowDebitDialog={setShowDebitDialog}
        showMembershipDialog={showMembershipDialog} setShowMembershipDialog={setShowMembershipDialog}
        showWriteOffDialog={showWriteOffDialog} setShowWriteOffDialog={setShowWriteOffDialog}
        showVoidDialog={showVoidDialog} handleVoidCancel={handleVoidCancel} handleVoidConfirm={handleVoidConfirm} voidTarget={voidTarget}
        showCourtesyCredit={showCourtesyCredit} handleCourtesyCreditCancel={handleCourtesyCreditCancel} handleCourtesyCreditSave={handleCourtesyCreditSave} editTarget={editTarget}
        showUndoDialog={showUndoDialog} handleUndoCancel={handleUndoCancel} handleUndoConfirm={handleUndoConfirm}
        showSimpleStatement={showSimpleStatement} setShowSimpleStatement={setShowSimpleStatement}
        showDetailedStatement={showDetailedStatement} setShowDetailedStatement={setShowDetailedStatement}
        showEditDeposit={showEditDeposit} handleEditDepositCancel={handleEditDepositCancel} handleEditDepositSave={handleEditDepositSave} editDepositTarget={editDepositTarget}
        showInvoiceModal={showInvoiceModal} handleInvoiceModalCancel={handleInvoiceModalCancel} handleInvoiceModalSave={handleInvoiceModalSave} invoiceModalData={invoiceModalData}
        magicStickAnchorEl={magicStickAnchorEl} setMagicStickAnchorEl={setMagicStickAnchorEl}
        showTransferConfirmation={showTransferConfirmation} setShowTransferConfirmation={setShowTransferConfirmation}
        showEditInvoice={showEditInvoice} setShowEditInvoice={setShowEditInvoice} editInvoiceTarget={editInvoiceTarget}
      />
    </Box>
  );
};

export default LedgerList;
