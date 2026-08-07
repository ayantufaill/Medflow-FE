import React from 'react';
import { Box, Typography, Checkbox } from '@mui/material';
import { COLORS } from '../../constants/colors';
import { getFlagColor, PATIENT_FLAGS } from './constants';
import FlagOption from './FlagOption';

const FlagCommunicationColumn = ({ flags, handleFlagToggle }) => {
  const reminderColor = getFlagColor('appointment_reminder');

  return (
    <Box sx={{ 
      flex: 1, 
      border: `1px solid ${COLORS.BORDER_LIGHT}`, 
      borderRadius: '12px', 
      backgroundColor: COLORS.WHITE, 
      p: '16px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Patient Communication Section */}
      <Typography sx={{ fontWeight: 600, mb: 1.5, color: COLORS.TEXT_PRIMARY, fontSize: '14px' }}>
        Patient Communication
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Checkbox 
          size="small" 
          checked={flags['appointment_reminder'] || false}
          onChange={() => handleFlagToggle('appointment_reminder')}
          sx={{ p: 0.5, mt: -0.5, color: COLORS.BORDER, '&.Mui-checked': { color: COLORS.ACCENT } }} 
        />
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ width: 36, height: 22, bgcolor: reminderColor, borderRadius: '4px', flexShrink: 0 }} />
          <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_BODY, lineHeight: 1.4 }}>
            Send appointment reminder earlier than scheduled time
          </Typography>
        </Box>
      </Box>

      {/* Patient Section */}
      <Typography sx={{ fontWeight: 600, mb: 1.5, color: COLORS.TEXT_PRIMARY, fontSize: '14px' }}>
        Patient
      </Typography>

      {PATIENT_FLAGS.map((flag) => (
        <FlagOption 
          key={flag.label}
          label={flag.label}
          color={flag.color}
          checked={flags[flag.label]}
          onChange={handleFlagToggle}
        />
      ))}
    </Box>
  );
};

export default FlagCommunicationColumn;
