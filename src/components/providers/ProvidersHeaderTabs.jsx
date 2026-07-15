import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

const ProvidersHeaderTabs = ({ activeSubTab, handleSubTabChange, SUB_TABS }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: '#e0e0e0', mb: 3 }}>
      <Tabs
        value={activeSubTab}
        onChange={handleSubTabChange}
        sx={{ 
          minHeight: '36px',
          '& .MuiTab-root': { 
            textTransform: 'none', 
            fontWeight: 600, 
            fontSize: '0.85rem',
            minHeight: '36px',
            color: '#6B7280',
            py: 1
          },
          '& .Mui-selected': {
            color: '#2262EF !important',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#2262EF'
          }
        }}
      >
        {SUB_TABS.map((tab) => (
          <Tab
            key={tab.label}
            label={tab.label}
            disableRipple
            sx={tab.inactive ? { color: '#EF4444 !important', '&.Mui-selected': { color: '#EF4444 !important' } } : {}}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default ProvidersHeaderTabs;
