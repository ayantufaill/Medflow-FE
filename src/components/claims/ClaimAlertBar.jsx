import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import alertIcon from '../../assets/claimicons/alerticon.svg';
import sentClaimIcon from '../../assets/claimicons/sentclaim.svg';
import printClaimIcon from '../../assets/claimicons/printclaim.svg';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import { ReportActionsBar } from '../reports/ui';

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
 *      variant: 'send' | 'print' | 'outlined' | 'gold' | 'default' | 'export',
 *      disabled?: boolean,
 *      icon?: 'send' | 'print' | 'export',
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
      borderRadius: '8px', // updated to 8px for AgingReport match
      px: 2, // updated to match px:2
      py: 0.8,
      height: 36,
    };

    switch (action.variant) {
      case 'send':
        return {
          ...base,
          backgroundColor: '#00BBAB', // Primary teal
          color: '#ffffff',
          '&:hover': { backgroundColor: '#00a89a' },
          '&.Mui-disabled': { backgroundColor: 'rgba(0, 187, 171, 0.4)', color: '#ffffff' },
        };
      case 'print':
        return {
          ...base,
          border: '1px solid #3b82f6',
          backgroundColor: 'transparent',
          color: '#3b82f6',
          '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.04)' },
          '&.Mui-disabled': { borderColor: '#e5e7eb', color: '#9ca3af' },
        };
      case 'export':
        return {
          ...base,
          backgroundColor: '#3CA2E0',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#2b8ac3' },
          '&.Mui-disabled': { backgroundColor: 'rgba(60, 162, 224, 0.4)', color: '#ffffff' },
        };
      case 'gold':
        return {
          ...base,
          backgroundColor: '#e5c59e',
          color: '#3d3021',
          '&:hover': { backgroundColor: '#d1b089' },
          '&.Mui-disabled': { backgroundColor: 'rgba(229, 197, 158, 0.4)', color: 'rgba(61, 48, 33, 0.4)' },
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
      default:
        return {
          ...base,
          backgroundColor: '#3CA2E0', // Alternative blue
          color: '#ffffff',
          '&:hover': { backgroundColor: '#2E8CCC' },
          '&.Mui-disabled': { backgroundColor: 'rgba(60, 162, 224, 0.4)', color: '#ffffff' },
        };
    }
  };

  const renderIcon = (action) => {
    if (action.icon === 'send') {
      return <Box component="img" src={sentClaimIcon} alt="send" sx={{ width: 16, height: 16, mr: 0.5 }} />;
    }
    if (action.icon === 'print') {
      return <PrintIcon sx={{ fontSize: 18, mr: 0.5 }} />;
    }
    if (action.icon === 'export') {
      return <FileDownloadIcon sx={{ fontSize: 18, mr: 0.5 }} />;
    }
    return null;
  };

  const leftActions = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {alertCount > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
          <Box component="img" src={alertIcon} alt="alert" sx={{ width: 16, height: 16 }} />
          <Typography sx={{ color: '#d93838', fontSize: '0.85rem', fontWeight: 600 }}>
            {alertCount} claims have alerts. Please fix the validation errors before sending claims.
          </Typography>
        </Box>
      )}
      <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
        ( {claimCount} claim/s )
      </Typography>
    </Box>
  );

  const rightActions = (
    <>
      {actions.map((action, i) => (
        <Button
          key={i}
          variant={action.variant === 'outlined' || action.variant === 'print' ? 'outlined' : 'contained'}
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
    </>
  );

  return (
    <ReportActionsBar
      customLeftActions={leftActions}
      customRightActions={rightActions}
    />
  );
};

export default ClaimAlertBar;
