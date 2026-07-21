import React from 'react';
import { Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingCheckbox } from './SharedSettings';

const AI = () => {
  return (
    <PracticeSettingCard 
      title="AI" 
      subtitle="Speech recognition and transcription accuracy controls"
      icon={<MicIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <SettingCheckbox label="Enable Audio Denoising" defaultChecked info />
        <SettingCheckbox label="Enable Transcription Validation" defaultChecked info />
      </Box>
    </PracticeSettingCard>
  );
};

export default AI;
