import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import { FileDownload, Print, ChevronLeft, ChevronRight } from '@mui/icons-material';

const RxReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [providerFilter, setProviderFilter] = useState('All');

  const rows = [
    { 
      id: 77, 
      provider: 'Dr. Smith', 
      patient: 'Francis Fuller', 
      startDate: '05/07/2026', 
      dose: '5MG', 
      refills: 0, 
      duration: '2 Week', 
      longTerm: 'No', 
      prints: 0, 
      notes: '', 
      drugName: 'FLEXERIL' 
    }
  ];

  const filteredRows = useMemo(() => {
    let result = rows;
    if (providerFilter !== 'All') {
      result = result.filter(r => r.provider === providerFilter);
    }
    if (startDate || endDate) {
      const s = startDate ? new Date(startDate) : new Date('1900-01-01');
      const e = endDate ? new Date(endDate) : new Date('2100-01-01');
      result = result.filter(r => {
        const d = new Date(r.startDate);
        return d >= s && d <= e;
      });
    }
    return result;
  }, [providerFilter, startDate, endDate]);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Rx #,Provider,Patient,Start Date,Dose,Refills,Duration,Long Term,Prints,Notes,Drug Name\n";
    filteredRows.forEach(row => {
      csvContent += `"${row.id}","${row.provider}","${row.patient}","${row.startDate}","${row.dose}","${row.refills}","${row.duration}","${row.longTerm}","${row.prints}","${row.notes}","${row.drugName}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rx_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline', mb: 2, cursor: 'pointer', display: 'inline-block' }}>
        RX Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Start Date:</Typography>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ fontSize: '0.85rem', padding: '4px', border: '1px solid #ccc' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>End Date:</Typography>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ fontSize: '0.85rem', padding: '4px', border: '1px solid #ccc' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Provider:</Typography>
          <Select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} size="small" variant="standard" sx={{ minWidth: 120, fontSize: '0.85rem' }}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Dr. Smith">Dr. Smith</MenuItem>
          </Select>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="text" size="small" onClick={() => { setStartDate(''); setEndDate(''); setProviderFilter('All'); }} sx={{ textTransform: 'none', color: 'error.main' }}>Clear filters</Button>
        </Box>
      </Box>

      <Divider sx={{ my: 3, borderColor: '#d1a066' }} />

      {/* Export Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 4 }}>
        <Button variant="contained" size="small" onClick={handleExportCSV} startIcon={<FileDownload />} sx={{ backgroundColor: '#4a90e2', textTransform: 'none' }}>Export as CSV</Button>
        <Button variant="contained" size="small" onClick={handlePrint} startIcon={<Print />} sx={{ backgroundColor: '#d1a066', textTransform: 'none' }}>Print</Button>
      </Box>

      {/* RX Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f9fafb' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Rx #</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Provider</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Dose</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Refills</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Long Term</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Prints</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Notes</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Drug Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.id}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b' }}>{row.provider}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b' }}>{row.patient}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.startDate}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.dose}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.refills}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.duration}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.longTerm}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.prints}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.notes}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.drugName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RxReport;
