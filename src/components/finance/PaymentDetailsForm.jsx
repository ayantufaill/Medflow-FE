import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Stack,
  IconButton,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Helper component for the underlined inputs
const PaymentField = ({ label, placeholder, required }) => (
  <Box>
    {label && (
      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#333' }}>
        {label} {required && '*'}
      </Typography>
    )}
    <TextField
      fullWidth
      variant="standard"
      placeholder={placeholder}
      InputProps={{
        disableUnderline: false,
        sx: { 
          fontSize: '0.9rem',
          py: 0.5,
          '&:before': { borderBottomColor: '#bbdefb' }, // Light blue line
        }
      }}
      sx={{ mt: 0.5 }}
    />
  </Box>
);

const PaymentDetailsForm = ({ onBack }) => {
  const cardFields = [
    { label: "Name", placeholder: "test test", required: true },
    { label: "Card Number", placeholder: "0000 0000 0000 0000", required: true },
    { label: "Expiration Date", placeholder: "00 00", required: true },
    { label: "CVV", placeholder: "123", required: true },
  ];

  const addressFields = [
    { placeholder: "Address" },
    { placeholder: "City" },
    { placeholder: "State" },
    { placeholder: "Zip" },
    { placeholder: "Email" },
    { placeholder: "Phone" },
  ];

  return (
    <Box sx={{ width: '100%', bgcolor: '#fff', position: 'relative', pb: 4 }}>
      {/* Header Bar */}
      <Box sx={{ bgcolor: '#3f51b5', color: '#fff', p: 1.5, textAlign: 'center', position: 'relative' }}>
        <IconButton 
          onClick={onBack} 
          sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#fff' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Enter Payment Details
        </Typography>
      </Box>

      <Box sx={{ p: 4, maxWidth: 1000, margin: '0 auto' }}>
        <Grid container spacing={8}>
          {/* Left Column: Credit Card Information */}
          <Grid item xs={12} md={6}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
                Credit Card Information
              </Typography>
              <LockIcon sx={{ fontSize: 18, color: '#ccc' }} />
            </Stack>

            <Stack spacing={3}>
              {cardFields.map((field, idx) => (
                <PaymentField 
                  key={idx}
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ))}
            </Stack>
          </Grid>

          {/* Right Column: Address Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ color: '#333', fontWeight: 'bold', mb: 4 }}>
              Address Information *
            </Typography>

            <Stack spacing={3}>
              {addressFields.map((field, idx) => (
                <PaymentField 
                  key={idx}
                  placeholder={field.placeholder}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Footer: Payment Methods & Address */}
        <Box sx={{ mt: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>
              Available payment methods:
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" width="40" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width="30" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width="50" />
            </Stack>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
             <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
               The Dental Office
             </Typography>
             <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
               6341 Plano Pkwy
             </Typography>
             <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
               Plano, TX
             </Typography>
             <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
               75028
             </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentDetailsForm;
