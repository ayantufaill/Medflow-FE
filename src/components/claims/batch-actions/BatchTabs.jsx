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
        borderBottom: `1px solid ${COLORS.BORDER}`,
        mb: 2,
        '& .MuiTab-root': {
          textTransform: 'none',
          minWidth: 120,
          fontWeight: fontWeight.semibold,
          fontSize: fontSize.sm,
          color: COLORS.TEXT_MUTED,
        },
        '& .Mui-selected': { 
          color: `${COLORS.ACCENT} !important` 
        },
        '& .MuiTabs-indicator': {
          backgroundColor: COLORS.ACCENT
        }
      }}
    >
      <Tab label="Insurance Batch Payment" value="INSURANCE BATCH PAYMENT" />
      <Tab label="Batch Invoices" value="BATCH INVOICES" />
      <Tab label="Batch Claims" value="BATCH CLAIMS" />
    </Tabs>
  );
};

export default BatchTabs;
