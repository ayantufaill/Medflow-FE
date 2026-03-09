import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const sectionTitleSx = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: 'primary.main',
  mb: 1.5,
};

/**
 * Patient flags, Preferred Dentist/Hygienist, Patient Profile (Pediatric/Adult) – screenshot style.
 */
export default function PatientFlagsSection({ patient, preferredDentists = [], preferredHygienists = [] }) {
  const patientProfile = patient?.patientProfileType === 'pediatric' ? 'pediatric' : 'adult';
  const flags = Array.isArray(patient?.patientFlags) ? patient.patientFlags : [];

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Typography component="span" sx={{ ...sectionTitleSx, mb: 0, display: 'inline' }}>
          Patient flags:{' '}
        </Typography>
        <Button
          variant="text"
          size="small"
          sx={{
            textTransform: 'none',
            color: 'primary.main',
            p: 0,
            minWidth: 'auto',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&:hover': { textDecoration: 'underline', background: 'none' },
          }}
        >
          +add flags
        </Button>
      </Box>
      <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
        <InputLabel>Preferred Dentist</InputLabel>
        <Select label="Preferred Dentist" value={patient?.preferredDentistId || ''} sx={{ borderRadius: 1.5 }}>
          <MenuItem value="">—</MenuItem>
          {preferredDentists.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
        <InputLabel>Preferred Hygienist</InputLabel>
        <Select label="Preferred Hygienist" value={patient?.preferredHygienistId || ''} sx={{ borderRadius: 1.5 }}>
          <MenuItem value="">—</MenuItem>
          {preferredHygienists.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600 }}>
        Patient Profile
      </Typography>
      <RadioGroup row value={patientProfile} name="patientProfile">
        <FormControlLabel value="pediatric" control={<Radio size="small" />} label="Pediatric" />
        <FormControlLabel value="adult" control={<Radio size="small" />} label="Adult" />
      </RadioGroup>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {flags.length ? flags.map((flag) => flag?.label || flag?.name || String(flag)).join(', ') : 'No flags added'}
      </Typography>
    </Box>
  );
}
