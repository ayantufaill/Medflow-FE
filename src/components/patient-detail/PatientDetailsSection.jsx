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
import { labelSx, fontSize, fontWeight } from '../../constants/styles';

// Radio option text (Male/Female, Male/Man/Female/Woman) had no fontFamily/size set,
// so it fell back to the theme default (Manrope, 1rem) instead of matching the
// Inter/12px value text used everywhere else on this page.
const radioLabelTypographySx = {
  fontFamily: 'Inter',
  fontSize: fontSize.base,
  fontWeight: fontWeight.regular,
};

/**
 * Patient Details: demographics with underlined input style.
 * Label left, input right; radio groups for Sex at Birth and Gender Identity.
 */
export default function PatientDetailsSection({ patient, isEditMode = false, onPatientDataChange }) {
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
                variant="outlined"
                size="small"
                fullWidth
                value={formatDate(patient?.dateOfBirth) || ''}
                placeholder="MM/DD/YYYY"
                InputProps={{
                  readOnly: true,
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
          <Typography sx={{ ...labelSx, fontFamily: 'Inter' }}>
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
                slotProps={{ typography: radioLabelTypographySx }}
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
              <FormControlLabel
                value="female"
                control={<Radio size="small" />}
                label="Female"
                slotProps={{ typography: radioLabelTypographySx }}
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
          <Typography sx={{ ...labelSx, fontFamily: 'Inter', pt: 0.5 }}>
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
                slotProps={{ typography: radioLabelTypographySx }}
                sx={{ opacity: !isEditMode ? 0.6 : 1 }}
              />
              <FormControlLabel
                value="female"
                control={<Radio size="small" />}
                label="Female/Woman"
                slotProps={{ typography: radioLabelTypographySx }}
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
