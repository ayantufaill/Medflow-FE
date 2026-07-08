import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  MenuItem,
} from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import { formatDate } from './utils';
import { StackedFieldRow } from './InlineField';

export default function PatientDetailsSection({ patient, patientNumber, isEditMode = false, onPatientDataChange }) {
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

  const sexAtBirth = localPatientData?.sexAtBirth?.toLowerCase?.() || localPatientData?.gender?.toLowerCase?.() || '';
  const genderIdentity = localPatientData?.genderIdentity?.toLowerCase?.() || localPatientData?.gender?.toLowerCase?.() || '';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <StackedFieldRow
        label="Title"
        isEditMode={isEditMode}
        input={
          isEditMode ? (
            <TextField
              select
              variant="outlined"
              fullWidth
              value={localPatientData?.title || 'MS.'}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 38,
                  fontSize: '0.8rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  '& fieldset': { borderColor: '#e2e8f0' },
                  '&:hover fieldset': { borderColor: '#cbd5e1' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                },
              }}
            >
              <MenuItem value="MR.">MR.</MenuItem>
              <MenuItem value="MS.">MS.</MenuItem>
              <MenuItem value="MRS.">MRS.</MenuItem>
              <MenuItem value="DR.">DR.</MenuItem>
              <MenuItem value="MX.">MX.</MenuItem>
            </TextField>
          ) : (
            <TextField
              variant="outlined"
              fullWidth
              value={localPatientData?.title || 'MS.'}
              slotProps={{ input: { readOnly: true } }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 38,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  '& fieldset': { borderColor: '#e2e8f0' },
                },
              }}
            />
          )
        }
      />

      <StackedFieldRow 
        label="First Name" 
        value={localPatientData?.firstName || ''} 
        placeholder="First name"
        required
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('firstName', e.target.value)}
      />

      <StackedFieldRow 
        label="Middle Name" 
        value={localPatientData?.middleName || ''} 
        placeholder="Middle name"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('middleName', e.target.value)}
      />

      <StackedFieldRow 
        label="Last Name" 
        value={localPatientData?.lastName || ''} 
        placeholder="Last name"
        required
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('lastName', e.target.value)}
      />

      <StackedFieldRow 
        label="Preferred Name" 
        value={localPatientData?.preferredName || ''} 
        placeholder="Preferred name"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('preferredName', e.target.value)}
      />

      {isEditMode ? (
        <StackedFieldRow 
          label="Date of Birth" 
          value={localPatientData?.dateOfBirth ? localPatientData.dateOfBirth.split('T')[0] : ''}
          onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
          required
          isEditMode={isEditMode}
          type="date"
        />
      ) : (
        <StackedFieldRow
          label="Date of Birth"
          required
          isEditMode={isEditMode}
          input={
            <TextField
              variant="outlined"
              fullWidth
              value={formatDate(localPatientData?.dateOfBirth) || ''}
              placeholder="MM/DD/YYYY"
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: (
                    <Box component="span" sx={{ ml: 1, color: 'action.active', display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ fontSize: 18 }} />
                    </Box>
                  ),
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
                },
              }}
            />
          }
        />
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 1.5, alignItems: 'center', mb: 1.25 }}>
        <Typography component="label" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>
          Sex at Birth
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup 
            row 
            value={sexAtBirth === 'male' ? 'male' : sexAtBirth === 'female' ? 'female' : ''}
            onChange={(e) => handleFieldChange('sexAtBirth', e.target.value)}
          >
            <FormControlLabel 
              value="male" 
              control={<Radio size="small" disabled={!isEditMode} sx={{ p: 0.5 }} />} 
              label={<Typography sx={{ fontSize: '0.8rem' }}>Male</Typography>}
            />
            <FormControlLabel 
              value="female" 
              control={<Radio size="small" disabled={!isEditMode} sx={{ p: 0.5 }} />} 
              label={<Typography sx={{ fontSize: '0.8rem' }}>Female</Typography>}
            />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 1.5, alignItems: 'flex-start', mb: 1.25 }}>
        <Typography component="label" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
          Gender Identity
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup 
            value={genderIdentity === 'male' ? 'male' : genderIdentity === 'female' ? 'female' : genderIdentity === 'non-binary' ? 'non-binary' : genderIdentity === 'prefer not to say' ? 'prefer not to say' : ''}
            onChange={(e) => handleFieldChange('genderIdentity', e.target.value)}
            sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}
          >
            <FormControlLabel 
              value="male" 
              control={<Radio size="small" disabled={!isEditMode} sx={{ p: 0.5 }} />} 
              label={<Typography sx={{ fontSize: '0.78rem' }}>Male / Man</Typography>}
            />
            <FormControlLabel 
              value="female" 
              control={<Radio size="small" disabled={!isEditMode} sx={{ p: 0.5 }} />} 
              label={<Typography sx={{ fontSize: '0.78rem' }}>Female / Woman</Typography>}
            />
            <FormControlLabel 
              value="non-binary" 
              control={<Radio size="small" disabled={!isEditMode} sx={{ p: 0.5 }} />} 
              label={<Typography sx={{ fontSize: '0.78rem' }}>Non-binary</Typography>}
            />
            <FormControlLabel 
              value="prefer not to say" 
              control={<Radio size="small" disabled={!isEditMode} sx={{ p: 0.5 }} />} 
              label={<Typography sx={{ fontSize: '0.78rem' }}>Prefer not to say</Typography>}
            />
          </RadioGroup>
        </FormControl>
      </Box>

      <StackedFieldRow
        label="Social Security Number"
        value={localPatientData?.ssn ? String(localPatientData.ssn).replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3') : ''}
        placeholder="xxx-xx-xxxx"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('ssn', e.target.value.replace(/[^0-9]/g, ''))}
      />
    </Box>
  );
}
