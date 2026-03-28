import { useEffect, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { formatDate } from './utils';
import { InlineFieldRow, labelWidth } from './InlineField';
import { sectionTitleSx } from '../../constants/styles';

/**
 * Additional Information (and optionally Spouse Information).
 */
export default function AdditionalInformationSection({ patient, showSpouse = true, isEditMode = false, onPatientDataChange }) {
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

  return (
    <Box>
      <Typography variant="subtitle1" sx={sectionTitleSx}>
        Additional Information
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow 
          label="Referred By" 
          value={localPatientData?.referralSource}
          onChange={(e) => handleFieldChange('referralSource', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />
        {isEditMode ? (
          <InlineFieldRow 
            label="Last Visit Date" 
            value={localPatientData?.lastVisitDate ? localPatientData.lastVisitDate.split('T')[0] : ''}
            onChange={(e) => handleFieldChange('lastVisitDate', e.target.value)}
            InputProps={{ readOnly: !isEditMode }}
            type="date"
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
              onChange={(e) => handleFieldChange('spouseInfo', { ...localPatientData?.spouseInfo, email: e.target.value })}
              InputProps={{ readOnly: !isEditMode }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
