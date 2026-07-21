import React from 'react';
import { Typography } from '@mui/material';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import PracticeSettingCard from './PracticeSettingCard';

const TreatmentPrintoutForm = () => {
  return (
    <PracticeSettingCard 
      title="Treatment Printout Form" 
      subtitle="Printed treatment plan layout options"
      icon={<LocalPrintshopOutlinedIcon sx={{ fontSize: 18 }} />}
    >
      <Typography sx={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', py: 1 }}>
        No configurable options in this section yet.
      </Typography>
    </PracticeSettingCard>
  );
};

export default TreatmentPrintoutForm;
