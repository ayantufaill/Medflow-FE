import React from 'react';
import { Grid, TextField, FormControl, Select, MenuItem } from '@mui/material';
import { Controller } from 'react-hook-form';
import { Label, inputProps, selectProps, SPECIALTIES } from './Shared';

const ProfessionalLicensing = ({ register, control, errors }) => {
  return (
    <Grid container spacing={2.5}>
      <Grid size={4}>
        <Label>Organization Name</Label>
        <TextField fullWidth placeholder="Enter your Organization Name" 
          {...register('organizationName')} 
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label required>License Number</Label>
        <TextField fullWidth placeholder="Enter License Number"
          {...register('licenseNumber', { required: 'Required' })}
          error={!!errors.licenseNumber} helperText={errors.licenseNumber?.message}
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label required>Federal Tax Number</Label>
        <TextField fullWidth placeholder="Enter Federal Tax Number"
          {...register('federalTaxNumber', { required: 'Required' })}
          error={!!errors.federalTaxNumber} helperText={errors.federalTaxNumber?.message}
          InputProps={inputProps}
        />
      </Grid>

      <Grid size={4}>
        <Label required>NPI</Label>
        <TextField fullWidth placeholder="Enter NPI"
          {...register('npiNumber', { required: 'Required' })}
          error={!!errors.npiNumber} helperText={errors.npiNumber?.message}
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label>DEA</Label>
        <TextField fullWidth placeholder="Enter DEA" 
          {...register('dea')} 
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label>Speciality</Label>
        <Controller name="specialty" control={control} render={({ field }) => (
          <FormControl fullWidth>
            <Select {...field} displayEmpty {...selectProps}>
              <MenuItem value=""><em>Select Speciality</em></MenuItem>
              {SPECIALTIES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        )} />
      </Grid>
    </Grid>
  );
};
export default ProfessionalLicensing;
