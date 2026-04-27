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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Individual Ledger</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #333; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f5f5f5; font-weight: bold; color: #555; }
            tr:hover { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h2>Individual Ledger Report</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              ${individualData.map(row => `
                <tr>
                  <td>${row.date}</td>
                  <td>${row.patient}</td>
                  <td>${row.description}</td>
                  <td>${row.amount}</td>
                  <td>${row.balance}</td>
                  <td>${row.user}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button 
          startIcon={<Print />} 
          size="small" 
          variant="outlined" 
          onClick={handlePrint}
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