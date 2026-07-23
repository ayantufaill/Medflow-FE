import React from 'react';
import {
  Box,
  Typography,
  Switch,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const DentalInsuranceFinancialSection = ({ 
  dentalInsuranceFinancial, 
  onDentalInsuranceFinancialChange 
}) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
      <Box display="flex" alignItems="center">
        <Typography variant="subtitle2" fontWeight="bold">Dental Insurance And Financial Information</Typography>
        <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
      </Box>
      <Switch 
        size="small" 
        checked={dentalInsuranceFinancial.enabled} 
        onChange={(e) => onDentalInsuranceFinancialChange('enabled', e.target.checked)}
      />
    </Box>
  );
};

export default DentalInsuranceFinancialSection;
