import { useEffect, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import {
  HomeOutlined as HomeOutlinedIcon,
  AccountBalanceOutlined as WorkAddressIcon,
} from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
// Same CSS variant PatientForm.jsx already uses for this library. Importing the other
// variant (style.css) here caused the two stylesheets to collide once both were loaded
// in the same SPA session — .selected-flag/.country-list/.flag are defined differently
// in each file, so whichever loaded last partially won per-property, breaking the
// flag-dropdown's shape and misaligning the country rows.
import 'react-phone-input-2/lib/material.css';
import { InlineFieldRow, standardFieldSx } from './InlineField';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';

// Only safe, non-geometric overrides here. The library positions the flag icon with
// `position: absolute` + a fixed `margin-top`/`left` tuned to its own default height and
// padding (see .selected-flag .flag, .country-list .flag/.country in material.css) — so
// overriding height/padding/width on .form-control, .selected-flag, .flag-dropdown, or
// .country-list .country reintroduces exactly the misaligned-flag bug this fixes.
const phoneInputWrapperSx = {
  '& .react-tel-input': {
    fontFamily: 'Inter',
    width: '100%',
  },
  '& .react-tel-input .form-control': {
    width: '100%',
    fontFamily: 'Inter',
    fontSize: fontSize.base,
  },
  '& .react-tel-input .country-list': {
    fontFamily: 'Inter',
  },
};

// Full-width tinted pill used to head off a nested address block ("Patient's
// Address", "Work Address") within a larger card, matching the rounded
// icon+label bar from Figma instead of a plain bold caption.
function AddressSectionLabel({ icon: Icon, children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: COLORS.SURFACE_TINT,
        borderRadius: radius.md,
        px: 1.5,
        py: 1,
        mt: 2.5,
        mb: 1.5,
      }}
    >
      {Icon && <Icon sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY }} />}
      <Typography
        sx={{
          fontFamily: 'Inter',
          fontSize: fontSize.xs,
          fontWeight: fontWeight.semibold,
          color: COLORS.TEXT_SECONDARY,
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

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

const PhoneField = ({ value, label, isEditMode, onChange }) => {
  // View mode: same static, read-only box as every other field on this page.
  if (!isEditMode) {
    return (
      <InlineFieldRow
        label={label}
        input={
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={formatPhoneNumber(value || '')}
            placeholder="(XXX) XXX-XXXX"
            InputProps={{ readOnly: true, inputProps: { title: value || '' } }}
            sx={{ ...standardFieldSx, minWidth: 0 }}
          />
        }
      />
    );
  }

  // Edit mode: real country flag-dropdown + searchable country list (react-phone-input-2,
  // already used the same way in PatientForm.jsx) instead of the old decorative,
  // non-interactive flag emoji + arrow that this field previously showed.
  return (
    <InlineFieldRow
      label={label}
      input={
        <Box sx={phoneInputWrapperSx}>
          <PhoneInput
            country="us"
            value={value || ''}
            onChange={(rawValue) => onChange({ target: { value: rawValue } })}
            enableSearch
            searchPlaceholder="Search"
            inputProps={{ name: label }}
            // The InlineFieldRow label above ("Mobile Number"/"Home Phone Number") already
            // identifies the field, so the library's own floating "Phone" label is redundant.
            // An empty string (not just omitting the prop, which defaults to "Phone") skips
            // rendering the label div entirely.
            specialLabel=""
          />
        </Box>
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

        <AddressSectionLabel icon={HomeOutlinedIcon}>Patient&apos;s Address</AddressSectionLabel>

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

        <AddressSectionLabel icon={WorkAddressIcon}>Work Address</AddressSectionLabel>
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
