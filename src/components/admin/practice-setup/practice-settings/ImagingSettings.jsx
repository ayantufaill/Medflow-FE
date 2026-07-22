import React from 'react';
import { Typography } from '@mui/material';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import PracticeSettingCard from './PracticeSettingCard';

const ImagingSettings = () => {
  return (
    <PracticeSettingCard 
      title="Imaging Settings" 
      subtitle="X-ray and imaging integration preferences"
      icon={<ImageSearchIcon sx={{ fontSize: 18 }} />}
    >
      <Typography sx={{ fontSize: '12px', color: '#9ca3af', fontStyle: 'italic', py: 1 }}>
        No configurable options in this section yet.
      </Typography>
    </PracticeSettingCard>
  );
};

export default ImagingSettings;
