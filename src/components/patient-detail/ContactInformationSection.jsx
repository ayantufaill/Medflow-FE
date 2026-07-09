import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  HomeOutlined as HomeOutlinedIcon,
  AccountBalanceOutlined as WorkAddressIcon,
} from '@mui/icons-material';
import { InlineFieldRow } from './InlineField';
import PhoneField from './PhoneField';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';

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
