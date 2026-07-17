import React from 'react';
import { Grid, TextField, FormControlLabel, RadioGroup, Radio, Checkbox, Typography, Box } from '@mui/material';
import { Controller } from 'react-hook-form';
import { Label, inputProps } from './Shared';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TypeOption = ({ value, label, selected }) => (
  <FormControlLabel 
    value={value} 
    control={<Radio size="small" />} 
    label={<Typography sx={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', lineHeight: '16px', letterSpacing: '0px', color: selected ? '#1976d2' : '#4b5563' }}>{label}</Typography>} 
    sx={{ 
      margin: 0,
      pr: 2,
      pl: 1,
      py: 0.5,
      border: `1px solid ${selected ? '#1976d2' : '#E5E7EB'}`,
      borderRadius: '8px',
      backgroundColor: selected ? '#f0f7ff' : '#fff',
      flex: 1,
    }}
  />
);

const ProviderTypeTaxDetail = ({ register, control, errors }) => {
  return (
    <Grid container spacing={2.5}>
      <Grid size={4}>
        <Label required>Additional Provider Id</Label>
        <TextField fullWidth placeholder="Enter Provider Id"
          {...register('additionalProviderId', { required: 'Required' })}
          error={!!errors.additionalProviderId} helperText={errors.additionalProviderId?.message}
          InputProps={inputProps}
        />
      </Grid>
      <Grid size={4}>
        <Label required>Tax Id Type</Label>
        <TextField fullWidth placeholder="Enter Tax Id Type"
          {...register('taxIdType', { required: 'Required' })}
          error={!!errors.taxIdType} helperText={errors.taxIdType?.message}
          InputProps={inputProps}
        />
      </Grid>
      
      <Grid size={4} sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 3, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
        <Controller name="defaultDentist" control={control} render={({ field }) => (
          <FormControlLabel
            control={<Checkbox icon={<RadioButtonUncheckedIcon sx={{ color: '#1976d2' }} />} checkedIcon={<CheckCircleIcon />} size="small" checked={!!field.value} onChange={field.onChange} />}
            label={<Typography sx={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', lineHeight: '16px', letterSpacing: '0px', color: '#111', whiteSpace: 'nowrap' }}>Default Doctor</Typography>}
          />
        )} />
        <Controller name="defaultHygienist" control={control} render={({ field }) => (
          <FormControlLabel
            control={<Checkbox icon={<RadioButtonUncheckedIcon sx={{ color: '#1976d2' }} />} checkedIcon={<CheckCircleIcon />} size="small" checked={!!field.value} onChange={field.onChange} />}
            label={<Typography sx={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', lineHeight: '16px', letterSpacing: '0px', color: '#111', whiteSpace: 'nowrap' }}>Default Hygienist</Typography>}
          />
        )} />
      </Grid>

      <Grid size={12}>
        <Label sx={{ textTransform: 'uppercase', fontSize: '0.7rem', color: '#6b7280', mb: 1 }}>Type</Label>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Controller name="providerType" control={control} render={({ field }) => (
            <RadioGroup row {...field} sx={{ display: 'flex', gap: 2 }}>
              <TypeOption value="Dentist" label="Dentist" selected={field.value === 'Dentist'} />
              <TypeOption value="Hygienist" label="Hygienist" selected={field.value === 'Hygienist'} />
              <TypeOption value="Assistant/Other" label="Assistant/Other" selected={field.value === 'Assistant/Other'} />
            </RadioGroup>
          )} />
          <Controller name="signatureOnFile" control={control} render={({ field }) => (
            <FormControlLabel
              control={<Checkbox size="small" sx={{ borderRadius: '4px' }} checked={!!field.value} onChange={field.onChange} />}
              label={<Typography sx={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', lineHeight: '16px', letterSpacing: '0px', color: '#4b5563' }}>Signature on File</Typography>}
              sx={{ ml: 2 }}
            />
          )} />
        </Box>
      </Grid>
    </Grid>
  );
};
export default ProviderTypeTaxDetail;
