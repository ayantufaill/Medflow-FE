import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const MOCK_REQUESTS = [
  { patient: 'Patient One', created: '05/08/2025', requested: '$358.00', paid: '--------', date: '', status: '' },
  { patient: 'Patient Two', created: '05/08/2025', requested: '$1,000.00', paid: '--------', date: '', status: '' },
  { patient: 'Patient Three', created: '05/08/2025', requested: '$288.00', paid: '$288.00', date: '05/10/2025', status: 'Successful Transaction' },
  { patient: 'Patient Four', created: '05/13/2025', requested: '$69.00', paid: '$69.00', date: '05/13/2025', status: 'Successful Transaction' },
  { patient: 'Patient Five', created: '05/14/2025', requested: '$877.10', paid: '$877.10', date: '05/14/2025', status: 'Successful Transaction' },
];

const PaymentRequest = () => {
  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Payment Request Report:
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Created On Date Filter:</Typography>
          <Select value="Range" size="small" variant="standard" sx={{ fontSize: '0.85rem', minWidth: 100 }}>
            <MenuItem value="Range">Range</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Start Date:</Typography>
          <Typography sx={{ fontSize: '0.85rem', borderBottom: '1px solid #ccc' }}>05/08/2025</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>End Date:</Typography>
          <Typography sx={{ fontSize: '0.85rem', borderBottom: '1px solid #ccc' }}>05/08/2026</Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Button variant="contained" sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.8rem' }}>Apply Filters</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Export as CSV</Button>
        <Button variant="contained" size="small" sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Print</Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Created On</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Amount Requested</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Amount Paid</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Date Paid</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_REQUESTS.map((row, index) => (
              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fcfcfc' : '#fff' }}>
                <TableCell sx={{ fontSize: '0.75rem', py: 1, color: '#0052cc', textDecoration: 'underline' }}>{row.patient}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.created}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.requested}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.paid}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.date}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: row.status.includes('Successful') ? '#007b3e' : '#000' }}>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentRequest;

