import React, { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import {
  Edit, NotInterested, Settings, MoreHoriz,
  InsertDriveFileOutlined, CalendarTodayOutlined,
  AttachFileOutlined, KeyboardArrowDown, KeyboardArrowRight,
  CompareArrowsOutlined, ShieldOutlined, PrintOutlined,
  LocalHospital, ArrowUpward
} from '@mui/icons-material';

import SVGIcon from '../../assets/finance icons/SVG.svg';
import ButtonUndoIcon from '../../assets/finance icons/Button - Undo → SVG.svg';
import ButtonVoidIcon from '../../assets/finance icons/Button - Void → SVG.svg';
import ButtonAdjustIcon from '../../assets/finance icons/Button - Adjust → SVG.svg';
import ButtonPrintIcon from '../../assets/finance icons/Button - Print → SVG.svg';
import ButtonSettingsIcon from '../../assets/finance icons/Button - Settings → SVG.svg';
import ButtonMagicIcon from '../../assets/finance icons/Button - Magic actions → SVG.svg';

const LedgerSubRow = ({
  id, date, title, amount, initials, isAdjustment, isPayment, isClaim,
  showExtendedTools, onVoidClick, voidData, onEditClick, editData,
  adjustmentType, onRefreshClick, refreshData, onMagicStickClick,
  onSettingsClick, onAdjustmentSelect, onPrintClick,
  onAttachClick, attachData, procedures,
  claimStatus, statusResponse, isApproved
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasProcedures = procedures && procedures.length > 0;

  const patientTotal = hasProcedures ? procedures.reduce((sum, proc) => sum + Number(proc.ptPortion || 0), 0) : 0;
  const insTotal = hasProcedures ? procedures.reduce((sum, proc) => sum + Number(proc.insPortion || 0), 0) : 0;
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box 
        onClick={() => { if (hasProcedures) setExpanded(!expanded); }}
        sx={{ 
          display: 'flex', alignItems: 'center', p: '12px 24px', borderTop: '1px solid #DFE5EC', 
          bgcolor: '#FFFFFF', cursor: hasProcedures ? 'pointer' : 'default', 
          '&:hover': { bgcolor: '#f8f9fa' } 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: 220 }}>
          {hasProcedures && (
            expanded ? 
              <KeyboardArrowDown sx={{ fontSize: 18, color: '#6B778C', mr: 0.5 }} /> : 
              <KeyboardArrowRight sx={{ fontSize: 18, color: '#6B778C', mr: 0.5 }} />
          )}
          {!hasProcedures && <InsertDriveFileOutlined sx={{ fontSize: 16, color: '#6B778C', mr: 0.5 }} />}
      <Typography variant="caption" sx={{ color: '#6B778C', fontSize: '12px', mr: 2 }}>{date}</Typography>
      <CalendarTodayOutlined sx={{ fontSize: 16, color: '#6B778C', mr: 1 }} />
    </Box>
    <Typography variant="caption" sx={{
      flexGrow: 1, color: '#1A1A1A', fontSize: '12px',
      fontWeight: isAdjustment ? 400 : 600, display: 'flex', alignItems: 'center', gap: 1,
    }}>
      {title.includes('(uncollected)') ? (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#1A1A1A', fontSize: '12px' }}>
            {title.replace('(uncollected)', '').trim()} #{id || '14040'}:{' '}
            {adjustmentType || 'Un-Collected'}{' '}
            <Box component="span" sx={{ color: '#2362EF', fontWeight: 'bold' }}>
              {amount}
            </Box>
          </Typography>
        </Box>
      ) : isPayment ? (
        <Typography variant="caption" sx={{ color: '#1A1A1A', fontSize: '12px', fontWeight: 600 }}>{title}</Typography>
      ) : isClaim ? (
        <Typography variant="caption" sx={{ color: '#1A1A1A', fontSize: '12px', fontWeight: 600 }}>{title}</Typography>
      ) : (
        <Typography variant="caption" sx={{ color: '#1A1A1A', fontSize: '12px', fontWeight: 600 }}>
          {isAdjustment ? 'Adjustment' : 'Invoice'} #{id || '24636'}: [ {title} ]{' '}
          <Box component="span" sx={{ color: '#1A1A1A', fontWeight: 'bold' }}>
            {amount}
          </Box>
        </Typography>
      )}
    </Typography>
    {hasProcedures && expanded && !isClaim ? (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ width: 100, fontWeight: 600, color: '#e57373', fontSize: '11px', textAlign: 'right', mr: 2 }}>
          Patient: ${patientTotal.toFixed(2)}
        </Typography>
        <Typography variant="caption" sx={{ width: 110, fontWeight: 600, color: '#e57373', fontSize: '11px', textAlign: 'right', mr: 2 }}>
          Insurance: ${insTotal.toFixed(2)}
        </Typography>
        <Box sx={{ width: 140, textAlign: 'right', mr: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#e57373', fontSize: '10px' }}>
            Previous Total Balance:
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#e57373', fontSize: '11px' }}>
            {amount}
          </Typography>
        </Box>
      </Box>
    ) : isClaim && !isApproved ? (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#f59e0b', fontSize: '11px', whiteSpace: 'nowrap' }}>
          {claimStatus || 'Claim in process'}
        </Typography>
        {statusResponse && (
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#f59e0b', fontSize: '11px', whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {statusResponse}
          </Typography>
        )}
      </Box>
    ) : (
      <Typography variant="caption" sx={{ width: 80, fontWeight: 600, color: '#1A1A1A', fontSize: '12px', textAlign: 'right', mr: 2 }}>
        {title.includes('(uncollected)') ? '$0.00' : amount}
      </Typography>
    )}

    <Typography variant="caption" sx={{ width: 40, color: '#6B778C', fontSize: '12px', textAlign: 'center', mr: 2, display: (hasProcedures && expanded) ? 'none' : 'block' }}>
      {initials || 'MAG'}
    </Typography>
    
    <Stack direction="row" spacing={2} alignItems="center" sx={{ justifyContent: 'flex-end', minWidth: 120 }}>
      {isPayment ? (
        <>
          <Box component="img" src={ButtonVoidIcon} sx={{ width: 18, height: 18, cursor: 'pointer', transform: 'scaleX(-1)' }} />
          <Box component="img" src={ButtonPrintIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} />
          <Box component="img" src={ButtonVoidIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} onClick={() => onVoidClick?.(voidData)} />
          <Edit sx={{ fontSize: 18, color: '#7cb342', cursor: 'pointer' }} onClick={() => onEditClick?.(editData)} />
          <MoreHoriz sx={{ fontSize: 18, color: '#90a4ae', cursor: 'pointer' }} />
        </>
      ) : isClaim ? (
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Attachment */}
          <Box sx={{ width: 22, height: 22, bgcolor: '#b3d4ff', border: '1px solid #4a90e2', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => onAttachClick?.(attachData)}>
            <AttachFileOutlined sx={{ fontSize: 16, color: '#1A1A1A' }} />
          </Box>
          {/* Arrows pointing in */}
          <Box sx={{ width: 22, height: 22, bgcolor: '#86efac', border: '1px solid #22c55e', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <CompareArrowsOutlined sx={{ fontSize: 16, color: '#1A1A1A' }} />
          </Box>
          {/* Shield / Send Claim */}
          <Box sx={{ position: 'relative', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ShieldOutlined sx={{ fontSize: 22, color: '#64748b', fill: '#e2e8f0' }} />
            <LocalHospital sx={{ fontSize: 12, color: '#3b82f6', position: 'absolute', top: 5 }} />
            <ArrowUpward sx={{ fontSize: 12, color: '#22c55e', position: 'absolute', right: -6, top: -2 }} />
          </Box>
          {/* EOB */}
          <Box sx={{ px: 0.5, height: 18, bgcolor: '#6366f1', border: '1px solid #4338ca', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Typography sx={{ fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>EOB</Typography>
          </Box>
          {/* Print */}
          <Box sx={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <PrintOutlined sx={{ fontSize: 20, color: '#38bdf8' }} />
          </Box>
          {/* Edit / Pencil */}
          <Box sx={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Edit sx={{ fontSize: 18, color: '#10b981' }} />
          </Box>
        </Stack>
      ) : showExtendedTools ? (
        <>
          <Box component="img" src={ButtonAdjustIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} onClick={(e) => onAdjustmentSelect?.(e)} />
          <Box component="img" src={ButtonPrintIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} onClick={(e) => onPrintClick?.(e)} />
          <Box component="img" src={ButtonSettingsIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} onClick={() => onSettingsClick?.({ id, date, title, amount })} />
          <Box component="img" src={ButtonMagicIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} onClick={(e) => onMagicStickClick?.(e)} />
        </>
      ) : (
        <>
          <Box component="img" src={SVGIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} />
          <Box component="img" src={ButtonUndoIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onRefreshClick?.(refreshData); }} />
          <Box component="img" src={ButtonVoidIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onVoidClick?.(voidData); }} />
        </>
      )}
    </Stack>
  </Box>

  {/* Render Procedures if expanded */}
  {expanded && hasProcedures && (
    <Box sx={{ pl: 4, pr: 3, py: 1, bgcolor: '#fbfbfb', borderTop: '1px solid #eee' }}>
      
      {/* Header for the procedures */}
      <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5, borderBottom: '1px solid #ddd', mb: 1 }}>
        <Typography variant="caption" sx={{ width: 80, color: '#666', fontSize: '10px', fontWeight: 600 }}>Date</Typography>
        <Typography variant="caption" sx={{ width: 60, color: '#666', fontSize: '10px', fontWeight: 600 }}>Code</Typography>
        <Typography variant="caption" sx={{ flexGrow: 1, color: '#666', fontSize: '10px', fontWeight: 600 }}>Description</Typography>
        <Typography variant="caption" sx={{ width: 120, color: '#666', fontSize: '10px', fontWeight: 600 }}>Provider</Typography>
        <Typography variant="caption" sx={{ width: 100, color: '#666', fontSize: '10px', fontWeight: 600, textAlign: 'right', mr: 2 }}>Patient</Typography>
        <Typography variant="caption" sx={{ width: 110, color: '#666', fontSize: '10px', fontWeight: 600, textAlign: 'right', mr: 2 }}>Insurance</Typography>
        <Typography variant="caption" sx={{ width: 140, color: '#666', fontSize: '10px', fontWeight: 600, textAlign: 'right', mr: 2 }}>Fee</Typography>
        <Box sx={{ minWidth: 120 }} />
      </Box>

      {procedures.map((proc, idx) => (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', py: 0.75, borderBottom: idx !== procedures.length - 1 ? '1px dashed #e0e0e0' : 'none' }}>
          <Box sx={{ width: 80, display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#555', fontSize: '11px' }}>
              {date || proc.date}
            </Typography>
          </Box>
          <Box sx={{ width: 60, display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#1A1A1A', fontSize: '11px', fontWeight: 600 }}>
              {proc.code}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ flexGrow: 1, color: '#444', fontSize: '11px' }}>
            {proc.description || proc.treatment} {proc.site && `(Tooth ${proc.site})`}
          </Typography>
          <Typography variant="caption" sx={{ width: 120, color: '#555', fontSize: '11px' }}>
            {proc.provider || initials || 'Staff'}
          </Typography>
          <Typography variant="caption" sx={{ width: 100, color: '#1A1A1A', fontSize: '11px', textAlign: 'right', mr: 2 }}>
            ${Number(proc.ptPortion || 0).toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ width: 110, color: '#1A1A1A', fontSize: '11px', textAlign: 'right', mr: 2 }}>
            ${Number(proc.insPortion || 0).toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ width: 140, color: '#1A1A1A', fontSize: '11px', fontWeight: 600, textAlign: 'right', mr: 2 }}>
            ${Number(proc.total || proc.totalPrice || proc.charge || 0).toFixed(2)}
          </Typography>
          <Box sx={{ minWidth: 120 }} />
        </Box>
      ))}
    </Box>
  )}
</Box>
);
}

export default LedgerSubRow;
