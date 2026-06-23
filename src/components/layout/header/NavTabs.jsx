import { useState } from 'react';
import { Box, Typography } from '@mui/material';

const TABS = ['Schedule', 'Patients', 'Clinical', 'Billing', 'Reports'];

const NavTabs = () => {
  const [activeTab, setActiveTab] = useState('Schedule');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <Box
            key={tab}
            onClick={() => setActiveTab(tab)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: '12px',
              py: '6px',
              cursor: 'pointer',
              borderRadius: '14px',
              backgroundColor: isActive ? 'rgba(34, 98, 239, 0.08)' : 'transparent',
              transition: 'background-color 0.15s ease',
              '&:hover': {
                backgroundColor: isActive ? 'rgba(34, 98, 239, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#2262ef' : '#5c646f',
                whiteSpace: 'nowrap',
              }}
            >
              {tab}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default NavTabs;
