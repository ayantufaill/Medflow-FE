import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import { formatDate } from './utils';
import { InlineFieldRow, standardFieldSx, labelWidth } from './InlineField';
import { sectionTitleSx, labelSx } from '../../constants/styles';

/**
 * Patient Details: demographics with underlined input style.
 * Label left, input right; radio groups for Sex at Birth and Gender Identity.
 */
export default function PatientDetailsSection({ patient, patientNumber, isEditMode = false, onPatientDataChange }) {
  const [localPatientData, setLocalPatientData] = useState(patient || {});

  // Update local data when patient prop changes
  useEffect(() => {
    if (patient) {
      console.log('📥 PatientDetailsSection received patient:', patient);
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

  const sexAtBirth = localPatientData?.sexAtBirth?.toLowerCase?.() || localPatientData?.gender?.toLowerCase?.() || '';
  const genderIdentity = localPatientData?.genderIdentity?.toLowerCase?.() || localPatientData?.gender?.toLowerCase?.() || '';

  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{ mb: 2, ...sectionTitleSx }}
      >
        Patient Details {patientNumber != null ? `(pt #${patientNumber})` : ''}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow 
          label="Title" 
          value={localPatientData?.title || ''} 
          placeholder=""
          onChange={(e) => handleFieldChange('title', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="First Name" 
          value={localPatientData?.firstName || ''} 
          placeholder="First name"
          onChange={(e) => handleFieldChange('firstName', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="Middle Name" 
          value={localPatientData?.middleName || ''} 
          placeholder="Middle name"
          onChange={(e) => handleFieldChange('middleName', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="Last Name" 
          value={localPatientData?.lastName || ''} 
          placeholder="Last name"
          onChange={(e) => handleFieldChange('lastName', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="Preferred Name" 
          value={localPatientData?.preferredName || ''} 
          placeholder="Preferred name"
          onChange={(e) => handleFieldChange('preferredName', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />

        {isEditMode ? (
          <InlineFieldRow 
            label="Date of Birth" 
            value={localPatientData?.dateOfBirth ? localPatientData.dateOfBirth.split('T')[0] : ''}
            onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
            InputProps={{ readOnly: !isEditMode }}
            type="date"
          />
        ) : (
          <InlineFieldRow
            label="Date of Birth"
            placeholder="MM/DD/YYYY"
            input={
              <TextField
                variant="standard"
                fullWidth
                value={formatDate(patient?.dateOfBirth) || ''}
                placeholder="MM/DD/YYYY"
                InputProps={{
                  readOnly: true,
                  disableUnderline: false,
                  endAdornment: (
                    <Box component="span" sx={{ ml: 1, color: 'action.active', display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ fontSize: 20 }} />
                    </Box>
                  ),
                }}
                sx={standardFieldSx}
              />
            }
          />
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `${labelWidth}px 1fr`,
            gap: 1,
            alignItems: 'center',
            py: 0.75,
            minHeight: 36,
          }}
        >
          <Typography sx={labelSx}>
            Sex at Birth:
          </Typography>
          <FormControl component="fieldset" sx={{ minWidth: 0 }}>
            <RadioGroup 
              row 
              value={sexAtBirth === 'male' ? 'male' : sexAtBirth === 'female' ? 'female' : ''}
              onChange={(e) => handleFieldChange('sexAtBirth', e.target.value)}
              disabled={!isEditMode}
            >
              <FormControlLabel 
                value="male" 
                control={<Radio size="small" />} 
                label="Male"
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
              <FormControlLabel 
                value="female" 
                control={<Radio size="small" />} 
                label="Female"
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `${labelWidth}px 1fr`,
            gap: 1,
            alignItems: 'flex-start',
            py: 0.75,
            minHeight: 36,
          }}
        >
          <Typography sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.8rem', pt: 0.5 }}>
            Gender Identity:
          </Typography>
          <FormControl component="fieldset" sx={{ minWidth: 0 }}>
            <RadioGroup 
              value={genderIdentity === 'male' ? 'male' : genderIdentity === 'female' ? 'female' : ''}
              onChange={(e) => handleFieldChange('genderIdentity', e.target.value)}
              disabled={!isEditMode}
            >
              <FormControlLabel 
                value="male" 
                control={<Radio size="small" />} 
                label="Male/Man"
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
              <FormControlLabel 
                value="female" 
                control={<Radio size="small" />} 
                label="Female/Woman"
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <InlineFieldRow
          label="Social Security Number"
          value={localPatientData?.ssn ? String(localPatientData.ssn).replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3') : ''}
          placeholder="xxx-xx-xxxx"
          onChange={(e) => handleFieldChange('ssn', e.target.value.replace(/[^0-9]/g, ''))}
          InputProps={{ readOnly: !isEditMode }}
        />
      </Box>
    </Box>
  );
}
