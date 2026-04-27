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
  Typography,
  Button,
} from '@mui/material';
import { Print } from '@mui/icons-material';

const FamilyLedgerTable = () => {
  const familyData = [
    { date: '04/10/2026', patient: 'Test Patient 1', description: 'Patient Deposit', amount: '$184.00', balance: '$200.00', user: 'MAG' },
    { date: '04/09/2026', patient: 'Test Patient 2', description: 'Office Visit', amount: '$50.00', balance: '$150.00', user: 'SAB' },
  ];

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Family Ledger</title>
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
          <h2>Family Ledger Report</h2>
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
              ${familyData.map(row => `
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
