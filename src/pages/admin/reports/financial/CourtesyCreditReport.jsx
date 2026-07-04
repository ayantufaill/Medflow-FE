import React from 'react';
import { Box, Typography, Grid, TableRow, TableCell } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportSearchInput, ReportDataTable } from '../../../../components/reports/ui';

const CourtesyCreditReport = () => {
  const dummyData = [
    {
      flags: ['#22c55e', '#ef4444', '#a855f7'],
      id: '6',
      name: 'Patient One',
      amount: 200.00
    },
    {
      flags: [],
      id: '701',
      name: 'Patient Two',
      amount: 149.60
    }
  ];

  const columns = [
    { label: 'Flags' },
    { label: 'Patient ID' },
    { label: <Box sx={{ display: 'flex', alignItems: 'center' }}>Patient Name <UnfoldMoreIcon sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} /></Box> },
    { label: <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>Amount <UnfoldMoreIcon sx={{ fontSize: 16, ml: 0.5, color: '#94a3b8' }} /></Box>, align: 'right' },
  ];

  const renderRow = (row, idx) => (
    <TableRow key={idx} sx={{ '& td': { fontSize: '0.75rem', py: 1 }, backgroundColor: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 0.2 }}>
          {row.flags.map((color, i) => (
            <Box key={i} sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px' }} />
          ))}
        </Box>
      </TableCell>
      <TableCell>{row.id}</TableCell>
      <TableCell sx={{ color: '#337ab7', fontWeight: 600, cursor: 'pointer' }}>{row.name}</TableCell>
      <TableCell align="right" sx={{ fontWeight: 600 }}>${row.amount.toFixed(2)}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <ReportSelect defaultValue="all" prefix="Filter by Outstanding:" options={[{ value: 'all', label: 'All patients' }]} width="200px" />
      <ReportSelect defaultValue="all" prefix="Filter by Patients:" options={[{ value: 'all', label: 'All' }]} width="200px" />
      <ReportSelect defaultValue="pts" prefix="Filter by Flags:" options={[{ value: 'pts', label: 'Patients with or without flags' }]} width="240px" />
    </>
  );

  const bottomFilters = (
    <>
      <ReportSearchInput placeholder="Search by patient name" width="250px" />
    </>
  );

  return (
    <ReportLayout title="Courtesy Credit Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply Filters')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      {/* Table Section */}
      <ReportDataTable 
        columns={columns} 
        data={dummyData} 
        renderRow={renderRow} 
      />
      <Box sx={{ border: '1px solid #e0e0e0', borderTop: 'none', backgroundColor: '#fcfcfc', py: 1.5, px: 2 }}>
        <Grid container>
          <Grid item xs={6} sx={{ textAlign: 'right', pr: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Total</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>2 patients</Typography>
          </Grid>
          <Grid item xs={3} sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>$349.60</Typography>
          </Grid>
        </Grid>
      </Box>
    </ReportLayout>
  );
};

export default CourtesyCreditReport;
