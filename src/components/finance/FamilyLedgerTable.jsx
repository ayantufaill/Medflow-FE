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
    const tableEl = document.getElementById('family-ledger-table');
    if (!tableEl) {
      alert("Ledger table not found to print.");
      return;
    }
    const htmlToPrint = tableEl.outerHTML;

    const familyName = patient ? `${patient.lastName} Family` : 'Family';
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Family Ledger - ' + familyName + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; margin-bottom: 20px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }');
    printWindow.document.write('.MuiCheckbox-root, input[type="checkbox"], button, .hide-on-print, .no-print { display: none !important; }');
    printWindow.document.write('h6, h5, h2 { font-family: sans-serif; color: #333; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(`<h2>Family Ledger Report - ${familyName}</h2>`);
    printWindow.document.write(htmlToPrint);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
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
          sx={{ textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6', borderRadius: '8px', px: 2, fontWeight: 600 }}
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
        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <TableContainer component={Paper} elevation={0} id="family-ledger-table">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                  {['Date', 'Patient', 'Description', 'Amount', 'Balance', 'User'].map((head) => (
                    <TableCell key={head}>
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
                  <TableRow key={index} hover sx={{ '& td': { fontSize: '0.75rem', py: 1.5, verticalAlign: 'middle', borderBottom: '1px solid #e2e8f0', color: '#1e293b' } }}>
                    <TableCell>{dateStr}</TableCell>
                    <TableCell>{row.patientName}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell sx={{ color: row.credits > 0 ? '#2e7d32' : 'inherit', fontWeight: row.credits > 0 ? '500' : 'normal' }}>
                      {amtStr}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{balStr}</TableCell>
                    <TableCell>STAFF</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default FamilyLedgerTable;
