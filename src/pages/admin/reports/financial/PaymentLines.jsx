import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
} from '@mui/material';

const MOCK_PAYMENT_LINES = [
  { id: '966', patient: 'Patient One', amount: '$65.00', downPayment: 'No', dueDate: '05/15/2026', chargedOn: '', failedOn: '', failedAttempts: 0, status: 'Scheduled', error: '' },
  { id: '232', patient: 'Patient Two', amount: '$42.00', downPayment: 'No', dueDate: '05/20/2026', chargedOn: '', failedOn: '', failedAttempts: 0, status: 'Scheduled', error: '' },
  { id: '1247', patient: 'Patient Three', amount: '$599.50', downPayment: 'No', dueDate: '05/22/2026', chargedOn: '', failedOn: '', failedAttempts: 0, status: 'Scheduled', error: '' },
  { id: '856', patient: 'Patient Four', amount: '$266.67', downPayment: 'No', dueDate: '05/22/2026', chargedOn: '', failedOn: '', failedAttempts: 0, status: 'Scheduled', error: '' },
  { id: '986', patient: 'Patient Five', amount: '$1,295.67', downPayment: 'No', dueDate: '05/23/2026', chargedOn: '', failedOn: '', failedAttempts: 0, status: 'Scheduled', error: '' },
];

const PaymentLines = () => {
  const [dueDateFilter, setDueDateFilter] = useState('Range');
  const [selectedStatus, setSelectedStatus] = useState('Scheduled');

  const StatusChip = ({ label }) => (
    <Box
      onClick={() => setSelectedStatus(label)}
      sx={{
        px: 2,
        py: 0.5,
        borderRadius: '4px',
        border: '1px solid #1a3a6b',
        cursor: 'pointer',
        backgroundColor: selectedStatus === label ? '#1a3a6b' : '#fff',
        color: selectedStatus === label ? '#fff' : '#1a3a6b',
        fontSize: '0.8rem',
        fontWeight: 500,
        '&:hover': { opacity: 0.8 }
      }}
    >
      {label}
    </Box>
  );

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Payment Lines Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Due Date Filter:</Typography>
          <Select
            value={dueDateFilter}
            onChange={(e) => setDueDateFilter(e.target.value)}
            size="small"
            variant="standard"
            sx={{ fontSize: '0.85rem', minWidth: 100 }}
          >
            <MenuItem value="Range">Range</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Start Date:</Typography>
          <TextField size="small" variant="standard" defaultValue="04/08/2026" sx={{ width: 100, '& input': { fontSize: '0.85rem' } }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>End Date:</Typography>
          <TextField size="small" variant="standard" defaultValue="06/08/2026" sx={{ width: 100, '& input': { fontSize: '0.85rem' } }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Filter by Status:</Typography>
          <Select
            value="Select Status"
            size="small"
            sx={{ fontSize: '0.85rem', minWidth: 120, height: 32, backgroundColor: '#5c85bb', color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
          >
            <MenuItem value="Select Status">Select Status</MenuItem>
          </Select>
          <StatusChip label="Failed" />
          <StatusChip label="Pending" />
          <StatusChip label="Scheduled" />
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={<Checkbox size="small" />}
          label={<Typography sx={{ fontSize: '0.85rem' }}>Include Archived</Typography>}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 3 }}>
        <Button variant="contained" sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.8rem', fontWeight: 600 }}>Apply Filters</Button>
        <Button variant="contained" sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.8rem', fontWeight: 600 }}>Create Template</Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.8rem', fontWeight: 600 }}>Export as CSV</Button>
        <Button variant="contained" sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.8rem', fontWeight: 600 }}>Print</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Patient ID</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Down Payment</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Charged On</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Failed On</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Failed Attempts</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Error Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_PAYMENT_LINES.map((row, index) => (
              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fcfcfc' : '#fff' }}>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.id}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1, color: '#0052cc', textDecoration: 'underline' }}>{row.patient}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.amount}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.downPayment}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.dueDate}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.chargedOn}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.failedOn}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.failedAttempts}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.status}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.error}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Total:</TableCell>
              <TableCell sx={{ border: 'none' }}></TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>$4,185.77</TableCell>
              <TableCell colSpan={7} sx={{ border: 'none' }}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentLines;

