import { useEffect, useState } from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import { StackedFieldRow } from './InlineField';

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

const PhoneField = ({ value, label, isEditMode, onChange }) => {
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

export default function EmergencyContactSection({ patient, isEditMode = false, onPatientDataChange }) {
  const [localPatientData, setLocalPatientData] = useState(patient || {});

  useEffect(() => {
    if (patient) {
      setLocalPatientData(patient);
    }
  }, [patient]);

  const handlePhoneChange = (field, value) => {
    const currentEc = localPatientData?.emergencyContact || {};
    const updatedEc = { ...currentEc, [field]: value };
    const updatedData = { 
      ...localPatientData, 
      emergencyContact: updatedEc
    };
    setLocalPatientData(updatedData);
    if (onPatientDataChange) {
      onPatientDataChange(updatedData);
    }
  };

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localPatientData, [field]: value };
    setLocalPatientData(updatedData);
    if (onPatientDataChange) {
      onPatientDataChange(updatedData);
    }
  };

  const ec = localPatientData?.emergencyContact || {};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <StackedFieldRow 
        label="Name" 
        value={ec?.name || ''}
        placeholder="Thomas Wilson"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('emergencyContact', { ...ec, name: e.target.value })}
      />
      <StackedFieldRow 
        label="Relationship" 
        value={ec?.relationship || ''}
        placeholder="Father"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('emergencyContact', { ...ec, relationship: e.target.value })}
      />
      <PhoneField 
        label="Phone" 
        value={ec?.phone || ''}
        isEditMode={isEditMode}
        onChange={(e) => handlePhoneChange('phone', e.target.value)}
      />
    </Box>
  );
}
