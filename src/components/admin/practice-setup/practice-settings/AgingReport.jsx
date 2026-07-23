import React from 'react';
import { Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import PracticeSettingCard from './PracticeSettingCard';

const AgingReport = () => {
  return (
    <PracticeSettingCard 
      title="Aging Report" 
      subtitle="Aging report display and calculation settings"
      icon={<BarChartIcon sx={{ fontSize: 18 }} />}
    >
      <Typography sx={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', py: 1 }}>
        No configurable options in this section yet.
      </Typography>
    </PracticeSettingCard>
  );
};

export default AgingReport;
