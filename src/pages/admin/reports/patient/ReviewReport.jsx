import React, { useState } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, TableCell, TableRow
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';

const ReviewReport = () => {
  const [currentDate, setCurrentDate] = useState(dayjs('2026-05-08'));
  const [dateRange, setDateRange] = useState('daily');
  const [status, setStatus] = useState('none');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const handlePrevDate = () => setCurrentDate(prev => prev.subtract(1, 'day'));
  const handleNextDate = () => setCurrentDate(prev => prev.add(1, 'day'));

  const columns = [
    { label: 'Patient Name' },
    { label: 'Review Status' },
    { label: 'Date' },
  ]; // Empty table placeholder columns

  const topFilters = (
    <>
      <ReportSelect 
        label={dateRange} 
        prefix="Date Range:" 
        value={dateRange} 
        onChange={(e) => setDateRange(e.target.value)}
        options={['daily', 'weekly']}
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

  const bottomFilters = (
    <>
      <ReportSelect 
        label={status} 
        prefix="Filter By Status:" 
        value={status} 
        onChange={(e) => setStatus(e.target.value)}
        options={[
          { value: 'none', label: 'None' },
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' }
        ]}
      />
    </>
  );

  const customBottomRowLeftActions = (
    <Typography variant="caption" sx={{ color: '#337ab7', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', mr: 2 }}>
      Number of Patients: 0
    </Typography>
  );

  return (
    <React.Fragment>
      <ReportLayout title="Review Report:">
        <ReportFilterBar 
          topRowFilters={topFilters}
          bottomRowFilters={bottomFilters}
          bottomRowLeftActions={customBottomRowLeftActions}
          onApplyFilters={() => console.log('Apply Filters')}
          onCreateTemplate={() => setTemplateDialogOpen(true)}
          onExportCsv={() => alert('Exporting CSV...')}
          onPrint={() => window.print()}
        />

        <ReportDataTable 
          columns={columns} 
          data={[]} 
          renderRow={() => null} 
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
export default ReviewReport;
