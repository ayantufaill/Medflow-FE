import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Checkbox, Button, TableCell, TableRow, Radio, RadioGroup, FormControlLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { fetchAppointmentsReport, selectAppointmentsData, selectAppointmentsDataLoading } from '../../../../store/slices/patientReportSlice';



const AppointmentsReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectAppointmentsData) || [];
  const loading = useSelector(selectAppointmentsDataLoading);

  const [dateType, setDateType] = useState('aptDate');
  const [startDate, setStartDate] = useState(dayjs('2026-04-08'));
  const [endDate, setEndDate] = useState(dayjs('2026-05-08'));
  const [provider, setProvider] = useState('all');
  const [status, setStatus] = useState('all');
  const [locationType, setLocationType] = useState('office');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const fetchReport = () => {
    dispatch(fetchAppointmentsReport({
      startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
      provider,
      status
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
    { label: 'Flags' },
    { label: 'Type' },
    { label: 'Status' },
    { label: 'Providers' },
    { label: 'Operatory' },
    { label: 'Apt. Date' },
    { label: 'Time' },
    { label: 'Duration' },
    { label: 'Procedures' },
    { label: 'Next Apt. Date' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.flags}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.type}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.providers}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.operatory}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.aptDate}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.time}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.duration}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.procedures}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.nextAptDate}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RadioGroup row value={dateType} onChange={(e) => setDateType(e.target.value)} sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel 
            value="aptDate" 
            control={<Radio size="small" />} 
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Appointment Date:</Typography>} 
            sx={{ m: 0 }}
          />
        </RadioGroup>
        <ReportSelect defaultValue="range" options={[{ value: 'range', label: 'Range' }, { value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' }, { value: 'last7', label: 'Last 7 Days' }]} width="100px" />
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Start Date:</Typography>
        <DatePicker
          value={startDate}
          onChange={(v) => setStartDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'outlined', size: 'small', sx: { width: 120, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } },
            openPickerIcon: { sx: { display: 'none' } }
          }}
        />
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>End Date:</Typography>
        <DatePicker
          value={endDate}
          onChange={(v) => setEndDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'outlined', size: 'small', sx: { width: 120, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } },
            openPickerIcon: { sx: { display: 'none' } }
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RadioGroup row defaultValue="created" sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel 
            value="created" 
            control={<Radio size="small" />} 
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Appointment Created Date:</Typography>} 
            sx={{ m: 0 }}
          />
        </RadioGroup>
        <ReportSelect defaultValue="range" options={[{ value: 'range', label: 'Range' }, { value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' }, { value: 'last7', label: 'Last 7 Days' }]} width="100px" />
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Start Date:</Typography>
        <DatePicker
          value={startDate}
          onChange={() => {}}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'outlined', size: 'small', sx: { width: 120, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } },
            openPickerIcon: { sx: { display: 'none' } }
          }}
        />
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>End Date:</Typography>
        <DatePicker
          value={endDate}
          onChange={() => {}}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'outlined', size: 'small', sx: { width: 120, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } },
            openPickerIcon: { sx: { display: 'none' } }
          }}
        />
      </Box>
    </>
  );

  const bottomFilters = (
    <>
      <ReportSelect 
        label="Select Provider" 
        prefix="Provider:" 
        value={provider} 
        onChange={(e) => setProvider(e.target.value)} 
        options={[{ value: 'all', label: 'Select Provider' }, { value: 'kar', label: 'KAR' }, { value: 'sab', label: 'SAB' }]} 
        width="160px"
      />
      <ReportSelect 
        label="Select Status" 
        prefix="Appointment Status:" 
        value={status} 
        onChange={(e) => setStatus(e.target.value)} 
        options={[{ value: 'all', label: 'Select Status' }, { value: 'complete', label: 'Checked out complete' }, { value: 'cancelled', label: 'Cancelled' }]} 
        width="180px"
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RadioGroup row value={locationType} onChange={(e) => setLocationType(e.target.value)} sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel value="office" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>Office Appointments</Typography>} sx={{ m: 0, mr: 1 }} />
          <FormControlLabel value="online" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>Online Appointments</Typography>} sx={{ m: 0 }} />
        </RadioGroup>
      </Box>
      <ReportCheckbox label="Include Shortlisted Appointments" />
      <ReportSelect defaultValue="all" options={[{ value: 'all', label: 'Pts With Or Without Flags' }]} width="180px" />
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="Appointments Report:">
          <Box className="hide-on-print" sx={{ mb: 2 }}>
            <ReportFilterBar 
              topRowFilters={topFilters}
              bottomRowFilters={bottomFilters}
              onApplyFilters={handleApply}
              onCreateTemplate={() => setTemplateDialogOpen(true)}
            />
          </Box>

          {/* Summary Text and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
              (number of appointments = {reportData.length})
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

export default AppointmentsReport;

