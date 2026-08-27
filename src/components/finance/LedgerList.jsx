import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Box, Paper, Stack, Checkbox, Typography, Divider, Dialog, DialogContent,
  Button, Menu, MenuItem,
} from '@mui/material';
import {
  CalendarMonth, Print, Edit, NotInterested, Settings, AutoFixHigh,
  CheckCircle, Refresh, Tune, MoreHoriz,
} from '@mui/icons-material';

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
  transferOutstandingToPatient,
} from '../../store/slices/billingSlice';
import { fetchMedicalHistoryThunk, fetchDentalHistoryThunk } from '../../store/slices/patientSlice';
import { paymentService } from '../../services/payment.service';

import LedgerItemCard from './LedgerItemCard';
import { invoiceService } from '../../services/invoice.service';
import LedgerDialogManager from './LedgerDialogManager';
import { claimService } from '../../services/claim.service';
import ManageEOBModal from '../claims/batch-actions/modals/ManageEOBModal';
import EditClaimDialog from '../claims/EditClaimDialog';

const LedgerList = ({ patient, expanded, filters }) => {
  const dispatch = useDispatch();
  const location = useLocation();
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
  const [transferTarget,           setTransferTarget]           = useState(null);
  const [showEditInvoice,        setShowEditInvoice]        = useState(false);
  const [editInvoiceTarget,      setEditInvoiceTarget]      = useState(null);
  const [showInvoiceModal,       setShowInvoiceModal]       = useState(false);
  const [invoiceModalData,       setInvoiceModalData]       = useState(null);
  const [magicStickAnchorEl,     setMagicStickAnchorEl]     = useState(null);
  const [showAttachDialog,       setShowAttachDialog]       = useState(false);
  const [attachTarget,           setAttachTarget]           = useState(null);
  const [showEOBModal,           setShowEOBModal]           = useState(false);
  const [eobTarget,              setEOBTarget]              = useState(null);

  const handleEOBClick = (data) => {
    setEOBTarget(data);
    setShowEOBModal(true);
  };
  const [showEditClaimDialog,    setShowEditClaimDialog]    = useState(false);
  const [editClaimTarget,        setEditClaimTarget]        = useState(null);

  const handleEditClaimClick = (claimData) => {
    setEditClaimTarget(claimData);
    setShowEditClaimDialog(true);
  };
  
  const [showAdaDialog,          setShowAdaDialog]          = useState(false);
  const [adaTarget,              setAdaTarget]              = useState(null);

  const handlePrintClaimClick = (claim) => {
    setAdaTarget(claim);
    setShowAdaDialog(true);
  };

  const handleReopenClaimClick = async (claim) => {
    if (!claim?.id) return;
    try {
      const isClosed = ['paid', 'cancelled'].includes((claim.status || '').toLowerCase());
      const newStatus = isClosed ? 'draft' : 'cancelled';
      await claimService.updateClaim(claim.id, { status: newStatus });
      refreshLedger();
    } catch (err) {
      console.error('Failed to toggle claim status', err);
      alert('Failed to toggle claim status.');
    }
  };
  
  // Local deposit edits (not server-persisted in the original code either)
  const [depositOverrides,       setDepositOverrides]       = useState({});

  // ── Fetch on mount / patientId change ────────────────────────────────────
  const refreshLedger = useCallback(() => {
    if (patientId) {
      dispatch(fetchLedgerItems(patientId));
      dispatch(fetchMedicalHistoryThunk(patientId));
      dispatch(fetchDentalHistoryThunk(patientId));
    }
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

  useEffect(() => {
    if (location.state?.invoiceId && ledgerItems.length > 0) {
      const targetInvoiceId = location.state.invoiceId;
      const idx = ledgerItems.findIndex(item => 
        String(item.id) === String(targetInvoiceId) || 
        String(item.invoiceNumber) === String(targetInvoiceId)
      );
      
      if (idx !== -1) {
        setExpandedItems((prev) => {
          if (!prev[idx]) {
            const targetItem = ledgerItems[idx];
            if (targetItem?.method === 'Invoice') {
              dispatch(fetchInvoiceDetails({ patientId, invoiceId: targetItem.id }));
            }
            return { ...prev, [idx]: true };
          }
          return prev;
        });

        setTimeout(() => {
          const element = document.getElementById(`ledger-item-${idx}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a temporary highlight effect
            element.style.transition = 'box-shadow 0.3s ease-in-out';
            element.style.boxShadow = '0 0 10px 2px #4caf50';
            setTimeout(() => {
              element.style.boxShadow = 'none';
            }, 2000);
          }
        }, 300);
      }
    }
  }, [location.state?.invoiceId, ledgerItems, patientId, dispatch]);

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
    console.log('handleBackdateDone called with:', date, 'calendarTarget:', calendarTarget);
    if (!calendarTarget) {
      console.warn('calendarTarget is null');
    }
    if (!date) {
      console.warn('date is empty or null');
    }
    
    if (calendarTarget && date) {
      console.log('Dispatching backdateTransaction...', { patientId, itemId: calendarTarget.id, date, isAdjustment: calendarTarget.isAdjustment });
      try {
        await dispatch(backdateTransaction({
          patientId,
          itemId: calendarTarget.id,
          date,
          isAdjustment: calendarTarget.isAdjustment,
        })).unwrap();
        console.log('backdateTransaction succeeded');
      } catch (err) {
        console.error('backdateTransaction failed', err);
        alert('Failed to backdate: ' + err);
      }
    }
    setCalendarTarget(null);
    setAnchorEl(null);
  };

  const handleVoidClick  = (item) => { setVoidTarget(item); setShowVoidDialog(true); };
  const handleVoidCancel = () => { setShowVoidDialog(false); setVoidTarget(null); };
  const handleVoidConfirm = async () => {
    if (voidTarget) {
      try {
        console.log('Dispatching voidTransaction with:', voidTarget);
        await dispatch(voidTransaction({
          patientId,
          invoiceId: voidTarget.invoiceId, // might be undefined for adjustments
          itemId:    voidTarget.id,
          isAdjustment: voidTarget.isAdjustment,
          isGrouped:    voidTarget.isGrouped,
          isPayment:    voidTarget.isPayment,
        })).unwrap();
        console.log('voidTransaction succeeded');
      } catch (err) {
        console.error('voidTransaction failed:', err);
      }
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
  const handleUndoConfirm = async () => {
    if (undoTarget) {
      try {
        if (undoTarget.isAdjustment) {
          console.log('Dispatching voidTransaction for adjustment with:', undoTarget);
          await dispatch(voidTransaction({
            patientId,
            invoiceId: undoTarget.invoiceId,
            itemId: undoTarget.id,
            isAdjustment: true
          })).unwrap();
          console.log('voidTransaction succeeded');
        } else if (undoTarget.isPayment) {
          console.log('Dispatching voidPayment with:', undoTarget);
          await paymentService.voidPayment(undoTarget.id, 'Undone by user');
          console.log('voidPayment succeeded');
        } else {
          console.log('Dispatching undoCourtesyCredit with:', undoTarget);
          await dispatch(undoCourtesyCredit({
            patientId,
            procedureId: undoTarget.id,
            invoiceId:   undoTarget.invoiceId,
          })).unwrap();
          console.log('undoCourtesyCredit succeeded');
        }
      } catch (err) {
        console.error('undo action failed:', err);
      }
    }
    setShowUndoDialog(false);
    setUndoTarget(null);
    refreshLedger();
  };

  const handleTransferConfirm = async () => {
    if (transferTarget) {
      if (transferTarget.isGrouped && transferTarget.procedures) {
        let successCount = 0;
        for (let i = 0; i < transferTarget.procedures.length; i++) {
          const proc = transferTarget.procedures[i];
          const procId = proc.ProcNum || proc._id || proc.id;
          if (procId) {
            const isLast = i === transferTarget.procedures.length - 1;
            try {
              await dispatch(transferOutstandingToPatient({
                patientId,
                invoiceId: transferTarget.invoiceId,
                procedureId: procId,
                skipFetch: !isLast
              })).unwrap();
              successCount++;
            } catch (err) {
              console.error('Failed to transfer for procedure:', procId, err);
            }
          }
        }
        if (successCount === 0 && transferTarget.procedures.length > 0) {
          // If all failed, they might not have any outstanding balance
          console.warn('No procedures had outstanding insurance to transfer');
        }
      } else {
        await dispatch(transferOutstandingToPatient({
          patientId,
          invoiceId: transferTarget.invoiceId,
          procedureId: transferTarget.id,
        }));
      }
    }
    setShowTransferConfirmation(false);
    setTransferTarget(null);
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

  const handleAttachClick = (data) => {
    setAttachTarget({ ...data, patientId: patientId || 1 });
    setShowAttachDialog(true);
  };

  const handleAddProcedureClick = (item) => { setInvoiceModalData(item); setShowInvoiceModal(true); };
  const handleInvoiceModalCancel = () => { setShowInvoiceModal(false); setInvoiceModalData(null); };

  const handleInvoiceModalSave = async (savePayload) => {
    // Support both old array format and new object format from InvoiceModal
    const data = Array.isArray(savePayload) ? savePayload : savePayload.procedures;
    const shouldAddClaim = !Array.isArray(savePayload) && savePayload.addClaim;
    const claimRows = !Array.isArray(savePayload) ? (savePayload.claimProcedures || []) : [];

    const payload = {
      patientId: parseInt(patientId, 10) || 1,
      notes: savePayload.description,
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
      let createdInvoiceId;

      if (invoiceModalData?.invoiceId) {
        const targetInvoiceId = invoiceModalData.invoiceId;
        await Promise.all(
          payload.items.map(item => invoiceService.addInvoiceItem(targetInvoiceId, {
            serviceId: item.code,
            unitPrice: item.charge,
            description: item.description,
            cptCode: item.code,
            quantity: 1,
            // passing additional fields in case the backend uses them
            date: item.date,
            provider: item.provider,
            site: item.site,
            dbi: item.dbi,
            completed: item.completed
          }))
        );
        createdInvoiceId = targetInvoiceId;
      } else {
        const result = await dispatch(createInvoice(payload)).unwrap();
        createdInvoiceId = result?.invoice?._id || result?.invoice?.id || result?._id || result?.id;
      }

      setShowInvoiceModal(false);
      setInvoiceModalData(null);

      // If "Add Claim" was checked, create a claim for all dbi=false procedures
      if (shouldAddClaim && claimRows.length > 0) {
        if (createdInvoiceId) {
          try {
            await claimService.createClaimFromInvoice(createdInvoiceId, {
              procedures: claimRows.map((row) => ({
                code: row.code,
                description: row.treatment,
                charge: parseFloat((String(row.charge || '')).replace(/[^0-9.-]+/g, '')) || 0,
                insPortion: parseFloat((String(row.insPortion || '')).replace(/[^0-9.-]+/g, '')) || 0,
              })),
            });
          } catch (claimErr) {
            console.warn('Invoice created but claim creation failed:', claimErr);
          }
        }
      }

      refreshLedger();
    } catch (err) {
      alert('Failed to create invoice: ' + (err.message || err));
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: 1, bgcolor: '#FFFFFF' }}>
      {ledgerItems.map((item, idx) => {
        // Apply filters
        if (item.isVoided && !filters?.includeVoided) {
          return null;
        }

        const isExpanded = expandedItems[idx] || false;
        let displayItem = depositOverrides[item.id]
          ? { ...item, method: depositOverrides[item.id].paymentType || item.method }
          : item;

        // Also filter out voided child details if they shouldn't be included
        if (!filters?.includeVoided && displayItem.details) {
          displayItem = {
            ...displayItem,
            details: displayItem.details.filter(d => !d.isVoided)
          };
        }

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
            setTransferTarget={setTransferTarget}
            setEditInvoiceTarget={setEditInvoiceTarget}
            setShowEditInvoice={setShowEditInvoice}
            setAdjAnchorEl={setAdjAnchorEl}
            setAdjItem={setAdjItem}
            setPrintAnchorEl={setPrintAnchorEl}
            setPrintItem={setPrintItem}
            onEOBClick={handleEOBClick}
            onPrintClaimClick={handlePrintClaimClick}
            onReopenClaimClick={handleReopenClaimClick}
            onEditClaimClick={handleEditClaimClick}
            handleAddProcedureClick={handleAddProcedureClick}
            handleAttachClick={handleAttachClick}
          />
        );
      })}

      <LedgerDialogManager
        anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleBackdateDone={handleBackdateDone}
        printAnchorEl={printAnchorEl} setPrintAnchorEl={setPrintAnchorEl} handlePrintSelect={handlePrintSelect} printItem={printItem}
        adjAnchorEl={adjAnchorEl} setAdjAnchorEl={setAdjAnchorEl} handleAdjustmentSelect={handleAdjustmentSelect} adjItem={adjItem}
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
        showTransferConfirmation={showTransferConfirmation} setShowTransferConfirmation={setShowTransferConfirmation} handleTransferConfirm={handleTransferConfirm}
        showEditInvoice={showEditInvoice} setShowEditInvoice={setShowEditInvoice} editInvoiceTarget={editInvoiceTarget}
        showAttachDialog={showAttachDialog} setShowAttachDialog={setShowAttachDialog} attachTarget={attachTarget}
        showAdaDialog={showAdaDialog} setShowAdaDialog={setShowAdaDialog} adaTarget={adaTarget}
      />
      {showEOBModal && (
        <ManageEOBModal
          open={showEOBModal}
          onClose={(hasChanges) => { 
            setShowEOBModal(false); 
            setEOBTarget(null); 
            if (hasChanges && patientId) {
              dispatch(fetchLedgerItems(patientId));
            }
          }}
          selectedBatchPayment={eobTarget}
        />
      )}
      {showEditClaimDialog && (
        <EditClaimDialog
          open={showEditClaimDialog}
          claim={editClaimTarget}
          onClose={() => { setShowEditClaimDialog(false); setEditClaimTarget(null); }}
          onSave={async (data) => {
            try {
              if (editClaimTarget?._id || editClaimTarget?.id) {
                const claimId = editClaimTarget._id || editClaimTarget.id;
                console.log("Saving claim edits:", claimId, data);
                await claimService.updateClaim(claimId, data);
                refreshLedger();
              }
            } catch (err) {
              console.error("Failed to update claim:", err);
            }
          }}
        />
      )}
    </Box>
  );
};

export default LedgerList;
