import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import ConfigRow from './ConfigRow';

const PhoneNumberSection = ({ 
  phoneNumber, 
  onPhoneNumberChange 
}) => {
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>Patient's Phone Number</Typography>
      <ConfigRow 
        label="Home Phone Number" 
        checked={phoneNumber.homePhone.enabled}
        requiredStatus={phoneNumber.homePhone.requiredStatus}
        onChange={(val) => onPhoneNumberChange('homePhone', 'enabled', val)}
        onRequiredStatusChange={(val) => onPhoneNumberChange('homePhone', 'requiredStatus', val)}
      />
      <ConfigRow 
        label="Work Phone Number" 
        checked={phoneNumber.workPhone.enabled}
        requiredStatus={phoneNumber.workPhone.requiredStatus}
        onChange={(val) => onPhoneNumberChange('workPhone', 'enabled', val)}
        onRequiredStatusChange={(val) => onPhoneNumberChange('workPhone', 'requiredStatus', val)}
      />
    </Box>
  );
};

export default PhoneNumberSection;
