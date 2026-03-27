import { useEffect, useState } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { sectionTitleSx } from '../../constants/styles';

export default function FinancialResponsibilitySection({ patient, isEditMode = false, onPatientDataChange }) {
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

  const responsibility = localPatientData?.financialResponsibility || {};
  const value = responsibility?.type || 'hoh';
  return (
    <Box>
      <Typography variant="subtitle1" sx={sectionTitleSx}>
        <InfoIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
        Financial Responsibility
      </Typography>
      <RadioGroup 
        value={value} 
        name="financialResponsibility" 
        sx={{ mt: 0.5 }}
        onChange={(e) => handleFieldChange('financialResponsibility', { ...responsibility, type: e.target.value })}
        disabled={!isEditMode}
      >
        <FormControlLabel 
          value="self" 
          control={<Radio size="small" />} 
          label="Self"
          sx={{ opacity: !isEditMode ? 0.6 : 1 }}
        />
        <FormControlLabel 
          value="hoh" 
          control={<Radio size="small" />} 
          label="HOH responsible"
          sx={{ opacity: !isEditMode ? 0.6 : 1 }}
        />
      </RadioGroup>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {responsibility?.name || responsibility?.displayName || 'No responsible party selected'}
      </Typography>
    </Box>
  );
}
