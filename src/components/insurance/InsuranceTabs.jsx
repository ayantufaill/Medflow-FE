import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight } from '../../constants/styles';

const InsuranceTabs = ({ tabValue, onTabChange }) => {
  return (
    <Tabs
      value={tabValue}
      onChange={onTabChange}
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
      <Tab label="Active Coverages" />
      <Tab label="Family Coverages" />
      <Tab label="Archived Coverages" />
      <Tab label="Archived Family Coverages" />
    </Tabs>
  );
};

export default InsuranceTabs;
