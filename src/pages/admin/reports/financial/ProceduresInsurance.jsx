import React, { useState, useEffect, useMemo } from 'react';
import { reportingService } from '../../../../services/reporting.service';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';

const ProceduresInsurance = () => {
  const [payerName, setPayerName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProcedures = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('procedures-insurance', { startDate, endDate });
      setReportData(data || []);
    } catch (error) {
      console.error('Failed to fetch', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!payerName) return reportData;
    return reportData.filter(r => r.insurance?.toLowerCase().includes(payerName.toLowerCase()));
  }, [reportData, payerName]);

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 2, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Procedures By Insurance Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>Start Date:</Typography>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} 
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>End Date:</Typography>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} 
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.85rem' }}>Provider:</Typography>
            <Select value="All" size="small" variant="standard" sx={{ fontSize: '0.85rem', minWidth: 100 }}>
              <MenuItem value="All">All</MenuItem>
            </Select>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>Search by Payer:</Typography>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Enter Name"
            value={payerName}
            onChange={(e) => setPayerName(e.target.value)}
            sx={{ width: 220, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.85rem' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={fetchProcedures}
            sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, py: 0.3, px: 1.5, minWidth: 'auto' }}
          >
            Apply Filters
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, py: 0.3, px: 1.5, minWidth: 'auto' }}
          >
            Create Template
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderTop: '1px solid #dcb265', pt: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button
            variant="contained"
            size="small"
            sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', fontWeight: 600, py: 0.3, px: 1.5, minWidth: 'auto' }}
          >
            Print
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={30} /></Box>
          ) : reportData.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>Please click Apply Filters to load procedures</Typography>
            </Box>
          ) : filteredData.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>No procedures found for this payer</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#fcfcfc' }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Procedure Code</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Insurance</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#666' }}>Claim Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row, idx) => (
                    <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.code}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.patient}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.insurance}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.claimStatus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProceduresInsurance;

