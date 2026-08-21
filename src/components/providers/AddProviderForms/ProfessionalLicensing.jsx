import React, { useEffect } from 'react';
import { Grid, TextField, FormControl, Select, MenuItem, Chip, Box } from '@mui/material';
import { Controller } from 'react-hook-form';
import { Label, inputProps, selectProps, SPECIALTIES } from './Shared';
import { useBranch } from '../../../hooks/redux';

const ProfessionalLicensing = ({ register, control, errors }) => {
  const { branches, fetchBranches: loadBranches } = useBranch();
  useEffect(() => {
    if (branches.length === 0) loadBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Grid size={4}>
        <Label>Branches</Label>
        <Controller name="branchIds" control={control} defaultValue={[]} render={({ field }) => (
          <FormControl fullWidth>
            <Select
              {...field}
              multiple
              displayEmpty
              value={field.value || []}
              renderValue={(selected) => selected.length === 0
                ? <em>Not assigned</em>
                : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => (
                      <Chip key={id} size="small" label={branches.find((b) => b.id === id)?.name || id} />
                    ))}
                  </Box>
                )}
              {...selectProps}
            >
              {branches.map((b) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
            </Select>
          </FormControl>
        )} />
      </Grid>
    </Grid>
  );
};
export default ProfessionalLicensing;
