import React from 'react';
import { Box } from '@mui/material';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingCheckbox, SettingInlineNumber } from './SharedSettings';

const Insurance = () => {
  return (
    <PracticeSettingCard 
      title="Insurance (for NEA/Vyne offices)" 
      subtitle="Claim eligibility and clearinghouse behavior"
      icon={<VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ mb: 1 }}>
          <SettingInlineNumber label="Eligibility Data-Validity Duration" defaultValue={14} info />
        </Box>
        <Box sx={{ borderTop: '1px dashed #e5e7eb', my: 1 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 1 }}>
          <SettingCheckbox label="Allow Sending Quads as Teeth for Claims" defaultChecked info />
          <SettingCheckbox label="Allow Submission of Claims/Preds with no Attachments" defaultChecked info />
          <SettingCheckbox label="Allow Submission of Secondary Claims without Primary Claim Insurance Payment Amount" info />
          <SettingCheckbox label="Allow Submission of Secondary Claims without Primary Claim Remittance Date" info />
          <SettingCheckbox label="Automatically apply payment based on ERA report (beta)" info />
          <SettingCheckbox label="Display Eligibility Response in Vyne HTML Format" defaultChecked info />
          <SettingCheckbox label="Use Tesia Payer Procedure Requirements" defaultChecked info />
        </Box>
      </Box>
    </PracticeSettingCard>
  );
};

export default Insurance;
