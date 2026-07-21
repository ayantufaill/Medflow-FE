import React from 'react';
import { Box } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingCheckbox, SettingInlineNumber } from './SharedSettings';

const Communication = () => {
  return (
    <PracticeSettingCard 
      title="Communication" 
      subtitle="Patient notifications and confirmation pop-ups"
      icon={<ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <SettingInlineNumber label="Hide the Caller Id Popup After # of seconds" defaultValue={5} info />
        <Box sx={{ borderTop: '1px dashed #e5e7eb', my: 1 }} />
        <SettingCheckbox label="Add calendar invitation to appointment reminders" defaultChecked />
        <SettingCheckbox label="Include confirmations messages in the patient notifications pop-up" />
        <SettingCheckbox label="Include unread messages only in the patient notifications pop-up" defaultChecked />
        <SettingCheckbox label="Show phone call pop-up when having unread confirmation messages" />
      </Box>
    </PracticeSettingCard>
  );
};

export default Communication;
