import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SectionContainer from './SectionContainer';
import FormInputLabel from './FormInputLabel';

const commonInputStyles = {
  '& .MuiOutlinedInput-root': {
    height: '36px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    '& fieldset': { borderColor: '#d1d5db' },
    '&:hover fieldset': { borderColor: '#9ca3af' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
  },
  '& .MuiOutlinedInput-input': {
    padding: '0 12px',
    height: '36px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.85rem',
  }
};

const phoneInputStyles = {
  '& .react-tel-input': {
    width: '100%',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      borderColor: '#9ca3af',
    },
    '&:focus-within': {
      borderColor: '#3b82f6',
    },
  },
  '& .react-tel-input .form-control': {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    paddingLeft: '65px',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    outline: 'none',
  },
  '& .react-tel-input .form-control:focus': {
    border: 'none',
    boxShadow: 'none',
  },
  '& .react-tel-input .flag-dropdown': {
    border: 'none',
    borderRight: '1px solid #d1d5db',
    borderRadius: '8px 0 0 8px',
    backgroundColor: 'transparent',
    width: '55px',
    height: '100%',
  },
  '& .react-tel-input .flag-dropdown:hover': {
    backgroundColor: '#f3f4f6',
  },
  '& .react-tel-input .selected-flag': {
    width: '100%',
    height: '100%',
    padding: 0,
    backgroundColor: 'transparent',
  },
  '& .react-tel-input .selected-flag:hover': {
    backgroundColor: 'transparent',
  },
  '& .react-tel-input .selected-flag .flag': {
    display: 'none',
  },
  '& .react-tel-input .selected-flag .arrow': {
    display: 'none',
  }
};

const PracticeInformationForm = ({ register, errors, control, setPhoneCountry, setFaxCountry }) => {
  const [phoneCode, setPhoneCode] = useState('us');
  const [faxCode, setFaxCode] = useState('us');

  return (
    <SectionContainer title="Practice Information" icon={PersonOutlineIcon}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 2.5 }}>
        {/* Row 1 */}
        <Box sx={{ width: { xs: '100%', lg: '409px' }, flexShrink: 1 }}>
          <FormInputLabel label="Practice Name" required />
          <TextField
            fullWidth
            placeholder="Enter Practice Name"
            {...register("practiceName")}
            error={!!errors.practiceName}
            helperText={errors.practiceName?.message}
            sx={commonInputStyles}
          />
        </Box>
        
        <Box sx={{ width: { xs: '100%', lg: '370px' }, flexShrink: 1 }}>
          <FormInputLabel label="Phone Number" required />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Box sx={{ position: 'relative', ...phoneInputStyles }}>
                <PhoneInput
                  {...field}
                  country="us"
                  enableSearch
                  specialLabel=""
                  onChange={(value, country) => {
                    field.onChange(value);
                    setPhoneCountry(country);
                    setPhoneCode(country?.countryCode || 'us');
                  }}
                  value={field.value || ""}
                />
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '55px',
                    height: '36px',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    zIndex: 2,
                  }}
                >
                  <Typography sx={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase' }}>
                    {phoneCode}
                  </Typography>
                  <KeyboardArrowDownIcon sx={{ fontSize: '1rem', color: '#9ca3af' }} />
                </Box>
                {errors.phone && (
                  <Typography color="error" sx={{ fontSize: '0.75rem', mt: 0.5, mx: 1.5 }}>
                    {errors.phone.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '410px' }, flexShrink: 1 }}>
          <FormInputLabel label="Email" />
          <TextField
            fullWidth
            placeholder="Enter Your Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={commonInputStyles}
          />
        </Box>

        {/* Row 2 */}
        <Box sx={{ width: { xs: '100%', lg: '409px' }, flexShrink: 1 }}>
          <FormInputLabel label="Website" />
          <TextField
            fullWidth
            placeholder="Enter Your Website"
            {...register("website")}
            error={!!errors.website}
            helperText={errors.website?.message}
            sx={commonInputStyles}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '370px' }, flexShrink: 1 }}>
          <FormInputLabel label="Registration Number" />
          <TextField
            fullWidth
            placeholder="Enter Business Number"
            {...register("businessRegistrationNumber")}
            error={!!errors.businessRegistrationNumber}
            helperText={errors.businessRegistrationNumber?.message}
            sx={commonInputStyles}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '410px' }, flexShrink: 1 }}>
          <FormInputLabel label="Legal Name" />
          <TextField
            fullWidth
            placeholder="Enter Legal Name"
            {...register("businessLegalName")}
            error={!!errors.businessLegalName}
            helperText={errors.businessLegalName?.message}
            sx={commonInputStyles}
          />
        </Box>

        {/* Row 3 */}
        <Box sx={{ width: { xs: '100%', lg: '409px' }, flexShrink: 1 }}>
          <FormInputLabel label="Fax Number" />
          <TextField
            fullWidth
            placeholder="Enter Fax Number"
            {...register("fax")}
            error={!!errors.fax}
            helperText={errors.fax?.message}
            sx={commonInputStyles}
          />
        </Box>
        
        {/* Empty boxes to push the Fax Number to the left if needed when flex-wrapping */}
        <Box sx={{ width: { xs: '100%', lg: '370px' }, display: { xs: 'none', lg: 'block' } }} />
        <Box sx={{ width: { xs: '100%', lg: '410px' }, display: { xs: 'none', lg: 'block' } }} />
      </Box>
    </SectionContainer>
  );
};

export default PracticeInformationForm;
export { commonInputStyles, phoneInputStyles };
