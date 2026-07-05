import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import {
  Edit, NotInterested, Settings, MoreHoriz,
  InsertDriveFileOutlined, CalendarTodayOutlined
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
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', p: '12px 24px', borderTop: '1px solid #DFE5EC', bgcolor: '#FFFFFF', '&:hover': { bgcolor: '#f8f9fa' } }}>
    <Box sx={{ display: 'flex', alignItems: 'center', width: 220 }}>
      <InsertDriveFileOutlined sx={{ fontSize: 16, color: '#6B778C', mr: 0.5 }} />
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
        <Typography variant="caption" sx={{ color: '#0288d1', fontSize: '12px', fontWeight: 600 }}>{title}</Typography>
      ) : (
        <Typography variant="caption" sx={{ color: '#1A1A1A', fontSize: '12px', fontWeight: 600 }}>
          {isAdjustment ? 'Adjustment' : 'Invoice'} #{id || '24636'}: [ {title} ]{' '}
          <Box component="span" sx={{ color: '#1A1A1A', fontWeight: 'bold' }}>
            {amount}
          </Box>
        </Typography>
      )}
    </Typography>
    
    <Typography variant="caption" sx={{ width: 80, fontWeight: 600, color: '#1A1A1A', fontSize: '12px', textAlign: 'right', mr: 2 }}>
      {title.includes('(uncollected)') ? '$0.00' : amount}
    </Typography>
    <Typography variant="caption" sx={{ width: 40, color: '#6B778C', fontSize: '12px', textAlign: 'center', mr: 2 }}>
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
        null
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
          <Box component="img" src={ButtonUndoIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} onClick={() => onRefreshClick?.(refreshData)} />
          <Box component="img" src={ButtonVoidIcon} sx={{ width: 18, height: 18, cursor: 'pointer' }} onClick={() => onVoidClick?.(voidData)} />
        </>
      )}
    </Stack>
  </Box>
);

export default LedgerSubRow;
