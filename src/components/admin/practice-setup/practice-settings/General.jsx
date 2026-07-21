import React from 'react';
import { Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingCheckbox, SettingInlineNumber, SettingInlineSelect } from './SharedSettings';

const General = () => {
  return (
    <PracticeSettingCard 
      title="General" 
      subtitle="Session, date format, and platform-wide defaults"
      icon={<SettingsIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mb: 2 }}>
          <SettingInlineNumber
            label="Consider medical history outdated after X months from the last review"
            defaultValue={11}
          />
          <SettingInlineNumber
            label="Session Expiration Duration (minutes)"
            defaultValue={60}
            info
          />
          <SettingInlineSelect
            label="Custom Date Format"
            options={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
            ]}
            defaultValue="MM/DD/YYYY"
            info
          />
        </Box>
        <Box sx={{ borderTop: '1px dashed #e5e7eb', my: 1 }} />
        <SettingCheckbox label="Hide Pearl Advertisement" />
        <SettingCheckbox label="Show Dentists on Hygienist list on Patient Info Page" />
        <SettingCheckbox label="Show Outbound Calls" />
        <SettingCheckbox label="Show Patient ID next to patient name in header" />
        <SettingCheckbox label="Use Insurance New Design as Default" defaultChecked />
      </Box>
    </PracticeSettingCard>
  );
};

export default General;
