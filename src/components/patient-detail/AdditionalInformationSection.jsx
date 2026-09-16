import { useEffect, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { formatDate } from './utils';
import { InlineFieldRow, labelWidth, standardFieldSx } from './InlineField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { sectionTitleSx, roundedAutocompletePaperSx } from '../../constants/styles';
import { patientValidations } from '../../validations/patientValidations';
import { US_STATES, STATE_CITIES } from '../../constants/usAddressData';
import WorkAddressIcon from '@mui/icons-material/Business';
import { AddressSectionLabel } from './InlineField';
import { Autocomplete, MenuItem } from '@mui/material';

/**
 * Additional Information (and optionally Spouse Information).
 */
export default function AdditionalInformationSection({ patient, showSpouse = true, isEditMode = false, onPatientDataChange }) {
  const [localPatientData, setLocalPatientData] = useState(patient || {});
  const [spouseEmailError, setSpouseEmailError] = useState('');

  useEffect(() => {
    if (patient) {
      setLocalPatientData(patient);
    }
  }, [patient]);

  const handleFieldChange = (field, value) => {
    // Convert date strings to ISO format for consistency
    let processedValue = value;
    if ((field === 'dateOfBirth' || field === 'lastVisitDate') && value) {
      try {
        // HTML5 date input returns YYYY-MM-DD, convert to ISO datetime at noon UTC
        const [year, month, day] = value.split('-');
        const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0));
        if (!isNaN(date.getTime())) {
          processedValue = date.toISOString();
        }
      } catch (error) {
        console.error('Date conversion error:', error);
        processedValue = value; // Keep original if conversion fails
      }
    }

    const updatedData = { ...localPatientData, [field]: processedValue };
    setLocalPatientData(updatedData);
    if (onPatientDataChange) {
      onPatientDataChange(updatedData);
    }
  };

  const handleSpouseEmailChange = (e) => {
    const value = e.target.value;
    handleFieldChange('spouseInfo', { ...localPatientData?.spouseInfo, email: value });

    if (isEditMode) {
      if (!value) {
        setSpouseEmailError('');
        return;
      }
      const validationResult = patientValidations.email.validate(value, localPatientData);
      if (validationResult !== true && validationResult !== 'Either phone number or email is required') {
        setSpouseEmailError(validationResult);
      } else {
        setSpouseEmailError('');
      }
    }
  };

  const stripPatientId = (name) => {
    return name ? name.replace(/\s*\(PAT\d+\)/, '').trim() : name;
  };

  return (
    <Box>
      {showSpouse && (
        <>
          <Typography variant="subtitle1" sx={{ ...sectionTitleSx, mt: 0, mb: 1 }}>
            Spouse Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <InlineFieldRow
              label="Spouse Name"
              value={localPatientData?.spouseInfo?.name || ''}
              onChange={(e) => handleFieldChange('spouseInfo', { ...localPatientData?.spouseInfo, name: e.target.value })}
              InputProps={{ readOnly: !isEditMode }}
            />
            <InlineFieldRow
              label="Spouse Phone"
              value={localPatientData?.spouseInfo?.phone || ''}
              onChange={(e) => handleFieldChange('spouseInfo', { ...localPatientData?.spouseInfo, phone: e.target.value })}
              InputProps={{ readOnly: !isEditMode }}
            />
            <InlineFieldRow
              label="Email Address"
              value={localPatientData?.spouseInfo?.email || ''}
              onChange={handleSpouseEmailChange}
              InputProps={{ readOnly: !isEditMode }}
              error={!!spouseEmailError}
              helperText={spouseEmailError}
            />
          </Box>
        </>
      )}
      
      <Typography variant="subtitle1" sx={{ ...sectionTitleSx, mt: showSpouse ? 3 : 0, mb: 1 }}>
        Additional Information
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow
          label="Occupation"
          value={localPatientData?.occupation}
          placeholder="Occupation"
          onChange={(e) => handleFieldChange('occupation', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Patient's / Guardian's Employer"
          value={localPatientData?.employer ?? localPatientData?.guardianEmployer}
          placeholder="Employer"
          onChange={(e) => handleFieldChange('employer', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />

        <AddressSectionLabel icon={WorkAddressIcon}>Work Address</AddressSectionLabel>
        <InlineFieldRow
          label="Country"
          value={localPatientData?.workAddress?.country || 'United States'}
          input={isEditMode ? (
            <TextField select variant="outlined" size="small" fullWidth value={localPatientData?.workAddress?.country || 'United States'} onChange={(e) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, country: e.target.value })} sx={standardFieldSx}>
              <MenuItem value="United States">United States</MenuItem>
            </TextField>
          ) : undefined}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="State"
          value={localPatientData?.workAddress?.state}
          input={isEditMode ? (
            <TextField select variant="outlined" size="small" fullWidth value={localPatientData?.workAddress?.state || ''} onChange={(e) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, state: e.target.value, city: '' })} sx={standardFieldSx}>
              <MenuItem value="">Select state</MenuItem>
              {US_STATES.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
            </TextField>
          ) : undefined}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="City"
          value={localPatientData?.workAddress?.city}
          input={isEditMode ? (
            <Autocomplete
              options={STATE_CITIES[localPatientData?.workAddress?.state] || []}
              value={localPatientData?.workAddress?.city || ''}
              onChange={(_, newVal) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, city: newVal || '' })}
              onInputChange={(_, newInputValue) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, city: newInputValue || '' })}
              disabled={!localPatientData?.workAddress?.state}
              freeSolo
              slotProps={{ paper: { sx: roundedAutocompletePaperSx } }}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" size="small" fullWidth placeholder={localPatientData?.workAddress?.state ? "City" : "Select state first"} sx={standardFieldSx} />
              )}
            />
          ) : undefined}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Address Line 1"
          value={localPatientData?.workAddress?.line1}
          placeholder="Address line 1"
          onChange={(e) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, line1: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Address Line 2"
          value={localPatientData?.workAddress?.line2}
          placeholder="Address line 2"
          onChange={(e) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, line2: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Zip/Postal Code"
          value={localPatientData?.workAddress?.postalCode}
          placeholder="Zip/Postal Code"
          onChange={(e) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, postalCode: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
      </Box>
    </Box>
  );
}
