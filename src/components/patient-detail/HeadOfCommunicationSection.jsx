import { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Select, MenuItem, FormControl } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { getInitials } from './utils';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius, roundedSelectMenuProps } from '../../constants/styles';

export default function HeadOfCommunicationSection({ patient, isEditMode = false, onPatientDataChange }) {
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

  const head = localPatientData?.headOfCommunication;
  const patientFullName = `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim();
  const displayName =
    head?.name ||
    [head?.firstName, head?.lastName].filter(Boolean).join(' ') ||
    patientFullName;
  const options = Array.isArray(patient?.household) && patient.household.length
    ? patient.household
    : [{ name: displayName }];
  const relationLabel = displayName === patientFullName ? 'Self' : 'Household member';
  const isUnder16 = patient?.dateOfBirth ? dayjs().diff(dayjs(patient.dateOfBirth), 'year') < 16 : false;

  return (
    <Box>
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
        Head of Communication
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mt: 1,
          backgroundColor: COLORS.SURFACE_INPUT,
          borderRadius: radius.md,
          px: 1.5,
          py: 1.25,
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: COLORS.ACCENT,
            fontSize: '0.75rem',
          }}
        >
          {(() => {
            const parts = displayName.split(' ');
            const first = parts[0];
            const last = parts.length > 1 ? parts[parts.length - 1] : '';
            return getInitials(first, last);
          })()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {isEditMode && isUnder16 ? (
            <FormControl size="small" fullWidth>
              <Select
                value={displayName}
                onChange={(e) => handleFieldChange('headOfCommunication', { name: e.target.value })}
                variant="outlined"
                MenuProps={roundedSelectMenuProps}
                sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, borderRadius: radius.md }}
              >
                {options.map((option) => {
                  const optionName =
                    option?.name ||
                    option?.displayName ||
                    [option?.firstName, option?.lastName].filter(Boolean).join(' ').trim();
                  return (
                    <MenuItem key={optionName} value={optionName}>
                      {optionName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          ) : (
            <>
              <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, lineHeight: 1.3 }}>
                {displayName}
              </Typography>
              <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, lineHeight: 1.3 }}>
                {relationLabel} · primary
              </Typography>
            </>
          )}
        </Box>
        {!isEditMode && <CheckCircleIcon sx={{ color: COLORS.STATUS_SUCCESS, fontSize: 20, flexShrink: 0 }} />}
      </Box>
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mt: 1 }}>
        For patients under 16, communication is sent to the Head of Communication. Patients 16+ receive their own communication.
      </Typography>
    </Box>
  );
}
