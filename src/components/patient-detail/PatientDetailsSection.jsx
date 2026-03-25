import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import { formatDate } from './utils';
import { InlineFieldRow, standardFieldSx, labelWidth } from './InlineField';

/**
 * Patient Details: demographics with underlined input style.
 * Label left, input right; radio groups for Sex at Birth and Gender Identity.
 */
export default function PatientDetailsSection({ patient, patientNumber }) {
  const sexAtBirth = patient?.sexAtBirth?.toLowerCase?.() || patient?.gender?.toLowerCase?.() || '';
  const genderIdentity = patient?.genderIdentity?.toLowerCase?.() || patient?.gender?.toLowerCase?.() || '';

  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 2, color: 'primary.main', fontSize: '0.95rem' }}
      >
        Patient Details {patientNumber != null ? `(pt #${patientNumber})` : ''}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow label="Title" value={patient?.title} placeholder="" />
        <InlineFieldRow label="First Name" value={patient?.firstName} placeholder="First name" />
        <InlineFieldRow label="Middle Name" value={patient?.middleName} placeholder="Middle name" />
        <InlineFieldRow label="Last Name" value={patient?.lastName} placeholder="Last name" />
        <InlineFieldRow label="Preferred Name" value={patient?.preferredName} placeholder="Preferred name" />

        <InlineFieldRow
          label="Date of Birth"
          placeholder="MM/DD/YYYY"
          input={
            <TextField
              variant="standard"
              fullWidth
              value={formatDate(patient?.dateOfBirth) || ''}
              placeholder="MM/DD/YYYY"
              InputProps={{
                readOnly: true,
                disableUnderline: false,
                endAdornment: (
                  <Box component="span" sx={{ ml: 1, color: 'action.active', display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ fontSize: 20 }} />
                  </Box>
                ),
              }}
              sx={standardFieldSx}
            />
          }
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `${labelWidth}px 1fr`,
            gap: 1,
            alignItems: 'center',
            py: 1.25,
            minHeight: 44,
          }}
        >
          <Typography sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
            Sex at Birth:
          </Typography>
          <FormControl component="fieldset" sx={{ minWidth: 0 }}>
            <RadioGroup row value={sexAtBirth === 'male' ? 'male' : sexAtBirth === 'female' ? 'female' : ''}>
              <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
              <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `${labelWidth}px 1fr`,
            gap: 1,
            alignItems: 'flex-start',
            py: 1.25,
            minHeight: 44,
          }}
        >
          <Typography sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem', pt: 0.5 }}>
            Gender Identity:
          </Typography>
          <FormControl component="fieldset" sx={{ minWidth: 0 }}>
            <RadioGroup value={genderIdentity === 'male' ? 'male' : genderIdentity === 'female' ? 'female' : ''}>
              <FormControlLabel value="male" control={<Radio size="small" />} label="Male/Man" />
              <FormControlLabel value="female" control={<Radio size="small" />} label="Female/Woman" />
            </RadioGroup>
          </FormControl>
        </Box>

        <InlineFieldRow
          label="Social Security Number"
          value={patient?.ssn ? String(patient.ssn).replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3') : ''}
          placeholder="xxx-xx-xxxx"
        />
      </Box>
    </Box>
  );
}
