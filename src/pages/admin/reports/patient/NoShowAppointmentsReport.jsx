import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Checkbox, Button, TableCell, TableRow, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { fetchNoShowAppointmentsReport, selectNoShowAppointmentsData, selectNoShowAppointmentsDataLoading } from '../../../../store/slices/patientReportSlice';



const NoShowAppointmentsReport = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectNoShowAppointmentsData) || [];
  const loading = useSelector(selectNoShowAppointmentsDataLoading);

  const [startDate, setStartDate] = useState(dayjs('2026-04-08'));
  const [endDate, setEndDate] = useState(dayjs('2026-05-08'));
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const fetchReport = () => {
    dispatch(fetchNoShowAppointmentsReport({
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
    { label: 'Patient' },
    { label: 'Type' },
    { label: 'Providers' },
    { label: 'Duration' },
    { label: 'Pref. day' },
    { label: 'Pref. time' },
    { label: 'Procedures' },
    { label: 'Apt. Date' },
    { label: 'Next Apt. Date' },
    { label: 'Cancellation Reason' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.type}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.providers}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.duration}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.prefDay}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.prefTime}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem', maxWidth: 150 }}>{row.procedures}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.aptDate}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.nextAptDate}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem', maxWidth: 200, fontStyle: 'italic' }}>{row.reason}</TableCell>
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
            textField: { 
              size: 'small',
              sx: { width: 140, '& .MuiInputBase-root': { height: 26, fontSize: '0.75rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } }, '& .MuiInputBase-input': { px: 1, py: 0 } } 
            }, openPickerIcon: { sx: { fontSize: 16 } }
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
            textField: { 
              size: 'small',
              sx: { width: 140, '& .MuiInputBase-root': { height: 26, fontSize: '0.75rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } }, '& .MuiInputBase-input': { px: 1, py: 0 } } 
            }, openPickerIcon: { sx: { fontSize: 16 } }
          }}
        />
      </Box>
      <ReportCheckbox label="Show Inactive Patients" />
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="NoShow Appointments Report:">
          <Box className="hide-on-print" sx={{ mb: 2 }}>
            <ReportFilterBar 
              topRowFilters={topFilters}
              onApplyFilters={handleApply}
              onCreateTemplate={() => setTemplateDialogOpen(true)}
            />
          </Box>

          {/* Summary Text and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
              (number of appointments = {data.length})
            </Typography>
            <Box sx={{ transform: 'translateY(-4px)' }}>
              <ProductionReportActions
                onExportCsv={() => alert('Exporting...')}
                onPrint={() => window.print()}
                hasData={data.length > 0}
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
              data={data} 
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
export default NoShowAppointmentsReport;
