import React, { useMemo } from 'react';
import { Grid, TextField, FormControl, Select, MenuItem, Box, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SectionContainer from './SectionContainer';
import FormInputLabel from './FormInputLabel';
import { commonInputStyles } from './PracticeInformationForm';
import { US_STATES, STATE_CITIES } from '../../../constants/usAddressData';
import { TIME_ZONES, STATE_TIME_ZONES } from '../../../constants/timeZones';

const selectStyles = {
  ...commonInputStyles,
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    height: '100% !important',
    fontSize: '0.85rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .MuiSelect-icon': {
    color: '#9ca3af',
  }
};

const AddressLocationForm = ({ register, errors, control, watch, setValue }) => {
  const selectedState = watch('address.state');
  const availableCities = STATE_CITIES[selectedState] || [];

  const timeZoneOptions = useMemo(() => {
    const stateZones = selectedState ? STATE_TIME_ZONES[selectedState] || [] : TIME_ZONES.map((tz) => tz.value);
    return TIME_ZONES.filter((tz) => new Set([...stateZones, 'Asia/Karachi']).has(tz.value));
  }, [selectedState]);

  return (
    <SectionContainer title="Address & Location Details" icon={LocationOnOutlinedIcon}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 2.5 }}>
        <Box sx={{ width: { xs: '100%', lg: '389px' }, flexShrink: 1 }}>
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
                <MenuItem value="United States" sx={{ fontSize: '0.85rem' }}>United States</MenuItem>
              </TextField>
            )}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '389px' }, flexShrink: 1 }}>
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
                onChange={(e) => {
                  field.onChange(e);
                  setValue('address.city', "");
                }}
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
                  <MenuItem key={s.value} value={s.value} sx={{ fontSize: '0.85rem' }}>{s.label}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '389px' }, flexShrink: 1 }}>
          <FormInputLabel label="City" required />
          <Controller
            name="address.city"
            control={control}
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                {...field}
                value={field.value || ""}
                disabled={!selectedState}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors.address?.city}
                helperText={!selectedState ? "Please select a state first" : errors.address?.city?.message}
                sx={selectStyles}
                SelectProps={{
                  displayEmpty: true,
                  IconComponent: KeyboardArrowDownIcon
                }}
              >
                <MenuItem value="" disabled sx={{ display: 'none' }}>Enter your City</MenuItem>
                {availableCities.map((c) => (
                  <MenuItem key={c} value={c} sx={{ fontSize: '0.85rem' }}>{c}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '389px' }, flexShrink: 1 }}>
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

        <Box sx={{ width: { xs: '100%', lg: '389px' }, flexShrink: 1 }}>
          <FormInputLabel label="Zip/Postal Code" />
          <TextField
            fullWidth
            placeholder="Enter Zip/Postal Code"
            {...register("address.postalCode")}
            error={!!errors.address?.postalCode}
            helperText={errors.address?.postalCode?.message}
            sx={commonInputStyles}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '389px' }, flexShrink: 1 }}>
          <FormInputLabel label="Time Zone" />
          <Controller
            name="timezone"
            control={control}
            render={({ field }) => (
              <TextField
                select
                fullWidth
                {...field}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                error={!!errors.timezone}
                helperText={errors.timezone?.message}
                sx={selectStyles}
                SelectProps={{
                  displayEmpty: true,
                  IconComponent: KeyboardArrowDownIcon,
                  renderValue: (v) => {
                    const tz = TIME_ZONES.find((t) => t.value === v);
                    return (
                      <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tz ? tz.label : v}
                      </Box>
                    );
                  }
                }}
              >
                <MenuItem value="" disabled sx={{ display: 'none' }}>Select Time Zone</MenuItem>
                {timeZoneOptions.map((tz) => (
                  <MenuItem key={tz.value} value={tz.value} sx={{ fontSize: '0.85rem' }}>{tz.label}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

      </Box>
    </SectionContainer>
  );
};

export default AddressLocationForm;
