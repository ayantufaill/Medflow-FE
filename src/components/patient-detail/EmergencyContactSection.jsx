import { useEffect, useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { standardFieldSx, roundedSelectMenuProps } from '../../constants/styles';
import { InlineFieldRow } from './InlineField';
import PhoneField from './PhoneField';

const RELATIONSHIP_OPTIONS = ["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"];

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
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow 
          label="Name" 
          value={ec?.name}
          onChange={(e) => handleFieldChange('emergencyContact', { ...ec, name: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
          required={isEditMode}
        />
        <InlineFieldRow 
          label="Relationship" 
          value={ec?.relationship}
          input={isEditMode ? (
            <TextField
              select
              SelectProps={{ MenuProps: roundedSelectMenuProps }}
              variant="outlined"
              size="small"
              fullWidth
              value={ec?.relationship || ''}
              onChange={(e) => handleFieldChange('emergencyContact', { ...ec, relationship: e.target.value })}
              sx={standardFieldSx}
            >
              <MenuItem value="" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>Select relationship</MenuItem>
              {RELATIONSHIP_OPTIONS.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </TextField>
          ) : undefined}
          InputProps={{ readOnly: !isEditMode }}
          required={isEditMode}
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
