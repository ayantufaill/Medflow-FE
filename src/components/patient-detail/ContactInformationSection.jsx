import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import { InlineFieldRow, standardFieldSx } from './InlineField';

const PhoneField = ({ value, label }) => (
  <InlineFieldRow
    label={label}
    input={
      <TextField
        variant="standard"
        fullWidth
        value={value || ''}
        InputProps={{
          readOnly: true,
          disableUnderline: false,
          inputProps: { title: value || '' },
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 0.5, cursor: 'pointer', flexShrink: 0 }}>
              <span style={{ fontSize: '1rem' }}>🇺🇸</span>
              <ArrowDownIcon sx={{ fontSize: 18, ml: 0.25, color: 'action.active' }} />
            </InputAdornment>
          ),
        }}
        sx={{ ...standardFieldSx, minWidth: 0 }}
      />
    }
  />
);

/**
 * Contact Information: Mobile, Home Phone, Patient's Address, Email, Marital Status.
 * Underlined input style: label left, input right.
 */
export default function ContactInformationSection({ patient }) {
  const addr = patient?.address;

  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 2, color: 'primary.main', fontSize: '0.95rem' }}
      >
        Contact Information
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <PhoneField label="Mobile Number" value={patient?.phonePrimary} />
        <PhoneField label="Home Phone Number" value={patient?.phoneSecondary} />

        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ mt: 2.5, mb: 1, color: 'text.secondary', fontSize: '0.875rem' }}
        >
          Patient&apos;s Address
        </Typography>

        <InlineFieldRow label="Country" value={addr?.country || 'United States'} />
        <InlineFieldRow label="Address Line 1" value={addr?.line1} placeholder="Address line 1" />
        <InlineFieldRow label="Address Line 2" value={addr?.line2} placeholder="Address line 2" />
        <InlineFieldRow label="City" value={addr?.city} placeholder="City" />
        <InlineFieldRow label="State" value={addr?.state} placeholder="State" />
        <InlineFieldRow label="Zip/Postal Code" value={addr?.postalCode} placeholder="Zip/Postal Code" />

        <InlineFieldRow label="Email Address" value={patient?.email} placeholder="email@example.com" />
        <InlineFieldRow label="Marital Status" value={patient?.maritalStatus || 'Single'} />

        <InlineFieldRow label="Occupation" value={patient?.occupation} placeholder="Occupation" />
        <InlineFieldRow
          label="Patient's / Guardian's Employer"
          value={patient?.employer ?? patient?.guardianEmployer}
          placeholder="Employer"
        />

        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ mt: 2.5, mb: 1, color: 'text.secondary', fontSize: '0.875rem' }}
        >
          Work Address
        </Typography>
        <InlineFieldRow
          label="Country"
          value={patient?.workAddress?.country || 'United States'}
        />
        <InlineFieldRow
          label="Address Line 1"
          value={patient?.workAddress?.line1}
          placeholder="Address line 1"
        />
        <InlineFieldRow
          label="Address Line 2"
          value={patient?.workAddress?.line2}
          placeholder="Address line 2"
        />
        <InlineFieldRow label="City" value={patient?.workAddress?.city} placeholder="City" />
        <InlineFieldRow label="State" value={patient?.workAddress?.state} placeholder="State" />
        <InlineFieldRow
          label="Zip/Postal Code"
          value={patient?.workAddress?.postalCode}
          placeholder="Zip/Postal Code"
        />
      </Box>
    </Box>
  );
}
