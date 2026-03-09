import { Box, Typography } from '@mui/material';
import { InlineFieldRow } from './InlineField';

/**
 * Emergency Contact – underlined input style.
 */
export default function EmergencyContactSection({ patient }) {
  const ec = patient?.emergencyContact;

  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 2, color: 'primary.main', fontSize: '0.95rem' }}
      >
        Emergency Contact
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <InlineFieldRow label="Name" value={ec?.name} />
        <InlineFieldRow label="Relationship" value={ec?.relationship} />
        <InlineFieldRow label="Phone" value={ec?.phone} />
      </Box>
    </Box>
  );
}
