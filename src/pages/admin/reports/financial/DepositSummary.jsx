import React, { useState, useEffect } from 'react';
import { reportingService } from '../../../../services/reporting.service';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
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

const PAYMENT_TYPES = [
  'Do not use', 'Check', 'Debit Card', 'EFT', 'Cash', 'Care Credit', 'Master Card', 'Visa Card', 'ACH Payment',
  'American Express', 'Discover', 'Card on File', 'Online Card', 'Sunbit', 'Cherry', 'HFD', 'VCC'
];

const DepositSummary = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepositSummary();
  }, []);

  const fetchDepositSummary = async () => {
    setLoading(true);
    try {
      const data = await reportingService.getFinancialReport('deposit-summary', { startDate, endDate });
      setSummaryData(data || []);
    } catch (err) {
      console.error(err);
      setSummaryData([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    if (!summaryData) return;
    let csvContent = "data:text/csv;charset=utf-8,Date,Amount,Comment\n";
    summaryData.forEach(row => {
      csvContent += `"${row.date}","${row.amount}","${row.comment}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "deposit_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CheckboxGroup = ({ title, items }) => (
    <Box sx={{ mb: 3 }}>
      <FormControlLabel
        control={<Checkbox size="small" />}
        label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{title}</Typography>}
      />
      <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column' }}>
        {items.map((item, idx) => (
          <FormControlLabel
            key={idx}
            control={<Checkbox size="small" />}
            label={<Typography sx={{ fontSize: '0.75rem' }}>{item}</Typography>}
            sx={{ mb: -0.5 }}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: '#1a3a6b', fontWeight: 600, mb: 3, fontSize: '0.95rem', borderBottom: '1px solid #1a3a6b', width: 'fit-content', pb: 0.5 }}>
        Deposit Summary:
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={7}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a3a6b', mb: 1, borderBottom: '1px solid #e0e0e0', pb: 0.5 }}>
            Create new deposit summary:
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
            <Button variant="contained" size="small" onClick={handleExportCSV} sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Export CSV</Button>
            <Button variant="contained" size="small" onClick={handlePrint} sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Print</Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
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
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" size="small" onClick={fetchDepositSummary} sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Apply Filters</Button>
              <Button variant="contained" size="small" sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>Create Template</Button>
            </Box>
          </Box>

          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 2 }}>Include payment types</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <CheckboxGroup title="Patient payment types" items={PAYMENT_TYPES} />
            </Grid>
            <Grid item xs={4}>
              <CheckboxGroup title="Insurance payment types" items={PAYMENT_TYPES.slice(0, 15)} />
            </Grid>
            <Grid item xs={4}>
              <CheckboxGroup title="Include refund payment types" items={PAYMENT_TYPES.slice(0, 15)} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <CheckboxGroup title="Include Deposits" items={PAYMENT_TYPES.slice(0, 5)} />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" size="small" onClick={fetchDepositSummary} sx={{ backgroundColor: '#5c85bb', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>
              Preview Deposit
            </Button>
            <Button variant="contained" size="small" onClick={handlePrint} sx={{ backgroundColor: '#dcb265', textTransform: 'none', fontSize: '0.72rem', py: 0.3, px: 1.5, minWidth: 'auto' }}>
              Print Slip
            </Button>
          </Box>
        </Grid>

        {/* Divider */}
        <Grid item xs={false} md={0.5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2, borderColor: '#5c85bb' }} />
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
             <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a3a6b', borderBottom: '1px solid #1a3a6b', pb: 0.5 }}>
              Deposit summary:
            </Typography>
             <Button
              variant="contained"
              onClick={handlePrint}
              sx={{
                backgroundColor: '#dcb265',
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                minWidth: 60,
                height: 30,
                '&:hover': { backgroundColor: '#c99f54' }
              }}
            >
              Print
            </Button>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress size={30} /></Box>
            ) : !summaryData ? (
              <>
                <Typography sx={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#333', mb: 1 }}>
                  No summary create.
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#666' }}>
                  Create a deposit summary by editing the left side options and clicking 'Preview Deposit'.
                </Typography>
              </>
            ) : summaryData.length === 0 ? (
              <Typography sx={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#666' }}>No deposits found for this date range.</Typography>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fcfcfc' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Comment</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summaryData.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{row.date}</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem' }}>{row.comment}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>${(row.amount || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell colSpan={2} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                        ${summaryData.reduce((acc, curr) => acc + (curr.amount || 0), 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepositSummary;

