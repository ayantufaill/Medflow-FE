import React from 'react';
import { Box } from '@mui/material';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingToggle } from './SharedSettings';

const AutomatedWorkflows = () => {
  return (
    <PracticeSettingCard 
      title="Automated Workflows" 
      subtitle="Consent forms and reminder scheduling"
      icon={<AutoModeIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <SettingToggle
          label="Automate Consent Form Creation and Sharing X Days Before Appointment"
          defaultValue={3}
        />
        <SettingToggle
          label="Automatically request medical history updates X days prior to appointment"
          defaultValue={5}
        />
        <SettingToggle
          label="Send Unsigned Consent Forms Reminder X Days Before Appointment"
          defaultValue={1}
        />
      </Box>
    </PracticeSettingCard>
  );
};

export default AutomatedWorkflows;
