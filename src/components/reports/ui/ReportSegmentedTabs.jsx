import React from 'react';
import { Box, Button } from '@mui/material';

const ReportSegmentedTabs = ({ tabs, activeTab, onChange }) => {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f1f5f9', p: 0.5, borderRadius: '24px', width: 'fit-content', mb: 3 }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <Button 
            key={tab.value}
            onClick={() => onChange(tab.value)}
            sx={{ 
              backgroundColor: isActive ? '#ffffff' : 'transparent',
              color: isActive ? '#1e293b' : '#64748b',
              textTransform: 'none',
              borderRadius: '20px',
              px: 3,
              py: 0.5,
              fontWeight: 600,
              boxShadow: isActive ? '0px 1px 3px rgba(0,0,0,0.1)' : 'none',
              '&:hover': { backgroundColor: isActive ? '#ffffff' : 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            {tab.label}
          </Button>
        );
      })}
    </Box>
  );
};

export default ReportSegmentedTabs;
