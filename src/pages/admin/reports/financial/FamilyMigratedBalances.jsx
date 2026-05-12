import React from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const FamilyMigratedBalances = () => {
  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid #1a3a6b', textDecoration: 'none', cursor: 'pointer' }}>
          Family Migrated Balances:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, py: 0.3, px: 1.5, minWidth: 'auto' }}
          >
            Export as CSV
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: '#d32f2f', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, py: 0.3, px: 1.5, minWidth: 'auto', '&:hover': { backgroundColor: '#b71c1c' } }}
          >
            Print
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderBottom: 'none', borderRadius: 0 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff', borderTop: '1px solid #e0e0e0' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Patient Owing</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Insurance Owing</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Total Owing</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Migration Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ backgroundColor: '#fcfcfc' }}>
              <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Totals</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>$0.00</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>$0.00</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>$0.00</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FamilyMigratedBalances;

