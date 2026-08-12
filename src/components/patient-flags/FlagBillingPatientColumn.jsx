import React from 'react';
import { Box, Typography } from '@mui/material';
import { COLORS } from '../../constants/colors';
import { BILLING_FLAGS } from './constants';
import FlagOption from './FlagOption';

const FlagBillingPatientColumn = ({ flags, handleFlagToggle }) => {
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
      {/* Billing Section */}
      <Typography sx={{ fontWeight: 600, mb: 1.5, color: COLORS.TEXT_PRIMARY, fontSize: '14px' }}>
        Billing
      </Typography>
      
      {BILLING_FLAGS.map((flag) => (
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

export default FlagBillingPatientColumn;
