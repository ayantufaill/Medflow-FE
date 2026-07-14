import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import alertIcon from '../../assets/claimicons/alerticon.svg';
import sentClaimIcon from '../../assets/claimicons/sentclaim.svg';
import printClaimIcon from '../../assets/claimicons/printclaim.svg';

/**
 * Alert banner + claim count + action buttons row.
 *
 * Props:
 *  - alertCount: number of validation errors
 *  - claimCount: total filtered claims count
 *  - selectedCount: number of selected claims (for "Send Claims (3)" badge)
 *  - hasSelection: boolean
 *  - actions: Array of {
 *      label: string,
 *      onClick: fn,
 *      variant: 'send' | 'print' | 'outlined' | 'gold' | 'default',
 *      disabled?: boolean,
 *      icon?: 'send' | 'print',
 *    }
 */
const ClaimAlertBar = ({
  alertCount = 0,
  claimCount = 0,
  selectedCount = 0,
  hasSelection = false,
  actions = [],
}) => {
  const getButtonStyles = (action) => {
    const base = {
      textTransform: 'none',
      fontSize: '0.82rem',
      fontWeight: 600,
      boxShadow: 'none',
      borderRadius: '6px',
      px: 2.5,
      py: 0.8,
      height: 36,
    };

    switch (action.variant) {
      case 'send':
        return {
          ...base,
          backgroundColor: '#00BBAB',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#00a89a' },
          '&.Mui-disabled': { backgroundColor: 'rgba(0, 187, 171, 0.4)', color: '#ffffff' },
        };
      case 'print':
        return {
          ...base,
          backgroundColor: '#2362EF',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#1b52d4' },
          '&.Mui-disabled': { backgroundColor: 'rgba(35, 98, 239, 0.4)', color: '#ffffff' },
        };
      case 'outlined':
        return {
          ...base,
          backgroundColor: '#ffffff',
          color: '#333333',
          border: '1px solid #d1d5db',
          '&:hover': { backgroundColor: '#f9fafb', borderColor: '#9ca3af' },
          '&.Mui-disabled': { backgroundColor: '#f3f4f6', color: '#9ca3af', borderColor: '#e5e7eb' },
        };
      case 'gold':
        return {
          ...base,
          backgroundColor: '#e5c59e',
          color: '#3d3021',
          '&:hover': { backgroundColor: '#d1b089' },
          '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
        };
      default:
        return {
          ...base,
          backgroundColor: '#7d9cc4',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#6281a8' },
          '&.Mui-disabled': { backgroundColor: 'rgba(125, 156, 196, 0.4)', color: '#ffffff' },
        };
    }
  };

  const renderIcon = (action) => {
    if (action.icon === 'send') {
      return <Box component="img" src={sentClaimIcon} alt="send" sx={{ width: 16, height: 16, mr: 0.5 }} />;
    }
    if (action.icon === 'print') {
      return <Box component="img" src={printClaimIcon} alt="print" sx={{ width: 16, height: 16, mr: 0.5 }} />;
    }
    return null;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2,
        mb: 2,
      }}
    >
      {/* Left: Alert + Count */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {alertCount > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <Box component="img" src={alertIcon} alt="alert" sx={{ width: 16, height: 16 }} />
            <Typography sx={{ color: '#d93838', fontSize: '0.85rem', fontWeight: 600 }}>
              {alertCount} claims have alerts. Please fix the validation errors before sending claims.
            </Typography>
          </Box>
        )}
        <Typography sx={{ color: '#1a3a6b', fontSize: '0.85rem', fontWeight: 700 }}>
          ( {claimCount} claim/s )
        </Typography>
      </Box>

      {/* Right: Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap', alignItems: 'center' }}>
        {actions.map((action, i) => (
          <Button
            key={i}
            variant="contained"
            disabled={action.disabled !== undefined ? action.disabled : !hasSelection}
            onClick={action.onClick}
            sx={getButtonStyles(action)}
          >
            {renderIcon(action)}
            {action.label}
            {action.variant === 'send' && selectedCount > 0 && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ml: 0.8,
                  minWidth: 20,
                  height: 20,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                {selectedCount}
              </Box>
            )}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default ClaimAlertBar;
