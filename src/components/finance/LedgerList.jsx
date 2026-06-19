import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from '../../store/slices/billingSlice';

// Sub-components
import BackdateTransactionPopup from './BackdateTransactionPopup';
import PrintOptionsDropdown from './PrintOptionsDropdown';
import AdjustmentOptionsDropdown from './AdjustmentOptionsDropdown';
import CreditSubtractionDialog from './CreditSubtractionDialog';
import DebitAdjustmentDialog from './DebitAdjustmentDialog';
import MembershipAdjustmentDialog from './MembershipAdjustmentDialog';
import InsuranceWriteOffDialog from './InsuranceWriteOffDialog';
import CourtesyCreditComponent from './CourtesyCreditComponent';
import UndoConfirmationDialog from './UndoConfirmationDialog';
import VoidConfirmationDialog from './VoidConfirmationDialog';
import SimpleStatement from './SimpleStatement';
import DetailedStatement from './DetailedStatement';
import EditDeposit from './EditDeposit';
import InvoiceModal from './InvoiceModal';
import TransferCreditConfirmationDialog from './TransferCreditConfirmationDialog';
import EditInvoiceDetailsDialog from './EditInvoiceDetailsDialog';
import dayjs from 'dayjs';

// --- COMPONENT HELPERS ---

const IconCashMinus = ({ size = 18 }) => (
  <Box sx={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect x="2" y="8" width="16" height="8" fill="#a5d6a7" stroke="#000" strokeWidth="1" />
      <circle cx="10" cy="12" r="3" fill="#2e7d32" opacity="0.3" />
      <circle cx="18" cy="16" r="5" fill="#81d4fa" stroke="#000" strokeWidth="1" />
      <path d="M15 16H21" stroke="#0288d1" strokeWidth="2" />
    </svg>
  </Box>
);

const SummaryLabel = ({ label, value, isRed }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 0.5 }}>
    <Typography variant="caption" sx={{ color: '#777', fontSize: '10px', whiteSpace: 'nowrap' }}>{label}:</Typography>
    <Typography variant="caption" sx={{ fontWeight: 'bold', color: isRed ? '#d32f2f' : '#444', fontSize: '10px' }}>{value}</Typography>
  </Box>
);

