import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
} from '@mui/material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';

const DUMMY_DATA = [
  { patient: 'Alice Smith', type: 'Recare', providers: 'KAR', duration: '60 mins', prefDay: 'Thurs', prefTime: '11:30 AM', procedures: 'BW4, fl, hygiene', aptDate: 'Apr 09, 2026', nextAptDate: '', reason: 'She is out of the country.' },
  { patient: 'Bob Johnson', type: 'Recare', providers: 'SAB', duration: '85 mins', prefDay: 'Thurs', prefTime: '12:35 PM', procedures: 'fl, Maintenance, BW4, periodic ex', aptDate: 'Apr 16, 2026', nextAptDate: '', reason: 'pt has a meeting and will call to resched' },
];

const CancelledAppointmentsReport = () => {
  const dispatch = useDispatch();
  const { cancelledAppointmentsData, loading } = useSelector((state) => state.patientReport || { cancelledAppointmentsData: [], loading: false });

  // Get current date string in YYYY-MM-DD for native date input
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  
  const [data, setData] = useState(DUMMY_DATA);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const handleApply = () => {
    if (!startDate || !endDate) return;
    const filtered = DUMMY_DATA.filter((item) => {
      const itemDate = dayjs(item.aptDate, 'MMM DD, YYYY');
      if (!itemDate.isValid()) return false;
      return (
        (itemDate.isSame(startDate, 'day') || itemDate.isAfter(startDate, 'day')) &&
        (itemDate.isSame(endDate, 'day') || itemDate.isBefore(endDate, 'day'))
      );
    });
    setData(filtered);
  };

  const handleExportCSV = () => alert("Exporting...");

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
              sx: { width: 140, '& .MuiInputBase-root': { height: 26, fontSize: '0.75rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } }, '& .MuiInputBase-input': { px: 1, py: 0 }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' }, '& .MuiIconButton-root': { p: 0.2 } } 
            }, openPickerIcon: { sx: { fontSize: 16 } }, desktopPaper: { sx: { transform: 'scale(0.9)', transformOrigin: 'top left' } }
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
              sx: { width: 140, '& .MuiInputBase-root': { height: 26, fontSize: '0.75rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } }, '& .MuiInputBase-input': { px: 1, py: 0 }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' }, '& .MuiIconButton-root': { p: 0.2 } } 
            }, openPickerIcon: { sx: { fontSize: 16 } }, desktopPaper: { sx: { transform: 'scale(0.9)', transformOrigin: 'top left' } }
          }}
        />
      </Box>
      <ReportCheckbox label="Show Inactive Patients" />
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="Cancelled Appointments Report:">
          <ReportFilterBar 
            topRowFilters={topFilters}
            onApplyFilters={handleApply}
            onCreateTemplate={() => setTemplateDialogOpen(true)}
            onExportCsv={handleExportCSV}
            onPrint={() => window.print()}
          />

          <ReportDataTable 
            columns={columns} 
            data={data} 
            renderRow={renderRow} 
          />
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
export default CancelledAppointmentsReport;
