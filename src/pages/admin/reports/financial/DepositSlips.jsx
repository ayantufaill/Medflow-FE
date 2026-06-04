import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import { reportingService } from '../../../../services/reporting.service';

const DepositSlips = () => {
  const paymentTypes = [
    'Do not use', 'Check', 'Debit Card', 'EFT', 'Cash', 'Care Credit', 
    'Master Card', 'Visa Card', 'ACH Payment', 'American Express', 
    'Discover', 'Card on File', 'Online Card', 'Sunbit', 'Cherry', 'HFD', 'VCC'
  ];
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateMode, setDateMode] = useState('daily');
  const [showPreviousSlips, setShowPreviousSlips] = useState(true);

  useEffect(() => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    if (dateMode === 'daily') {
      // Just today
    } else if (dateMode === 'weekly') {
      // Start of week (Sunday) to End of week (Saturday)
      start.setDate(today.getDate() - today.getDay());
      end.setDate(start.getDate() + 6);
    } else if (dateMode === 'monthly') {
      // First to last day of month
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    if (dateMode !== 'range') {
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [dateMode]);

  const fetchDepositSlips = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('deposit-slips', { startDate, endDate });
      setReportData(data || []);
    } catch (error) {
      console.error('Failed to fetch deposit slips', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepositSlips();
  }, []); // Only run once on mount

  const renderCheckboxList = (title, items) => (
    <Box sx={{ mb: 2 }}>
      <FormControlLabel
        control={<Checkbox size="small" />}
        label={<Typography variant="body2" sx={{ fontWeight: 600 }}>{title}</Typography>}
      />
      <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column' }}>
        {items.map((item) => (
          <FormControlLabel
            key={item}
            control={<Checkbox size="small" defaultChecked={['Check', 'Online Card', 'Sunbit', 'Cherry', 'HFD', 'VCC'].includes(item)} />}
            label={<Typography variant="caption">{item}</Typography>}
            sx={{ my: -0.5 }}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Deposit Slips:
      </Typography>

      <Grid container spacing={4}>
        {/* Left Section - Controls */}
        <Grid item xs={12} md={6} sx={{ borderRight: '1px solid #e0e0e0', pr: 4 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>Create new deposit slip:</Typography>
          
          <RadioGroup row value={dateMode} onChange={(e) => setDateMode(e.target.value)} sx={{ mb: 2 }}>
            <FormControlLabel value="daily" control={<Radio size="small" />} label={<Typography variant="caption">Daily</Typography>} />
            <FormControlLabel value="range" control={<Radio size="small" />} label={<Typography variant="caption">Range</Typography>} />
            <FormControlLabel value="weekly" control={<Radio size="small" />} label={<Typography variant="caption">Weekly</Typography>} />
            <FormControlLabel value="monthly" control={<Radio size="small" />} label={<Typography variant="caption">Monthly</Typography>} />
          </RadioGroup>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="caption">Transactions done from: </Typography>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => { setStartDate(e.target.value); setDateMode('range'); }} 
              style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} 
            />
            <Typography variant="caption">to: </Typography>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => { setEndDate(e.target.value); setDateMode('range'); }} 
              style={{ fontSize: '0.75rem', padding: '2px', border: '1px solid #ccc' }} 
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography variant="caption">Group by provider</Typography>}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Include payment types</Typography>
            <FormControlLabel
              control={<Checkbox size="small" defaultChecked />}
              label={<Typography variant="caption">Include Archived Payment Types</Typography>}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              {renderCheckboxList('Patient payment types', paymentTypes)}
            </Grid>
            <Grid item xs={4}>
              {renderCheckboxList('Insurance payment types', paymentTypes)}
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={<Checkbox size="small" />}
                label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Include refund payment types</Typography>}
              />
              <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column' }}>
                {paymentTypes.map((item) => (
                  <FormControlLabel
                    key={item}
                    control={<Checkbox size="small" defaultChecked={['Check', 'Online Card', 'Sunbit', 'Cherry', 'HFD', 'VCC'].includes(item)} />}
                    label={<Typography variant="caption">{item}</Typography>}
                    sx={{ my: -0.5 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            {renderCheckboxList('Include Deposits', paymentTypes)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button variant="contained" onClick={fetchDepositSlips} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Create Deposit</Button>
            <Button variant="contained" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Grid>

        {/* Right Section - Preview */}
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>Deposit slip:</Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={30} />
            </Box>
          ) : reportData === null ? (
            <>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>No slip created.</Typography>
              <Typography variant="caption" color="text.secondary">
                Create a deposit slip by editing the left side options and clicking 'create'.
              </Typography>
            </>
          ) : reportData.length === 0 ? (
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>No deposits found for this date range.</Typography>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', maxHeight: 600 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>ID</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Bank</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.map((row, idx) => (
                    <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.depositId}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.date}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1, fontWeight: 600 }}>${(row.amount || 0).toFixed(2)}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.bank}</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1, color: row.status === 'Cleared' ? 'success.main' : 'text.primary' }}>{row.status}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ borderTop: '2px solid #e0e0e0' }}>
                    <TableCell colSpan={2} sx={{ fontSize: '0.75rem', py: 1, fontWeight: 700, textAlign: 'right' }}>Total Deposit:</TableCell>
                    <TableCell colSpan={3} sx={{ fontSize: '0.85rem', py: 1, fontWeight: 700, color: 'primary.main' }}>
                      ${reportData.reduce((acc, curr) => acc + (curr.amount || 0), 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Bottom Section - Previous Slips */}
      <Box>
        <Typography 
          variant="body2" 
          onClick={() => setShowPreviousSlips(!showPreviousSlips)}
          sx={{ mb: 2, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', cursor: 'pointer', width: 'fit-content' }}
        >
          <Box component="span" sx={{ mr: 1 }}>{showPreviousSlips ? '⌄' : '›'}</Box> Previous Deposit Slips:
        </Typography>
        
        {showPreviousSlips && (
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Date of Slip</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Total Amount</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { date: '02/01/2022', amount: '29,243.17', note: '' },
                  { date: '03/06/2022', amount: '11,009.60', note: '' },
                  { date: '03/07/2022', amount: '16,890.95', note: '' },
                  { date: '03/07/2022', amount: '18,130.95', note: '' },
                  { date: '03/31/2022', amount: '29,700.28', note: '' },
                  { date: '09/30/2022', amount: '34,352.70', note: '' },
                  { date: '12/26/2022', amount: '334,467.81', note: 'Full year deposit slip 2022.' },
                  { date: '08/02/2023', amount: '6,212.20', note: '' },
                  { date: '08/02/2023', amount: '8,522.40', note: '' },
                ].map((row, idx) => (
                  <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.date}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>${row.amount}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default DepositSlips;
