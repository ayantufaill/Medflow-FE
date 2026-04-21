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

const FamilyLedgerTable = () => {
  const familyData = [
    { date: '04/10/2026', patient: 'Test Patient 1', description: 'Patient Deposit', amount: '$184.00', balance: '$200.00', user: 'Admin' },
    { date: '04/09/2026', patient: 'Test Patient 2', description: 'Office Visit', amount: '$50.00', balance: '$150.00', user: 'Reception' },
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
              <TableCell width="40px" />
              {['Date', 'Patient', 'Description', 'Amount', 'Balance', 'User'].map((head) => (
                <TableCell key={head} sx={{ fontWeight: 'bold', color: '#555', fontSize: '12px' }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {familyData.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  <IconButton size="small">
                    <KeyboardArrowDown sx={{ fontSize: 18 }} />
                  </IconButton>
                </TableCell>
                <TableCell sx={{ fontSize: '11px' }}>{row.date}</TableCell>
                <TableCell sx={{ fontSize: '11px' }}>{row.patient}</TableCell>
                <TableCell sx={{ fontSize: '11px' }}>{row.description}</TableCell>
                <TableCell sx={{ fontSize: '11px' }}>{row.amount}</TableCell>
                <TableCell sx={{ fontSize: '11px' }}>{row.balance}</TableCell>
                <TableCell sx={{ fontSize: '11px' }}>{row.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FamilyLedgerTable;
