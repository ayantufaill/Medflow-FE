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

  const addr = localPatientData?.address;

  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 2, ...sectionTitleSx }}
      >
        Contact Information
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <PhoneField 
          label="Mobile Number" 
          value={localPatientData?.phonePrimary}
          isEditMode={isEditMode}
          onChange={(e) => handleFieldChange('phonePrimary', e.target.value)}
        />
        <PhoneField 
          label="Home Phone Number" 
          value={localPatientData?.phoneSecondary}
          isEditMode={isEditMode}
          onChange={(e) => handleFieldChange('phoneSecondary', e.target.value)}
        />

        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ mt: 2.5, mb: 1, ...labelSx }}
        >
          Patient&apos;s Address
        </Typography>

        <InlineFieldRow 
          label="Country" 
          value={addr?.country || 'United States'}
          onChange={(e) => handleFieldChange('address', { ...addr, country: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="Address Line 1" 
          value={addr?.line1}
          placeholder="Address line 1"
          onChange={(e) => handleFieldChange('address', { ...addr, line1: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="Address Line 2" 
          value={addr?.line2}
          placeholder="Address line 2"
          onChange={(e) => handleFieldChange('address', { ...addr, line2: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="City" 
          value={addr?.city}
          placeholder="City"
          onChange={(e) => handleFieldChange('address', { ...addr, city: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="State" 
          value={addr?.state}
          placeholder="State"
          onChange={(e) => handleFieldChange('address', { ...addr, state: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="Zip/Postal Code" 
          value={addr?.postalCode}
          placeholder="Zip/Postal Code"
          onChange={(e) => handleFieldChange('address', { ...addr, postalCode: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />

        <InlineFieldRow 
          label="Email Address" 
          value={localPatientData?.email}
          placeholder="email@example.com"
          onChange={(e) => handleFieldChange('email', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="Marital Status" 
          value={localPatientData?.maritalStatus || 'Single'}
          onChange={(e) => handleFieldChange('maritalStatus', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />

        <InlineFieldRow 
          label="Occupation" 
          value={localPatientData?.occupation}
          placeholder="Occupation"
          onChange={(e) => handleFieldChange('occupation', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Patient's / Guardian's Employer"
          value={localPatientData?.employer ?? localPatientData?.guardianEmployer}
          placeholder="Employer"
          onChange={(e) => handleFieldChange('employer', e.target.value)}
          InputProps={{ readOnly: !isEditMode }}
        />

        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ mt: 2.5, mb: 1, ...labelSx }}
        >
          Work Address
        </Typography>
        <InlineFieldRow
          label="Country"
          value={localPatientData?.workAddress?.country || 'United States'}
          onChange={(e) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, country: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Address Line 1"
          value={localPatientData?.workAddress?.line1}
          placeholder="Address line 1"
          onChange={(e) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, line1: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Address Line 2"
          value={localPatientData?.workAddress?.line2}
          placeholder="Address line 2"
          onChange={(e) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, line2: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="City" 
          value={localPatientData?.workAddress?.city}
          placeholder="City"
          onChange={(e) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, city: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow 
          label="State" 
          value={localPatientData?.workAddress?.state}
          placeholder="State"
          onChange={(e) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, state: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
        <InlineFieldRow
          label="Zip/Postal Code"
          value={localPatientData?.workAddress?.postalCode}
          placeholder="Zip/Postal Code"
          onChange={(e) => handleFieldChange('workAddress', { ...localPatientData?.workAddress, postalCode: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
      </Box>
    </Box>
  );
}
