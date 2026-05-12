import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Select,
  MenuItem,
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
  TextField,
  Link as MuiLink,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

const ProductionCollection = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const dummyData = [
    {
      date: '05/08/26',
      flags: true,
      patient: 'Patient A',
      dob: '05/22/1986',
      code: 'D0274',
      procedure: 'BW4',
      render: 'SAB',
      bill: 'SAB',
      charge: 0,
      adj: 0,
      estWriteOff: 0,
      insPayment: 35.00,
      ptPayment: 0,
      actualWriteOff: 0,
      collAdj: 0,
      ptRefund: 0,
      insRefund: 0,
      payFromCredit: 0,
      refundToCredit: 0,
      credit: 0,
      overpayment: 0
    },
    {
      date: '05/08/26',
      flags: true,
      patient: 'Patient B',
      dob: '05/22/1986',
      code: 'D0120',
      procedure: 'periodic ex',
      render: 'SAB',
      bill: 'SAB',
      charge: 0,
      adj: 0,
      estWriteOff: 0,
      insPayment: 31.00,
      ptPayment: 0,
      actualWriteOff: 0,
      collAdj: 0,
      ptRefund: 0,
      insRefund: 0,
      payFromCredit: 0,
      refundToCredit: 0,
      credit: 0,
      overpayment: 0
    }
  ];

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, borderBottom: '2px solid #1976d2', display: 'inline-block', pb: 0.5 }}>
        Production & Collection Report:
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ minHeight: 36 }}>
          <Tab label="Current Report" sx={{ textTransform: 'none', minHeight: 36, fontSize: '0.875rem' }} />
          <Tab label="Generated Reports" sx={{ textTransform: 'none', minHeight: 36, fontSize: '0.875rem' }} />
        </Tabs>
      </Box>

      {/* Filters Section */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
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

        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>Provider:</Typography>
            <Button variant="outlined" size="small" sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0 }}>Select Provider ⌄</Button>
          </Grid>
          <Grid item>
            <RadioGroup row defaultValue="no-grouping">
              <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption">No Grouping</Typography>} />
              <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption">Group By Provider</Typography>} />
            </RadioGroup>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mb: 1 }}>
          <Grid item>
            <RadioGroup row defaultValue="filter">
              <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ borderBottom: '1px solid' }}>Filter Codes</Typography>} />
              <FormControlLabel value="exclude" control={<Radio size="small" />} label={<Typography variant="caption">Enter Codes to Exclude</Typography>} />
            </RadioGroup>
            <Box sx={{ mt: 0.5 }}>
              <TextField 
                size="small" 
                placeholder="Enter code or procedure" 
                sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5 } }} 
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Display Only Records with Collection</Typography>} />
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Exclude Products</Typography>} />
          <FormControlLabel control={<Checkbox size="small" defaultChecked />} label={<Typography variant="caption">Show Flags in Report</Typography>} />
          <FormControlLabel control={<Checkbox size="small" defaultChecked />} label={<Typography variant="caption">Show Date of Birth</Typography>} />
          <FormControlLabel control={<Checkbox size="small" defaultChecked />} label={<Typography variant="caption">Show Provider</Typography>} />
          <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="caption">Filter by DOS</Typography>} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Select size="small" defaultValue="pts" sx={{ minWidth: 200, fontSize: '0.75rem' }}>
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

      {/* Action Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <MuiLink sx={{ fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>Office (no provider section)</MuiLink>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', bgcolor: '#4a90e2' }}>Export as CSV</Button>
          <Button variant="contained" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none', bgcolor: '#f5a623' }}>Print</Button>
        </Box>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' } }}>
              <TableCell>Date</TableCell>
              <TableCell>Flags</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Procedure</TableCell>
              <TableCell align="center" colSpan={2} sx={{ borderLeft: '1px solid #e0e0e0' }}>Provider / Internal Code</TableCell>
              <TableCell align="center" colSpan={3} sx={{ borderLeft: '1px solid #e0e0e0' }}>Production</TableCell>
              <TableCell align="center" colSpan={10} sx={{ borderLeft: '1px solid #e0e0e0' }}>Collection</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' } }}>
              <TableCell colSpan={6}></TableCell>
              <TableCell align="center" sx={{ borderLeft: '1px solid #e0e0e0' }}>Render</TableCell>
              <TableCell align="center">Bill</TableCell>
              <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>Procedure Charge</TableCell>
              <TableCell align="right">Adj</TableCell>
              <TableCell align="right">Estimate write off ⓘ</TableCell>
              <TableCell align="right" sx={{ borderLeft: '1px solid #e0e0e0' }}>Insurance Payment</TableCell>
              <TableCell align="right">Patient Payment</TableCell>
              <TableCell align="right">Actual Write-off ⓘ</TableCell>
              <TableCell align="right">Adj ⓘ</TableCell>
              <TableCell align="right">Pt. Refund ⓘ</TableCell>
              <TableCell align="right">Ins. Refund ⓘ</TableCell>
              <TableCell align="right">Pay From Credit ⓘ</TableCell>
              <TableCell align="right">Refund To Credit ⓘ</TableCell>
              <TableCell align="right">Credit (+/-) ⓘ</TableCell>
              <TableCell align="right">Overpayment To Credit ⓘ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((row, idx) => (
              <TableRow key={idx} sx={{ '& td': { fontSize: '0.7rem', py: 0.5, whiteSpace: 'nowrap' } }}>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                   <Box sx={{ width: 12, height: 12, bgcolor: '#f5a623', borderRadius: '2px' }} />
                </TableCell>
                <TableCell color="primary" sx={{ color: 'primary.main', fontWeight: 600 }}>{row.patient}</TableCell>
                <TableCell>{row.dob}</TableCell>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.procedure}</TableCell>
                <TableCell align="center" sx={{ borderLeft: '1px solid #f0f0f0' }}>{row.render}</TableCell>
                <TableCell align="center">{row.bill}</TableCell>
                <TableCell align="right" sx={{ borderLeft: '1px solid #f0f0f0' }}>${row.charge.toFixed(2)}</TableCell>
                <TableCell align="right">${row.adj.toFixed(2)}</TableCell>
                <TableCell align="right">${row.estWriteOff.toFixed(2)}</TableCell>
                <TableCell align="right" sx={{ borderLeft: '1px solid #f0f0f0' }}>${row.insPayment.toFixed(2)}</TableCell>
                <TableCell align="right">${row.ptPayment.toFixed(2)}</TableCell>
                <TableCell align="right">${row.actualWriteOff.toFixed(2)}</TableCell>
                <TableCell align="right">${row.collAdj.toFixed(2)}</TableCell>
                <TableCell align="right">${row.ptRefund.toFixed(2)}</TableCell>
                <TableCell align="right">${row.insRefund.toFixed(2)}</TableCell>
                <TableCell align="right">${row.payFromCredit.toFixed(2)}</TableCell>
                <TableCell align="right">${row.refundToCredit.toFixed(2)}</TableCell>
                <TableCell align="right">${row.credit.toFixed(2)}</TableCell>
                <TableCell align="right">${row.overpayment.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductionCollection;
