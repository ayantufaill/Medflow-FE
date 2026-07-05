import React from 'react';
import { Box, TableCell, TableRow } from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportDataTable } from '../../../../components/reports/ui';

const FamilyMigratedBalances = () => {
  const columns = [
    { label: 'Patient' },
    { label: 'Patient Owing' },
    { label: 'Insurance Owing' },
    { label: 'Total Owing' },
    { label: 'Migration Date' },
  ];

  const renderRow = (row, idx) => (
    <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Totals</TableCell>
      <TableCell sx={{ fontSize: '0.8rem' }}>$0.00</TableCell>
      <TableCell sx={{ fontSize: '0.8rem' }}>$0.00</TableCell>
      <TableCell sx={{ fontSize: '0.8rem' }}>$0.00</TableCell>
      <TableCell sx={{ fontSize: '0.8rem' }}></TableCell>
    </TableRow>
  );

  return (
    <ReportLayout title="Family Migrated Balances:">
      <ReportFilterBar 
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      <ReportDataTable 
        columns={columns} 
        data={[{}]} 
        renderRow={renderRow} 
      />
    </ReportLayout>
  );
};

export default FamilyMigratedBalances;
