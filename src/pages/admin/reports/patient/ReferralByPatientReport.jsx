import React, { useState } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, TableCell, TableRow
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportDataTable } from '../../../../components/reports/ui';

const DUMMY_DATA = [
  { patient: 'Alice Smith', referralSource: 'Insurance', referDate: '05/01/2026', notes: 'Referred from Cigna portal' },
  { patient: 'Bob Johnson', referralSource: 'Dr. Mike Lee', referDate: '04/28/2026', notes: 'Oral surgeon referral' },
];

const ReferralByPatientReport = () => {
  const [currentDate, setCurrentDate] = useState(dayjs('2026-05-08'));
  const [dateRange, setDateRange] = useState('daily');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const handlePrevDate = () => setCurrentDate(prev => prev.subtract(1, 'day'));
  const handleNextDate = () => setCurrentDate(prev => prev.add(1, 'day'));

  const columns = [
    { label: 'Patient' },
    { label: 'Referral Source' },
    { label: 'Referral Date' },
    { label: 'Notes' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.referralSource}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.referDate}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.notes}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Date Range:</Typography>
        <Select 
          variant="standard"
          size="small" 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          sx={{ fontSize: '0.75rem', width: 80, height: 24, backgroundColor: '#fff', '&:before, &:after': { display: 'none' } }}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
        </Select>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
          <ChevronLeft 
            onClick={handlePrevDate}
            sx={{ fontSize: '1.1rem', color: '#337ab7', cursor: 'pointer', '&:hover': { opacity: 0.7 } }} 
          />
          <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 600, minWidth: 80, textAlign: 'center' }}>
            {currentDate.format('MMM DD, YYYY')}
          </Typography>
          <ChevronRight 
            onClick={handleNextDate}
            sx={{ fontSize: '1.1rem', color: '#337ab7', cursor: 'pointer', '&:hover': { opacity: 0.7 } }} 
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Date:</Typography>
        <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#337ab7', borderBottom: '1px solid #ccc', width: 100, pb: 0.5 }}>
          {currentDate.format('MM/DD/YYYY')}
        </Typography>
      </Box>
    </>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Referral By Patient:">
        <ReportFilterBar 
          topRowFilters={topFilters}
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
export default ReferralByPatientReport;
