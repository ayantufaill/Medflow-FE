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
  TextField,
} from '@mui/material';

const MOCK_TRANSACTIONS = [
  { id: 'Patient A (861)', created: '05/26/2025', type: 'Payment', number: '18381', status: 'Pending' },
  { id: 'Patient B (452)', created: '06/24/2025', type: 'Payment', number: '18891', status: 'Pending' },
  { id: 'Patient C (123)', created: '07/15/2025', type: 'Payment', number: '19282', status: 'Pending' },
  { id: 'Patient D (789)', created: '02/03/2026', type: 'Payment', number: '23110', status: 'Pending' },
  { id: 'Patient E (456)', created: '02/27/2026', type: 'Payment', number: '23519', status: 'Pending' },
  { id: 'Patient F (321)', created: '03/20/2026', type: 'Payment', number: '23987', status: 'Pending' },
  { id: 'Patient G (654)', created: '03/27/2026', type: 'Payment', number: '24171', status: 'Pending' },
  { id: 'Patient H (987)', created: '05/08/2026', type: 'Payment', number: '25200', status: 'Pending' },
  { id: 'Patient I (159)', created: '05/08/2026', type: 'Payment', number: '25214', status: 'Pending' },
  { id: 'Patient J (753)', created: '07/15/2025', type: 'Deposit', number: '19272', status: 'Pending' },
];

const OpenEdgeTransactions = () => {
  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Open Edge Transactions Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Created On Date Filter:</Typography>
          <Select value="Range" size="small" variant="standard" sx={{ fontSize: '0.85rem', minWidth: 100 }}>
            <MenuItem value="Range">Range</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Start Date:</Typography>
          <TextField size="small" variant="standard" defaultValue="05/08/2025" sx={{ width: 100, '& input': { fontSize: '0.85rem' } }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>End Date:</Typography>
          <TextField size="small" variant="standard" defaultValue="05/08/2026" sx={{ width: 100, '& input': { fontSize: '0.85rem' } }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Filter by Status:</Typography>
          <Select value="Select Status" size="small" sx={{ fontSize: '0.85rem', minWidth: 120, height: 32, backgroundColor: '#5c85bb', color: '#fff' }}>
            <MenuItem value="Select Status">Select Status</MenuItem>
          </Select>
          <Button variant="outlined" size="small" sx={{ fontSize: '0.7rem', height: 28, borderColor: '#1a3a6b', color: '#1a3a6b' }}>Credit Card Declined</Button>
          <Button variant="outlined" size="small" sx={{ fontSize: '0.7rem', height: 28, borderColor: '#1a3a6b', color: '#1a3a6b' }}>Timed Out</Button>
          <Button variant="outlined" size="small" sx={{ fontSize: '0.7rem', height: 28, borderColor: '#1a3a6b', color: '#1a3a6b' }}>Pending</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 3 }}>
        <Button variant="contained" size="small" sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Apply Filters</Button>
        <Button variant="contained" size="small" sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Create Template</Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Export as CSV</Button>
        <Button variant="contained" size="small" sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Print</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Patient ID</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Created On</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Transaction Type</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Transaction Number</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_TRANSACTIONS.map((row, index) => (
              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fcfcfc' : '#fff' }}>
                <TableCell sx={{ fontSize: '0.75rem', py: 1, color: '#0052cc', textDecoration: 'underline' }}>{row.id}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.created}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.type}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.number}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OpenEdgeTransactions;

