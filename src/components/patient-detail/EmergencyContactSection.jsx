import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { InlineFieldRow } from './InlineField';
import { sectionTitleSx } from '../../constants/styles';

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

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localPatientData, [field]: value };
    setLocalPatientData(updatedData);
    if (onPatientDataChange) {
      onPatientDataChange(updatedData);
    }
  };

  const ec = localPatientData?.emergencyContact;

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
        <InlineFieldRow 
          label="Phone" 
          value={ec?.phone}
          onChange={(e) => handleFieldChange('emergencyContact', { ...ec, phone: e.target.value })}
          InputProps={{ readOnly: !isEditMode }}
        />
      </Box>
    </Box>
  );
}
