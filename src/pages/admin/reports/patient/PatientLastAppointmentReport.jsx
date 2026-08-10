import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Checkbox, Button, TableCell, TableRow, Select, MenuItem, TableHead, Table, TableBody, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { fetchPatientLastAppointmentReport, selectLastAppointmentData, selectLastAppointmentDataLoading } from '../../../../store/slices/patientReportSlice';



const PatientLastAppointmentReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectLastAppointmentData) || [];
  const loading = useSelector(selectLastAppointmentDataLoading);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(dayjs('2026-05-08'));
  
  const [patientStatus, setPatientStatus] = useState('active');
  const [provider, setProvider] = useState('all');
  const [appointmentStatus, setAppointmentStatus] = useState('all');
  const [flagsFilter, setFlagsFilter] = useState('all');

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const fetchReport = () => {
    dispatch(fetchPatientLastAppointmentReport({
      startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
      patientStatus,
      provider,
      appointmentStatus,
      flagsFilter
    }));
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleApply = () => {
    fetchReport();
  };

  const columns = [
    { label: 'ID' },
    { label: 'Patient' },
    { label: 'Patient Status' },
    { label: 'Appt Date' },
    { label: 'Appt Type' },
    { label: 'Appt Status' },
    { label: 'Next Appt Date' },
    { label: 'New Patient Appt' },
    { label: 'Provider' },
    { label: 'Email' },
    { label: 'Phone Number' },
    { label: 'Permission to Text' },
    { label: 'Permission to Email' },
    { label: 'Request Review' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.id}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.apptDate}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.type}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.apptStatus}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.nextAppt}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.newPatient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.provider}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.email}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.phone}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.text}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.emailPerm}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.review}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Start Date:</Typography>
        <DatePicker
          value={startDate}
          onChange={(v) => setStartDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'standard', size: 'small', sx: { width: 140, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } } } },
            openPickerIcon: { sx: { display: 'none' } }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>End Date:</Typography>
        <DatePicker
          value={endDate}
          onChange={(v) => setEndDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'standard', size: 'small', sx: { width: 140, '& .MuiInputBase-root': { height: 24, fontSize: '0.75rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } } } },
            openPickerIcon: { sx: { display: 'none' } }
          }}
        />
      </Box>
      
      <ReportSelect value={patientStatus} onChange={(e) => setPatientStatus(e.target.value)} prefix="Filter Report By:" options={[{ value: 'active', label: 'Active Patients Only' }, { value: 'all', label: 'All Patients' }]} width="140px" />
      <ReportSelect value={provider} onChange={(e) => setProvider(e.target.value)} options={[{ value: 'all', label: 'All Providers' }]} width="120px" />
      <ReportSelect value={appointmentStatus} onChange={(e) => setAppointmentStatus(e.target.value)} options={[{ value: 'all', label: 'All Appointment Status' }]} width="160px" />
      
      <ReportSelect defaultValue="default" prefix="Sort Report By:" options={[{ value: 'default', label: 'Default' }]} width="100px" />
    </>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox label="Show Flags in Report" />
      <ReportSelect value={flagsFilter} onChange={(e) => setFlagsFilter(e.target.value)} options={[{ value: 'all', label: 'Pts With Or Without Flags' }]} width="180px" />
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="Patient By Last Appointment Report:">
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
export default PatientLastAppointmentReport;
