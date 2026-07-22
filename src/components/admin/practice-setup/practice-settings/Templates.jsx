import React from 'react';
import { Box } from '@mui/material';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingCheckbox } from './SharedSettings';

const Templates = () => {
  return (
    <PracticeSettingCard 
      title="Templates (Emails/Texts)" 
      subtitle="Default footers for email and text templates"
      icon={<RateReviewOutlinedIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <SettingCheckbox label="Add Default Sms Footer" defaultChecked info />
      </Box>
    </PracticeSettingCard>
  );
};

export default Templates;
