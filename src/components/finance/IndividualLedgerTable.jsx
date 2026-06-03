import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert
} from '@mui/material';
import { Print } from '@mui/icons-material';
import apiClient from '../../config/api';
import dayjs from 'dayjs';

const IndividualLedgerTable = ({ patient }) => {
  const [ledgerItems, setLedgerItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const patientId = patient?._id || patient?.id;

  useEffect(() => {
    const fetchLedger = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        setError('');
        const response = await apiClient.get(`/finance-dashboard/ledger/${patientId}`);
        setLedgerItems(response.data?.data?.ledger || []);
      } catch (err) {
        console.error('Error fetching individual ledger:', err);
        setError(err.response?.data?.error?.message || err.message || 'Failed to load ledger data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [patientId]);

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'patient', label: 'Patient' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount' },
    { key: 'balance', label: 'Balance' },
    { key: 'user', label: 'User' },
  ];

  const handlePrint = () => {
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Patient';
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Individual Ledger - ${patientName}</title>
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
          <h2>Individual Ledger Report - ${patientName}</h2>
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
              ${ledgerItems.map(row => {
                const dateStr = row.date ? dayjs(row.date).format('MM/DD/YYYY') : 'N/A';
                const amtStr = row.charges > 0 ? `$${row.charges.toFixed(2)}` : row.credits > 0 ? `-$${row.credits.toFixed(2)}` : '$0.00';
                const balStr = `$${row.balance.toFixed(2)}`;
                return `
                  <tr>
                    <td>${dateStr}</td>
                    <td>${patientName}</td>
                    <td>${row.description || ''}</td>
                    <td>${amtStr}</td>
                    <td>${balStr}</td>
                    <td>STAFF</td>
                  </tr>
                `;
              }).join('')}
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
          disabled={loading || ledgerItems.length === 0}
          sx={{ color: '#5c6bc0', borderColor: '#5c6bc0', textTransform: 'none' }}
        >
          Print
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, gap: 1 }}>
          <CircularProgress size={36} sx={{ color: '#5c6bc0' }} />
          <Typography variant="body2" color="text.secondary">Loading individual ledger...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : ledgerItems.length === 0 ? (
        <Paper elevation={0} sx={{ border: '1px solid #eee', p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No transactions found for this patient.
          </Typography>
        </Paper>
      ) : (
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
              {ledgerItems.map((row) => {
                const dateStr = row.date ? dayjs(row.date).format('MM/DD/YYYY') : 'N/A';
                const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'N/A';
                const amtStr = row.charges > 0 ? `$${row.charges.toFixed(2)}` : row.credits > 0 ? `-$${row.credits.toFixed(2)}` : '$0.00';
                const balStr = `$${row.balance.toFixed(2)}`;
                
                return (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontSize: '11px' }}>{dateStr}</TableCell>
                    <TableCell sx={{ fontSize: '11px' }}>{patientName}</TableCell>
                    <TableCell sx={{ fontSize: '11px' }}>{row.description}</TableCell>
                    <TableCell sx={{ fontSize: '11px', color: row.credits > 0 ? '#2e7d32' : 'inherit', fontWeight: row.credits > 0 ? '500' : 'normal' }}>
                      {amtStr}
                    </TableCell>
                    <TableCell sx={{ fontSize: '11px', fontWeight: 'bold' }}>{balStr}</TableCell>
                    <TableCell sx={{ fontSize: '11px' }}>STAFF</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default IndividualLedgerTable;