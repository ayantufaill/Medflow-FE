import React from 'react';
import { Grid, TextField, FormControl, Select, MenuItem } from '@mui/material';
import { Controller } from 'react-hook-form';
import { Label, inputProps, selectProps, US_STATES } from './Shared';

const AddressLocationDetails = ({ register, control, errors }) => {
  return (
    <Grid container spacing={2.5}>
      <Grid size={4}>
        <Label required>Country</Label>
        <Controller name="country" control={control} render={({ field }) => (
          <FormControl fullWidth>
            <Select {...field} {...selectProps}>
              <MenuItem value="United States">United States</MenuItem>
              <MenuItem value="Canada">Canada</MenuItem>
              <MenuItem value="Mexico">Mexico</MenuItem>
            </Select>
          </FormControl>
        )} />
      </Grid>
      <Grid size={4}>
        <Label required>City</Label>
        <TextField fullWidth placeholder="Enter your City"
          {...register('city', { required: 'Required' })}
          error={!!errors.city} helperText={errors.city?.message}
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label required>State/Province</Label>
        <Controller name="state" control={control} rules={{ required: 'Required' }} render={({ field }) => (
          <FormControl fullWidth error={!!errors.state}>
            <Select {...field} displayEmpty {...selectProps}>
              <MenuItem value=""><em>Select State</em></MenuItem>
              {US_STATES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        )} />
      </Grid>
      
      <Grid size={4}>
        <Label required>Address Line 1</Label>
        <TextField fullWidth placeholder="Enter your Address"
          {...register('addressLine1', { required: 'Required' })}
          error={!!errors.addressLine1} helperText={errors.addressLine1?.message}
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label>Address Line 2</Label>
        <TextField fullWidth placeholder="Enter your Address" 
          {...register('addressLine2')} 
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label required>Zip/Postal Code</Label>
        <TextField fullWidth placeholder="Enter Zip/Postal Code"
          {...register('zipCode', { required: 'Required' })}
          error={!!errors.zipCode} helperText={errors.zipCode?.message}
          InputProps={inputProps}
        />
      </Grid>
    </Grid>
  );
};
export default AddressLocationDetails;
