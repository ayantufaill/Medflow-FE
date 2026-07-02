import React from 'react';
import {
  Box, Typography, Select, MenuItem, Button, TableCell, TableRow
} from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';

const MOCK_REQUESTS = [
  { patient: 'Patient One', created: '05/08/2025', requested: '$358.00', paid: '--------', date: '', status: '' },
  { patient: 'Patient Two', created: '05/08/2025', requested: '$1,000.00', paid: '--------', date: '', status: '' },
  { patient: 'Patient Three', created: '05/08/2025', requested: '$288.00', paid: '$288.00', date: '05/10/2025', status: 'Successful Transaction' },
  { patient: 'Patient Four', created: '05/13/2025', requested: '$69.00', paid: '$69.00', date: '05/13/2025', status: 'Successful Transaction' },
  { patient: 'Patient Five', created: '05/14/2025', requested: '$877.10', paid: '$877.10', date: '05/14/2025', status: 'Successful Transaction' },
];

const PaymentRequest = () => {
  const columns = [
    { label: 'Patient' },
    { label: 'Created On' },
    { label: 'Amount Requested' },
    { label: 'Amount Paid' },
    { label: 'Date Paid' },
    { label: 'Status' },
  ];

  const renderRow = (row, index) => (
    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, color: '#337ab7', textDecoration: 'underline', cursor: 'pointer' }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.created}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.requested}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.paid}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.date}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, color: row.status.includes('Successful') ? '#166534' : '#000', fontWeight: row.status.includes('Successful') ? 500 : 400 }}>{row.status}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <ReportSelect 
        label="Range" 
        prefix="Created On Date Filter:" 
        defaultValue="Range"
        options={[{ value: 'Range', label: 'Range' }]}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, mr: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Start Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7' }}>05/08/2025</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>End Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7' }}>05/08/2026</Typography>
      </Box>
    </>
  );

  return (
    <ReportLayout title="Payment Request Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        onApplyFilters={() => console.log('Apply')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      {/* Table */}
      <ReportDataTable 
        columns={columns} 
        data={MOCK_REQUESTS} 
        renderRow={renderRow} 
      />
    </ReportLayout>
  );
};

export default PaymentRequest;

