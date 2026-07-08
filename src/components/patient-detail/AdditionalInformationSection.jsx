import { useEffect, useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { formatDate } from './utils';
import { StackedFieldRow } from './InlineField';

export default function AdditionalInformationSection({ patient, isEditMode = false, onPatientDataChange }) {
  const [localPatientData, setLocalPatientData] = useState(patient || {});

  useEffect(() => {
    if (patient) {
      setLocalPatientData(patient);
    }
  }, [patient]);

  const handleFieldChange = (field, value) => {
    let processedValue = value;
    if ((field === 'dateOfBirth' || field === 'lastVisitDate') && value) {
      try {
        const [year, month, day] = value.split('-');
        const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0));
        if (!isNaN(date.getTime())) {
          processedValue = date.toISOString();
        }
      } catch (error) {
        console.error('Date conversion error:', error);
        processedValue = value;
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <StackedFieldRow 
        label="Referred By" 
        value={stripPatientId(localPatientData?.customFields?.referringPatient) || localPatientData?.referralSource || ''}
        isEditMode={isEditMode}
        onChange={(e) => {
          handleFieldChange('referralSource', e.target.value);
          const currentCustomFields = localPatientData?.customFields || {};
          handleFieldChange('customFields', { ...currentCustomFields, referringPatient: e.target.value });
        }}
      />
      {isEditMode ? (
        <StackedFieldRow 
          label="Last Visit Date" 
          value={localPatientData?.lastVisitDate ? localPatientData.lastVisitDate.split('T')[0] : ''}
          onChange={(e) => handleFieldChange('lastVisitDate', e.target.value)}
          isEditMode={isEditMode}
          type="date"
        />
      ) : (
        <StackedFieldRow 
          label="Last Visit Date" 
          value={formatDate(localPatientData?.lastVisitDate) || '—'}
          isEditMode={isEditMode}
        />
      )}
      <StackedFieldRow 
        label="Portal Access" 
        isEditMode={isEditMode}
        input={
          <TextField
            select
            variant="outlined"
            fullWidth
            value={localPatientData?.portalAccessEnabled ? 'Yes' : 'No'}
            onChange={(e) => handleFieldChange('portalAccessEnabled', e.target.value === 'Yes')}
            slotProps={{
              input: {
                readOnly: !isEditMode,
              }
            }}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 38,
                fontSize: '0.8rem',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                '& fieldset': {
                  borderColor: '#e2e8f0',
                },
                '&:hover fieldset': {
                  borderColor: '#cbd5e1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                },
              },
            }}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        }
      />
    </Box>
  );
}
