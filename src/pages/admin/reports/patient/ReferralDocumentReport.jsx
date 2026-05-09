import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from '@mui/material';
import dayjs from 'dayjs';

const DUMMY_DATA = [
  { patient: 'Bonnie Fuller', provider: 'Dr. Smith', created: '05/07/2026', due: '', shared: '05/07/2026', status: 'Sent Out' },
  { patient: 'Sarah Miller', provider: 'Dr. Johnson', created: '05/04/2026', due: '', shared: '05/04/2026', status: 'Sent Out' },
  { patient: 'Charlie Wright', provider: 'Dr. Brown', created: '04/30/2026', due: '', shared: '05/01/2026', status: 'Sent Out' },
  { patient: 'David Lee', provider: 'Dr. Davis', created: '04/29/2026', due: '', shared: '04/29/2026', status: 'Sent Out' },
  { patient: 'Jane Smith', provider: 'Dr. White', created: '04/22/2026', due: '', shared: '04/22/2026', status: 'Sent Out' },
  { patient: 'Sabrina Sosa', provider: 'Dr. Green', created: '03/19/2026', due: '', shared: '', status: 'New' },
];

const ReferralDocumentReport = () => {
  const [status, setStatus] = useState('none');
  const [provider, setProvider] = useState('all');

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
      <Typography 
        variant="body2" 
        sx={{ color: '#337ab7', fontWeight: 500, mb: 2, textDecoration: 'underline', cursor: 'pointer' }}
      >
        Referral Document:
      </Typography>

      {/* Filter Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, mr: 2 }}>Filter By:</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Status:</Typography>
          <Select 
            variant="standard"
            size="small" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            sx={{ fontSize: '0.75rem', width: 100, height: 24 }}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="sent">Sent Out</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Provider:</Typography>
          <Select 
            variant="standard"
            size="small" 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)}
            sx={{ fontSize: '0.75rem', width: 120, height: 24 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="smith">Dr. Smith</MenuItem>
          </Select>
        </Box>

        <Button 
          variant="contained" 
          size="small" 
          sx={{ ml: 'auto', textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', boxShadow: 'none' }}
        >
          Apply Filters
        </Button>
      </Box>

      <Divider sx={{ mb: 2, opacity: 0.3 }} />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button 
          variant="contained" 
          size="small" 
          sx={{ textTransform: 'none', backgroundColor: '#4a89dc', fontSize: '0.75rem', boxShadow: 'none' }}
        >
          Export as CSV
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', boxShadow: 'none' }}
        >
          Print
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {['Referral Patient', 'Referral Provider', 'Created Date', 'Due Date', 'Shared Date', 'Status'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.72rem', borderBottom: '1px solid #ddd' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {DUMMY_DATA.map((row, i) => (
              <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.provider}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.created}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.due}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.shared}</TableCell>
                <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReferralDocumentReport;
