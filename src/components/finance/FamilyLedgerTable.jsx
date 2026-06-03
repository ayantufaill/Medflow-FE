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

const FamilyLedgerTable = ({ patient }) => {
  const [ledgerItems, setLedgerItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const patientId = patient?._id || patient?.id;
  const household = patient?.household || [];

  useEffect(() => {
    const fetchFamilyLedger = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        setError('');
        
        // 1. Gather all family member IDs (including the current patient)
        const familyMembers = [
          { id: patientId, name: `${patient?.firstName} ${patient?.lastName}` },
          ...household.map(member => ({
            id: member._id || member.id,
            name: `${member.firstName} ${member.lastName}`
          }))
        ];
        
        // 2. Query individual ledgers for all members in parallel
        const ledgerPromises = familyMembers.map(async (member) => {
          try {
            const res = await apiClient.get(`/finance-dashboard/ledger/${member.id}`);
            const items = res.data?.data?.ledger || [];
            // Tag each item with the patient name who owns the transaction
            return items.map(item => ({
              ...item,
              patientName: member.name
            }));
          } catch (err) {
            console.error(`Error fetching ledger for family member ${member.name}:`, err);
            return [];
          }
        });
        
        const ledgersResults = await Promise.all(ledgerPromises);
        
        // 3. Flatten and sort all items chronologically ascending to recalculate family running balance
        const allItems = ledgersResults.flat();
        allItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // 4. Recalculate the family running balance
        let balance = 0;
        const enrichedItems = allItems.map(item => {
          balance += item.charges - item.credits;
          return {
            ...item,
            balance
          };
        });
        
        // 5. Reverse to show descending (newest to oldest) in UI
        enrichedItems.reverse();
        
        setLedgerItems(enrichedItems);
      } catch (err) {
        console.error('Error fetching family ledger:', err);
        setError(err.response?.data?.error?.message || err.message || 'Failed to load family ledger data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyLedger();
  }, [patientId, household.length]);

  const handlePrint = () => {
    const familyName = patient ? `${patient.lastName} Family` : 'Family';
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Family Ledger - ${familyName}</title>
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
          <h2>Family Ledger Report - ${familyName}</h2>
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
                    <td>${row.patientName || ''}</td>
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
          <Typography variant="body2" color="text.secondary">Loading family ledger...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : ledgerItems.length === 0 ? (
        <Paper elevation={0} sx={{ border: '1px solid #eee', p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No family transactions found.
          </Typography>
        </Paper>
      ) : (
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
              {ledgerItems.map((row, index) => {
                const dateStr = row.date ? dayjs(row.date).format('MM/DD/YYYY') : 'N/A';
                const amtStr = row.charges > 0 ? `$${row.charges.toFixed(2)}` : row.credits > 0 ? `-$${row.credits.toFixed(2)}` : '$0.00';
                const balStr = `$${row.balance.toFixed(2)}`;

                return (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontSize: '11px' }}>{dateStr}</TableCell>
                    <TableCell sx={{ fontSize: '11px' }}>{row.patientName}</TableCell>
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

export default FamilyLedgerTable;
