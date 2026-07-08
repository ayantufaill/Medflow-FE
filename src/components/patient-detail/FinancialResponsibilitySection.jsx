import { useEffect, useState } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, TextField, MenuItem, Avatar } from '@mui/material';
import { CheckCircle as VerifiedIcon } from '@mui/icons-material';
import { getInitials } from './utils';

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

  const head = localPatientData?.headOfCommunication;
  const headDisplayName =
    head?.name ||
    [head?.firstName, head?.lastName].filter(Boolean).join(' ') ||
    `${patient?.firstName || 'Amanda'} ${patient?.lastName || 'Wilson'}`.trim();

  const householdMembers = Array.isArray(patient?.household) ? patient.household : [];
  const headOptions = householdMembers.length
    ? householdMembers.map(m => m.name || [m.firstName, m.lastName].filter(Boolean).join(' ').trim()).filter(Boolean)
    : [headDisplayName];

  if (!headOptions.includes(headDisplayName)) {
    headOptions.unshift(headDisplayName);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Financial Choice Card Selection */}
      <RadioGroup
        value={value}
        name="financialResponsibility"
        onChange={(e) => handleFieldChange('financialResponsibility', { ...responsibility, type: e.target.value, name: e.target.value === 'self' ? '' : responsibility.name })}
        sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
      >
        {/* Self Option Card */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: value === 'self' ? '#3b82f6' : '#e2e8f0',
            borderRadius: '8px',
            p: 1.5,
            bgcolor: value === 'self' ? '#f0f7ff' : '#ffffff',
            cursor: isEditMode ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            position: 'relative'
          }}
          onClick={() => isEditMode && handleFieldChange('financialResponsibility', { ...responsibility, type: 'self', name: '' })}
        >
          <Radio
            size="small"
            checked={value === 'self'}
            disabled={!isEditMode}
            value="self"
            sx={{ p: 0.5, mt: -0.25 }}
          />
          <Box>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>Self</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.25 }}>Patient pays their own balance.</Typography>
          </Box>
        </Box>

        {/* HOH Option Card */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: value === 'hoh' ? '#3b82f6' : '#e2e8f0',
            borderRadius: '8px',
            p: 1.5,
            bgcolor: value === 'hoh' ? '#f0f7ff' : '#ffffff',
            cursor: isEditMode ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            position: 'relative'
          }}
          onClick={() => isEditMode && handleFieldChange('financialResponsibility', { ...responsibility, type: 'hoh' })}
        >
          <Radio
            size="small"
            checked={value === 'hoh'}
            disabled={!isEditMode}
            value="hoh"
            sx={{ p: 0.5, mt: -0.25 }}
          />
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>HOH Responsible</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.25 }}>Household head is billed.</Typography>

            {value === 'hoh' && (
              <Box sx={{ mt: 1 }}>
                {isEditMode ? (
                  <TextField
                    select
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={responsibility?.name || ''}
                    onChange={(e) => handleFieldChange('financialResponsibility', { ...responsibility, type: 'hoh', name: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 34,
                        fontSize: '0.75rem',
                        backgroundColor: '#ffffff',
                      }
                    }}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select Household Member</MenuItem>
                    {householdMembers.map((m, idx) => {
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
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#dc2626', mt: 0.5 }}>
                    {responsibility?.name || responsibility?.displayName || 'No responsible party selected'}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </RadioGroup>

      {/* Head of Communication Sub-Card Section */}
      <Box sx={{ mt: 1, borderTop: '1px solid #f1f5f9', pt: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: '0.75rem',
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            mb: 1.5,
          }}
        >
          Head of Communication
        </Typography>

        {isEditMode ? (
          <TextField
            select
            variant="outlined"
            fullWidth
            size="small"
            value={headDisplayName}
            onChange={(e) => handleFieldChange('headOfCommunication', { name: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 38,
                fontSize: '0.8rem',
                backgroundColor: '#ffffff',
              }
            }}
          >
            {headOptions.map((optionName) => (
              <MenuItem key={optionName} value={optionName}>
                {optionName}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, border: '1px solid #f1f5f9', borderRadius: '6px', bgcolor: '#f8fafc' }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: '#3b82f6',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {getInitials(localPatientData?.firstName, localPatientData?.lastName)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                {headDisplayName}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                Self - primary
              </Typography>
            </Box>
            <VerifiedIcon sx={{ color: '#22c55e', fontSize: 20 }} />
          </Box>
        )}

        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 1.5, fontStyle: 'italic', lineHeight: 1.4 }}>
          For patients under 18, communication is sent to the Head of Communication. Patients 18+ receive their own communication.
        </Typography>
      </Box>
    </Box>
  );
}
