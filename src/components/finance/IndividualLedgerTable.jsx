import React from 'react';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import { KeyboardArrowDown, Print } from '@mui/icons-material';

const IndividualLedgerTable = () => {
  // Column headers configuration
  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'patient', label: 'Patient' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount' },
    { key: 'balance', label: 'Balance' },
    { key: 'user', label: 'User' },
  ];

  // Sample data - Replace with API data
  const individualData = [
    { 
      id: 1,
      date: '04/10/2026', 
      patient: 'Test Patient', 
      description: 'Patient Deposit', 
      amount: '$184.00', 
      balance: '$200.00', 
      user: 'MAG' 
    },
    { 
      id: 2,
      date: '04/09/2026', 
      patient: 'Test Patient', 
      description: 'Office Visit', 
      amount: '$50.00', 
      balance: '$150.00', 
      user: 'SAB' 
    },
    { 
      id: 3,
      date: '04/08/2026', 
      patient: 'Test Patient', 
      description: 'Cleaning Service', 
      amount: '$120.00', 
      balance: '$100.00', 
      user: 'MAG' 
    },
    { 
      id: 4,
      date: '04/07/2026', 
      patient: 'Test Patient', 
      description: 'X-Ray Examination', 
      amount: '$75.00', 
      balance: '$25.00', 
      user: 'SAB' 
    },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button 
          startIcon={<Print />} 
          size="small" 
          variant="outlined" 
          sx={{ color: '#5c6bc0', borderColor: '#5c6bc0', textTransform: 'none' }}
        >
          Print
        </Button>
      </Stack>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              {columns.map((column) => (
                <TableCell key={column.key} sx={{ fontWeight: 'bold', color: '#555', fontSize: '12px' }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {individualData.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map((column) => (
                  <TableCell key={column.key} sx={{ fontSize: '11px' }}>
                    {row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default IndividualLedgerTable;