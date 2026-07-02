import React from 'react';
import { 
  Box, Typography, TextField, Select, MenuItem, Button, IconButton, Divider, TableCell, TableRow
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportSearchInput, ReportDataTable } from '../../../../components/reports/ui';

const LoginReport = () => {
  const rows = [
    { id: 1, username: 'Babar Magsi', date: '05/08/2026 2:20 PM', status: 'Success', ip: '125.209.73.246', machine: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36' },
    { id: 2, username: 'Dr. Smith', date: '05/08/2026 1:07 PM', status: 'Success', ip: '125.209.73.246', machine: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36' },
    { id: 3, username: 'Hygienist A', date: '05/08/2026 1:05 PM', status: 'Success', ip: '182.188.108.206', machine: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36' },
    { id: 4, username: 'Staff B', date: '05/08/2026 1:02 PM', status: 'Success', ip: '162.251.62.66', machine: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36' },
    { id: 5, username: 'Babar Magsi', date: '05/08/2026 12:42 PM', status: 'Success', ip: '182.188.108.206', machine: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36' },
  ];

  const columns = [
    { label: 'Username' },
    { label: 'Login date' },
    { label: 'Login status' },
    { label: 'IP address' },
    { label: 'Machine info' }
  ];

  const renderRow = (row, index) => (
    <TableRow key={row.id} sx={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b', fontWeight: 600 }}>{row.username}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.date}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', color: row.status === 'Success' ? '#166534' : '#d93025', fontWeight: 500 }}>{row.status}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem' }}>{row.ip}</TableCell>
      <TableCell sx={{ fontSize: '0.75rem', maxWidth: 400, wordBreak: 'break-all', color: '#666' }}>{row.machine}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <ReportSelect 
        label="Daily" 
        prefix="Date Range:" 
        defaultValue="Daily"
        options={[{ value: 'Daily', label: 'Daily' }]}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2, mr: 2 }}>
        <IconButton size="small" sx={{ color: '#337ab7', p: 0 }}><ChevronLeft fontSize="small" /></IconButton>
        <Typography variant="body2" sx={{ color: '#337ab7', fontWeight: 600 }}>May 08, 2026</Typography>
        <Typography variant="body2" sx={{ mx: 0.5, color: '#337ab7' }}>➔</Typography>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>Date:</Typography>
        <Typography variant="body2" sx={{ color: '#337ab7', fontWeight: 600 }}>05/08/2026</Typography>
        <IconButton size="small" sx={{ color: '#337ab7', p: 0 }}><ChevronRight fontSize="small" /></IconButton>
      </Box>

      <Box sx={{ ml: 'auto' }}>
        <ReportSearchInput 
          placeholder="Search User" 
          value="" 
          onChange={() => {}}
        />
      </Box>
    </>
  );

  return (
    <ReportLayout title="Login Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        onApplyFilters={() => console.log('Apply Filters')}
        onExportCsv={() => alert('Exporting CSV...')}
        onPrint={() => window.print()}
      />

      {/* Login Table */}
      <ReportDataTable 
        columns={columns} 
        data={rows} 
        renderRow={renderRow} 
        emptyMessage="No login logs found for this date range"
      />
    </ReportLayout>
  );
};

export default LoginReport;

