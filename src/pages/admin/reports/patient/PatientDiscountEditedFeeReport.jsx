import React, { useState } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, TableCell, TableRow
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';

const DUMMY_DATA = [
  { patient: 'Bonnie Fuller', date: '05/07/2026', code: 'D1110', description: 'Prophylaxis - Adult', fee: '$120.00', editedFee: '$100.00', discount: '$20.00', provider: 'Dr. Smith' },
  { patient: 'Sarah Miller', date: '05/04/2026', code: 'D0120', description: 'Periodic Oral Eval', fee: '$65.00', editedFee: '$50.00', discount: '$15.00', provider: 'Dr. Johnson' },
];

const PatientDiscountEditedFeeReport = () => {
  const [currentDate, setCurrentDate] = useState(dayjs('2026-05-08'));
  const [dateRange, setDateRange] = useState('daily');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const handlePrevDate = () => setCurrentDate(prev => prev.subtract(1, 'day'));
  const handleNextDate = () => setCurrentDate(prev => prev.add(1, 'day'));

  const columns = [
    { label: 'Patient' },
    { label: 'Date' },
    { label: 'Code' },
    { label: 'Description' },
    { label: 'Original Fee' },
    { label: 'Edited Fee' },
    { label: 'Discount' },
    { label: 'Provider' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.date}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.code}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.description}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.fee}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.editedFee}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem', color: '#d9534f' }}>{row.discount}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.provider}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <ReportSelect 
        label={dateRange} 
        prefix="Date Range:" 
        value={dateRange} 
        onChange={(e) => setDateRange(e.target.value)}
        options={['daily', 'weekly', 'monthly']}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
        <ChevronLeft 
          onClick={handlePrevDate}
          sx={{ fontSize: '1.1rem', color: '#337ab7', cursor: 'pointer', '&:hover': { opacity: 0.7 } }} 
        />
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 600, minWidth: 80, textAlign: 'center', whiteSpace: 'nowrap' }}>
          {currentDate.format('MMM DD, YYYY')}
        </Typography>
        <ChevronRight 
          onClick={handleNextDate}
          sx={{ fontSize: '1.1rem', color: '#337ab7', cursor: 'pointer', '&:hover': { opacity: 0.7 } }} 
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', whiteSpace: 'nowrap' }}>
          {currentDate.format('MM/DD/YYYY')}
        </Typography>
      </Box>
    </>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Patient By Discount Or Edited Fee:">
        <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#999', fontStyle: 'italic', fontSize: '0.65rem' }}>
          Please note that Adjustment dates do not exist before 01/24/2023, so any data before that will not be displayed.
        </Typography>

        <ReportFilterBar 
          topRowFilters={topFilters}
          onApplyFilters={() => console.log('Apply Filters')}
          onCreateTemplate={() => setTemplateDialogOpen(true)}
          onExportCsv={() => alert('Exporting CSV...')}
          onPrint={() => window.print()}
        />

        <ReportDataTable 
          columns={columns} 
          data={DUMMY_DATA} 
          renderRow={renderRow} 
        />
      </ReportLayout>

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={(name) => alert(`Template "${name}" saved!`)} 
      />
    </React.Fragment>
  );
};

export default PatientDiscountEditedFeeReport;
