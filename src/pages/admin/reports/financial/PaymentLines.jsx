import React, { useState } from 'react';
import {
  Box, Typography, Select, MenuItem, Checkbox, FormControlLabel, Button, TableCell, TableRow, TextField
} from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';

const MOCK_PAYMENT_LINES = [
  { id: '966', patient: 'Patient One', amount: '$65.00', downPayment: 'No', dueDate: '05/15/2026', chargedOn: '', failedOn: '', failedAttempts: 0, status: 'Scheduled', error: '' },
  { id: '232', patient: 'Patient Two', amount: '$42.00', downPayment: 'No', dueDate: '05/20/2026', chargedOn: '', failedOn: '', failedAttempts: 0, status: 'Scheduled', error: '' },
  { id: '1247', patient: 'Patient Three', amount: '$599.50', downPayment: 'No', dueDate: '05/22/2026', chargedOn: '', failedOn: '', failedAttempts: 0, status: 'Scheduled', error: '' },
  { id: '856', patient: 'Patient Four', amount: '$266.67', downPayment: 'No', dueDate: '05/22/2026', chargedOn: '', failedOn: '', failedAttempts: 0, status: 'Scheduled', error: '' },
  { id: '986', patient: 'Patient Five', amount: '$1,295.67', downPayment: 'No', dueDate: '05/23/2026', chargedOn: '', failedOn: '', failedAttempts: 0, status: 'Scheduled', error: '' },
];

const PaymentLines = () => {
  const [dueDateFilter, setDueDateFilter] = useState('Range');
  const [selectedStatus, setSelectedStatus] = useState('Scheduled');

  const StatusChip = ({ label }) => (
    <Box
      onClick={() => setSelectedStatus(label)}
      sx={{
        px: 2,
        py: 0.5,
        borderRadius: '4px',
        border: '1px solid #4a89dc',
        cursor: 'pointer',
        backgroundColor: selectedStatus === label ? '#4a89dc' : '#fff',
        color: selectedStatus === label ? '#fff' : '#4a89dc',
        fontSize: '0.8rem',
        fontWeight: 500,
        transition: '0.2s',
        '&:hover': { backgroundColor: selectedStatus === label ? '#357ebd' : '#f0f7ff' }
      }}
    >
      {label}
    </Box>
  );

  const columns = [
    { label: 'Patient ID' },
    { label: 'Patient' },
    { label: 'Amount' },
    { label: 'Down Payment' },
    { label: 'Due Date' },
    { label: 'Charged On' },
    { label: 'Failed On' },
    { label: 'Failed Attempts' },
    { label: 'Status' },
    { label: 'Error Message' },
  ];

  const renderRow = (row, index) => (
    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.id}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, color: '#337ab7', textDecoration: 'underline', cursor: 'pointer' }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.amount}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.downPayment}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.dueDate}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.chargedOn}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.failedOn}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.failedAttempts}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.status}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{row.error}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <ReportSelect 
        label={dueDateFilter} 
        prefix="Due Date Filter:" 
        value={dueDateFilter} 
        onChange={(e) => setDueDateFilter(e.target.value)}
        options={[{ value: 'Range', label: 'Range' }]}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, mr: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Start Date:</Typography>
        <TextField size="small" variant="standard" defaultValue="04/08/2026" sx={{ width: 100, '& input': { fontSize: '0.85rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } } }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>End Date:</Typography>
        <TextField size="small" variant="standard" defaultValue="06/08/2026" sx={{ width: 100, '& input': { fontSize: '0.85rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } } }} />
      </Box>
    </>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
        <ReportSelect 
          label="Select Status" 
          prefix="Filter by Status:" 
          defaultValue="Select Status"
          options={[{ value: 'Select Status', label: 'Select Status' }]}
        />
        <StatusChip label="Failed" />
        <StatusChip label="Pending" />
        <StatusChip label="Scheduled" />
      </Box>
      <ReportCheckbox label="Include Archived" />
    </>
  );

  return (
    <ReportLayout title="Payment Lines Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      {/* Table Section */}
      <ReportDataTable 
        columns={columns} 
        data={MOCK_PAYMENT_LINES} 
        renderRow={renderRow} 
      />
      <Box sx={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderTop: 'none', py: 1.5, px: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
          Total: &nbsp; &nbsp; $4,185.77
        </Typography>
      </Box>
    </ReportLayout>
  );
};

export default PaymentLines;

