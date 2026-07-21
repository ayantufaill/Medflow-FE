import React from 'react';
import { Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingCheckbox } from './SharedSettings';

const PatientConfidentialInfo = () => {
  return (
    <PracticeSettingCard 
      title="Patient Confidential Info" 
      subtitle="Fields treated as confidential on the patient record"
      icon={<LockOutlinedIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 1 }}>
        <SettingCheckbox label="Additional Info (for pedo only)" defaultChecked />
        <SettingCheckbox label="Emergency Contact Information" defaultChecked />
        <SettingCheckbox label="Home Phone Number" defaultChecked />
        <SettingCheckbox label="Marital Status" defaultChecked />
        <SettingCheckbox label="Release Information" defaultChecked />
        <SettingCheckbox label="Spouse Information" defaultChecked />
        <SettingCheckbox label="Title" defaultChecked />
        <SettingCheckbox label="Work Phone Number" defaultChecked />
      </Box>
    </PracticeSettingCard>
  );
};

export default PatientConfidentialInfo;
