import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';

const BatchTabs = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs
      value={activeTab}
      onChange={(e, v) => setActiveTab(v)}
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
      <Tab label="Insurance Batch Payment" value="INSURANCE BATCH PAYMENT" />
      <Tab label="Batch Invoices" value="BATCH INVOICES" />
      <Tab label="Batch Claims" value="BATCH CLAIMS" />
    </Tabs>
  );
};

export default BatchTabs;
