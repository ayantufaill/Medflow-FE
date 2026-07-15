import React from 'react';
import { Typography, Box } from '@mui/material';
import { Controller } from 'react-hook-form';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

export const Label = ({ children, required, sx }) => (
  <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '11.5px', lineHeight: '17.25px', letterSpacing: '0px', color: '#4b5563', display: 'block', mb: 0.5, ...sx }}>
    {children}{required && <span style={{ color: '#e53935' }}> *</span>}
  </Typography>
);

export const PhoneInput = ({ label, required, name, control }) => {
  const [countryCode, setCountryCode] = React.useState('US');

  return (
    <Box>
      <Label required={required}>{label}</Label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? 'Required' : false,
          validate: (value) => {
            if (!value && !required) return true;
            if (!value && required) return 'Required';
            const cleanPhone = (value || '').replace(/\D/g, '');
            if (cleanPhone.length > 0 && cleanPhone.length < 10) return 'Phone number appears incomplete';
            if (cleanPhone.length > 15) return 'Phone number is too long';
            return true;
          }
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Box sx={{
            position: 'relative',
            '& .react-tel-input .flag-dropdown': {
              border: 'none',
              borderRight: `1px solid ${error ? '#d32f2f' : '#E5E7EB'}`,
              borderRadius: '8px 0 0 8px',
              backgroundColor: 'transparent',
              width: '60px',
            },
            '& .react-tel-input .selected-flag': {
              width: '100%',
              padding: '0 !important',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent !important',
            },
            '& .react-tel-input .selected-flag:hover, & .react-tel-input .selected-flag:focus': {
              backgroundColor: 'transparent !important',
            },
            '& .react-tel-input .selected-flag .flag': {
              display: 'none !important',
            },
            '& .react-tel-input .selected-flag::before': {
              content: `"${countryCode}"`,
              fontFamily: 'Inter',
              fontSize: '14px',
              color: '#4b5563',
              marginRight: '6px',
            },
            '& .react-tel-input .selected-flag::after': {
              content: '""',
              display: 'block',
              width: '10px',
              height: '6px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              transition: 'transform 0.2s',
            },
            '& .react-tel-input .flag-dropdown.open .selected-flag::after': {
              transform: 'rotate(180deg)',
            },
            '& .react-tel-input .selected-flag .arrow': {
              display: 'none !important',
            },
            '& .react-tel-input .country-list': {
              borderRadius: '8px',
              fontFamily: 'Inter',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }
          }}>
            <ReactPhoneInput
              specialLabel=""
              country={'us'}
              value={value}
              onChange={(phone, data) => {
                onChange(phone);
                if (data && data.countryCode) {
                  setCountryCode(data.countryCode.toUpperCase());
                }
              }}
              inputStyle={{
                width: '100%',
                height: '38px',
                border: 'none',
                borderRadius: '0 8px 8px 0',
                fontFamily: 'Inter',
                fontSize: '14px',
                paddingLeft: '65px',
              }}
              buttonStyle={{
                border: 'none',
                backgroundColor: 'transparent',
              }}
              containerStyle={{ 
                width: '100%', 
                border: `1px solid ${error ? '#d32f2f' : '#E5E7EB'}`, 
                borderRadius: '8px',
                backgroundColor: '#fff',
              }}
            />
            {error && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block', ml: 1.5 }}>
                {error.message}
              </Typography>
            )}
          </Box>
        )}
      />
    </Box>
  );
};

export const inputProps = {
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
};

export const selectProps = {
  MenuProps: {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    PaperProps: {
      sx: {
        mt: 0.5,
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }
    }
  },
  sx: {
    borderRadius: '8px',
    backgroundColor: '#fff',
    height: '40px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E5E7EB',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#D1D5DB',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1976d2',
    },
    '& .MuiSelect-select': {
      padding: '8px 14px',
      fontSize: '0.875rem',
      fontFamily: 'Inter',
      display: 'flex',
      alignItems: 'center',
    },
  }
};

export const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
];

export const SPECIALTIES = [
  'Dental Assistant',
  'Practice Billing Entity',
  'Dental Hygienist',
  'Dental Laboratory Technician',
  'General Dentist',
  'Denturist',
  'Endodontist',
  'Myofunctional Therapist',
  'Orthodontist',
  'Pathology, Oral & Maxillofacial',
  'Pedodontist',
  'Periodontist',
  'Prosthodontist',
  'Surgery, Oral & Maxillofacial',
];

export const COLOR_SWATCHES = [
  '#2dd4bf', '#f97316', '#facc15', '#fb7185', '#c084fc', '#38bdf8', '#4ade80', '#f472b6'
];

export const CARRIERS = [
  'Delta Dental','Blue Cross Blue Shield','Aetna','Cigna','United Healthcare','Humana',
];
