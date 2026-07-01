import React from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import {
  CheckCircle, KeyboardArrowDown, KeyboardArrowRight, CalendarTodayOutlined
} from '@mui/icons-material';

import ButtonScheduleIcon from '../../assets/finance icons/Button - Schedule → SVG.svg';
import ButtonPaymentIcon from '../../assets/finance icons/Button - Payment → SVG.svg';
import ButtonAdjustIcon from '../../assets/finance icons/Button - Adjust → SVG.svg';
import ButtonPrintIcon from '../../assets/finance icons/Button - Print → SVG.svg';

import LedgerSubRow from './LedgerSubRow';

const LedgerItemCard = ({
  idx,
  displayItem,
  isExpanded,
  adjustmentTypeMap,
  handleItemClick,
  handleCalendarClick,
  handleVoidClick,
  handleEditClick,
  handleRefreshClick,
  setMagicStickAnchorEl,
  setEditInvoiceTarget,
  setShowEditInvoice,
  setAdjAnchorEl,
  setAdjItem,
  setPrintAnchorEl,
  setPrintItem,
  handleAddProcedureClick
}) => {
  const title = displayItem.method === 'Invoice'
    ? `Invoice #${displayItem.invoiceNumber || displayItem.id} (${displayItem.date})`
    : displayItem.method === 'Adjustment'
    ? `Adjustment #${displayItem.invoiceNumber || displayItem.id} (${displayItem.date})`
    : `Patient Deposit #${displayItem.id} (${displayItem.date})`;

  return (
    <Box sx={{ 
      border: '1px solid #DFE5EC', 
      borderRadius: '18px', 
      bgcolor: '#FFFFFF', 
      mb: 2, 
      overflow: 'hidden' 
    }}>
      <Box 
        onClick={() => handleItemClick(idx)}
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          p: '16px 24px',
          cursor: 'pointer',
          bgcolor: '#F8FAFC',
        }}
      >
        {/* Left: Icon & Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 320 }}>
           <CheckCircle sx={{ color: '#42C070', fontSize: '20px' }} />
           {isExpanded ? <KeyboardArrowDown sx={{ color: '#6B778C' }} /> : <KeyboardArrowRight sx={{ color: '#6B778C' }} />}
           <Typography sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '14px', textTransform: 'uppercase' }}>
             {displayItem.method === 'Invoice' ? 'INVOICE' : displayItem.method === 'Adjustment' ? 'ADJUSTMENT' : 'PATIENT DEPOSIT'} #{displayItem.invoiceNumber || displayItem.id} ({displayItem.date}) {displayItem.amount}
           </Typography>
        </Box>

        {/* Middle: Balances Grid */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 6 }}>
          {/* Column 1 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 1, rowGap: 0.5, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Ins WO:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>{displayItem.summary?.insWo || '$0.00'}</Typography>
            
            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Applied WO:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>{displayItem.summary?.appliedWo || '$0.00'}</Typography>
            
            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Invoice Balance:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>$0.00</Typography>
          </Box>
          
          {/* Column 2 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 1, rowGap: 0.5, alignItems: 'flex-start' }}>
            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Pt Balance:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>{displayItem.summary?.ptBal || '$0.00'}</Typography>
            
            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Pt Paid:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>$0.00</Typography>
          </Box>

          {/* Column 3 */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 1, rowGap: 0.5, alignItems: 'flex-start' }}>
            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Ins Balance:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>{displayItem.summary?.insBal || '$0.00'}</Typography>
            
            <Typography variant="caption" sx={{ color: '#6B778C', textAlign: 'right', fontSize: '11px' }}>Ins Paid:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1A1A1A', fontSize: '11px' }}>$0.00</Typography>
          </Box>
        </Box>

        {/* Right: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
           <Stack direction="row" spacing={2} sx={{ ml: 2, alignItems: 'center' }}>
             <Box component="img" src={ButtonScheduleIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleCalendarClick(displayItem, e); }} />
             <Box component="img" src={ButtonPaymentIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} />
             <Box component="img" src={ButtonAdjustIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} />
             <Box component="img" src={ButtonPrintIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} />
           </Stack>
        </Box>
      </Box>

      {/* Expanded Content */}
      {isExpanded && (
        <Box sx={{ bgcolor: '#FFFFFF' }}>
          {!displayItem.details ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#6B778C' }}>Loading details...</Typography>
            </Box>
          ) : displayItem.details.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#6B778C', fontStyle: 'italic', fontSize: '12px' }}>
                No procedures or adjustments are currently attached to this {displayItem.method?.toLowerCase() || 'item'}.
              </Typography>
            </Box>
          ) : (
            displayItem.details.map((detail, dIdx) => (
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
          )))}

          {displayItem.method === 'Invoice' && (
            <Box sx={{ mt: displayItem.details?.length > 0 ? 2 : 0, p: '0 24px 16px 24px' }}>
              <Button
                variant="outlined" size="small"
                onClick={() => handleAddProcedureClick({ invoiceId: displayItem.id, date: displayItem.date })}
                sx={{ textTransform: 'none', borderRadius: '6px', color: '#2362EF', borderColor: '#DFE5EC' }}
              >
                + Add Procedure
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LedgerItemCard;
