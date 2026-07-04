import React, { useState } from 'react';
import {
  Box, Typography, Select, MenuItem, Button, TableCell, TableRow
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';

const MOCK_INDIVIDUALS = [
  { id: '616', name: 'Patient A', patientCollection: '-$9.90', insuranceCollection: '$148.00', totalCollection: '$138.10' },
  { id: '253', name: 'Patient B', patientCollection: '$0.00', insuranceCollection: '$1,017.00', totalCollection: '$1,017.00' },
  { id: '196', name: 'Patient C', patientCollection: '$0.00', insuranceCollection: '$216.00', totalCollection: '$216.00' },
  { id: '85', name: 'Patient D', patientCollection: '$0.00', insuranceCollection: '$99.00', totalCollection: '$99.00' },
  { id: '782', name: 'Patient E', patientCollection: '$0.00', insuranceCollection: '$99.00', totalCollection: '$99.00' },
  { id: '298', name: 'Patient F', patientCollection: '$0.00', insuranceCollection: '$119.00', totalCollection: '$119.00' },
  { id: '458', name: 'Patient G', patientCollection: '$0.00', insuranceCollection: '$71.00', totalCollection: '$71.00' },
];

const TotalCollectionIndividuals = () => {
  const [dateRange, setDateRange] = useState('Daily');
  const [sortBy, setSortBy] = useState('Default');

  const topFilters = (
    <>
      <ReportSelect 
        label={dateRange} 
        prefix="Date Range:" 
        value={dateRange} 
        onChange={(e) => setDateRange(e.target.value)}
        options={['Daily', 'Weekly']}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
        <ChevronLeft sx={{ fontSize: '1.1rem', color: '#337ab7', cursor: 'pointer', '&:hover': { opacity: 0.7 } }} />
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 600, minWidth: 80, textAlign: 'center', whiteSpace: 'nowrap' }}>
          May 08, 2026
        </Typography>
        <ChevronRight sx={{ fontSize: '1.1rem', color: '#337ab7', cursor: 'pointer', '&:hover': { opacity: 0.7 } }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, mr: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', whiteSpace: 'nowrap' }}>
          05/08/2026
        </Typography>
      </Box>

      <ReportSelect 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)}
        prefix="Sort Report By:"
        options={[
          { value: 'Default', label: 'Default' },
          { value: 'Amount', label: 'Amount' }
        ]}
      />
    </>
  );

  const columns = [
    { label: 'ID', width: '80px' },
    { label: 'Patient' },
    { label: 'Patient Collection' },
    { label: 'Insurance Collection' },
    { label: 'Total Collection' },
  ];

  const renderRow = (row, index) => (
    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.id}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, color: '#337ab7', textDecoration: 'underline', cursor: 'pointer' }}>{row.name}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, color: row.patientCollection.startsWith('-') ? '#d93025' : '#000' }}>{row.patientCollection}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.insuranceCollection}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.totalCollection}</TableCell>
    </TableRow>
  );

  return (
    <ReportLayout title="Total Collection By Individuals Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        onApplyFilters={() => console.log('Apply')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      {/* Individuals Table */}
      <ReportDataTable 
        columns={columns} 
        data={MOCK_INDIVIDUALS} 
        renderRow={renderRow} 
      />

      {/* Footer Totals */}
      <Box sx={{ mt: 3, ml: 1, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, border: '1px solid #e0e0e0', width: 'fit-content' }}>
        <Typography sx={{ fontSize: '0.85rem', color: '#337ab7', fontWeight: 600, mb: 0.5 }}>
          Total Patient Collection: <Typography component="span" sx={{ fontWeight: 600, color: '#d93025', ml: 1 }}>-$9.90</Typography>
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: '#337ab7', fontWeight: 600, mb: 0.5 }}>
          Total Insurance Collection: <Typography component="span" sx={{ fontWeight: 600, color: '#333', ml: 1 }}>$1,769.00</Typography>
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: '#337ab7', fontWeight: 600 }}>
          Total Collection: <Typography component="span" sx={{ fontWeight: 600, color: '#333', ml: 1 }}>$1,759.10</Typography>
        </Typography>
      </Box>
    </ReportLayout>
  );
};

export default TotalCollectionIndividuals;
