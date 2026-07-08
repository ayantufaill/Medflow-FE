import { Box, Typography, Avatar } from '@mui/material';
import { getInitials, computeAge } from './utils';

function formatDOB(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Using UTC dates to avoid local timezone offset shifts
    return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  } catch {
    return '';
  }
}

export default function PatientSummaryCard({ patient }) {
  const age = computeAge(patient?.dateOfBirth);
  const dobText = formatDOB(patient?.dateOfBirth);
  const ptCode = patient?.patientCode || patient?.patientNumber || 'PAT010';
  
  const displayDOB = dobText ? `DOB ${dobText}` : '';
  const displayAge = age != null ? `${age} y` : '';
  const displayPt = `pt #${ptCode}`;
  
  const detailsLine = [displayDOB, displayAge, displayPt].filter(Boolean).join(' - ');
  
  const phone = patient?.phonePrimary ? (() => {
    const digits = patient.phonePrimary.replace(/\D/g, '');
    if (digits.length === 10) return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return patient.phonePrimary;
  })() : '';
  
  const contactLine = [patient?.email, phone].filter(Boolean).join(' - ');

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        p: 2, 
        borderRadius: '8px', 
        bgcolor: '#f0f7ff', 
        border: '1px solid #dbeafe',
        flexGrow: 1,
        minWidth: 320
      }}
    >
      <Avatar
        sx={{
          width: 44,
          height: 44,
          bgcolor: '#1976d2',
          fontSize: '1rem',
          fontWeight: 700,
        }}
      >
        {getInitials(patient?.firstName, patient?.lastName)}
      </Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 1 }}>
          <Typography
            sx={{
              fontSize: '0.9rem',
              fontWeight: 800,
              color: '#1e293b',
            }}
          >
            {patient?.firstName} {patient?.lastName}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: '#64748b',
              fontWeight: 500
            }}
          >
            {detailsLine}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: '#64748b',
            fontWeight: 500
          }}
        >
          {contactLine}
        </Typography>
      </Box>
    </Box>
  );
}
