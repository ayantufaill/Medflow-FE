import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Grid, Select, MenuItem, Radio, RadioGroup, FormControlLabel, Checkbox, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Link as MuiLink
} from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox } from '../../../../components/reports/ui';

const ProductionCollection = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const dummyData = [
    {
      date: '05/08/26', flags: true, patient: 'Patient A', dob: '05/22/1986', code: 'D0274', procedure: 'BW4', render: 'SAB', bill: 'SAB', charge: 0, adj: 0, estWriteOff: 0, insPayment: 35.00, ptPayment: 0, actualWriteOff: 0, collAdj: 0, ptRefund: 0, insRefund: 0, payFromCredit: 0, refundToCredit: 0, credit: 0, overpayment: 0
    },
    {
      date: '05/08/26', flags: true, patient: 'Patient B', dob: '05/22/1986', code: 'D0120', procedure: 'periodic ex', render: 'SAB', bill: 'SAB', charge: 0, adj: 0, estWriteOff: 0, insPayment: 31.00, ptPayment: 0, actualWriteOff: 0, collAdj: 0, ptRefund: 0, insRefund: 0, payFromCredit: 0, refundToCredit: 0, credit: 0, overpayment: 0
    }
  ];

  const topFilters = (
    <>
      <ReportSelect 
        label="daily" 
        prefix="Date Range:" 
        defaultValue="daily"
        options={[{ value: 'daily', label: 'Daily' }]}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
        <Typography variant="caption" sx={{ color: '#337ab7', fontWeight: 600 }}>⬅ May 08, 2026 ⮕</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, mr: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7' }}>05/08/2026</Typography>
      </Box>

      <ReportSelect 
        label="All" 
        prefix="Provider:" 
        defaultValue="All"
        options={[{ value: 'All', label: 'Select Provider' }]}
      />
      
      <RadioGroup row defaultValue="no-grouping" sx={{ ml: 2 }}>
        <FormControlLabel value="no-grouping" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>No Grouping</Typography>} />
        <FormControlLabel value="group-provider" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Group By Provider</Typography>} />
      </RadioGroup>
    </>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
        <RadioGroup row defaultValue="filter">
          <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Filter Codes</Typography>} />
          <FormControlLabel value="exclude" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Enter Codes to Exclude</Typography>} />
        </RadioGroup>
        <TextField 
          size="small" 
          variant="outlined"
          placeholder="Enter code or procedure" 
          sx={{ width: 220, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.75rem', backgroundColor: '#fff' } }} 
        />
      </Box>

      <ReportCheckbox label="Display Only Records with Collection" />
      <ReportCheckbox label="Exclude Products" />
      <ReportCheckbox label="Show Flags in Report" defaultChecked />
      <ReportCheckbox label="Show Date of Birth" defaultChecked />
      <ReportCheckbox label="Show Provider" defaultChecked />
      <ReportCheckbox label="Filter by DOS" />

      <ReportSelect 
        label="pts" 
        defaultValue="pts"
        options={[{ value: 'pts', label: 'Pts With Or Without Flags' }]}
        sx={{ ml: 2 }}
      />
      <ReportSelect 
        label="default" 
        prefix="Sort Report By:" 
        defaultValue="default"
        options={[{ value: 'default', label: 'Default' }]}
      />
    </>
  );

  const customBottomRowLeftActions = (
    <MuiLink sx={{ fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', color: '#337ab7', mr: 2 }}>Office (no provider section)</MuiLink>
  );

  return (
    <ReportLayout title="Production & Collection Report:">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ minHeight: 36, '& .MuiTab-root': { textTransform: 'none', minHeight: 36, fontSize: '0.875rem', fontWeight: 600 } }}>
          <Tab label="Current Report" />
          <Tab label="Generated Reports" />
        </Tabs>
      </Box>

      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        bottomRowLeftActions={customBottomRowLeftActions}
        onApplyFilters={() => console.log('Apply')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', overflowX: 'auto', borderRadius: '4px' }}>
        <Table size="small" sx={{ '& .MuiTableCell-root': { borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap', py: 1 } }}>
              <TableCell rowSpan={2}>Date</TableCell>
              <TableCell rowSpan={2}>Flags</TableCell>
              <TableCell rowSpan={2}>Patient</TableCell>
              <TableCell rowSpan={2}>Date of Birth</TableCell>
              <TableCell rowSpan={2}>Code</TableCell>
              <TableCell rowSpan={2}>Procedure</TableCell>
              <TableCell align="center" colSpan={2}>Provider / Internal Code</TableCell>
              <TableCell align="center" colSpan={3}>Production</TableCell>
              <TableCell align="center" colSpan={10}>Collection</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap', py: 1 } }}>
              <TableCell align="center">Render</TableCell>
              <TableCell align="center">Bill</TableCell>
              <TableCell align="right">Procedure Charge</TableCell>
              <TableCell align="right">Adj</TableCell>
              <TableCell align="right">Estimate write off ⓘ</TableCell>
              <TableCell align="right">Insurance Payment</TableCell>
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
              <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fcfcfc', '& td': { fontSize: '0.7rem', py: 0.5, whiteSpace: 'nowrap' } }}>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                   <Box sx={{ width: 12, height: 12, bgcolor: '#f5a623', borderRadius: '2px' }} />
                </TableCell>
                <TableCell sx={{ color: '#337ab7', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>{row.patient}</TableCell>
                <TableCell>{row.dob}</TableCell>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.procedure}</TableCell>
                <TableCell align="center">{row.render}</TableCell>
                <TableCell align="center">{row.bill}</TableCell>
                <TableCell align="right">${row.charge.toFixed(2)}</TableCell>
                <TableCell align="right">${row.adj.toFixed(2)}</TableCell>
                <TableCell align="right">${row.estWriteOff.toFixed(2)}</TableCell>
                <TableCell align="right">${row.insPayment.toFixed(2)}</TableCell>
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
    </ReportLayout>
  );
};

export default ProductionCollection;

