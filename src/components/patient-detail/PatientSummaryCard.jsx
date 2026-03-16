import { Box, Typography, Avatar } from '@mui/material';
import { getInitials, computeAge } from './utils';

/**
 * Screenshot: large circular profile photo, name "Anna ... | 27 years old", email, row of 4 icons (dollar, person, calendar, tooth).
 */
export default function PatientSummaryCard({ patient, onBalance, onProfileClick }) {
  const age = computeAge(patient?.dateOfBirth);
  const ageText = age != null ? ` | ${age} years old` : '';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
      <Avatar
        sx={{
          width: 88,
          height: 88,
          bgcolor: 'primary.main',
          fontSize: '1.6rem',
          fontWeight: 600,
        }}
      >
        {getInitials(patient?.firstName, patient?.lastName)}
      </Avatar>
      <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: 'grey.900', lineHeight: 1.3, fontSize: '1.15rem' }}>
          {patient?.firstName} {patient?.lastName}{ageText}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: 'grey.600' }}>
          {patient?.email || '–'}
        </Typography>
      </Box>
    </Box>
  );
}
