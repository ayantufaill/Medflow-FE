import { useState } from 'react';
import { Box, Typography } from '@mui/material';

const TABS = [
  { label: 'Patient' },
  { label: 'Pending', count: 0 },
  { label: 'Search' },
  { label: 'Productivity' },
];

const LeftPanelTabs = ({ activeTab, onChange }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      height: '44px',
      borderBottom: '1px solid #e0e5eb',
      px: '12px',
      gap: '4px',
      flexShrink: 0,
    }}
  >
    {TABS.map(({ label, count }) => {
      const isActive = activeTab === label;
      const displayLabel = count !== undefined ? `${label} (${count})` : label;
      return (
        <Box
          key={label}
          onClick={() => onChange(label)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: '8px',
            pb: '10px',
            cursor: 'pointer',
            borderBottom: isActive ? '2px solid #2262ef' : '2px solid transparent',
            transition: 'border-color 0.15s ease',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontSize: '13px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#2262ef' : '#5c646f',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {displayLabel}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

export default LeftPanelTabs;
