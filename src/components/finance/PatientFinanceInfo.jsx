import React from 'react';
import { Box, Typography, Stack, IconButton, styled } from '@mui/material';

// --- STYLED COMPONENTS FOR PIXEL-PERFECT ICONS ---

const IconContainer = styled(Box)({
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
});

// 1. Bill/Scroll Icon
const IconBill = () => (
  <IconContainer>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M4 4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4H6" stroke="#000" strokeWidth="1.2" fill="#fff" />
      <path d="M4 6H18" stroke="#000" strokeWidth="1.2" />
      <text x="8" y="15" fill="#444" fontSize="10" fontWeight="bold" fontFamily="Arial">$</text>
    </svg>
  </IconContainer>
);

// 2. User Wallet Icon
const IconUserWallet = () => (
  <IconContainer>
    <svg width="28" height="28" viewBox="0 0 24 24">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="#8d6e63" stroke="#000" strokeWidth="1" />
      <rect x="14" y="10" width="6" height="4" fill="#6d4c41" stroke="#000" strokeWidth="1" />
      <circle cx="8" cy="14" r="5" fill="#1de9b6" stroke="#000" strokeWidth="1" />
      <path d="M8 11C6.3 11 5 12.3 5 14H11C11 12.3 9.7 11 8 11Z" fill="#1de9b6" stroke="#000" strokeWidth="1" />
    </svg>
  </IconContainer>
);

// 3. Insurance Shield Icon
const IconInsurance = () => (
  <IconContainer>
    <svg width="28" height="28" viewBox="0 0 24 24">
      <path d="M12 2L4 5V11C4 16.1 7.4 20.8 12 22C16.6 20.8 20 16.1 20 11V5L12 2Z" fill="#cfd8dc" stroke="#000" strokeWidth="1" />
      <path d="M12 7V17M7 12H17" stroke="#1976d2" strokeWidth="2" />
    </svg>
  </IconContainer>
);

// 4. Insurance Wallet Icon
const IconInsuranceWallet = () => (
  <IconContainer>
    <svg width="28" height="28" viewBox="0 0 24 24">
      <rect x="6" y="6" width="14" height="12" rx="2" fill="#8d6e63" stroke="#000" strokeWidth="1" />
      <path d="M8 8L3 10V16C3 19.1 5.4 21.8 8 23C10.6 21.8 13 19.1 13 16V10L8 8Z" fill="#cfd8dc" stroke="#000" strokeWidth="1" />
      <path d="M8 12V20M4 16H12" stroke="#1976d2" strokeWidth="1.5" />
    </svg>
  </IconContainer>
);

// 5. Refresh Coin Icon
const IconRefreshCoin = () => (
  <IconContainer>
    <svg width="28" height="28" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" fill="#ffe082" stroke="#000" strokeWidth="1" />
      <text x="9" y="16" fill="#000" fontSize="10" fontWeight="bold">$</text>
      <path d="M12 2C6.5 2 2 6.5 2 12" stroke="#000" strokeWidth="1" strokeDasharray="2,2" />
      <path d="M22 12C22 17.5 17.5 22 12 22" stroke="#000" strokeWidth="1" strokeDasharray="2,2" />
    </svg>
  </IconContainer>
);

// 6. Piggy Bank Icon
const IconPiggyBank = () => (
  <IconContainer>
    <svg width="28" height="28" viewBox="0 0 24 24">
      <path d="M19 12C19 15.3 16.3 18 13 18C9.7 18 7 15.3 7 12C7 8.7 9.7 6 13 6C16.3 6 19 8.7 19 12Z" fill="#f8bbd0" stroke="#000" strokeWidth="1" />
      <rect x="12" y="3" width="2" height="4" fill="#ffd54f" stroke="#000" strokeWidth="1" />
      <circle cx="16" cy="10" r="1" fill="#000" />
      <path d="M6 14L4 16M20 12L22 13" stroke="#000" strokeWidth="1" />
    </svg>
  </IconContainer>
);

// 7. Printer Icon
const IconPrinter = () => (
  <IconContainer>
    <svg width="28" height="28" viewBox="0 0 24 24">
      <path d="M6 8H18V14H6V8Z" fill="#4dd0e1" stroke="#000" strokeWidth="1" />
      <path d="M8 14H16V20H8V14Z" fill="#fff" stroke="#000" strokeWidth="1" />
      <path d="M8 4H16V8H8V4Z" fill="#eee" stroke="#000" strokeWidth="1" />
      <rect x="17" y="10" width="2" height="2" fill="red" stroke="#000" strokeWidth="0.5" />
    </svg>
  </IconContainer>
);

