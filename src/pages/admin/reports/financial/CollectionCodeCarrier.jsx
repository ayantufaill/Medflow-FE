import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Button,
  TextField,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { reportingService } from '../../../../services/reporting.service';

const CollectionPerCodePerCarrier = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateMode, setDateMode] = useState('daily');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [codeInput, setCodeInput] = useState('');

  useEffect(() => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    if (dateMode === 'daily') {
      // Just today
    } else if (dateMode === 'weekly') {
      start.setDate(today.getDate() - today.getDay());
      end.setDate(start.getDate() + 6);
    } else if (dateMode === 'monthly') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    if (dateMode !== 'range') {
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [dateMode]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('collection-code-carrier', { startDate, endDate });
      setReportData(data || []);
    } catch (error) {
      console.error('Failed to fetch', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    let data = [...reportData];
    if (codeInput.trim()) {
      const search = codeInput.toLowerCase();
      data = data.filter(r => (r.code || '').toLowerCase().includes(search));
    }
    return data;
  }, [reportData, codeInput]);

  const handlePrint = () => window.print();

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Collection per code per carrier:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 4, p: 2, backgroundColor: '#fff', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Start by searching for procedure codes: 
              <Box component="span" sx={{ ml: 1, color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}>Enter Code</Box>
            </Typography>
            <TextField 
              variant="standard" 
              fullWidth 
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Enter code or procedure" 
              sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }} 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Date Range:</Typography>
              <Select size="small" variant="standard" value={dateMode} onChange={(e) => setDateMode(e.target.value)} sx={{ minWidth: 80, fontSize: '0.75rem' }}>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="range">Range</MenuItem>
              </Select>
            </Box>
            {dateMode === 'range' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ fontSize: '0.75rem', padding: '2px' }} />
                <Typography variant="caption">to</Typography>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ fontSize: '0.75rem', padding: '2px' }} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="contained" size="small" onClick={fetchData} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
              <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Table Content */}
      <Box sx={{ py: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredData.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {codeInput ? 'No data found for this procedure code.' : 'Start by searching for procedure codes:'}
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Carrier</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Collection</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ fontSize: '0.8rem' }}>{row.code}</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: 'primary.main', fontWeight: 600 }}>{row.carrier}</TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.8rem' }}>${(row.collection || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell colSpan={2} align="right" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Total:</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'primary.main' }}>
                    ${filteredData.reduce((sum, r) => sum + (r.collection || 0), 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Disclaimers Section */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, textDecoration: 'underline', display: 'block', mb: 1, color: 'primary.main' }}>
              Disclaimers:
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, lineHeight: 1.4 }}>
              • Dual coverage excluded from the total collections and average per code
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.4 }}>
              • Carrier (in network or out of network) is based on the current status of the insurance per provider. ie. If you were in network during the selected range and the carrier is currently out of network, the results will show the carrier out of network
            </Typography>
          </Box>
          <Button variant="contained" size="small" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623', ml: 4 }}>
            Print
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CollectionPerCodePerCarrier;
