import React, { useState } from 'react';
import {
  Box, Typography, Select, MenuItem, Button, TableCell, TableRow, TextField
} from '@mui/material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';

const MOCK_TRANSACTIONS = [
  { id: 'Patient A (861)', created: '05/26/2025', type: 'Payment', number: '18381', status: 'Pending' },
  { id: 'Patient B (452)', created: '06/24/2025', type: 'Payment', number: '18891', status: 'Pending' },
  { id: 'Patient C (123)', created: '07/15/2025', type: 'Payment', number: '19282', status: 'Pending' },
  { id: 'Patient D (789)', created: '02/03/2026', type: 'Payment', number: '23110', status: 'Pending' },
  { id: 'Patient E (456)', created: '02/27/2026', type: 'Payment', number: '23519', status: 'Pending' },
  { id: 'Patient F (321)', created: '03/20/2026', type: 'Payment', number: '23987', status: 'Pending' },
  { id: 'Patient G (654)', created: '03/27/2026', type: 'Payment', number: '24171', status: 'Pending' },
  { id: 'Patient H (987)', created: '05/08/2026', type: 'Payment', number: '25200', status: 'Pending' },
  { id: 'Patient I (159)', created: '05/08/2026', type: 'Payment', number: '25214', status: 'Pending' },
  { id: 'Patient J (753)', created: '07/15/2025', type: 'Deposit', number: '19272', status: 'Pending' },
];

const OpenEdgeTransactions = () => {
  const columns = [
    { label: 'Patient ID' },
    { label: 'Created On' },
    { label: 'Transaction Type' },
    { label: 'Transaction Number' },
    { label: 'Status' },
  ];

  const renderRow = (row, index) => (
    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.75rem', py: 1, color: '#337ab7', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}>{row.id}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.created}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.type}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.number}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', color: row.status === 'Pending' ? '#f5a623' : '#333' }}>{row.status}</TableCell>
    </TableRow>
  );

  const [statusFilter, setStatusFilter] = useState('All');

  const filteredData = MOCK_TRANSACTIONS.filter(row => {
    if (statusFilter !== 'All' && row.status !== statusFilter) {
      return false;
    }
    return true;
  });

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
        <TextField size="small" variant="standard" defaultValue="05/08/2025" sx={{ width: 100, '& input': { fontSize: '0.85rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } } }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>End Date:</Typography>
        <TextField size="small" variant="standard" defaultValue="05/08/2026" sx={{ width: 100, '& input': { fontSize: '0.85rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } } }} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
        <ReportSelect 
          label="All Statuses" 
          prefix="Filter by Status:" 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'All', label: 'All Statuses' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Credit Card Declined', label: 'Credit Card Declined' },
            { value: 'Timed Out', label: 'Timed Out' }
          ]}
        />
        <Button onClick={() => setStatusFilter(statusFilter === 'Credit Card Declined' ? 'All' : 'Credit Card Declined')} variant={statusFilter === 'Credit Card Declined' ? 'contained' : 'outlined'} size="small" sx={{ fontSize: '0.7rem', height: 28, borderColor: '#337ab7', color: statusFilter === 'Credit Card Declined' ? '#fff' : '#337ab7', backgroundColor: statusFilter === 'Credit Card Declined' ? '#337ab7' : 'transparent', '&:hover': { backgroundColor: statusFilter === 'Credit Card Declined' ? '#286090' : '#f0f7ff' } }}>Credit Card Declined</Button>
        <Button onClick={() => setStatusFilter(statusFilter === 'Timed Out' ? 'All' : 'Timed Out')} variant={statusFilter === 'Timed Out' ? 'contained' : 'outlined'} size="small" sx={{ fontSize: '0.7rem', height: 28, borderColor: '#337ab7', color: statusFilter === 'Timed Out' ? '#fff' : '#337ab7', backgroundColor: statusFilter === 'Timed Out' ? '#337ab7' : 'transparent', '&:hover': { backgroundColor: statusFilter === 'Timed Out' ? '#286090' : '#f0f7ff' } }}>Timed Out</Button>
        <Button onClick={() => setStatusFilter(statusFilter === 'Pending' ? 'All' : 'Pending')} variant={statusFilter === 'Pending' ? 'contained' : 'outlined'} size="small" sx={{ fontSize: '0.7rem', height: 28, borderColor: '#337ab7', color: statusFilter === 'Pending' ? '#fff' : '#337ab7', backgroundColor: statusFilter === 'Pending' ? '#337ab7' : 'transparent', '&:hover': { backgroundColor: statusFilter === 'Pending' ? '#286090' : '#f0f7ff' } }}>Pending</Button>
      </Box>
    </>
  );

  return (
    <ReportLayout title="Open Edge Transactions Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        onApplyFilters={() => console.log('Apply')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      <ReportDataTable 
        columns={columns} 
        data={filteredData} 
        renderRow={renderRow} 
      />
    </ReportLayout>
  );
};

export default OpenEdgeTransactions;

