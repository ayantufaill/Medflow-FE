import React, { useState } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, TableCell, TableRow, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewsReport, selectReviewsData, selectReviewsDataLoading } from '../../../../store/slices/patientReportSlice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';

const ReviewReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectReviewsData) || [];
  const loading = useSelector(selectReviewsDataLoading);

  const [startDate, setStartDate] = useState(dayjs('2026-05-08'));
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('none');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  React.useEffect(() => {
    dispatch(fetchReviewsReport({
      startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
      endDate: endDate ? endDate.format('YYYY-MM-DD') : '',
      status
    }));
  }, [dispatch]);

  const handleApplyFilters = () => {
    dispatch(fetchReviewsReport({
      startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
      endDate: endDate ? endDate.format('YYYY-MM-DD') : '',
      status
    }));
  };

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.patientName}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.reviewStatus}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.date}</TableCell>
    </TableRow>
  );

  const columns = [
    { label: 'Patient Name' },
    { label: 'Review Status' },
    { label: 'Date' },
  ];

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Start Date:</Typography>
        <DatePicker
          value={startDate}
          onChange={(v) => setStartDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'outlined', size: 'small', sx: { width: 140, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>End Date:</Typography>
        <DatePicker
          value={endDate}
          onChange={(v) => setEndDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'outlined', size: 'small', sx: { width: 140, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } }
          }}
        />
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="Review Report:">
          <Box className="hide-on-print" sx={{ mb: 2 }}>
            <ReportFilterBar 
              topRowFilters={topFilters}
              bottomRowFilters={bottomFilters}
              onApplyFilters={handleApplyFilters}
              onCreateTemplate={() => setTemplateDialogOpen(true)}
            />
          </Box>

          {/* Summary Text and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
              (number of patients = {reportData.length})
            </Typography>
            <Box sx={{ transform: 'translateY(-4px)' }}>
              <ProductionReportActions
                onExportCsv={() => alert('Exporting CSV...')}
                onPrint={() => window.print()}
                hasData={reportData.length > 0}
              />
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <ReportDataTable 
              columns={columns} 
              data={reportData} 
              renderRow={renderRow} 
            />
          )}
      </ReportLayout>

        <CreateTemplateDialog 
          open={templateDialogOpen} 
          onClose={() => setTemplateDialogOpen(false)} 
          onSave={(name) => alert(`Template "${name}" saved!`)} 
        />
      </React.Fragment>
    </LocalizationProvider>
  );
};
export default ReviewReport;
