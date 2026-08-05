import React from 'react';
import { Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Divider } from '@mui/material';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const PatientProfileForm = ({ register, control, PATIENT_TITLES, GENDERS, MARITAL_STATUSES, CONTACT_METHODS, PROFILE_TYPES }) => {
  return (
    <>
      {/* 4. Demographics */}
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Demographics</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Title</InputLabel>
            <Select label="Title" defaultValue="" {...register('patientTitle')}>
              <MenuItem value=""><em>None</em></MenuItem>
              {PATIENT_TITLES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Middle Initial" fullWidth size="small"
            inputProps={{ maxLength: 1 }} {...register('middleInitial')} />
        </Grid>
        <Grid size={12}>
          <TextField label="Preferred Name" fullWidth size="small" {...register('preferredName')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller name="dateOfBirth" control={control} render={({ field }) => (
            <DatePicker label="Date of Birth" value={field.value} onChange={field.onChange}
              disableFuture slotProps={{ textField: { size: 'small', fullWidth: true } }} />
          )} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Gender</InputLabel>
            <Select label="Gender" defaultValue="" {...register('gender')}>
              <MenuItem value=""><em>Prefer not to say</em></MenuItem>
              {GENDERS.map((g) => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Sex at Birth</InputLabel>
            <Select label="Sex at Birth" defaultValue="" {...register('sexAtBirth')}>
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="intersex">Intersex</MenuItem>
              <MenuItem value="non_binary">Non-binary</MenuItem>
              <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Gender Identity</InputLabel>
            <Select label="Gender Identity" defaultValue="" {...register('genderIdentity')}>
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="male">Male / Man</MenuItem>
              <MenuItem value="female">Female / Woman</MenuItem>
              <MenuItem value="non_binary">Non-binary</MenuItem>
              <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Marital Status</InputLabel>
            <Select label="Marital Status" defaultValue="" {...register('maritalStatus')}>
              <MenuItem value=""><em>None</em></MenuItem>
              {MARITAL_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="SSN" fullWidth size="small" placeholder="XXX-XX-XXXX" {...register('ssn')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Occupation" fullWidth size="small" {...register('occupation')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Employer" fullWidth size="small" {...register('employer')} />
        </Grid>
      </Grid>

      {/* 5. Contact */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Contact</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Mobile Phone" fullWidth size="small" placeholder="+1 (555) 000-0000" {...register('mobilePhone')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Home Phone" fullWidth size="small" {...register('homePhone')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Work Phone" fullWidth size="small" {...register('workPhone')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Preferred Contact Method</InputLabel>
            <Select label="Preferred Contact Method" defaultValue="" {...register('preferredContactMethod')}>
              <MenuItem value=""><em>None</em></MenuItem>
              {CONTACT_METHODS.map((m) => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* 6. Address */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Address</Typography>
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField label="Address Line 1" fullWidth size="small" {...register('address')} />
        </Grid>
        <Grid size={12}>
          <TextField label="Address Line 2" fullWidth size="small" {...register('address2')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="City" fullWidth size="small" {...register('city')} />
        </Grid>
        <Grid size={{ xs: 6, sm: 6 }}>
          <TextField label="State" fullWidth size="small" {...register('state')} />
        </Grid>
        <Grid size={{ xs: 6, sm: 6 }}>
          <TextField label="ZIP" fullWidth size="small" {...register('zip')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Country" fullWidth size="small" {...register('country')} />
        </Grid>
        <Grid size={12}>
          <Typography variant="caption" color="text.secondary">Work Address (optional)</Typography>
        </Grid>
        <Grid size={12}>
          <TextField label="Work Line 1" fullWidth size="small" {...register('workAddress.line1')} />
        </Grid>
        <Grid size={12}>
          <TextField label="Work Line 2" fullWidth size="small" {...register('workAddress.line2')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Work City" fullWidth size="small" {...register('workAddress.city')} />
        </Grid>
        <Grid size={{ xs: 6, sm: 6 }}>
          <TextField label="Work State" fullWidth size="small" {...register('workAddress.state')} />
        </Grid>
        <Grid size={{ xs: 6, sm: 6 }}>
          <TextField label="Postal Code" fullWidth size="small" {...register('workAddress.postalCode')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Work Country" fullWidth size="small" {...register('workAddress.country')} />
        </Grid>
      </Grid>

      {/* 7. Clinical / Admin */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Clinical / Admin</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Chart Number" fullWidth size="small" {...register('chartNumber')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Medicaid ID" fullWidth size="small" {...register('medicaidId')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Preferred Dentist ID" fullWidth size="small" {...register('preferredDentistId')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Preferred Hygienist ID" fullWidth size="small" {...register('preferredHygienistId')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Referral Source" fullWidth size="small" {...register('referralSource')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Patient Profile Type</InputLabel>
            <Select label="Patient Profile Type" defaultValue="" {...register('patientProfileType')}>
              <MenuItem value=""><em>None</em></MenuItem>
              {PROFILE_TYPES.map((t) => (
                <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12}>
          <TextField label="Patient Flags" fullWidth size="small"
            placeholder="e.g. VIP, Allergy, Special needs"
            helperText="Comma-separated"
            {...register('patientFlags')} />
        </Grid>
        <Grid size={12}>
          <Controller name="portalAccessEnabled" control={control} render={({ field }) => (
            <FormControlLabel
              label={<Typography variant="body2">Portal access enabled</Typography>}
              control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} size="small" />}
            />
          )} />
        </Grid>
        <Grid size={12}>
          <Typography variant="caption" color="text.secondary">Emergency Contact (optional)</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="Name" fullWidth size="small" {...register('emergencyContact.name')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="Relationship" fullWidth size="small" {...register('emergencyContact.relationship')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="Phone" fullWidth size="small" {...register('emergencyContact.phone')} />
        </Grid>
      </Grid>
    </>
  );
};

export default PatientProfileForm;