const LedgerSubRow = ({
  id, date, title, amount, initials, isAdjustment, isPayment, isClaim,
  showExtendedTools, onVoidClick, voidData, onEditClick, editData,
  adjustmentType, onRefreshClick, refreshData, onMagicStickClick,
  onSettingsClick, onAdjustmentSelect, onPrintClick,
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', p: '2px 12px', '&:hover': { bgcolor: '#f0f4ff' } }}>
    <Typography variant="caption" sx={{ color: '#555', width: 80, fontSize: '11px' }}>{date}</Typography>
    <CalendarMonth sx={{ fontSize: 16, color: '#90a4ae', mr: 1 }} />
    <Typography variant="caption" sx={{
      flexGrow: 1, color: isAdjustment ? '#7e57c2' : '#444', fontSize: '11px',
      fontWeight: isAdjustment ? 500 : 400, display: 'flex', alignItems: 'center', gap: 1,
    }}>
      {title.includes('(uncollected)') ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#444', fontSize: '11px', fontWeight: 500 }}>
            {title.replace('(uncollected)', '').trim()} #{id || '14040'}:{' '}
            <Box component="span" sx={{ color: '#999', fontWeight: 'bold', ml: 0.5 }}>
              {adjustmentType || 'Un-Collected'} {amount}
            </Box>
          </Typography>
        </Box>
      ) : isPayment ? (
        <Typography variant="caption" sx={{ color: '#444', fontSize: '11px', fontWeight: 500 }}>{title}</Typography>
      ) : isClaim ? (
        <Typography variant="caption" sx={{ color: '#0288d1', fontSize: '11px', fontWeight: 500 }}>{title}</Typography>
      ) : (
        <Typography variant="caption" sx={{ color: '#444', fontSize: '11px', fontWeight: 500 }}>
          {isAdjustment ? 'Adjustment' : 'Invoice'} #{id || '24636'} ({date}): [ {title} ]
        </Typography>
      )}
    </Typography>
    <Typography variant="caption" sx={{ width: 80, fontWeight: 'bold', color: isAdjustment ? '#7e57c2' : '#444', fontSize: '11px', textAlign: 'left' }}>
      {title.includes('(uncollected)') ? '$0.00' : amount}
    </Typography>
    <Typography variant="caption" sx={{ width: 40, color: '#cfd8dc', fontWeight: 'bold', fontSize: '10px', textAlign: 'center' }}>
      {initials}
    </Typography>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ width: 120, justifyContent: 'flex-end' }}>
      {isPayment ? (
        <>
          <NotInterested sx={{ fontSize: 18, color: '#d32f2f', cursor: 'pointer', transform: 'scaleX(-1)' }} />
          <Print sx={{ fontSize: 18, color: '#5c6bc0', cursor: 'pointer' }} />
          <NotInterested sx={{ fontSize: 18, color: '#d32f2f', cursor: 'pointer' }} onClick={() => onVoidClick?.(voidData)} />
          <Edit sx={{ fontSize: 18, color: '#7cb342', cursor: 'pointer' }} onClick={() => onEditClick?.(editData)} />
          <MoreHoriz sx={{ fontSize: 18, color: '#90a4ae', cursor: 'pointer' }} />
        </>
      ) : isClaim ? (
        null
      ) : showExtendedTools ? (
        <>
          <Settings sx={{ fontSize: 18, color: '#90a4ae', cursor: 'pointer' }} onClick={() => onSettingsClick?.({ id, date, title, amount })} />
          <Print sx={{ fontSize: 18, color: '#5c6bc0', cursor: 'pointer' }} onClick={(e) => onPrintClick?.(e)} />
          <AutoFixHigh sx={{ fontSize: 18, color: '#444', cursor: 'pointer' }} onClick={(e) => onMagicStickClick?.(e)} />
          <Tune sx={{ fontSize: 18, color: '#7e57c2', cursor: 'pointer' }} onClick={(e) => onAdjustmentSelect?.(e)} />
          <NotInterested sx={{ fontSize: 18, color: '#d32f2f', cursor: 'pointer' }} onClick={() => onVoidClick?.(voidData)} />
        </>
      ) : (
        <>
          <Edit sx={{ fontSize: 18, color: '#7cb342', cursor: 'pointer' }} onClick={() => onEditClick?.(editData)} />
          <Refresh sx={{ fontSize: 18, color: '#4fc3f7', cursor: 'pointer' }} onClick={() => onRefreshClick?.(refreshData)} />
          <NotInterested sx={{ fontSize: 18, color: '#d32f2f', cursor: 'pointer' }} onClick={() => onVoidClick?.(voidData)} />
        </>
      )}
    </Stack>
  </Box>
);

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
      ledgerItems.forEach((_, idx) => { all[idx] = expanded; });
      setExpandedItems(all);
    }
  }, [expanded]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <Box sx={{ p: 1, bgcolor: '#f4f7f9' }}>
      {ledgerItems.map((item, idx) => {
        const isExpanded = expandedItems[idx] || false;
        // Apply any local deposit overrides (method/provider edits)
        const displayItem = depositOverrides[item.id]
          ? { ...item, method: depositOverrides[item.id].paymentType || item.method }
          : item;

        return (
          <Box key={idx} sx={{ mb: 1.5 }}>
            <Paper
              elevation={0}
              sx={{
                p: '4px 12px', border: '1px solid #a5b4fc',
                borderRadius: isExpanded && displayItem.details ? '4px 4px 0 0' : '4px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                bgcolor: '#fff', cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' },
              }}
              onClick={() => handleItemClick(idx)}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
                {isExpanded ? (
                  (() => {
                    if (displayItem.isAdjustment && !displayItem.useCheckmark)
                      return <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#f44336', mr: 2.5, ml: 0.5 }} />;
                    if (!displayItem.isAdjustment && !displayItem.success)
                      return <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#f44336', mr: 2.5, ml: 0.5 }} />;
                    return <CheckCircle sx={{ color: '#4caf50', fontSize: 20, width: 40 }} />;
                  })()
                ) : (
                  <Checkbox size="small" sx={{ p: 0, width: 40 }} />
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                  {isExpanded ? (
                    <Typography variant="caption" sx={{ color: '#333', fontWeight: 'bold', fontSize: '11px' }}>
                      {displayItem.method === 'Invoice' ? 'Invoice' : 'Adjustment'} #{displayItem.invoiceNumber || displayItem.id} ({displayItem.date}): {displayItem.totalAmount || displayItem.amount}
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="caption" sx={{ color: displayItem.color, fontWeight: 500, fontSize: '11px' }}>
                        {displayItem.method === 'Invoice'
                          ? `Invoice #${displayItem.invoiceNumber || displayItem.id}`
                          : displayItem.method === 'Adjustment'
                          ? `Adjustment #${displayItem.invoiceNumber || displayItem.id}`
                          : `Patient Deposit#${displayItem.id}`}{' '}
                        ({displayItem.date} <CalendarMonth sx={{ fontSize: 13, verticalAlign: 'middle', mb: 0.5 }} />) with {displayItem.method}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: displayItem.color, fontSize: '11px' }}>
                        {displayItem.amount}
                      </Typography>
                      {displayItem.success && !displayItem.isAdjustment && !displayItem.details?.some((d) => d.title.includes('(uncollected)')) && (
                        <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                          SuccessfulTransaction
                        </Typography>
                      )}
                    </>
                  )}
                </Box>

                {!isExpanded && (
                  <Typography variant="caption" sx={{ width: 40, color: '#cfd8dc', fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                    {displayItem.initials}
                  </Typography>
                )}
              </Stack>

              {!isExpanded && (
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: 120, justifyContent: 'flex-end' }}>
                  {!displayItem.success && <NotInterested sx={{ fontSize: 18, color: '#d32f2f', cursor: 'pointer' }} />}
                  <Print sx={{ fontSize: 18, color: '#90a4ae', cursor: 'pointer' }} />
                  <Edit
                    sx={{ fontSize: 18, color: '#7cb342', cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); handleCollapsedEditClick(displayItem); }}
                  />
                </Stack>
              )}
            </Paper>

            {/* Expanded Details */}
            {isExpanded && displayItem.details && (
              <Box sx={{ border: '1px solid #a5b4fc', borderTop: 'none', borderRadius: '0 0 4px 4px', bgcolor: '#f8faff', p: '4px 0' }}>
                <Divider sx={{ borderColor: '#eef2ff', mb: 0.5 }} />

                <Box sx={{ px: '12px', mb: 0.5 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 40px 120px', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, ml: '40px' }}>
                      <SummaryLabel label="Ins WO"          value={displayItem.summary?.insWo   || '$0.00'} />
                      <SummaryLabel label="Pt Balance"      value={displayItem.summary?.ptBal   || '$0.00'} isRed={displayItem.isAdjustment && displayItem.summary?.ptBal !== '$0.00'} />
                      <SummaryLabel label="Ins Balance"     value={displayItem.summary?.insBal  || '$0.00'} />
                      <SummaryLabel label="Invoice Balance" value={displayItem.summary?.invBal  || '$0.00'} isRed={displayItem.isAdjustment && displayItem.summary?.invBal !== '$0.00'} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#cfd8dc', fontWeight: 'bold', fontSize: '10px', textAlign: 'center' }}>
                      {displayItem.initials}
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="flex-end">
                      <CalendarMonth sx={{ fontSize: 18, color: '#90a4ae', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleCalendarClick(displayItem, e); }} />
                      <Tune sx={{ fontSize: 18, color: '#7e57c2', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setAdjAnchorEl(e.currentTarget); setAdjItem(displayItem); }} />
                      <Print sx={{ fontSize: 18, color: '#5c6bc0', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setPrintAnchorEl(e.currentTarget); setPrintItem(displayItem); }} />
                      <IconCashMinus size={18} />
                    </Stack>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 40px 120px', alignItems: 'center' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, ml: '40px' }}>
                      <SummaryLabel label="Applied WO" value={displayItem.summary?.appliedWo || '$0.00'} />
                      <SummaryLabel label="Pt Paid"    value={displayItem.summary?.ptPaid    || '$0.00'} />
                      <SummaryLabel label="Ins Paid"   value={displayItem.summary?.insPaid   || '$0.00'} />
                      <Box />
                    </Box>
                    <Box /><Box />
                  </Box>
                </Box>

                <Divider sx={{ borderColor: '#eef2ff', mb: 0.5 }} />

                {displayItem.details.map((detail, dIdx) => (
                  <LedgerSubRow
                    key={dIdx}
                    date={displayItem.date}
                    title={detail.title}
                    amount={detail.amount}
                    id={detail.id}
                    initials={displayItem.initials}
                    isPayment={detail.isPayment}
                    isClaim={detail.isClaim}
                    showExtendedTools={!detail.isClaim && !detail.title.includes('(uncollected)')}
                    adjustmentType={adjustmentTypeMap[`${displayItem.id}-${detail.id}`]}
                    onVoidClick={handleVoidClick}
                    onEditClick={handleEditClick}
                    onRefreshClick={handleRefreshClick}
                    voidData={{ id: detail.id, title: detail.title, amount: detail.amount, date: displayItem.date, invoiceId: displayItem.id, isAdjustment: displayItem.isAdjustment, isGrouped: detail.isGrouped }}
                    editData={{ id: detail.id, title: detail.title, amount: detail.amount, date: displayItem.date, invoiceId: displayItem.id, isAdjustment: displayItem.isAdjustment }}
                    refreshData={{ idx, id: detail.id, invoiceId: displayItem.id, isAdjustment: displayItem.isAdjustment }}
                    isAdjustment={displayItem.isAdjustment}
                    onMagicStickClick={(e) => setMagicStickAnchorEl(e.currentTarget)}
                    onSettingsClick={(data) => { setEditInvoiceTarget(data); setShowEditInvoice(true); }}
                    onAdjustmentSelect={(e) => { setAdjAnchorEl(e.currentTarget); setAdjItem(displayItem); }}
                    onPrintClick={(e) => { setPrintAnchorEl(e.currentTarget); setPrintItem(displayItem); }}
                  />
                ))}

                {displayItem.details?.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', p: '2px 12px' }}>
                    <Button
                      variant="contained" size="small"
                      onClick={() => handleAddProcedureClick({ invoiceId: displayItem.id, date: displayItem.date })}
                      sx={{ padding: '4px 16px', borderRadius: '4px', backgroundColor: '#7788bb', fontSize: '11px', color: 'white', '&:hover': { backgroundColor: '#6677aa' } }}
                    >
                      Add Procedure
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        );
      })}

      {/* ── Popovers / Dropdowns ── */}
      <BackdateTransactionPopup open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} onDone={handleBackdateDone} />
      <PrintOptionsDropdown anchorEl={printAnchorEl} open={Boolean(printAnchorEl)} onClose={() => setPrintAnchorEl(null)} onSelect={handlePrintSelect} />
      <AdjustmentOptionsDropdown anchorEl={adjAnchorEl} open={Boolean(adjAnchorEl)} onClose={() => setAdjAnchorEl(null)} onSelect={handleAdjustmentSelect} />

      {/* Adjustment sub-dialogs */}
      {[
        { open: showAdjustDialog,     onClose: () => setShowAdjustDialog(false),     Component: CreditSubtractionDialog },
        { open: showDebitDialog,      onClose: () => setShowDebitDialog(false),      Component: DebitAdjustmentDialog },
        { open: showMembershipDialog, onClose: () => setShowMembershipDialog(false), Component: MembershipAdjustmentDialog },
        { open: showWriteOffDialog,   onClose: () => setShowWriteOffDialog(false),   Component: InsuranceWriteOffDialog },
      ].map(({ open, onClose, Component }, i) => (
        <Dialog key={i} open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '4px', overflow: 'hidden' } }}>
          <DialogContent sx={{ p: 0 }}><Component onClose={onClose} /></DialogContent>
        </Dialog>
      ))}

      <VoidConfirmationDialog open={showVoidDialog} onClose={handleVoidCancel} onConfirm={handleVoidConfirm} voidTarget={voidTarget} />

      <Dialog open={showCourtesyCredit} onClose={handleCourtesyCreditCancel} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: '4px', overflow: 'hidden', bgcolor: 'transparent', boxShadow: 'none' } }}>
        <DialogContent sx={{ p: 0 }}>
          <CourtesyCreditComponent adjustmentData={editTarget} onSave={handleCourtesyCreditSave} onCancel={handleCourtesyCreditCancel} showAmountSection={false} />
        </DialogContent>
      </Dialog>

      <UndoConfirmationDialog open={showUndoDialog} onClose={handleUndoCancel} onConfirm={handleUndoConfirm} />

      {/* Statement dialogs */}
      {[
        { open: showSimpleStatement,   onClose: () => setShowSimpleStatement(false),   Component: SimpleStatement },
        { open: showDetailedStatement, onClose: () => setShowDetailedStatement(false), Component: DetailedStatement },
      ].map(({ open, onClose, Component }, i) => (
        <Dialog key={i} open={open} onClose={onClose} maxWidth={false} fullWidth
          PaperProps={{ sx: { borderRadius: 0, overflow: 'hidden', maxHeight: '90vh', margin: 0, bgcolor: '#f5f5f5', width: '880px', maxWidth: '90vw' } }}
          sx={{ '& .MuiDialog-paper': { margin: 0, maxWidth: '100%' } }}>
          <DialogContent sx={{ p: 0, m: 0, bgcolor: '#f5f5f5' }}><Component onClose={onClose} /></DialogContent>
        </Dialog>
      ))}

      <Dialog open={showEditDeposit} onClose={handleEditDepositCancel} maxWidth={false}
        PaperProps={{ sx: { minWidth: 220, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', bgcolor: '#fff', borderRadius: '4px', overflow: 'hidden' } }}>
        <DialogContent sx={{ p: 0 }}>
          <EditDeposit depositData={editDepositTarget} onSave={handleEditDepositSave} onCancel={handleEditDepositCancel} />
        </DialogContent>
      </Dialog>

      <Dialog open={showInvoiceModal} onClose={handleInvoiceModalCancel} maxWidth={false} fullWidth
        PaperProps={{ sx: { borderRadius: '2px', overflow: 'hidden', bgcolor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #ccc' } }}>
        <DialogContent sx={{ p: 0 }}>
          <InvoiceModal invoiceData={invoiceModalData} onSave={handleInvoiceModalSave} onCancel={handleInvoiceModalCancel} />
        </DialogContent>
      </Dialog>

      <Menu anchorEl={magicStickAnchorEl} open={Boolean(magicStickAnchorEl)} onClose={() => setMagicStickAnchorEl(null)}
        PaperProps={{ sx: { boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #eef2ff', '& .MuiMenuItem-root': { fontSize: '12px', fontWeight: 500, color: '#444', py: 1 } } }}>
        <MenuItem onClick={() => { setMagicStickAnchorEl(null); setShowTransferConfirmation(true); }}>
          Transfer Outstanding To Patient
        </MenuItem>
      </Menu>

      <TransferCreditConfirmationDialog
        open={showTransferConfirmation}
        onClose={() => setShowTransferConfirmation(false)}
        onConfirm={() => setShowTransferConfirmation(false)}
      />

      {showEditInvoice && (
        <Box
          sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300 }}
          onClick={() => setShowEditInvoice(false)}
        >
          <Box onClick={(e) => e.stopPropagation()}>
            <EditInvoiceDetailsDialog onClose={() => setShowEditInvoice(false)} invoiceId={editInvoiceTarget?.id} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LedgerList;
