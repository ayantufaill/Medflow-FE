import React from 'react';
import {
  Box,
  Typography,
  Grid,
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
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const ProviderCollectionPerPaymentType = () => {
  const dummyData = [
    { date: '05/08/26', flags: ['#f5a623'], patient: 'Patient A', code: 'D0274', procedure: 'BW4', render: 'SAB', bill: 'SAB', ins: 35.00, pt: 0, actual: 0, adj: 0, ptRef: 0, insRef: 0, payFrom: 0, newCredit: 0 },
    { date: '05/08/26', flags: ['#f5a623'], patient: 'Patient B', code: 'D1110', procedure: 'hygiene', render: 'SAB', bill: 'SAB', ins: 53.00, pt: 0, actual: 0, adj: 0, ptRef: 0, insRef: 0, payFrom: 0, newCredit: 0 },
    { date: '05/08/26', flags: ['#f5a623', '#4a90e2', '#e11d48'], patient: 'Patient C', code: 'D2740', procedure: '19 porc Cr', render: 'SAB', bill: 'SAB', ins: 470.00, pt: 0, actual: 0, adj: 0, ptRef: 0, insRef: 0, payFrom: 0, newCredit: 0 },
  ];

  const summaryStats = [
    { label: 'Total Collection Incl. Pay From Credit:', value: '$1,333.00' },
    { label: 'Total Collection Excl. Pay From Credit:', value: '$1,333.00' },
    { label: 'Total Prepayments:', value: '$0.00' },
    { label: 'Actual Write-off:', value: '$0.00' },
    { label: 'Total Collection Adjustments:', value: '$0.00' },
    { label: 'Total Production Adjustments:', value: '$0.00' },
  ];

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Provider Collection Per Payment Type:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Date Range:</Typography>
            <Select size="small" defaultValue="daily" sx={{ minWidth: 100, fontSize: '0.75rem' }}>
              <MenuItem value="daily">Daily</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <Typography variant="caption" color="primary">⬅ May 08, 2026 ⮕ Date: 05/08/2026</Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Filter Report by:</Typography>
          <Select size="small" defaultValue="all" sx={{ minWidth: 140, fontSize: '0.75rem' }}>
            <MenuItem value="all">Provider: All</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel 
              control={<Checkbox size="small" defaultChecked />} 
              label={<Typography variant="caption">Show Flags in Report</Typography>} 
            />
            <Select size="small" defaultValue="pts" sx={{ minWidth: 180, fontSize: '0.75rem' }}>
              <MenuItem value="pts">Pts With Or Without Flags</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Sort Report By</Typography>
              <Select size="small" defaultValue="default" sx={{ minWidth: 100, fontSize: '0.75rem' }}>
                <MenuItem value="default">Default</MenuItem>
              </Select>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Apply Filters</Button>
            <Button variant="contained" size="small" sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Create Template</Button>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
      </Box>

      <Typography variant="body2" sx={{ fontWeight: 700, borderBottom: '1px solid #1976d2', display: 'inline-block', mb: 1, color: 'text.secondary' }}>
        Master Card
      </Typography>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.65rem', fontWeight: 700 } }}>
              <TableCell>Date</TableCell>
              <TableCell>Flags</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Procedure</TableCell>
              <TableCell align="center" colSpan={2} sx={{ borderLeft: '1px solid #e0e0e0' }}>Provider / Internal Code</TableCell>
              <TableCell align="center" colSpan={3} sx={{ borderLeft: '1px solid #e0e0e0' }}>Collection</TableCell>
              <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>Adjustment</TableCell>
              <TableCell align="right">Pt. Refund</TableCell>
              <TableCell align="right">Ins. Refund</TableCell>
              <TableCell align="right">Pay From Credit</TableCell>
              <TableCell align="right">New Credit</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.65rem', fontWeight: 700 } }}>
              <TableCell colSpan={5}></TableCell>
              <TableCell align="center" sx={{ borderLeft: '1px solid #e0e0e0' }}>Render</TableCell>
              <TableCell align="center">Bill</TableCell>
              <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>Insurance Payment</TableCell>
              <TableCell align="right">Patient Payment</TableCell>
              <TableCell align="right">Actual Write-off</TableCell>
              <TableCell colSpan={5}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((row, idx) => (
              <TableRow key={idx} sx={{ '& td': { fontSize: '0.7rem', py: 0.5 } }}>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.2 }}>
                    {row.flags.map((color, i) => (
                      <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>{row.patient}</TableCell>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.procedure}</TableCell>
                <TableCell align="center">{row.render}</TableCell>
                <TableCell align="center">{row.bill}</TableCell>
                <TableCell align="right">${row.ins.toFixed(2)}</TableCell>
                <TableCell align="right">${row.pt.toFixed(2)}</TableCell>
                <TableCell align="right">${row.actual.toFixed(2)}</TableCell>
                <TableCell align="right">${row.adj.toFixed(2)}</TableCell>
                <TableCell align="right">${row.ptRef.toFixed(2)}</TableCell>
                <TableCell align="right">${row.insRef.toFixed(2)}</TableCell>
                <TableCell align="right">${row.payFrom.toFixed(2)}</TableCell>
                <TableCell align="right">${row.newCredit.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={7} align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Total:</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$1,333.00</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$0.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Summary Section */}
      <Box sx={{ mt: 3, ml: 4 }}>
        {summaryStats.map((stat, idx) => (
          <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 500, minWidth: 240, color: 'primary.main' }}>{stat.label}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProviderCollectionPerPaymentType;
