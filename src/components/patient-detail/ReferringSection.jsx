import { useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { InlineFieldRow, standardFieldSx } from './InlineField';
import { formatDate } from './utils';

export default function ReferringSection({ patient, isEditMode = false, onPatientDataChange }) {
  const [localPatientData, setLocalPatientData] = useState(patient || {});

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

  const stripPatientId = (name) => {
    return name ? name.replace(/\s*\(PAT\d+\)/, '').trim() : name;
  };

  return (
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
  );
}
