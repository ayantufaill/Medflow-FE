import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Popover, MenuItem } from '@mui/material';
import { NotificationsNone, Settings } from '@mui/icons-material';

const iconStyle = {
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: '#ffffff',
  borderRadius: '50%',
  boxShadow: '0px 1px 4px rgba(0,0,0,0.08)',
};

const ActionIcons = () => {
  const navigate = useNavigate();
  const [settingsAnchor, setSettingsAnchor] = useState(null);

  const handleSettingsOpen = (event) => {
    if (settingsAnchor) {
      setSettingsAnchor(null);
    } else {
      setSettingsAnchor(event.currentTarget);
    }
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Box sx={{ ...iconStyle, position: 'relative' }}>
        <NotificationsNone sx={{ fontSize: '18px', color: '#4a5568' }} />
        <Box
          sx={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '7px',
            height: '7px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
          }}
        />
      </Box>

      <Box sx={iconStyle} onClick={handleSettingsOpen}>
        <Settings sx={{ fontSize: '18px', color: '#4a5568' }} />
      </Box>

      <Popover
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disableScrollLock
        PaperProps={{
          sx: {
            overflow: 'visible',
            border: '1px solid #e2e8f0',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            mt: 1,
            minWidth: 180,
            borderRadius: '6px',
          },
        }}
      >
        <Box sx={{ py: 1 }}>
          {[
            'Claim Management',
            'Batch Actions',
            'Reports',
            'Advanced Reporting',
            'KPI Dashboard',
            'Automations',
            'Admin',
          ].map((item) => (
            <MenuItem
              key={item}
              onClick={() => {
                if (item === 'Claim Management') navigate('/claims');
                if (item === 'Batch Actions') navigate('/batch-actions');
                if (item === 'Advanced Reporting') navigate('/admin/advanced-reporting');
                if (item === 'Admin') navigate('/admin/user-management');
                if (item === 'Reports') navigate('/admin/reports/financial');
                if (item === 'KPI Dashboard') navigate('/kpi');
                handleSettingsClose();
              }}
              sx={{
                fontFamily: 'Inter',
                fontSize: '13px',
                fontWeight: 500,
                color: '#09121f',
                py: 1,
                px: 2,
                '&:hover': {
                  backgroundColor: '#f8fafc',
                },
              }}
            >
              {item}
            </MenuItem>
          ))}
        </Box>
      </Popover>
    </Box>
  );
};

export default ActionIcons;
