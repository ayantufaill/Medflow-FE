import { useEffect, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { formatDate } from './utils';
import { InlineFieldRow, labelWidth, standardFieldSx } from './InlineField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { sectionTitleSx } from '../../constants/styles';
import { patientValidations } from '../../validations/patientValidations';

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
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow 
          label="Referred By" 
          value={stripPatientId(localPatientData?.customFields?.referringPatient) || localPatientData?.referralSource || ''}
          onChange={(e) => {
            // Update both to be safe, though normally you'd only update one depending on the UI paradigm
            handleFieldChange('referralSource', e.target.value);
            if (localPatientData?.customFields?.referringPatient) {
              handleFieldChange('customFields', { ...localPatientData.customFields, referringPatient: e.target.value });
            }
          }}
          InputProps={{ readOnly: !isEditMode }}
        />
        {isEditMode ? (
          <InlineFieldRow 
            label="Last Visit Date" 
            input={
              <DatePicker
                views={['year', 'month', 'day']}
                disableFuture
                value={localPatientData?.lastVisitDate ? dayjs(localPatientData.lastVisitDate) : null}
                onChange={(newValue) => {
                  handleFieldChange('lastVisitDate', newValue ? newValue.format('YYYY-MM-DD') : '');
                }}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: standardFieldSx,
                  }
                }}
              />
            }
          />
        ) : (
          <InlineFieldRow 
            label="Last Visit Date" 
            value={formatDate(localPatientData?.lastVisitDate)}
            InputProps={{ readOnly: true }}
          />
        )}
        <InlineFieldRow 
          label="Portal Access" 
          value={localPatientData?.portalAccessEnabled ? 'Yes' : 'No'}
          onChange={(e) => handleFieldChange('portalAccessEnabled', e.target.value === 'Yes')}
          InputProps={{ readOnly: !isEditMode }}
        />
      </Box>

      {showSpouse && (
        <>
          <Typography variant="subtitle1" sx={{ ...sectionTitleSx, mt: 2.5 }}>
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
    </Box>
  );
}
