import { Box, Typography, Avatar, IconButton } from '@mui/material';
import {
  AttachMoney as DollarIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
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
        <Box sx={{ display: 'flex', gap: 0.5, mt: 1.25 }}>
          {onBalance && (
            <IconButton
              size="small"
              onClick={onBalance}
              title="Balance"
              sx={{
                color: 'grey.600',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                p: 0.6,
              }}
            >
              <DollarIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          <IconButton
            size="small"
            title="MyChart Profile"
            onClick={onProfileClick}
            sx={{
              color: 'grey.600',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1,
              p: 0.6,
            }}
          >
            <PersonIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            title="Calendar"
            sx={{
              color: 'grey.600',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1,
              p: 0.6,
            }}
          >
            <CalendarIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
