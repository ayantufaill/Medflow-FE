import React from 'react';
import { Box } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingCheckbox } from './SharedSettings';

const ClaimManagement = () => {
  return (
    <PracticeSettingCard 
      title="Claim Management" 
      subtitle="Claim submission rules and attachment behavior"
      icon={<DescriptionIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 1 }}>
        <SettingCheckbox label="Allow Custom Codes In Claims" />
        <SettingCheckbox label="Disallow Deactivating Patient Policy if it has unclosed Claims." info />
        <SettingCheckbox label="Enable $0 Procedures in Claim Submission" defaultChecked />
        <SettingCheckbox label="Enable claims auto-attachment" defaultChecked />
        
        <SettingCheckbox label="Hide Subscriber Signature From Manual Claim" />
        <SettingCheckbox label="Include Pearl Annotations In Claim Attachments" defaultChecked />
        <SettingCheckbox label="Only display the total fee on the last page for multi-page claims." />
        <SettingCheckbox label="Print a Doctor & Patient copy for EOB" defaultChecked info />
      </Box>
    </PracticeSettingCard>
  );
};

export default ClaimManagement;
