import React, { useState, useEffect } from 'react';
import { TableCell, TableRow, Button, Box, Typography, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDispatch, useSelector } from 'react-redux';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportDataTable } from '../../../../components/reports/ui';
import { fetchOnlineSchedulingReferralReport, selectOnlineSchedulingReferralData, selectOnlineSchedulingReferralDataLoading } from '../../../../store/slices/patientReportSlice';



const OnlineSchedulingReferral = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectOnlineSchedulingReferralData) || [];
  const loading = useSelector(selectOnlineSchedulingReferralDataLoading);

  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);

  const fetchReport = () => {
    dispatch(fetchOnlineSchedulingReferralReport({
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD')
    }));
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleApply = () => {
    fetchReport();
  };

  const columns = [
    { label: 'Referral' },
    { label: 'UTM Source' },
    { label: 'UTM Medium' },
    { label: 'UTM Campaign' },
    { label: 'Number of Clicks' },
  ];

  const renderRow = (row, index) => (
    <TableRow 
      key={index} 
      hover
      sx={{ 
        '& td': { fontSize: '0.75rem', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' },
        '&:hover': { backgroundColor: '#f1f5f9' }
      }}
    >
      <TableCell sx={{ color: '#3b82f6', fontWeight: 600 }}>{row.referral}</TableCell>
      <TableCell>{row.utmSource}</TableCell>
      <TableCell>{row.utmMedium}</TableCell>
      <TableCell>{row.utmCampaign}</TableCell>
      <TableCell>{row.clicks}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1e293b' }}>Start Date:</Typography>
        <DatePicker
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { size: 'small', sx: { width: 140, '& .MuiInputBase-root': { height: 26, fontSize: '0.75rem' }, '& .MuiInputBase-input': { px: 1, py: 0 } } }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1e293b' }}>End Date:</Typography>
        <DatePicker
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { size: 'small', sx: { width: 140, '& .MuiInputBase-root': { height: 26, fontSize: '0.75rem' }, '& .MuiInputBase-input': { px: 1, py: 0 } } }
          }}
        />
      </Box>
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
      <ReportLayout title="Online Scheduling Referral">
        <ReportFilterBar 
          topRowFilters={topFilters}
          onApplyFilters={handleApply}
          onCreateTemplate={() => setTemplateDialogOpen(true)}
          onExportCsv={() => alert('Exporting CSV...')}
          onPrint={() => window.print()}
        />

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
        onSave={handleSaveTemplate} 
      />
    </React.Fragment>
    </LocalizationProvider>
  );
};

export default OnlineSchedulingReferral;
