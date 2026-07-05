import React, { useState } from 'react';
import { 
  Box, Typography, Select, MenuItem, Button, TableRow, TableCell, IconButton
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';

const RxReport = () => {
  const [dateRange, setDateRange] = useState('Daily');
  const [provider, setProvider] = useState('All');

  const rows = [
    { 
      id: 77, 
      provider: 'Dr. Smith', 
      patient: 'Francis Fuller', 
      startDate: '05/07/2026', 
      dose: '5MG', 
      refills: 0, 
      duration: '2 Week', 
      longTerm: 'No', 
      prints: 0, 
      notes: '', 
      drugName: 'FLEXERIL' 
    }
  ];

  const columns = [
    { label: 'Rx #' },
    { label: 'Provider' },
    { label: 'Patient' },
    { label: 'Start Date' },
    { label: 'Dose' },
    { label: 'Refills' },
    { label: 'Duration' },
    { label: 'Long Term' },
    { label: 'Prints' },
    { label: 'Notes' },
    { label: 'Drug Name' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={row.id} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.id}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 500 }}>{row.provider}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.startDate}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.dose}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.refills}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.duration}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.longTerm}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.prints}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.notes}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.drugName}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReportSelect label="Daily" prefix="Date Range:" value={dateRange} onChange={e => setDateRange(e.target.value)} />
        <IconButton size="small"><ChevronLeft fontSize="small" /></IconButton>
        <Typography sx={{ fontSize: '0.75rem', color: '#337ab7', whiteSpace: 'nowrap' }}>May 07, 2026</Typography>
        <Typography sx={{ fontSize: '0.75rem', mx: 1 }}>➔</Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Date:</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#337ab7', whiteSpace: 'nowrap' }}>05/07/2026</Typography>
        <IconButton size="small"><ChevronRight fontSize="small" /></IconButton>
      </Box>
      <ReportSelect label="All" prefix="Provider:" value={provider} onChange={e => setProvider(e.target.value)} />
    </>
  );

  return (
    <ReportLayout title="RX Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        onApplyFilters={() => console.log('Apply Filters')}
        onExportCsv={() => alert('Exporting as CSV...')}
        onPrint={() => window.print()}
      />

      <ReportDataTable 
        columns={columns} 
        data={rows} 
        renderRow={renderRow} 
      />
    </ReportLayout>
  );
};

export default RxReport;
