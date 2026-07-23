import React from 'react';
import { Box, Typography } from '@mui/material';
import { DescriptionOutlined as DescriptionOutlinedIcon } from '@mui/icons-material';
import GeneralConfigurationCard from './GeneralConfigurationCard';
import TypesOfRemindersCard from './TypesOfRemindersCard';

const ReminderConfig = ({ settings, setSettings }) => {
  return (
    <Box sx={{
      border: '1px solid #E5E9F2',
      borderRadius: '12px',
      bgcolor: '#FFFFFF',
      overflow: 'hidden'
    }}>
      {/* Main Header */}
      <Box sx={{
        bgcolor: '#F2F6FC',
        px: 3,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        borderBottom: '1px solid #E5E9F2'
      }}>
        <DescriptionOutlinedIcon sx={{ fontSize: '1.2rem', color: '#4472C4' }} />
        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1E293b', letterSpacing: '0.5px' }}>
          REMINDER CONFIGURATION
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ px: 3, pb: 3, pt: 3 }}>
        <GeneralConfigurationCard settings={settings} setSettings={setSettings} />
        <TypesOfRemindersCard settings={settings} setSettings={setSettings} />
      </Box>
    </Box>
  );
};

export default ReminderConfig;
