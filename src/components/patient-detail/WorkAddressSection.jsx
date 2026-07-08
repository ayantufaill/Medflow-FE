import { useEffect, useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { StackedFieldRow } from './InlineField';

export default function WorkAddressSection({ patient, isEditMode = false, onPatientDataChange }) {
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

  const workAddr = localPatientData?.workAddress || {};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <StackedFieldRow 
        label="Address Line 1" 
        value={workAddr?.line1 || ''}
        placeholder="125 Broad St"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('workAddress', { ...workAddr, line1: e.target.value })}
      />
      <StackedFieldRow 
        label="Address Line 2" 
        value={workAddr?.line2 || ''}
        placeholder="Address line 2"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('workAddress', { ...workAddr, line2: e.target.value })}
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 1.5 }}>
        <StackedFieldRow 
          label="City" 
          value={workAddr?.city || ''}
          placeholder="Boston"
          isEditMode={isEditMode}
          labelWidth={60}
          onChange={(e) => handleFieldChange('workAddress', { ...workAddr, city: e.target.value })}
        />
        <StackedFieldRow 
          label="State" 
          value={workAddr?.state || ''}
          placeholder="MA"
          isEditMode={isEditMode}
          labelWidth={60}
          onChange={(e) => handleFieldChange('workAddress', { ...workAddr, state: e.target.value })}
        />
      </Box>
      <StackedFieldRow 
        label="Zip / Postal" 
        value={workAddr?.postalCode || ''}
        placeholder="02110"
        isEditMode={isEditMode}
        onChange={(e) => handleFieldChange('workAddress', { ...workAddr, postalCode: e.target.value })}
      />
    </Box>
  );
}
