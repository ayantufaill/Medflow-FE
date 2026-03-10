import { Box, Typography, Table, TableBody, TableRow, TableCell } from '@mui/material';

const rowCellSx = {
  borderBottom: 1,
  borderColor: 'grey.300',
  py: 1.25,
  fontSize: '0.875rem',
};

const labelSx = {
  width: '42%',
  fontWeight: 600,
  color: 'text.secondary',
  ...rowCellSx,
};

const valueSx = { ...rowCellSx, fontWeight: 400, color: 'text.primary' };

const Row = ({ label, value }) => (
  <TableRow>
    <TableCell sx={labelSx}>{label}</TableCell>
    <TableCell sx={valueSx}>{value ?? '–'}</TableCell>
  </TableRow>
);

export default function PatientAddressSection({ patient }) {
  const addr = patient?.address;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 1.5, color: 'primary.main', fontSize: '0.95rem' }}
      >
        Patient&apos;s Address
      </Typography>
      <Table size="small" sx={{ '& td': { border: 0 } }}>
        <TableBody>
          <Row label="Country" value="United States" />
          <Row label="Address Line 1" value={addr?.line1} />
          <Row label="Address Line 2" value={addr?.line2} />
          <Row label="City" value={addr?.city} />
          <Row label="State" value={addr?.state} />
          <Row label="Zip/Postal Code" value={addr?.postalCode} />
          <Row label="Email Address" value={patient?.email} />
          <Row label="Marital Status" value={patient?.maritalStatus || 'Single'} />
        </TableBody>
      </Table>
    </Box>
  );
}

