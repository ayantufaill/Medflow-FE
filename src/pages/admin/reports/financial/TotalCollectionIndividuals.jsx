import React, { useState } from 'react';
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
} from '@mui/material';

const MOCK_INDIVIDUALS = [
  { id: '616', name: 'Patient A', patientCollection: '-$9.90', insuranceCollection: '$148.00', totalCollection: '$138.10' },
  { id: '253', name: 'Patient B', patientCollection: '$0.00', insuranceCollection: '$1,017.00', totalCollection: '$1,017.00' },
  { id: '196', name: 'Patient C', patientCollection: '$0.00', insuranceCollection: '$216.00', totalCollection: '$216.00' },
  { id: '85', name: 'Patient D', patientCollection: '$0.00', insuranceCollection: '$99.00', totalCollection: '$99.00' },
  { id: '782', name: 'Patient E', patientCollection: '$0.00', insuranceCollection: '$99.00', totalCollection: '$99.00' },
  { id: '298', name: 'Patient F', patientCollection: '$0.00', insuranceCollection: '$119.00', totalCollection: '$119.00' },
  { id: '458', name: 'Patient G', patientCollection: '$0.00', insuranceCollection: '$71.00', totalCollection: '$71.00' },
];

const TotalCollectionIndividuals = () => {
  const [dateRange, setDateRange] = useState('Daily');
  const [sortBy, setSortBy] = useState('Default');

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Total Collection By Individuals Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Date Range:</Typography>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            size="small"
            variant="standard"
            sx={{ fontSize: '0.85rem', minWidth: 100 }}
          >
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
          </Select>
          <Typography sx={{ fontSize: '0.85rem', color: '#1a3a6b', ml: 1 }}>← May 08, 2026 →</Typography>
          <Typography sx={{ fontSize: '0.85rem' }}>Date: 05/08/2026</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem' }}>Sort Report By</Typography>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            sx={{ fontSize: '0.85rem', minWidth: 100, height: 32, backgroundColor: '#5c85bb', color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
          >
            <MenuItem value="Default">Default</MenuItem>
            <MenuItem value="Amount">Amount</MenuItem>
          </Select>
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, py: 0.3, px: 1.5, minWidth: 'auto', '&:hover': { backgroundColor: '#4a74a8' } }}
          >
            Apply Filters
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, py: 0.3, px: 1.5, minWidth: 'auto', '&:hover': { backgroundColor: '#c99f54' } }}
          >
            Create Template
          </Button>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          size="small"
          sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, py: 0.3, px: 1.5, minWidth: 'auto', '&:hover': { backgroundColor: '#4a74a8' } }}
        >
          Export as CSV
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, py: 0.3, px: 1.5, minWidth: 'auto', '&:hover': { backgroundColor: '#c99f54' } }}
        >
          Print
        </Button>
      </Box>

      {/* Individuals Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0', width: '80px' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Patient Collection</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Insurance Collection</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Total Collection</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_INDIVIDUALS.map((row, index) => (
              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fcfcfc' : '#fff' }}>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.id}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1, color: '#0052cc', textDecoration: 'underline' }}>{row.name}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1, color: row.patientCollection.startsWith('-') ? '#d93025' : '#000' }}>{row.patientCollection}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.insuranceCollection}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.totalCollection}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Totals */}
      <Box sx={{ mt: 3, ml: 1 }}>
        <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b', fontWeight: 600, mb: 0.5 }}>
          Total Patient Collection: <Typography component="span" sx={{ fontWeight: 400, color: '#d93025', ml: 1 }}>-$9.90</Typography>
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b', fontWeight: 600, mb: 0.5 }}>
          Total Insurance Collection: <Typography component="span" sx={{ fontWeight: 400, color: '#000', ml: 1 }}>$1,769.00</Typography>
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#1a3a6b', fontWeight: 600 }}>
          Total Collection: <Typography component="span" sx={{ fontWeight: 400, color: '#000', ml: 1 }}>$1,759.10</Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default TotalCollectionIndividuals;

