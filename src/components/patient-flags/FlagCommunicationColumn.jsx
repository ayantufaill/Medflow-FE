import React from 'react';
import { Box, Typography, Checkbox } from '@mui/material';
import { COLORS } from '../../constants/colors';
import { getFlagColor } from './constants';

const FlagCommunicationColumn = ({ flags, handleFlagToggle }) => {
  const reminderColor = getFlagColor('appointment_reminder');

  return (
    <Box sx={{ 
      flex: 1, 
      border: `1px solid ${COLORS.BORDER_LIGHT}`, 
      borderRadius: '12px', 
      backgroundColor: COLORS.WHITE, 
      p: '20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography sx={{ fontWeight: 600, mb: 2, color: COLORS.TEXT_PRIMARY, fontSize: '14px' }}>
        Patient Communication
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Checkbox 
          size="small" 
          checked={flags['appointment_reminder'] || false}
          onChange={() => handleFlagToggle('appointment_reminder')}
          sx={{ p: 0.5, mt: -0.5, color: COLORS.BORDER, '&.Mui-checked': { color: COLORS.ACCENT } }} 
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ width: 40, height: 24, bgcolor: reminderColor, borderRadius: '4px', flexShrink: 0 }} />
          <Typography sx={{ fontSize: '14px', color: COLORS.TEXT_BODY, lineHeight: 1.4 }}>
            Send appointment reminder earlier than scheduled time
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FlagCommunicationColumn;
