import React from 'react';
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

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline', mb: 2, cursor: 'pointer', display: 'inline-block' }}>
        RX Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Date Range:</Typography>
          <Select defaultValue="Daily" size="small" variant="standard" sx={{ minWidth: 100, fontSize: '0.85rem' }}>
            <MenuItem value="Daily">Daily</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small"><ChevronLeft fontSize="small" /></IconButton>
          <Typography variant="body2" color="primary">May 07, 2026</Typography>
          <Typography variant="body2" sx={{ mx: 1 }}>➔</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Date:</Typography>
          <Typography variant="body2" color="primary">05/07/2026</Typography>
          <IconButton size="small"><ChevronRight fontSize="small" /></IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Provider:</Typography>
          <Select defaultValue="All" size="small" variant="standard" sx={{ minWidth: 120, fontSize: '0.85rem' }}>
            <MenuItem value="All">All</MenuItem>
          </Select>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" size="small" sx={{ backgroundColor: '#8db3d9', textTransform: 'none', px: 3 }}>Apply</Button>
        </Box>
      </Box>

      <Divider sx={{ my: 3, borderColor: '#d1a066' }} />

      {/* Export Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 4 }}>
        <Button variant="contained" size="small" startIcon={<FileDownload />} sx={{ backgroundColor: '#4a90e2', textTransform: 'none' }}>Export as CSV</Button>
        <Button variant="contained" size="small" startIcon={<Print />} sx={{ backgroundColor: '#d1a066', textTransform: 'none' }}>Print</Button>
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
            {rows.map((row) => (
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
