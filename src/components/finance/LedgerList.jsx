import React from 'react';
import { Box, Paper, Stack, Checkbox, Typography, Divider, Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@mui/material';
import { 
  CalendarMonth, Print, Edit, NotInterested, Settings, AutoFixHigh, Reply, 
  CheckCircle, Refresh, Tune
} from '@mui/icons-material';
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

// --- CUSTOM PIXEL ART ICONS FOR LEDGER ---

const PixelIconWrapper = ({ children, size = 18, color = 'inherit' }) => (
  <Box sx={{ 
    width: size, 
    height: size, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    color: color,
    cursor: 'pointer'
  }}>
    {children}
  </Box>
);

const PixelCalendar = () => (
  <PixelIconWrapper size={16}>
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1" stroke="#90a4ae" strokeWidth="1" fill="#fff" />
      <path d="M2 6H14" stroke="#90a4ae" strokeWidth="1" />
      <path d="M5 2V4M11 2V4" stroke="#90a4ae" strokeWidth="1" />
      <rect x="4" y="8" width="2" height="2" fill="#90a4ae" />
      <rect x="7" y="8" width="2" height="2" fill="#90a4ae" />
    </svg>
  </PixelIconWrapper>
);

const PixelPrint = ({ color = '#90a4ae' }) => (
  <PixelIconWrapper size={18}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 5V2H12V5" stroke={color} strokeWidth="1" />
      <path d="M3 5H13V11H3V5Z" fill={color === '#90a4ae' ? '#eee' : color} stroke={color} strokeWidth="1" />
      <rect x="5" y="9" width="6" height="5" fill="#fff" stroke={color} strokeWidth="1" />
    </svg>
  </PixelIconWrapper>
);

const PixelEdit = () => (
  <PixelIconWrapper size={18}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 2L14 4L6 12L3 13L4 10L12 2Z" fill="#81c784" stroke="#2e7d32" strokeWidth="1" />
      <path d="M11 3L13 5" stroke="#2e7d32" strokeWidth="1" />
    </svg>
  </PixelIconWrapper>
);

const PixelBlock = () => (
  <PixelIconWrapper size={18}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#d32f2f" strokeWidth="1.5" />
      <path d="M4 4L12 12" stroke="#d32f2f" strokeWidth="1.5" />
    </svg>
  </PixelIconWrapper>
);

const PixelSettings = () => (
  <PixelIconWrapper size={16}>
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="#555" strokeWidth="1.5" />
      <path d="M8 2V4M8 12V14M2 8H4M12 8H14M4 4L5.5 5.5M10.5 10.5L12 12M4 12L5.5 10.5M10.5 5.5L12 4" stroke="#555" strokeWidth="1.5" />
    </svg>
  </PixelIconWrapper>
);

const PixelReply = ({ color = '#5c6bc0', flip = false }) => (
  <PixelIconWrapper size={18}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
      <path d="M13 12V8C13 6.3 11.7 5 10 5H3" stroke={color} strokeWidth="1.5" />
      <path d="M6 2L3 5L6 8" stroke={color} strokeWidth="1.5" />
    </svg>
  </PixelIconWrapper>
);

const PixelRefresh = ({ color = '#4fc3f7' }) => (
  <PixelIconWrapper size={18}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8C3 5.24 5.24 3 8 3C9.38 3 10.63 3.56 11.53 4.46" stroke={color} strokeWidth="1.5" />
      <path d="M12 2V5H9" stroke={color} strokeWidth="1.5" />
    </svg>
  </PixelIconWrapper>
);

const PixelAutoFix = () => (
  <PixelIconWrapper size={18}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 13L13 3M10 2L14 6" stroke="#444" strokeWidth="1.5" />
      <path d="M3 3L4 4M2 6L3 7M6 2L7 3" stroke="#ffd54f" strokeWidth="1" />
    </svg>
  </PixelIconWrapper>
);

const SummaryLabel = ({ label, value }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 0.5 }}>
    <Typography variant="caption" sx={{ color: '#777', fontSize: '10px', whiteSpace: 'nowrap' }}>{label}:</Typography>
    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#444', fontSize: '10px' }}>{value}</Typography>
  </Box>
);

