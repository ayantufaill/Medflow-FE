import { useEffect, useState } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, TextField, MenuItem } from '@mui/material';
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
        onChange={(e) => handleFieldChange('financialResponsibility', { ...responsibility, type: e.target.value, name: e.target.value === 'self' ? '' : responsibility.name })}
      >
        <FormControlLabel 
          value="self" 
          control={<Radio size="small" disabled={!isEditMode} />} 
          label="Self"
          sx={{ opacity: !isEditMode ? 0.6 : 1 }}
        />
        <FormControlLabel 
          value="hoh" 
          control={<Radio size="small" disabled={!isEditMode} />} 
          label="HOH responsible"
          sx={{ opacity: !isEditMode ? 0.6 : 1 }}
        />
      </RadioGroup>
      {isEditMode && value === 'hoh' ? (
        <TextField
          select
          variant="standard"
          size="small"
          value={responsibility?.name || ''}
          onChange={(e) => handleFieldChange('financialResponsibility', { ...responsibility, type: 'hoh', name: e.target.value })}
          sx={{ mt: 1, minWidth: 200, '.MuiInputBase-root': { fontSize: '0.85rem' } }}
          displayEmpty
        >
          <MenuItem value="" disabled>Select Household Member</MenuItem>
          {(patient?.household || []).map((m, idx) => {
            const memberName = m?.displayName || m?.name || [m?.firstName, m?.lastName].filter(Boolean).join(' ').trim();
            if (!memberName) return null;
            return (
              <MenuItem key={idx} value={memberName}>
                {memberName}
              </MenuItem>
            );
          })}
        </TextField>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {value === 'self' ? 'Self' : (responsibility?.name || responsibility?.displayName || 'No responsible party selected')}
        </Typography>
      )}
    </Box>
  );
}
