import React from 'react';
import { Box, Typography } from '@mui/material';

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
      borderBottom: '2px solid #e0e6ed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 1.5,
    }}
  >
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
    {TABS.map((tab, idx) => {
      const isActive = activeTab === idx;
      const count = tabCounts[tab.key];
      return (
        <Box
          key={tab.key}
          onClick={() => onTabChange(idx)}
          sx={{
            pb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            fontSize: '0.85rem',
            fontWeight: isActive ? 700 : 500,
            color: isActive ? '#2362EF' : '#8898aa',
            cursor: 'pointer',
            borderBottom: isActive ? '4px solid #2362EF' : '4px solid transparent',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
            '&:hover': { color: '#2362EF' },
          }}
        >
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
                backgroundColor: isActive ? '#EBF2FF' : '#8898aa',
                color: isActive ? '#2362EF' : '#ffffff',
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
      );
    })}
    </Box>
    <Typography
      sx={{
        fontSize: '0.8rem',
        color: '#64748b',
        cursor: 'pointer',
        '&:hover': { textDecoration: 'underline' },
        pb: 1.5,
        pr: 1
      }}
    >
      All reports
    </Typography>
  </Box>
);

export default ClaimTabBar;