const LedgerSubRow = ({ id, date, title, amount, initials, isAdjustment, showExtendedTools, onVoidClick, voidData, onEditClick, editData, adjustmentType, onRefreshClick, refreshData }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    p: '2px 12px', 
    '&:hover': { bgcolor: '#f0f4ff' } 
  }}>
    <Typography variant="caption" sx={{ color: '#555', width: 80, fontSize: '11px' }}>{date}</Typography>
    <CalendarMonth sx={{ fontSize: 16, color: '#90a4ae', mr: 1 }} />
    <Typography variant="caption" sx={{ 
      flexGrow: 1, 
      color: isAdjustment ? '#7e57c2' : '#444', 
      fontSize: '11px',
      fontWeight: isAdjustment ? 500 : 400,
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      {title.includes('(uncollected)') ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#444', fontSize: '11px', fontWeight: 500 }}>
            {title.replace('(uncollected)', '').trim()} #{id || '14040'}: 
            <Box component="span" sx={{ color: '#999', fontWeight: 'bold', ml: 0.5 }}>
              {adjustmentType || 'Un-Collected'} {amount}
            </Box>
          </Typography>
        </Box>
      ) : (
        <Typography variant="caption" sx={{ color: '#444', fontSize: '11px', fontWeight: 500 }}>
          Invoice #{id || '24636'} ({date}): [ {title} ]{amount}
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
      {showExtendedTools ? (
        <>
           {/* <Settings sx={{ fontSize: 18, color: '#90a4ae', cursor: 'pointer' }} />
           <Print sx={{ fontSize: 18, color: '#5c6bc0', cursor: 'pointer' }} />
           <AutoFixHigh sx={{ fontSize: 18, color: '#444', cursor: 'pointer' }} />
           <Tune sx={{ fontSize: 18, color: '#7e57c2', cursor: 'pointer' }} /> */}
        </>
      ) : (
        <>
          <Edit 
            sx={{ fontSize: 18, color: '#7cb342', cursor: 'pointer' }} 
            onClick={() => onEditClick && onEditClick(editData)}
          />
          <Refresh 
            sx={{ fontSize: 18, color: '#4fc3f7', cursor: 'pointer' }} 
            onClick={() => onRefreshClick && onRefreshClick(refreshData)}
          />
          <NotInterested 
            sx={{ fontSize: 18, color: '#d32f2f', cursor: 'pointer' }} 
            onClick={() => onVoidClick && onVoidClick(voidData)}
          />
        </>
      )}
    </Stack>
  </Box>
);

const LedgerList = ({ expanded, items = [] }) => {
  const [ledgerItems, setLedgerItems] = React.useState(
    items.length > 0 ? items : [
      { 
        id: '24532', date: '04/10/2026', method: 'Master Card', amount: ' $184.00', color: '#5c6bc0',
        initials: 'MAG', success: false,
        summary: { insWo: '$0.00', ptBal: '$0.00', insBal: '$0.00', invBal: '$0.00' },
        details: [
          { id: '14040', title: 'Periodic Oral Eval (uncollected)', amount: '$50.00' },
          { id: '24636', title: 'Broken appt', amount: '$134.00' }
        ]
      },
      { 
        id: '24531', date: '04/10/2026', method: 'Sunbit', amount: '$92.00', color: '#5c6bc0',
        initials: 'MAG', success: true,
        summary: { insWo: '$0.00', ptBal: '$0.00', insBal: '$0.00', invBal: '$0.00' },
        details: [
          { id: '24637', title: 'Amalgam - 1 Surface', amount: '$92.00' }
        ]
      },
      { 
        id: '24530', date: '04/10/2026', method: 'Sunbit', amount: '$292.00', color: '#5c6bc0', initials: 'MAG',
        success: true,
        summary: { insWo: '$0.00', ptBal: '$0.00', insBal: '$0.00', invBal: '$0.00' },
        details: [{ id: '24638', title: 'Composite - 2 Surfaces', amount: '$292.00' }]
      },
      { 
        id: '23003', date: '01/27/2026', method: 'Master Card', amount: '- $1.00', color: '#90a4ae', initials: 'MAG',
        success: false,
        summary: { insWo: '$0.00', ptBal: '$0.00', insBal: '$0.00', invBal: '$0.00' },
        details: [{ id: '24639', title: 'Account Adjustment', amount: '- $1.00' }]
      },
      { 
        id: '8494', date: '09/20/2023', method: 'American Express', amount: '$1.00', color: '#5c6bc0', success: true, initials: 'MAG',
        summary: { insWo: '$0.00', ptBal: '$0.00', insBal: '$0.00', invBal: '$0.00' },
        details: [{ id: '24640', title: 'Test Transaction', amount: '$1.00' }]
      },
    ]
  );
  const [expandedItems, setExpandedItems] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [printAnchorEl, setPrintAnchorEl] = React.useState(null);
  const [adjAnchorEl, setAdjAnchorEl] = React.useState(null);
  const [showAdjustDialog, setShowAdjustDialog] = React.useState(false);
  const [showDebitDialog, setShowDebitDialog] = React.useState(false);
  const [showMembershipDialog, setShowMembershipDialog] = React.useState(false);
  const [showWriteOffDialog, setShowWriteOffDialog] = React.useState(false);
  const [showVoidDialog, setShowVoidDialog] = React.useState(false);
  const [voidTarget, setVoidTarget] = React.useState(null);
  const [voidedItems, setVoidedItems] = React.useState({});
  const [showCourtesyCredit, setShowCourtesyCredit] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState(null);
  const [adjustmentTypes, setAdjustmentTypes] = React.useState({});
  const [refreshedItems, setRefreshedItems] = React.useState({});
  const [showUndoDialog, setShowUndoDialog] = React.useState(false);
  const [undoTarget, setUndoTarget] = React.useState(null);
  const [showSimpleStatement, setShowSimpleStatement] = React.useState(false);
  const [showDetailedStatement, setShowDetailedStatement] = React.useState(false);
  const [showEditDeposit, setShowEditDeposit] = React.useState(false);
  const [editDepositTarget, setEditDepositTarget] = React.useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = React.useState(false);
  const [invoiceModalData, setInvoiceModalData] = React.useState(null);


  // Sync individual states with global expanded prop
  React.useEffect(() => {
    if (expanded !== undefined) {
      const allExpanded = {};
      ledgerItems.forEach((_, idx) => {
        allExpanded[idx] = expanded;
      });
      setExpandedItems(allExpanded);
    }
  }, [expanded]);

  const handleItemClick = (idx, event) => {
    console.log('Click on invoice:', idx);
    setExpandedItems(prev => {
      const newState = {
        ...prev,
        [idx]: !prev[idx]
      };
      console.log('New expanded state:', newState);
      return newState;
    });
  };
  
  const handleCalendarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePrintClick = (event) => {
    setPrintAnchorEl(event.currentTarget);
  };

  const handleAdjClick = (event) => {
    setAdjAnchorEl(event.currentTarget);
  };

  const handleAdjustmentSelect = (option) => {
    if (option === 'Credit (subtraction)') {
      setShowAdjustDialog(true);
    } else if (option === 'Debit (addition)') {
      setShowDebitDialog(true);
    } else if (option === 'Membership Adjustment') {
      setShowMembershipDialog(true);
    } else if (option === 'Insurance Write-Off') {
      setShowWriteOffDialog(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePrintClose = () => {
    setPrintAnchorEl(null);
  };

  const handleAdjClose = () => {
    setAdjAnchorEl(null);
  };

  const handlePrintSelect = (option) => {
    if (option === 'Simple Statements') {
      setShowSimpleStatement(true);
    } else if (option === 'Detailed Statement') {
      setShowDetailedStatement(true);
    }
  };

  const handleBackdateDone = (date) => {
    console.log('Backdated to:', date);
    // Add logic here to update the transaction date if needed
  };

  const handleVoidClick = (item) => {
    setVoidTarget(item);
    setShowVoidDialog(true);
  };

  const handleVoidConfirm = () => {
    if (voidTarget) {
      // Mark the item as voided using invoice ID and detail ID
      const voidKey = `${voidTarget.invoiceId}-${voidTarget.id}`;
      setVoidedItems(prev => ({
        ...prev,
        [voidKey]: true
      }));
      console.log('Voiding adjustment:', voidTarget);
    }
    setShowVoidDialog(false);
    setVoidTarget(null);
  };

  const handleVoidCancel = () => {
    setShowVoidDialog(false);
    setVoidTarget(null);
  };

  const handleEditClick = (item) => {
    setEditTarget(item);
    setShowCourtesyCredit(true);
  };

  const handleCourtesyCreditSave = (data) => {
    console.log('Saving courtesy credit:', data);
    // Save the adjustment type
    const key = `${data.invoiceId}-${data.id}`;
    setAdjustmentTypes(prev => ({
      ...prev,
      [key]: data.adjustmentType
    }));
    setShowCourtesyCredit(false);
    setEditTarget(null);
  };

  const handleCourtesyCreditCancel = () => {
    setShowCourtesyCredit(false);
    setEditTarget(null);
  };

  const handleRefreshClick = (data) => {
    setUndoTarget(data);
    setShowUndoDialog(true);
  };

  const handleUndoConfirm = () => {
    if (undoTarget) {
      const key = `${undoTarget.invoiceId}-${undoTarget.id}`;
      setRefreshedItems(prev => ({
        ...prev,
        [key]: true
      }));
    }
    setShowUndoDialog(false);
    setUndoTarget(null);
  };

  const handleUndoCancel = () => {
    setShowUndoDialog(false);
    setUndoTarget(null);
  };

  const handleCollapsedEditClick = (item) => {
    setEditDepositTarget(item);
    setShowEditDeposit(true);
  };

  const handleEditDepositSave = (data) => {
    if (editDepositTarget) {
      // Update the ledger item with the new payment type and provider
      setLedgerItems(prevItems => 
        prevItems.map(item => 
          item.id === editDepositTarget.id 
            ? { ...item, method: data.paymentType, provider: data.provider }
            : item
        )
      );
    }
    setShowEditDeposit(false);
    setEditDepositTarget(null);
  };

  const handleEditDepositCancel = () => {
    setShowEditDeposit(false);
    setEditDepositTarget(null);
  };

  const handleAddProcedureClick = (item) => {
    console.log('Add procedure for:', item);
    setInvoiceModalData(item);
    setShowInvoiceModal(true);
  };

  const handleInvoiceModalSave = (data) => {
    console.log('Saving invoice modal:', data);
    setShowInvoiceModal(false);
    setInvoiceModalData(null);
  };

  const handleInvoiceModalCancel = () => {
    setShowInvoiceModal(false);
    setInvoiceModalData(null);
  };

  return (
    <Box sx={{ p: 1, bgcolor: '#f4f7f9' }}>
      {ledgerItems.map((item, idx) => {
        const isExpanded = expandedItems[idx] || false;
        const isRefreshed = item.details?.some(detail => refreshedItems[`${item.id}-${detail.id}`]);
        
        return (
        <Box key={idx} sx={{ mb: 1.5 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: '4px 12px', 
              border: '1px solid #a5b4fc', 
              borderRadius: isExpanded && item.details ? '4px 4px 0 0' : '4px',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              bgcolor: '#fff',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            onClick={(e) => handleItemClick(idx, e)}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
              {isExpanded ? (
                isRefreshed ? (
                  <Box sx={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: '50%', 
                    bgcolor: '#d32f2f',
                    mr: 2.5 
                  }} />
                ) : (
                  <CheckCircle sx={{ color: '#4caf50', fontSize: 20, width: 40 }} />
                )
              ) : (
                <Checkbox size="small" sx={{ p: 0, width: 40 }} />
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                {isExpanded ? (
                  <Typography variant="caption" sx={{ color: item.color, fontWeight: 500, fontSize: '11px' }}>
                    Invoice #{item.id} ({item.date}): [ Patient Deposit ]{item.amount}
                  </Typography>
                ) : (
                  <>
                    <Typography variant="caption" sx={{ color: item.color, fontWeight: 500, fontSize: '11px' }}>
                      Patient Deposit#{item.id} ({item.date} <CalendarMonth sx={{ fontSize: 13, verticalAlign: 'middle', mb: 0.5 }} />) with {item.method}
                    </Typography>

                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: item.color, fontSize: '11px' }}>
                      {item.amount}
                    </Typography>

                    {item.success && !item.details?.some(d => d.title.includes('(uncollected)')) && (
                      <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        SuccessfulTransaction
                      </Typography>
                    )}
                  </>
                )}
              </Box>
              
              {!isExpanded && (
                <Typography variant="caption" sx={{ width: 40, color: '#cfd8dc', fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                  {item.initials}
                </Typography>
              )}
            </Stack>

            {!isExpanded && (
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: 120, justifyContent: 'flex-end' }}>
                {/* {!item.success && (
                  <NotInterested sx={{ fontSize: 18, color: '#d32f2f', cursor: 'pointer' }} />
                )}
                <Print sx={{ fontSize: 18, color: '#90a4ae', cursor: 'pointer' }} /> */}
                <Edit 
                  sx={{ fontSize: 18, color: '#7cb342', cursor: 'pointer' }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCollapsedEditClick(item);
                  }} 
                />
              </Stack>
            )}
          </Paper>

          {/* Expanded Details Section */}
          {isExpanded && item.details && (
            <Box sx={{ 
              border: '1px solid #a5b4fc', 
              borderTop: 'none', 
              borderRadius: '0 0 4px 4px',
              bgcolor: '#f8faff',
              p: '4px 0'
            }}>
              <Divider sx={{ borderColor: '#eef2ff', mb: 0.5 }} />
              
              {/* Financial Summary Row from the "modern" view */}
              <Box sx={{ px: '12px', mb: 0.5 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 40px 120px', alignItems: 'center', mb: 0.5 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, ml: '40px' }}>
                    <SummaryLabel label="Ins WO" value={item.summary?.insWo || '$0.00'} />
                    <SummaryLabel label="Pt Balance" value={item.summary?.ptBal || '$0.00'} />
                    <SummaryLabel label="Ins Balance" value={item.summary?.insBal || '$0.00'} />
                    <SummaryLabel label="Invoice Balance" value={item.summary?.invBal || '$0.00'} />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#cfd8dc', fontWeight: 'bold', fontSize: '10px', textAlign: 'center' }}>
                    {item.initials}
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="flex-end">
                    <CalendarMonth 
                      sx={{ fontSize: 18, color: '#90a4ae', cursor: 'pointer' }} 
                      onClick={handleCalendarClick}
                    />
                    <Tune 
                      sx={{ fontSize: 18, color: '#7e57c2', cursor: 'pointer' }} 
                      onClick={handleAdjClick}
                    />
                    <Print 
                      sx={{ fontSize: 18, color: '#5c6bc0', cursor: 'pointer' }} 
                      onClick={handlePrintClick}
                    />
                    {/* <IconCashMinus size={18} /> */}
                  </Stack>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 40px 120px', alignItems: 'center' }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, ml: '40px' }}>
                    <SummaryLabel label="Applied WO" value={item.summary?.appliedWo || '$0.00'} />
                    <SummaryLabel label="Pt Paid" value={item.summary?.ptPaid || '$0.00'} />
                    <SummaryLabel label="Ins Paid" value={item.summary?.insPaid || '$0.00'} />
                    <Box />
                  </Box>
                  <Box />
                  <Box />
                </Box>
              </Box>

              <Divider sx={{ borderColor: '#eef2ff', mb: 0.5 }} />

              {item.details.map((detail, dIdx) => {
                const voidKey = `${item.id}-${detail.id}`;
                const isVoided = voidedItems[voidKey];
                const adjustmentKey = `${item.id}-${detail.id}`;
                const currentAdjustmentType = adjustmentTypes[adjustmentKey];
                
                // Skip rendering if the item is voided
                if (isVoided) return null;
                
                return (
                <LedgerSubRow 
                  key={dIdx}
                  date={item.date}
                  title={detail.title}
                  amount={detail.amount}
                  id={detail.id}
                  initials={item.initials}
                  showExtendedTools={!detail.title.includes('(uncollected)')}
                  onVoidClick={handleVoidClick}
                  onEditClick={handleEditClick}
                  onRefreshClick={handleRefreshClick}
                  adjustmentType={currentAdjustmentType}
                  voidData={{
                    id: detail.id,
                    title: detail.title,
                    amount: detail.amount,
                    date: item.date,
                    invoiceId: item.id
                  }}
                  editData={{
                    id: detail.id,
                    title: detail.title,
                    amount: detail.amount,
                    date: item.date,
                    invoiceId: item.id
                  }}
                  refreshData={{
                    idx: idx,
                    id: detail.id,
                    invoiceId: item.id
                  }}
                />
                );
              })}
              
              {/* Show "Add Procedure" button below all procedures if any item is voided */}
              {item.details?.some(detail => voidedItems[`${item.id}-${detail.id}`]) && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: '2px 12px',
                }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAddProcedureClick({ invoiceId: item.id, date: item.date })}
                    sx={{
                      padding: '4px 16px',
                      borderRadius: '4px',
                      backgroundColor: '#7788bb',
                      fontSize: '11px',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#6677aa',
                      },
                    }}
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
      <BackdateTransactionPopup 
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        onDone={handleBackdateDone}
      />
      <PrintOptionsDropdown 
        anchorEl={printAnchorEl}
        open={Boolean(printAnchorEl)}
        onClose={handlePrintClose}
        onSelect={handlePrintSelect}
      />
      <AdjustmentOptionsDropdown 
        anchorEl={adjAnchorEl}
        open={Boolean(adjAnchorEl)}
        onClose={handleAdjClose}
        onSelect={handleAdjustmentSelect}
      />

      <Dialog 
        open={showAdjustDialog} 
        onClose={() => setShowAdjustDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '4px', overflow: 'hidden' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <CreditSubtractionDialog onClose={() => setShowAdjustDialog(false)} />
        </DialogContent>
      </Dialog>
      <Dialog 
        open={showDebitDialog} 
        onClose={() => setShowDebitDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '4px', overflow: 'hidden' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <DebitAdjustmentDialog onClose={() => setShowDebitDialog(false)} />
        </DialogContent>
      </Dialog>
      <Dialog 
        open={showMembershipDialog} 
        onClose={() => setShowMembershipDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '4px', overflow: 'hidden' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <MembershipAdjustmentDialog onClose={() => setShowMembershipDialog(false)} />
        </DialogContent>
      </Dialog>
      <Dialog 
        open={showWriteOffDialog} 
        onClose={() => setShowWriteOffDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '4px', overflow: 'hidden' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <InsuranceWriteOffDialog onClose={() => setShowWriteOffDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Void Confirmation Dialog */}
      <VoidConfirmationDialog
        open={showVoidDialog}
        onClose={handleVoidCancel}
        onConfirm={handleVoidConfirm}
        voidTarget={voidTarget}
      />

      {/* Courtesy Credit Dialog */}
      <Dialog
        open={showCourtesyCredit}
        onClose={handleCourtesyCreditCancel}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '4px',
            overflow: 'hidden',
            bgcolor: 'transparent',
            boxShadow: 'none'
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <CourtesyCreditComponent
            adjustmentData={editTarget}
            onSave={handleCourtesyCreditSave}
            onCancel={handleCourtesyCreditCancel}
            showAmountSection={false}
          />
        </DialogContent>
      </Dialog>

      {/* Undo Confirmation Dialog */}
      <UndoConfirmationDialog
        open={showUndoDialog}
        onClose={handleUndoCancel}
        onConfirm={handleUndoConfirm}
      />

      {/* Simple Statement Dialog */}
      <Dialog
        open={showSimpleStatement}
        onClose={() => setShowSimpleStatement(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            overflow: 'hidden',
            maxHeight: '90vh',
            margin: 0,
            bgcolor: '#f5f5f5',
            width: '880px',
            maxWidth: '90vw'
          }
        }}
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxWidth: '100%'
          }
        }}
      >
        <DialogContent sx={{ p: 0, m: 0, bgcolor: '#f5f5f5' }}>
          <SimpleStatement onClose={() => setShowSimpleStatement(false)} />
        </DialogContent>
      </Dialog>

      {/* Detailed Statement Dialog */}
      <Dialog
        open={showDetailedStatement}
        onClose={() => setShowDetailedStatement(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            overflow: 'hidden',
            maxHeight: '90vh',
            margin: 0,
            bgcolor: '#f5f5f5',
            width: '880px',
            maxWidth: '90vw'
          }
        }}
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxWidth: '100%'
          }
        }}
      >
        <DialogContent sx={{ p: 0, m: 0, bgcolor: '#f5f5f5' }}>
          <DetailedStatement onClose={() => setShowDetailedStatement(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Deposit Dialog */}
      <Dialog
        open={showEditDeposit}
        onClose={handleEditDepositCancel}
        maxWidth={false}
        PaperProps={{
          sx: {
            minWidth: 220,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            bgcolor: '#fff',
            borderRadius: '4px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <EditDeposit
            depositData={editDepositTarget}
            onSave={handleEditDepositSave}
            onCancel={handleEditDepositCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Invoice Modal Dialog */}
      <Dialog
        open={showInvoiceModal}
        onClose={handleInvoiceModalCancel}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '2px',
            overflow: 'hidden',
            bgcolor: '#fff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: '1px solid #ccc'
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <InvoiceModal
            invoiceData={invoiceModalData}
            onSave={handleInvoiceModalSave}
            onCancel={handleInvoiceModalCancel}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LedgerList;