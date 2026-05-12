import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
} from '@mui/material';

const MOCK_DATA = [
  { name: 'Patient One', dob: 'May/17/1963', email: 'patient1@example.com', phone: '+1 (555) 000-1234', amount: '$350.00', credit: '$350.00', insCredit: '$0.00' },
  { name: 'Patient Two', dob: 'Jul/19/1941', email: 'patient2@example.com', phone: '+1 (555) 000-5678', amount: '$29.90', credit: '$29.90', insCredit: '$0.00' },
  { name: 'Patient Three', dob: 'Dec/06/1966', email: 'patient3@example.com', phone: '+1 (555) 000-9012', amount: '$44.00', credit: '$44.00', insCredit: '$0.00' },
  { name: 'Patient Four', dob: 'Jul/17/1984', email: 'patient4@example.com', phone: '+1 (555) 000-3456', amount: '$395.20', credit: '$395.20', insCredit: '$0.00' },
  { name: 'Patient Five', dob: 'Dec/13/1964', email: 'patient5@example.com', phone: '+1 (555) 000-7890', amount: '$1,275.00', credit: '$1,275.00', insCredit: '$0.00' },
];

const CreditAccountsReport = () => {
  const [filter, setFilter] = useState('All patients');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [groupByCredit, setGroupByCredit] = useState(false);

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Credit Accounts Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.85rem', color: '#666' }}>Filter by Outstanding:</Typography>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            variant="standard"
            sx={{ fontSize: '0.85rem', minWidth: 120 }}
          >
            <MenuItem value="All patients">All patients</MenuItem>
            <MenuItem value="Outstanding only">Outstanding only</MenuItem>
          </Select>
        </Box>

        <FormControlLabel
          control={<Checkbox checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} size="small" />}
          label={<Typography sx={{ fontSize: '0.85rem' }}>Include Inactive Patients</Typography>}
        />

        <FormControlLabel
          control={<Checkbox checked={groupByCredit} onChange={(e) => setGroupByCredit(e.target.checked)} size="small" />}
          label={<Typography sx={{ fontSize: '0.85rem' }}>Group By Credit</Typography>}
        />

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#5c85bb',
              textTransform: 'none',
              fontSize: '0.72rem',
              fontWeight: 600,
              py: 0.3,
              px: 1.5,
              minWidth: 'auto',
              '&:hover': { backgroundColor: '#4a74a8' }
            }}
          >
            Apply Filters
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#dcb265',
              textTransform: 'none',
              fontSize: '0.72rem',
              fontWeight: 600,
              py: 0.3,
              px: 1.5,
              minWidth: 'auto',
              '&:hover': { backgroundColor: '#c99f54' }
            }}
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
          sx={{
            backgroundColor: '#5c85bb',
            textTransform: 'none',
            fontSize: '0.72rem',
            fontWeight: 600,
            py: 0.3,
            px: 1.5,
            minWidth: 'auto',
            '&:hover': { backgroundColor: '#4a74a8' }
          }}
        >
          Export as CSV
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<span>🖨️</span>}
          sx={{
            backgroundColor: '#dcb265',
            textTransform: 'none',
            fontSize: '0.72rem',
            fontWeight: 600,
            py: 0.3,
            px: 1.5,
            minWidth: 'auto',
            '&:hover': { backgroundColor: '#c99f54' }
          }}
        >
          Print
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Patient Name</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Birth Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Phone Number</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Patient Credit</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666', borderBottom: '1px solid #e0e0e0' }}>Insurance Credit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MOCK_DATA.map((row, index) => (
              <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fcfcfc' : '#fff' }}>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.name}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.dob}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.email}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.phone}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.amount}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.credit}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.insCredit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CreditAccountsReport;

