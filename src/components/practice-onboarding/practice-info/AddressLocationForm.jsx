import React from 'react';
import { Grid, TextField, FormControl, Select, MenuItem, Box, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SectionContainer from './SectionContainer';
import FormInputLabel from './FormInputLabel';
import { commonInputStyles } from './PracticeInformationForm';

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", 
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", 
  "VA", "WA", "WV", "WI", "WY", "DC"
];

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "New Zealand", "Ireland", "Germany", 
  "France", "Spain", "Italy", "Netherlands", "Sweden", "Norway", "Denmark", "Switzerland", "Austria", 
  "Belgium", "Portugal", "Poland", "Japan", "South Korea", "China", "India", "Singapore", "Malaysia", 
  "Philippines", "United Arab Emirates", "Saudi Arabia", "South Africa", "Brazil", "Mexico", "Argentina"
];

const selectStyles = {
  ...commonInputStyles,
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    height: '100% !important',
    fontSize: '0.85rem',
  },
  '& .MuiSelect-icon': {
    color: '#9ca3af',
  }
};

const AddressLocationForm = ({ register, errors, control }) => {
  return (
    <SectionContainer title="Address & Location Details" icon={LocationOnOutlinedIcon}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 2.5 }}>
        <Box sx={{ width: { xs: '100%', lg: '409px' }, flexShrink: 1 }}>
          <FormInputLabel label="Country" />
          <Controller
            name="address.country"
            control={control}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                {...field}
                value={field.value || ""}
                sx={selectStyles}
                SelectProps={{
                  displayEmpty: true,
                  IconComponent: KeyboardArrowDownIcon
                }}
              >
                <MenuItem value="" disabled sx={{ display: 'none' }}>Enter your Country</MenuItem>
                {COUNTRIES.map((c) => (
                  <MenuItem key={c} value={c} sx={{ fontSize: '0.85rem' }}>{c}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '370px' }, flexShrink: 1 }}>
          <FormInputLabel label="City" required />
          <TextField
            fullWidth
            placeholder="Enter your City"
            {...register("address.city", { required: "City is required" })}
            error={!!errors.address?.city}
            helperText={errors.address?.city?.message}
            sx={commonInputStyles}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '410px' }, flexShrink: 1 }}>
          <FormInputLabel label="State/Province" required />
          <Controller
            name="address.state"
            control={control}
            rules={{ required: "State is required" }}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                {...field}
                value={field.value || ""}
                error={!!errors.address?.state}
                helperText={errors.address?.state?.message}
                sx={selectStyles}
                SelectProps={{
                  displayEmpty: true,
                  IconComponent: KeyboardArrowDownIcon
                }}
              >
                <MenuItem value="" disabled sx={{ display: 'none' }}>Enter State/Province</MenuItem>
                {US_STATES.map((s) => (
                  <MenuItem key={s} value={s} sx={{ fontSize: '0.85rem' }}>{s}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '409px' }, flexShrink: 1 }}>
          <FormInputLabel label="Street" />
          <TextField
            fullWidth
            placeholder="Enter your Address"
            {...register("address.street")}
            error={!!errors.address?.street}
            helperText={errors.address?.street?.message}
            sx={commonInputStyles}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '370px' }, flexShrink: 1 }}>
          <FormInputLabel label="Zip/Postal Code" />
          <TextField
            fullWidth
            placeholder="Enter Zip/Postal Code"
            {...register("address.postalCode")}
            error={!!errors.address?.postalCode}
            helperText={errors.address?.postalCode?.message}
            sx={commonInputStyles}
            InputProps={{
              endAdornment: (
                <Box sx={{ color: '#9ca3af', display: 'flex', alignItems: 'center', mr: -0.5 }}>
                  <KeyboardArrowDownIcon fontSize="small" />
                </Box>
              )
            }}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '410px' }, flexShrink: 1 }}>
          <FormInputLabel label="Time Zone" />
          <FormControl fullWidth error={!!errors.timezone}>
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Enter your Address"
                  sx={commonInputStyles}
                />
              )}
            />
            {errors.timezone && (
              <Typography color="error" sx={{ fontSize: '0.75rem', mt: 0.5, mx: 1.5 }}>
                {errors.timezone.message}
              </Typography>
            )}
          </FormControl>
        </Box>

      </Box>
    </SectionContainer>
  );
};

export default AddressLocationForm;
