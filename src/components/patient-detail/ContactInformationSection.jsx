import { useEffect, useState } from 'react';
import { Box, Typography, MenuItem, Autocomplete, TextField } from '@mui/material';
import {
  HomeOutlined as HomeOutlinedIcon,
  AccountBalanceOutlined as WorkAddressIcon,
} from '@mui/icons-material';
import { InlineFieldRow, AddressSectionLabel } from './InlineField';
import PhoneField from './PhoneField';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius, standardFieldSx, roundedSelectMenuProps, roundedAutocompletePaperSx } from '../../constants/styles';
import { patientValidations } from '../../validations/patientValidations';
import { US_STATES, STATE_CITIES } from '../../constants/usAddressData';

const MARITAL_STATUS_OPTIONS = [
  { label: 'Single', value: 'single' },
  { label: 'Married', value: 'married' },
  { label: 'Widowed', value: 'widowed' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Under 18', value: 'under_18' },
  { label: 'Prefer not to answer', value: 'prefer_not_to_answer' }
];



export default function ContactInformationSection({ patient, isEditMode = false, onPatientDataChange }) {
  const [localPatientData, setLocalPatientData] = useState(patient || {});
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (patient) {
      setLocalPatientData(patient);
    }
  }, [patient]);

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localPatientData, [field]: value };
    setLocalPatientData(updatedData);
    if (onPatientDataChange) {
      onPatientDataChange(updatedData);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    handleFieldChange('email', value);

    if (isEditMode) {
      if (!value) {
        setEmailError('');
        return;
      }
      const validationResult = patientValidations.email.validate(value, localPatientData);
      if (validationResult !== true && validationResult !== 'Either phone number or email is required') {
        setEmailError(validationResult);
      } else {
        setEmailError('');
      }
    }
  };

  const addr = localPatientData?.address;

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <PhoneField
          label="Mobile Number"
          value={localPatientData?.phonePrimary}
          isEditMode={isEditMode}
          onChange={(e) => handleFieldChange('phonePrimary', e.target.value)}
          required={isEditMode}
        />
        <PhoneField
          label="Home Phone Number"
          value={localPatientData?.phoneSecondary}
          isEditMode={isEditMode}
          onChange={(e) => handleFieldChange('phoneSecondary', e.target.value)}
        />

        <AddressSectionLabel icon={HomeOutlinedIcon}>Patient&apos;s Address</AddressSectionLabel>


        <InlineFieldRow
          label="Country"
          value={addr?.country || 'United States'}
          input={isEditMode ? (
            <TextField select SelectProps={{ MenuProps: roundedSelectMenuProps }} variant="outlined" size="small" fullWidth value={addr?.country || 'United States'} onChange={(e) => handleFieldChange('address', { ...addr, country: e.target.value })} sx={standardFieldSx}>
              <MenuItem value="United States">United States</MenuItem>
            </TextField>
          ) : undefined}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="State"
          value={addr?.state}
          input={isEditMode ? (
            <TextField select SelectProps={{ MenuProps: roundedSelectMenuProps }} variant="outlined" size="small" fullWidth value={addr?.state || ''} onChange={(e) => handleFieldChange('address', { ...addr, state: e.target.value, city: '' })} sx={standardFieldSx}>
              <MenuItem value="">Select state</MenuItem>
              {US_STATES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
            </TextField>
          ) : undefined}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="City"
          value={addr?.city}
          input={isEditMode ? (
            <Autocomplete
              options={STATE_CITIES[addr?.state] || []}
              value={addr?.city || ''}
              onChange={(_, newVal) => handleFieldChange('address', { ...addr, city: newVal || '' })}
              onInputChange={(_, newInputValue) => handleFieldChange('address', { ...addr, city: newInputValue || '' })}
              disabled={!addr?.state}
              freeSolo
              slotProps={{ paper: { sx: roundedAutocompletePaperSx } }}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" size="small" fullWidth placeholder={addr?.state ? "City" : "Select state first"} sx={standardFieldSx} />
              )}
            />
          ) : undefined}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Address Line 1"
          value={addr?.line1}
          placeholder="Address line 1"
          onChange={(e) => handleFieldChange('address', { ...addr, line1: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Address Line 2"
          value={addr?.line2}
          placeholder="Address line 2"
          onChange={(e) => handleFieldChange('address', { ...addr, line2: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Zip/Postal Code"
          value={addr?.postalCode}
          placeholder="Zip/Postal Code"
          onChange={(e) => handleFieldChange('address', { ...addr, postalCode: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />

        <InlineFieldRow
          label="Email Address"
          value={localPatientData?.email}
          placeholder="email@example.com"
          onChange={handleEmailChange}
          InputProps={{ readOnly: !isEditMode }}
          error={!!emailError}
          helperText={emailError}
        />
        <InlineFieldRow
          label="Marital Status"
          value={MARITAL_STATUS_OPTIONS.find(o => o.value === (localPatientData?.maritalStatus || 'single').toLowerCase())?.label || localPatientData?.maritalStatus || 'Single'}
          input={isEditMode ? (
            <TextField
              select
              SelectProps={{ MenuProps: roundedSelectMenuProps }}
              variant="outlined"
              size="small"
              fullWidth
              value={(localPatientData?.maritalStatus || 'single').toLowerCase()}
              onChange={(e) => handleFieldChange('maritalStatus', e.target.value)}
              sx={standardFieldSx}
            >
              {MARITAL_STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          ) : undefined}
          InputProps={{ readOnly: !isEditMode }}
        />

      </Box>
    </Box>
  );
}
