import React from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';

const TABS = [
  { label: 'Unsent Claims', key: 'unsent' },
  { label: 'Errored', key: 'errored' },
  { label: 'Rejected', key: 'rejected' },
  { label: 'History', key: 'history' },
  { label: 'Outstanding Claims', key: 'outstanding' },
  { label: 'Predetermination', key: 'predetermination' },
  { label: 'Dentical Reports', key: 'dentical' },
  { label: 'ERA Reports', key: 'era' },
];

const ClaimTabBar = ({ activeTab, onTabChange, tabCounts = {} }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 2.5,
      borderBottom: '1px solid #e2e8f0',
    }}
  >
    <Tabs
      value={activeTab === -1 ? false : activeTab}
      onChange={(e, newValue) => onTabChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        '& .MuiTab-root': {
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '0.875rem',
          minWidth: 120,
          color: '#64748b',
          borderBottom: '3px solid transparent',
          px: 2,
          '&.Mui-selected': {
            color: '#3b82f6',
          },
        },
        '& .MuiTabs-indicator': {
          height: 3,
          backgroundColor: '#3b82f6',
        },
      }}
    >
      {TABS.map((tab, idx) => {
        const isActive = activeTab === idx;
        const count = tabCounts[tab.key];
        
        return (
          <Tab
            key={tab.key}
            disableRipple
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {tab.label}
                {count !== undefined && count > 0 && (
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 20,
                      height: 20,
                      borderRadius: '10px',
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : '#f1f5f9',
                      color: isActive ? '#3b82f6' : '#64748b',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      px: 0.6,
                      lineHeight: 1,
                    }}
                  >
                    {count}
                  </Box>
                )}
              </Box>
            }
          />
        );
      })}
    </Tabs>
    
    <Typography
      sx={{
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#64748b',
        cursor: 'pointer',
        '&:hover': { color: '#1e293b' },
        pl: 2,
        pb: 1,
        whiteSpace: 'nowrap',
      }}
    >
      All reports
    </Typography>
  </Box>
);

export default ClaimTabBar;
