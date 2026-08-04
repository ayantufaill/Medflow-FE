import React from 'react';
import { Grid, TextField, FormControl, Select, MenuItem, Box, Switch, Typography, Tooltip } from '@mui/material';
import { Controller } from 'react-hook-form';
import InfoIcon from '@mui/icons-material/Info';
import SectionContainer from './SectionContainer';
import AddressLocationDetails from './AddressLocationDetails';
import { Label, PhoneInput, inputProps, selectProps, SPECIALTIES } from './Shared';

import personalInfoIcon from '../../../assets/usermanagement icons/personalinformation.svg';
import addressIcon from '../../../assets/usermanagement icons/address.svg';
import licensingIcon from '../../../assets/usermanagement icons/licensing.svg';

const LabProviderForm = ({ register, control, errors }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* ── Lab Details ── */}
      <SectionContainer title="Lab Details" icon={personalInfoIcon}>
        <Grid container spacing={2.5}>
          <Grid size={4}>
            <Label required>Lab Name</Label>
            <TextField fullWidth placeholder="Enter Lab Name"
              {...register('labName', { required: 'Required' })}
              error={!!errors.labName} helperText={errors.labName?.message}
              InputProps={inputProps}
            />
          </Grid>
          <Grid size={4}>
            <Label>Due Date in Days</Label>
            <TextField fullWidth type="number" placeholder="Enter Due Date in Days"
              inputProps={{ min: 0 }}
              {...register('dueDateInDays')}
              InputProps={inputProps}
            />
          </Grid>
          <Grid size={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <Label sx={{ mb: 0 }}>In-house Lab Provider</Label>
              <Tooltip title="Mark this provider as an in-house lab">
                <InfoIcon sx={{ fontSize: 14, color: 'text.disabled', cursor: 'help' }} />
              </Tooltip>
            </Box>
            <Controller name="inHouseLabProvider" control={control} render={({ field }) => (
              <Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} size="small" />
            )} />
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

export default LabProviderForm;
