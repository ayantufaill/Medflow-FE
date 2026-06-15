import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';

const CoverageBookModal = ({ open, onClose, coverageData = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Extended mock data to represent a full coverage book
  const mockFullData = [
    { code: 'D0120', name: 'Periodic oral evaluation', rule: 'Covered 100%', waiting: 'None', limit: '2 per 12 months' },
    { code: 'D0150', name: 'Comprehensive oral evaluation', rule: 'Covered 100%', waiting: 'None', limit: '1 per 36 months' },
    { code: 'D0210', name: 'Intraoral - complete series', rule: 'Covered 100%', waiting: 'None', limit: '1 per 60 months' },
    { code: 'D1110', name: 'Prophylaxis - adult', rule: 'Covered 100%', waiting: 'None', limit: '2 per 12 months' },
    { code: 'D1206', name: 'Topical fluoride varnish', rule: 'Covered 100%', waiting: 'None', limit: '2 per 12 months, up to age 14' },
    { code: 'D1351', name: 'Sealant - per tooth', rule: 'Covered 100%', waiting: 'None', limit: '1 per tooth per 36 months, up to age 16' },
    { code: 'D2140', name: 'Amalgam - one surface', rule: 'Covered 80%', waiting: '6 months', limit: '1 per surface per 24 months' },
    { code: 'D2391', name: 'Resin composite - one surface', rule: 'Covered 80%', waiting: '6 months', limit: '1 per surface per 24 months' },
    { code: 'D2740', name: 'Crown - porcelain/ceramic', rule: 'Covered 50%', waiting: '12 months', limit: '1 per tooth per 60 months' },
    { code: 'D3310', name: 'Endodontic therapy, anterior', rule: 'Covered 80%', waiting: '6 months', limit: '1 per tooth per lifetime' },
    { code: 'D4341', name: 'Periodontal scaling & root planing', rule: 'Covered 80%', waiting: '6 months', limit: '1 per quadrant per 24 months' },
    { code: 'D5110', name: 'Complete denture - maxillary', rule: 'Covered 50%', waiting: '12 months', limit: '1 per 60 months' },
    { code: 'D7140', name: 'Extraction - erupted tooth', rule: 'Covered 80%', waiting: 'None', limit: 'None' },
    { code: 'D8080', name: 'Comprehensive orthodontic treatment', rule: 'Covered 50%', waiting: '12 months', limit: 'Up to age 19, $1500 lifetime max' },
  ];

  // We could merge coverageData here if it was saved, but typically the full book is fetched from backend.
  // We'll use mockFullData for the demonstration of the detailed panel.
  const displayData = coverageData.length > 0 ? coverageData : mockFullData;

  const filteredData = displayData.filter(item => 
    item.code?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f0f4f8' }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: '#1a3353' }}>
          Full Coverage Book
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            size="small"
            placeholder="Search procedure code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: '300px' }}
          />
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#eef4ff' }}>
                <TableCell sx={{ fontWeight: 700, width: '15%' }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 700, width: '30%' }}>Procedure Description</TableCell>
                <TableCell sx={{ fontWeight: 700, width: '15%' }}>Coverage Rule</TableCell>
                <TableCell sx={{ fontWeight: 700, width: '15%' }}>Waiting Period</TableCell>
                <TableCell sx={{ fontWeight: 700, width: '25%' }}>Limitations / Frequency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell sx={{ color: '#2e7d32', fontWeight: 500 }}>{row.rule || 'See plan details'}</TableCell>
                  <TableCell>{row.waiting || 'None'}</TableCell>
                  <TableCell>{row.limit || '-'}</TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#666' }}>
                    No procedures found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: '#f0f4f8' }}>
        <Button onClick={onClose} variant="contained" sx={{ textTransform: 'none', bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CoverageBookModal;
