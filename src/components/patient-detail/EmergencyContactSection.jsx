import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { InlineFieldRow } from './InlineField';
import PhoneField from './PhoneField';

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
