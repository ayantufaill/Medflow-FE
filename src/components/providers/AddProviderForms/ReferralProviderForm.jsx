import React from 'react';
import { Grid, TextField, FormControl, Select, MenuItem, Box } from '@mui/material';
import { Controller } from 'react-hook-form';
import SectionContainer from './SectionContainer';
import AddressLocationDetails from './AddressLocationDetails';
import { Label, PhoneInput, inputProps, selectProps, SPECIALTIES } from './Shared';

import personalInfoIcon from '../../../assets/usermanagement icons/personalinformation.svg';
import addressIcon from '../../../assets/usermanagement icons/address.svg';
import licensingIcon from '../../../assets/usermanagement icons/licensing.svg';

const ReferralProviderForm = ({ register, control, errors }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* ── Personal Information ── */}
      <SectionContainer title="Personal Information" icon={personalInfoIcon}>
        <Grid container spacing={2.5}>
          <Grid size={3}>
            <Label required>First Name</Label>
            <TextField fullWidth placeholder="Enter First Name"
              {...register('firstName', { required: 'Required' })}
              error={!!errors.firstName} helperText={errors.firstName?.message}
              InputProps={inputProps}
            />
          </Grid>
          <Grid size={3}>
            <Label required>Last Name</Label>
            <TextField fullWidth placeholder="Enter Last Name"
              {...register('lastName', { required: 'Required' })}
              error={!!errors.lastName} helperText={errors.lastName?.message}
              InputProps={inputProps}
            />
          </Grid>
          <Grid size={3}>
            <Label required>Prefix (Dr, Mr...)</Label>
            <TextField fullWidth placeholder="Enter Title"
              {...register('prefix', { required: 'Required' })}
              error={!!errors.prefix} helperText={errors.prefix?.message}
              InputProps={inputProps}
            />
          </Grid>
          <Grid size={3}>
            <Label>Suffix (DDs...)</Label>
            <TextField fullWidth placeholder="Enter Suffix" 
              {...register('suffix')} 
              InputProps={inputProps}
            />
          </Grid>
        </Grid>
      </SectionContainer>

      {/* ── Contact Information ── */}
      <SectionContainer title="Contact Information" icon={personalInfoIcon}>
        <Grid container spacing={2.5}>
          <Grid size={4}>
            <PhoneInput label="Office Phone Number" required name="officePhone" control={control} />
          </Grid>
          <Grid size={4}>
            <PhoneInput label="Mobile Phone Number" required name="mobilePhone" control={control} />
          </Grid>
          <Grid size={4}>
            <Label required>Email</Label>
            <TextField fullWidth type="email" placeholder="Enter Email"
              {...register('email', { required: 'Required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })}
              error={!!errors.email} helperText={errors.email?.message}
              InputProps={inputProps}
            />
          </Grid>
          <Grid size={4}>
            <PhoneInput label="Fax Number" name="faxNumber" control={control} />
          </Grid>
        </Grid>
      </SectionContainer>

      {/* ── Professional Details ── */}
      <SectionContainer title="Professional Details" icon={licensingIcon}>
        <Grid container spacing={2.5}>
          <Grid size={4}>
            <Label>Specialty</Label>
            <Controller name="specialty" control={control} render={({ field }) => (
              <FormControl fullWidth>
                <Select {...field} displayEmpty {...selectProps}>
                  <MenuItem value=""><em>&nbsp;</em></MenuItem>
                  {SPECIALTIES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            )} />
          </Grid>
        </Grid>
      </SectionContainer>

      {/* ── Address & Location ── */}
      <SectionContainer title="Address & Location Details" icon={addressIcon}>
        <AddressLocationDetails register={register} control={control} errors={errors} />
      </SectionContainer>

      {/* ── Additional Information ── */}
      <SectionContainer title="Additional Information" icon={licensingIcon}>
        <Grid container spacing={2.5}>
          <Grid size={12}>
            <Label>Description</Label>
            <TextField fullWidth multiline rows={3}
              placeholder="Enter Description" {...register('description')} 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
            />
          </Grid>
        </Grid>
      </SectionContainer>
    </Box>
  );
};

export default ReferralProviderForm;
