import { useEffect, useState } from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import { InlineFieldRow, standardFieldSx } from './InlineField';
import { sectionTitleSx, labelSx } from '../../constants/styles';

/**
 * Format phone number for display
 * @param {string} value - Raw phone number value
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (value) => {
  if (!value) return '';
  
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '');
  
  // Handle country code
  let phoneNumber = digitsOnly;
  
  // Format based on length
  if (digitsOnly.length === 10) {
    // (XXX) XXX-XXXX
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    // +1 (XXX) XXX-XXXX
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  } else if (digitsOnly.length <= 3) {
    // Just show digits
    return digitsOnly;
  } else if (digitsOnly.length <= 6) {
    // (XXX XXX
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  } else {
    // (XXX) XXX-XXXXXX
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
};

/**
 * Clean and validate phone number input
 * Limits to max 11 digits (1 country code + 10 digit number)
 * @param {string} value - Raw input value
 * @returns {string} - Cleaned phone number with max 11 digits
 */
const cleanPhoneNumber = (value) => {
  if (!value) return '';
  
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '');
  
  // Limit to max 11 digits
  if (digitsOnly.length > 11) {
    return digitsOnly.slice(0, 11);
  }
  
  // If starts with 0 or 9 (invalid first digits), remove them
  if (digitsOnly.length > 0 && (digitsOnly[0] === '0' || digitsOnly[0] === '9')) {
    return digitsOnly.slice(1);
  }
  
  return digitsOnly;
};

const PhoneField = ({ value, label, isEditMode, onChange }) => {
  const [inputValue, setInputValue] = useState(value || '');
  
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);
  
  const handleChange = (e) => {
    const rawValue = e.target.value;
    
    // Clean and limit the phone number
    const cleanedNumber = cleanPhoneNumber(rawValue);
    
    // Format for display
    const formattedNumber = formatPhoneNumber(cleanedNumber);
    
    // Update local state with formatted value
    setInputValue(formattedNumber);
    
    // Send cleaned (unformatted) value to parent
    onChange({
      target: {
        value: cleanedNumber
      }
    });
  };
  
  return (
    <InlineFieldRow
      label={label}
      input={
        <TextField
          variant="standard"
          fullWidth
          value={isEditMode ? inputValue : value || ''}
          onChange={handleChange}
          inputProps={{
            readOnly: !isEditMode,
            maxLength: isEditMode ? 16 : undefined, // Max: +1 (XXX) XXX-XXXX = 16 chars
            title: value || '',
          }}
          InputProps={{
            readOnly: !isEditMode,
            disableUnderline: false,
            inputProps: { title: value || '' },
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0.5, cursor: 'pointer', flexShrink: 0 }}>
                <span style={{ fontSize: '1rem' }}>🇺🇸</span>
                <ArrowDownIcon sx={{ fontSize: 18, ml: 0.25, color: 'action.active' }} />
              </InputAdornment>
            ),
          }}
          sx={{ ...standardFieldSx, minWidth: 0 }}
          placeholder="(XXX) XXX-XXXX"
        />
      }
    />
  );
};

/**
 * Emergency Contact – underlined input style.
 */
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
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 2, ...sectionTitleSx }}
      >
        Emergency Contact
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow 
          label="Name" 
          value={ec?.name}
          onChange={(e) => handleFieldChange('emergencyContact', { ...ec, name: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="Relationship" 
          value={ec?.relationship}
          onChange={(e) => handleFieldChange('emergencyContact', { ...ec, relationship: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <PhoneField 
          label="Phone" 
          value={ec?.phone || ''}
          isEditMode={isEditMode}
          onChange={(e) => handlePhoneChange('phone', e.target.value)}
        />
      </Box>
    </Box>
  );
}
