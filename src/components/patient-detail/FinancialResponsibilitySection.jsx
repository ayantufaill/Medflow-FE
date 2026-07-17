import { useEffect, useState } from 'react';
import { Box, Typography, Radio, TextField, MenuItem } from '@mui/material';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius, roundedSelectMenuProps } from '../../constants/styles';

const OPTIONS = [
  { value: 'self', title: 'Self', description: 'Patient pays their own balance.' },
  { value: 'hoh', title: 'HOH Responsible', description: 'Household head is billed.' },
];

// Selectable option card (border + tint on the active one) replacing the
// plain RadioGroup rows, matching the Figma card-choice treatment.
function ResponsibilityOption({ option, selected, isEditMode, onSelect }) {
  return (
    <Box
      onClick={() => onSelect(option.value)}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
        border: `1.2px solid ${selected ? COLORS.ACCENT : COLORS.BORDER}`,
        backgroundColor: selected ? COLORS.ACCENT_BG : COLORS.SURFACE_CARD,
        borderRadius: radius.md,
        p: 1.5,
        mb: 1.25,
        cursor: isEditMode ? 'pointer' : 'default',
      }}
    >
      <Radio
        checked={selected}
        size="small"
        onChange={() => onSelect(option.value)}
        sx={{
          p: 0,
          mt: '2px',
          color: COLORS.ACCENT,
          '&.Mui-checked': { color: COLORS.ACCENT },
        }}
      />
      <Box>
        <Typography sx={{ fontFamily: 'Inter', fontWeight: fontWeight.semibold, fontSize: fontSize.md, color: COLORS.TEXT_PRIMARY }}>
          {option.title}
        </Typography>
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mt: 0.25 }}>
          {option.description}
        </Typography>
      </Box>
    </Box>
  );
}

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

  const handleSelect = (nextValue) => {
    if (!isEditMode) return;
    handleFieldChange('financialResponsibility', { ...responsibility, type: nextValue, name: nextValue === 'self' ? '' : responsibility.name });
  };

  return (
    <Box>
      {OPTIONS.map((option) => (
        <ResponsibilityOption
          key={option.value}
          option={option}
          selected={value === option.value}
          isEditMode={isEditMode}
          onSelect={handleSelect}
        />
      ))}
      {isEditMode && value === 'hoh' ? (
        <TextField
          select
          variant="outlined"
          size="small"
          SelectProps={{ MenuProps: roundedSelectMenuProps }}
          value={responsibility?.name || ''}
          onChange={(e) => handleFieldChange('financialResponsibility', { ...responsibility, type: 'hoh', name: e.target.value })}
          sx={{ mt: 1, minWidth: 200, '.MuiInputBase-root': { fontSize: '0.85rem', borderRadius: radius.md } }}
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
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
          {value === 'self' ? 'Self' : (responsibility?.name || responsibility?.displayName || 'No responsible party selected.')}
        </Typography>
      )}
    </Box>
  );
}
