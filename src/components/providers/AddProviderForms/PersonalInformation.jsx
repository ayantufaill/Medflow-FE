import React from 'react';
import { Grid } from '@mui/material'; // Using standard Grid but sized with size={4} assuming Grid v2 was imported previously, but let's use Grid2 or Grid properly
// Wait, AddProviderDialog used `<Grid size={4}>` which means it's MUI v6 Grid or Grid v2. We'll just import Grid from '@mui/material'.
import { TextField } from '@mui/material';
import { Label, PhoneInput, inputProps } from './Shared';

const PersonalInformation = ({ register, control, errors }) => {
  return (
    <Grid container spacing={2.5}>
      <Grid size={4}>
        <Label required>First Name</Label>
        <TextField fullWidth placeholder="Enter First Name"
          {...register('firstName', { required: 'Required' })}
          error={!!errors.firstName} helperText={errors.firstName?.message}
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label>Middle Name</Label>
        <TextField fullWidth placeholder="Enter Middle Name" 
          {...register('middleName')} 
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label required>Last Name</Label>
        <TextField fullWidth placeholder="Enter Last Name"
          {...register('lastName', { required: 'Required' })}
          error={!!errors.lastName} helperText={errors.lastName?.message}
          InputProps={inputProps}
        />
      </Grid>

      <Grid size={4}>
        <Label required>Prefix(Dr,Mr...)</Label>
        <TextField fullWidth placeholder="Enter Prefix" 
          {...register('prefix')} 
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label>Suffix(DDS,...)</Label>
        <TextField fullWidth placeholder="Enter Suffix" 
          {...register('suffix')} 
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label>Preferred Name</Label>
        <TextField fullWidth placeholder="Enter Preferred Name" 
          {...register('preferredName')} 
          InputProps={inputProps}
        />
      </Grid>

      <Grid size={4}>
        <Label>Internal Code Name</Label>
        <TextField fullWidth placeholder="Enter internal Code" 
          {...register('internalCodeName')} 
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <PhoneInput label="Mobile Phone Number" required name="mobilePhone" control={control} />
      </Grid>
      <Grid size={4}>
        <Label required>Email</Label>
        <TextField fullWidth type="email" placeholder="Enter Your Email"
          {...register('email', { required: 'Required' })}
          error={!!errors.email} helperText={errors.email?.message}
          InputProps={inputProps}
        />
      </Grid>

      <Grid size={4}>
        <PhoneInput label="Home Phone Number" name="homePhone" control={control} />
      </Grid>
    </Grid>
  );
};
export default PersonalInformation;
