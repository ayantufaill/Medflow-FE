import React from 'react';
import { Box, Paper, Stack, Checkbox, Typography, Divider } from '@mui/material';
import { 
  CalendarMonth, Print, Edit, NotInterested, Settings, AutoFixHigh, Reply, 
  CheckCircle, Refresh, Tune
} from '@mui/icons-material';
import BackdateTransactionPopup from './BackdateTransactionPopup';
import PrintOptionsDropdown from './PrintOptionsDropdown';
import AdjustmentOptionsDropdown from './AdjustmentOptionsDropdown';

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
  <Stack direction="row" spacing={0.5}>
    <Typography variant="caption" sx={{ color: '#777', fontSize: '10px' }}>{label}:</Typography>
    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#444', fontSize: '10px' }}>{value}</Typography>
  </Stack>
);

const LedgerSubRow = ({ id, date, title, amount, initials, isAdjustment, showExtendedTools }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    p: '2px 12px', 
    '&:hover': { bgcolor: '#f0f4ff' } 
  }}>
    <Box sx={{ width: 40 }} />
    <Typography variant="caption" sx={{ color: '#555', width: 80, fontSize: '11px' }}>{date}</Typography>
    <CalendarMonth sx={{ fontSize: 16, color: '#90a4ae' }} />
    <Box sx={{ width: 12 }} />
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
            <Box component="span" sx={{ color: '#d32f2f', fontWeight: 'bold', ml: 0.5 }}>
              Un-Collected {amount}
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
           <Settings sx={{ fontSize: 18, color: '#90a4ae', cursor: 'pointer' }} />
           <Print sx={{ fontSize: 18, color: '#5c6bc0', cursor: 'pointer' }} />
           <AutoFixHigh sx={{ fontSize: 18, color: '#444', cursor: 'pointer' }} />
           <Tune sx={{ fontSize: 18, color: '#7e57c2', cursor: 'pointer' }} />
        </>
      ) : (
        <>
          <Edit sx={{ fontSize: 18, color: '#7cb342', cursor: 'pointer' }} />
          <Refresh sx={{ fontSize: 18, color: '#4fc3f7', cursor: 'pointer' }} />
          <NotInterested sx={{ fontSize: 18, color: '#d32f2f', cursor: 'pointer' }} />
        </>
      )}
    </Stack>
  </Box>
);

const LedgerList = ({ expanded, items = [] }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [printAnchorEl, setPrintAnchorEl] = React.useState(null);
  const [adjAnchorEl, setAdjAnchorEl] = React.useState(null);
  
  const handleCalendarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePrintClick = (event) => {
    setPrintAnchorEl(event.currentTarget);
  };

  const handleAdjClick = (event) => {
    setAdjAnchorEl(event.currentTarget);
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

  const handleBackdateDone = (date) => {
    console.log('Backdated to:', date);
    // Add logic here to update the transaction date if needed
  };

  const ledgerItems = items.length > 0 ? items : [
    { 
      id: '24532', date: '04/10/2026', method: 'Master Card', amount: ' $184.00', color: '#5c6bc0',
      initials: 'MAG', success: false,
      summary: { insWo: '$0.00', ptBal: '$0.00', insBal: '$0.00', invBal: '$0.00' },
      details: [
        { id: '14040', title: 'Periodic Oral Eval (uncollected)', amount: '$50.00' },
        { id: '24636', title: 'Prophylaxis - Adult', amount: '$134.00' }
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
  ];

  return (
    <Box sx={{ p: 1, bgcolor: '#f4f7f9' }}>
      {ledgerItems.map((item, idx) => (
        <Box key={idx} sx={{ mb: 1.5 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: '4px 12px', 
              border: '1px solid #a5b4fc', 
              borderRadius: expanded && item.details ? '4px 4px 0 0' : '4px',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              bgcolor: '#fff'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
              {expanded ? (
                <CheckCircle sx={{ color: '#4caf50', fontSize: 20, width: 40 }} />
              ) : (
                <Checkbox size="small" sx={{ p: 0, width: 40 }} />
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                {expanded ? (
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
              
              {!expanded && (
                <Typography variant="caption" sx={{ width: 40, color: '#cfd8dc', fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                  {item.initials}
                </Typography>
              )}
            </Stack>

            {!expanded && (
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: 120, justifyContent: 'flex-end' }}>
                {!item.success && (
                  <NotInterested sx={{ fontSize: 18, color: '#d32f2f', cursor: 'pointer' }} />
                )}
                <Print sx={{ fontSize: 18, color: '#90a4ae', cursor: 'pointer' }} />
                <Edit sx={{ fontSize: 18, color: '#7cb342', cursor: 'pointer' }} />
              </Stack>
            )}
          </Paper>

          {/* Expanded Details Section */}
          {expanded && item.details && (
            <Box sx={{ 
              border: '1px solid #a5b4fc', 
              borderTop: 'none', 
              borderRadius: '0 0 4px 4px',
              bgcolor: '#f8faff',
              p: '4px 0'
            }}>
              <Divider sx={{ borderColor: '#eef2ff', mb: 0.5 }} />
              
              {/* Financial Summary Row from the "modern" view */}
              <Box sx={{ display: 'flex', alignItems: 'center', px: '12px', mb: 0.5 }}>
                <Box sx={{ display: 'flex', gap: 6, justifyContent: 'center', flexGrow: 1, ml: '40px' }}>
                  <SummaryLabel label="Ins WO" value={item.summary?.insWo || '$0.00'} />
                  <SummaryLabel label="Pt Balance" value={item.summary?.ptBal || '$0.00'} />
                  <SummaryLabel label="Ins Balance" value={item.summary?.insBal || '$0.00'} />
                  <SummaryLabel label="Invoice Balance" value={item.summary?.invBal || '$0.00'} />
                </Box>
                <Typography variant="caption" sx={{ width: 40, color: '#cfd8dc', fontWeight: 'bold', fontSize: '10px', textAlign: 'center' }}>
                  {item.initials}
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: 120, justifyContent: 'flex-end' }}>
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
                  <IconCashMinus size={18} />
                </Stack>
              </Box>

              <Divider sx={{ borderColor: '#eef2ff', mb: 0.5 }} />

              {item.details.map((detail, dIdx) => (
                <LedgerSubRow 
                  key={dIdx}
                  date={item.date}
                  title={detail.title}
                  amount={detail.amount}
                  id={detail.id}
                  initials={item.initials}
                  showExtendedTools={!detail.title.includes('(uncollected)')}
                />
              ))}
            </Box>
          )}
        </Box>
      ))}
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
      />
      <AdjustmentOptionsDropdown 
        anchorEl={adjAnchorEl}
        open={Boolean(adjAnchorEl)}
        onClose={handleAdjClose}
      />
    </Box>
  );
};

export default LedgerList;