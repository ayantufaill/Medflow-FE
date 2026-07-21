import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material';

const PatientPaymentSection = ({ 
  patientPayment, 
  googleMeasurementId,
  onPaymentChange, 
  onGoogleIdChange 
}) => {
  return (
    <>
      <Typography variant="h6" fontWeight="bold" gutterBottom>Patient Payment</Typography>
      <Box display="flex" flexDirection="column">
        <FormControlLabel 
          control={
            <Checkbox 
              checked={patientPayment.includeAchPayment} 
              onChange={(e) => onPaymentChange('includeAchPayment', e.target.checked)} 
            />
          } 
          label={<Typography variant="body2">Include ACH Payment</Typography>} 
        />
        <FormControlLabel 
          control={
            <Checkbox 
              checked={patientPayment.addPaymentAsQuickDeposit} 
              onChange={(e) => onPaymentChange('addPaymentAsQuickDeposit', e.target.checked)} 
            />
          } 
          label={<Typography variant="body2">Add payment as a quick deposit</Typography>} 
        />
        <FormControlLabel 
          control={
            <Checkbox 
              checked={patientPayment.allowPatientToEditQuickPaymentAmount} 
              onChange={(e) => onPaymentChange('allowPatientToEditQuickPaymentAmount', e.target.checked)} 
            />
          } 
          label={<Typography variant="body2">Allow patient to edit quick payment amount</Typography>} 
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" fontWeight="bold" gutterBottom>Google Measurement ID Setup</Typography>
      <TextField 
        fullWidth 
        size="small" 
        placeholder="G-XXXXXXXXXX" 
        value={googleMeasurementId}
        onChange={(e) => onGoogleIdChange(e.target.value)}
        sx={{ maxWidth: 350, mt: 1 }} 
      />
    </>
  );
};

export default PatientPaymentSection;