// 8. Cloud Upload Icon
const IconCloudUpload = () => (
  <IconContainer>
    <svg width="28" height="28" viewBox="0 0 24 24">
      <path d="M17.5 19C15.1 19 13.1 17.4 12.6 15.2C12.1 15.4 11.6 15.5 11 15.5C8.8 15.5 7 13.7 7 11.5C7 9.3 8.8 7.5 11 7.5C11.3 7.5 11.6 7.5 11.9 7.6C12.8 5.5 14.9 4 17.5 4C20.8 4 23.5 6.7 23.5 10C23.5 13.3 20.8 16 17.5 16V19Z" fill="#fff" stroke="#000" strokeWidth="1" transform="scale(0.8)" />
      <path d="M12 18V8M9 11L12 8L15 11" stroke="#0288d1" strokeWidth="2.5" />
    </svg>
  </IconContainer>
);

// 9. Cash Plus Icon
const IconCashPlus = () => (
  <IconContainer>
    <svg width="30" height="30" viewBox="0 0 24 24">
      <rect x="2" y="8" width="16" height="8" fill="#a5d6a7" stroke="#000" strokeWidth="1" />
      <circle cx="10" cy="12" r="3" fill="#2e7d32" opacity="0.3" />
      <circle cx="18" cy="16" r="5" fill="#81d4fa" stroke="#000" strokeWidth="1" />
      <path d="M18 13V19M15 16H21" stroke="#0288d1" strokeWidth="2" />
    </svg>
  </IconContainer>
);

// 10. Cash Minus Icon
const IconCashMinus = () => (
  <IconContainer>
    <svg width="30" height="30" viewBox="0 0 24 24">
      <rect x="2" y="8" width="16" height="8" fill="#a5d6a7" stroke="#000" strokeWidth="1" />
      <circle cx="10" cy="12" r="3" fill="#394b39ff" opacity="0.3" />
      <circle cx="18" cy="16" r="5" fill="#81d4fa" stroke="#000" strokeWidth="1" />
      <path d="M15 16H21" stroke="#0288d1" strokeWidth="2" />
    </svg>
  </IconContainer>
);

// 11. Calendar Icon
const IconCalendar = () => (
  <IconContainer>
    <svg width="28" height="28" viewBox="0 0 24 24">
      <rect x="4" y="6" width="16" height="14" rx="2" fill="#bbdefb" stroke="#0288d1" strokeWidth="1.5" />
      <path d="M4 10H20" stroke="#0288d1" strokeWidth="1.5" />
      <path d="M8 4V8M16 4V8" stroke="#0288d1" strokeWidth="1.5" />
      <text x="13" y="17" fill="#0288d1" fontSize="10" fontWeight="bold">$</text>
      <rect x="7" y="12" width="2" height="2" fill="#fff" opacity="0.5" />
      <rect x="10" y="12" width="2" height="2" fill="#fff" opacity="0.5" />
      <rect x="7" y="15" width="2" height="2" fill="#fff" opacity="0.5" />
      <rect x="10" y="15" width="2" height="2" fill="#fff" opacity="0.5" />
    </svg>
  </IconContainer>
);

const PatientFinanceInfo = ({ view, onCalendarClick }) => {
  const pixelIcons = [
    { Icon: IconBill },
    { Icon: IconUserWallet },
    { Icon: IconInsurance },
    { Icon: IconInsuranceWallet },
    { Icon: IconRefreshCoin },
    { Icon: IconPiggyBank },
    { Icon: IconPrinter },
    { Icon: IconCloudUpload },
    { Icon: IconCashPlus },
    { Icon: IconCashMinus },
    { Icon: IconCalendar, onClick: onCalendarClick }
  ];

  return (
    <Box sx={{ width: '38%', flexShrink: 0, pr: 2 }}>
      <Box sx={{ borderTop: '4px solid #7986cb', width: 'fit-content', minWidth: '80px', textAlign: 'center', p: 1, border: '1px solid #ddd', borderTopWidth: '4px' }}>
        <Typography variant="caption" sx={{ color: '#5c6bc0', fontWeight: 'bold', whiteSpace: 'nowrap' }}>test test</Typography>
      </Box>
      
      <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#5c6bc0', cursor: 'pointer' }}>Billing flags: <span style={{ color: '#1976d2' }}>+add flags</span></Typography>
        <Typography variant="caption" sx={{ color: '#1976d2', cursor: 'pointer' }}>+add account note</Typography>
      </Stack>

      {/* Custom Pixel Icon Toolbar - Hidden in Family View */}
      {view !== 'family' && (
        <Stack direction="row" spacing={0.2} sx={{ mb: 2, flexWrap: 'wrap', '& button': { p: 0.25 } }}>
          {pixelIcons.map((item, i) => (
            <IconButton 
              key={i} 
              size="small" 
              onClick={item.onClick}
              sx={{ '&:hover': { bgcolor: 'transparent' } }}
            >
              <item.Icon />
            </IconButton>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default PatientFinanceInfo;
