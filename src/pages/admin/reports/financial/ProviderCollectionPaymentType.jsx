import React from 'react';
import {
  Box, Typography, Grid, Select, MenuItem, Checkbox, FormControlLabel, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox } from '../../../../components/reports/ui';

const ProviderCollectionPerPaymentType = () => {
  const dummyData = [
    { date: '05/08/26', flags: ['#f5a623'], patient: 'Patient A', code: 'D0274', procedure: 'BW4', render: 'SAB', bill: 'SAB', ins: 35.00, pt: 0, actual: 0, adj: 0, ptRef: 0, insRef: 0, payFrom: 0, newCredit: 0 },
    { date: '05/08/26', flags: ['#f5a623'], patient: 'Patient B', code: 'D1110', procedure: 'hygiene', render: 'SAB', bill: 'SAB', ins: 53.00, pt: 0, actual: 0, adj: 0, ptRef: 0, insRef: 0, payFrom: 0, newCredit: 0 },
    { date: '05/08/26', flags: ['#f5a623', '#4a89dc', '#e11d48'], patient: 'Patient C', code: 'D2740', procedure: '19 porc Cr', render: 'SAB', bill: 'SAB', ins: 470.00, pt: 0, actual: 0, adj: 0, ptRef: 0, insRef: 0, payFrom: 0, newCredit: 0 },
  ];

  const summaryStats = [
    { label: 'Total Collection Incl. Pay From Credit:', value: '$1,333.00' },
    { label: 'Total Collection Excl. Pay From Credit:', value: '$1,333.00' },
    { label: 'Total Prepayments:', value: '$0.00' },
    { label: 'Actual Write-off:', value: '$0.00' },
    { label: 'Total Collection Adjustments:', value: '$0.00' },
    { label: 'Total Production Adjustments:', value: '$0.00' },
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
        label="all" 
        prefix="Filter Report by:" 
        defaultValue="all"
        options={[{ value: 'all', label: 'Provider: All' }]}
      />
    </>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox label="Show Flags in Report" defaultChecked />
      
      <ReportSelect 
        label="pts" 
        defaultValue="pts"
        options={[{ value: 'pts', label: 'Pts With Or Without Flags' }]}
      />

      <ReportSelect 
        label="default" 
        prefix="Sort Report By:" 
        defaultValue="default"
        options={[{ value: 'default', label: 'Default' }]}
      />
    </>
  );

  return (
    <ReportLayout title="Provider Collection Per Payment Type:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply')}
        onPrint={() => window.print()}
      />

      <Typography variant="body2" sx={{ fontWeight: 700, borderBottom: '2px solid #337ab7', display: 'inline-block', mb: 2, color: '#337ab7', pb: 0.5 }}>
        Master Card
      </Typography>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
        <Table size="small" sx={{ '& .MuiTableCell-root': { borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.65rem', fontWeight: 700, py: 1 } }}>
              <TableCell rowSpan={2}>Date</TableCell>
              <TableCell rowSpan={2}>Flags</TableCell>
              <TableCell rowSpan={2}>Patient</TableCell>
              <TableCell rowSpan={2}>Code</TableCell>
              <TableCell rowSpan={2}>Procedure</TableCell>
              <TableCell align="center" colSpan={2}>Provider / Internal Code</TableCell>
              <TableCell align="center" colSpan={3}>Collection</TableCell>
              <TableCell align="right" rowSpan={2}>Adjustment</TableCell>
              <TableCell align="right" rowSpan={2}>Pt. Refund</TableCell>
              <TableCell align="right" rowSpan={2}>Ins. Refund</TableCell>
              <TableCell align="right" rowSpan={2}>Pay From Credit</TableCell>
              <TableCell align="right" rowSpan={2}>New Credit</TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#f8f9fa', '& th': { fontSize: '0.65rem', fontWeight: 700, py: 1 } }}>
              <TableCell align="center">Render</TableCell>
              <TableCell align="center">Bill</TableCell>
              <TableCell align="right">Insurance Payment</TableCell>
              <TableCell align="right">Patient Payment</TableCell>
              <TableCell align="right">Actual Write-off</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((row, idx) => (
              <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fcfcfc', '& td': { fontSize: '0.7rem', py: 0.5 } }}>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.2 }}>
                    {row.flags.map((color, i) => (
                      <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#337ab7', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>{row.patient}</TableCell>
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
            <TableRow sx={{ backgroundColor: '#fff' }}>
              <TableCell colSpan={7} align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 1.5 }}>Total:</TableCell>
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
      <Box sx={{ mt: 4, ml: 4 }}>
        {summaryStats.map((stat, idx) => (
          <Box key={idx} sx={{ display: 'flex', mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 260, color: '#337ab7' }}>{stat.label}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
          </Box>
        ))}
      </Box>
    </ReportLayout>
  );
};

export default ProviderCollectionPerPaymentType;

