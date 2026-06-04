import React, { useState, useMemo } from 'react';
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Select Status');

  const filteredTransactions = useMemo(() => {
    let filtered = MOCK_TRANSACTIONS;
    if (selectedStatus !== 'Select Status') {
      filtered = filtered.filter(row => row.status === selectedStatus);
    }
    if (startDate || endDate) {
      const sDate = startDate ? new Date(startDate) : new Date('1900-01-01');
      const eDate = endDate ? new Date(endDate) : new Date('2100-01-01');
      filtered = filtered.filter(row => {
        const itemDate = new Date(row.created);
        return itemDate >= sDate && itemDate <= eDate;
      });
    }
    return filtered;
  }, [selectedStatus, startDate, endDate]);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Patient ID,Created On,Transaction Type,Transaction Number,Status\n";
    MOCK_TRANSACTIONS.forEach(row => {
      csvContent += `"${row.id}","${row.created}","${row.type}","${row.number}","${row.status}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "openedge_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Open Edge Transactions Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Start Date:</Typography>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>End Date:</Typography>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Filter by Status:</Typography>
          <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} size="small" sx={{ fontSize: '0.85rem', minWidth: 120, height: 32, backgroundColor: '#5c85bb', color: '#fff' }}>
            <MenuItem value="Select Status">Select Status</MenuItem>
            <MenuItem value="Credit Card Declined">Credit Card Declined</MenuItem>
            <MenuItem value="Timed Out">Timed Out</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 3 }}>
        <Button variant="contained" size="small" sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Apply Filters</Button>
        <Button variant="contained" size="small" sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Create Template</Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV} sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Export as CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Print</Button>
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
            {filteredTransactions.map((row, index) => (
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

