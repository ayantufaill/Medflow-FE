import { useEffect, useState } from 'react';
import { Box, Typography, TextField, InputAdornment, MenuItem } from '@mui/material';
import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import { StackedFieldRow, standardFieldSx } from './InlineField';
import { sectionTitleSx, labelSx } from '../../constants/styles';
import WorkAddressSection from './WorkAddressSection';

const formatPhoneNumber = (value) => {
  if (!value) return '';
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  } else if (digitsOnly.length <= 3) {
    return digitsOnly;
  } else if (digitsOnly.length <= 6) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  } else {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
};

const cleanPhoneNumber = (value) => {
  if (!value) return '';
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length > 11) {
    return digitsOnly.slice(0, 11);
  }
  if (digitsOnly.length > 0 && (digitsOnly[0] === '0' || digitsOnly[0] === '9')) {
    return digitsOnly.slice(1);
  }
  return digitsOnly;
};

const PhoneField = ({ value, label, isEditMode, required = false, onChange }) => {
  const [inputValue, setInputValue] = useState(value || '');
  
  useEffect(() => {
    setInputValue(formatPhoneNumber(value || ''));
  }, [value]);
  
  const handleChange = (e) => {
    const rawValue = e.target.value;
    const cleanedNumber = cleanPhoneNumber(rawValue);
    const formattedNumber = formatPhoneNumber(cleanedNumber);
    setInputValue(formattedNumber);
    onChange({
      target: {
        value: cleanedNumber
      }
    });
  };
  
  return (
    <StackedFieldRow
      label={label}
      required={required}
      isEditMode={isEditMode}
      input={
        <TextField
          variant="outlined"
          fullWidth
          value={isEditMode ? inputValue : formatPhoneNumber(value) || ''}
          onChange={handleChange}
          slotProps={{
            input: {
              readOnly: !isEditMode,
              maxLength: isEditMode ? 16 : undefined,
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 0.5, cursor: 'pointer', flexShrink: 0 }}>
                  <span style={{ fontSize: '1rem' }}>🇺🇸</span>
                  <ArrowDownIcon sx={{ fontSize: 16, ml: 0.25, color: 'action.active' }} />
                </InputAdornment>
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
              '&:hover fieldset': {
                borderColor: '#cbd5e1',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3b82f6',
              },
            },
          }}
          placeholder="(XXX) XXX-XXXX"
        />
      }
    />
  );
};

export default function ContactInformationSection({ patient, isEditMode = false, onPatientDataChange }) {
  const [localPatientData, setLocalPatientData] = useState(patient || {});

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

  const addr = localPatientData?.address || {};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <PhoneField 
        label="Mobile Number" 
        value={localPatientData?.phonePrimary}
        required
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('phonePrimary', e.target.value)}
      />
      <PhoneField 
        label="Home Phone" 
        value={localPatientData?.phoneSecondary}
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('phoneSecondary', e.target.value)}
      />

      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          fontSize: '0.75rem',
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          mt: 2,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          pb: 0.5,
          borderBottom: '1px solid #e2e8f0',
          px: 1.5,
          py: 1,
          mx: -2,
          bgcolor: '#F3F8FD',
          borderRadius: '4px 4px 0 0',
        }}
      >
        📍 Patient's Address
      </Typography>

      <StackedFieldRow
        label="Country"
        isEditMode={isEditMode}
        input={
          <TextField
            select
            variant="outlined"
            fullWidth
            value={addr?.country || 'United States'}
            onChange={(e) => handleFieldChange('address', { ...addr, country: e.target.value })}
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
            <MenuItem value="United States">United States</MenuItem>
            <MenuItem value="Canada">Canada</MenuItem>
            <MenuItem value="United Kingdom">United Kingdom</MenuItem>
          </TextField>
        }
      />

      <StackedFieldRow 
        label="Address Line 1" 
        value={addr?.line1 || ''}
        placeholder="Address line 1"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('address', { ...addr, line1: e.target.value })}
      />
      <StackedFieldRow 
        label="Address Line 2" 
        value={addr?.line2 || ''}
        placeholder="Address line 2"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('address', { ...addr, line2: e.target.value })}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 1.5 }}>
        <StackedFieldRow 
          label="City" 
          value={addr?.city || ''}
          placeholder="City"
          isEditMode={isEditMode}
          labelWidth={60}
          onChange={(e) => handleFieldChange('address', { ...addr, city: e.target.value })}
        />
        <StackedFieldRow 
          label="State" 
          value={addr?.state || ''}
          placeholder="State"
          isEditMode={isEditMode}
          labelWidth={60}
          onChange={(e) => handleFieldChange('address', { ...addr, state: e.target.value })}
        />
      </Box>

      <StackedFieldRow 
        label="Zip / Postal" 
        value={addr?.postalCode || ''}
        placeholder="Zip / Postal"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('address', { ...addr, postalCode: e.target.value })}
      />

      <StackedFieldRow 
        label="Email" 
        value={localPatientData?.email || ''}
        placeholder="amanda.wilson@example.com"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('email', e.target.value)}
      />

      <StackedFieldRow
        label="Marital Status"
        isEditMode={isEditMode}
        input={
          <TextField
            select
            variant="outlined"
            fullWidth
            value={localPatientData?.maritalStatus || 'single'}
            onChange={(e) => handleFieldChange('maritalStatus', e.target.value)}
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
            <MenuItem value="single">single</MenuItem>
            <MenuItem value="married">married</MenuItem>
            <MenuItem value="divorced">divorced</MenuItem>
            <MenuItem value="widowed">widowed</MenuItem>
            <MenuItem value="separated">separated</MenuItem>
          </TextField>
        }
      />

      <StackedFieldRow 
        label="Occupation" 
        value={localPatientData?.occupation || ''}
        placeholder="Occupation"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('occupation', e.target.value)}
      />
      <StackedFieldRow
        label="Employer"
        value={localPatientData?.employer ?? localPatientData?.guardianEmployer ?? ''}
        placeholder="Employer"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('employer', e.target.value)}
      />

      {/* Work Address subsection */}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          fontSize: '0.75rem',
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          mt: 2,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          pb: 0.5,
          borderBottom: '1px solid #e2e8f0',
          px: 1.5,
          py: 1,
          mx: -2,
          bgcolor: '#F3F8FD',
          borderRadius: '4px 4px 0 0',
        }}
      >
        🏢 Work Address
      </Typography>
      <WorkAddressSection
        patient={localPatientData}
        isEditMode={isEditMode}
        onPatientDataChange={(updatedData) => {
          setLocalPatientData(updatedData);
          if (onPatientDataChange) onPatientDataChange(updatedData);
        }}
      />
    </Box>
  );
}
