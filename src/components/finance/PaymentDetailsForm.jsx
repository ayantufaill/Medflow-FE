import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Stack,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';

const PaymentField = ({ label, placeholder, required }) => (
  <Box>
    {label && (
      <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '11.5px', lineHeight: '17.25px', letterSpacing: '0px', color: '#4b5563', display: 'block', mb: 0.5 }}>
        {label}{required && <span style={{ color: '#e53935' }}> *</span>}
      </Typography>
    )}
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      InputProps={{
        sx: {
          borderRadius: '8px',
          backgroundColor: '#fff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E5E7EB',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D1D5DB',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
          },
          '& .MuiInputBase-input': {
            padding: '10px 14px',
            fontSize: '0.875rem',
            fontFamily: 'Inter',
          },
        }
      }}
    />
  </Box>
);

const SectionContainer = ({ title, icon: Icon, children }) => {
  const borderColor = '#E5E7EB';
  const headerBg = '#F3F8FD';

  return (
    <Box sx={{ border: `1px solid ${borderColor}`, borderRadius: '12px', mb: 2, backgroundColor: '#FFFFFF' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2, backgroundColor: headerBg, borderBottom: `1px solid ${borderColor}`, borderTopLeftRadius: '11px', borderTopRightRadius: '11px' }}>
        {Icon && <Icon sx={{ fontSize: '20px', color: '#6B7280' }} />}
        <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '14px', lineHeight: '20px', letterSpacing: '0px', color: '#111' }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

const PaymentDetailsForm = ({ onBack }) => {
  const cardFields = [
    { label: "Name", placeholder: "Name on card", required: true },
    { label: "Card Number", placeholder: "0000 0000 0000 0000", required: true },
    { label: "Expiration Date", placeholder: "MM / YY", required: true },
    { label: "CVV", placeholder: "123", required: true },
  ];

  const addressFields = [
    { placeholder: "Address", col: 4 },
    { placeholder: "City", col: 4 },
    { placeholder: "State", col: 4 },
    { placeholder: "Zip", col: 4 },
    { placeholder: "Email", col: 4 },
    { placeholder: "Phone", col: 4 },
  ];

  return (
    <>
      <DialogTitle
        sx={{
          backgroundColor: '#F1F5FD',
          color: '#111',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E5E7EB',
          m: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e2ebfc', 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <PaymentOutlinedIcon sx={{ color: '#2362EF', fontSize: '20px' }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '16px', lineHeight: '24px', letterSpacing: '-0.4px', color: '#111' }}>
              Add Payment Method
            </Typography>
            <Typography sx={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '11.5px', lineHeight: '17.25px', color: '#6B7280' }}>
              Enter the patient's credit card and billing details below
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onBack} sx={{ color: '#6B7280' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: '24px !important', pb: 2.5 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <SectionContainer title="Credit Card Information" icon={LockIcon}>
              <Grid container spacing={2.5}>
                {cardFields.map((field, idx) => (
                  <Grid size={6} key={idx}>
                    <PaymentField 
                      label={field.label}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  </Grid>
                ))}
              </Grid>
            </SectionContainer>
          </Grid>

          <Grid size={12}>
            <SectionContainer title="Address Information" icon={PaymentOutlinedIcon}>
              <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '11.5px', lineHeight: '17.25px', letterSpacing: '0px', color: '#4b5563', display: 'block', mb: 1.5 }}>
                Billing Address<span style={{ color: '#e53935' }}> *</span>
              </Typography>
              <Grid container spacing={2.5}>
                {addressFields.map((field, idx) => (
                  <Grid size={field.col} key={idx}>
                    <PaymentField 
                      placeholder={field.placeholder}
                    />
                  </Grid>
                ))}
              </Grid>
            </SectionContainer>
          </Grid>
        </Grid>

        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', px: 1 }}>
          <Box>
            <Typography sx={{ fontSize: '12px', color: '#6B7280', mb: 1, fontWeight: 600 }}>
              Available payment methods:
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" width="40" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width="30" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width="50" />
            </Stack>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        px: 3, 
        py: 2, 
        backgroundColor: '#FFFFFF', 
        borderTop: '1px solid #E5E7EB', 
        gap: 1.5,
        justifyContent: 'flex-end'
      }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            borderColor: '#D1D5DB', 
            color: '#374151',
            backgroundColor: '#FFFFFF',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '6px',
            px: 2,
            '&:hover': {
              backgroundColor: '#F3F4F6',
              borderColor: '#D1D5DB'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onBack}
          sx={{
            backgroundColor: '#2563EB', 
            color: '#FFFFFF',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '6px',
            px: 2.5,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#1D4ED8',
              boxShadow: 'none',
            }
          }}
        >
          Save Card
        </Button>
      </DialogActions>
    </>
  );
};

export default PaymentDetailsForm;
