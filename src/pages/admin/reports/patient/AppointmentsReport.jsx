import React, { useState, useEffect, useMemo } from 'react';
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
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';


const AppointmentsReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectAppointmentsData) || [];
  const loading = useSelector(selectAppointmentsDataLoading);
  const providerList = useSelector(selectProviderDropdownList);

  const providerOptions = useMemo(() => [
    { value: 'all', label: 'Select Provider' },
    ...(providerList || []).map((p) => {
      const first = p.userId?.firstName || p.firstName || p.FName || '';
      const last = p.userId?.lastName || p.lastName || p.LName || '';
      const name = `${first} ${last}`.trim() || p.providerCode || p._id || 'Unknown';
      return { value: p.id || p.ProvNum || name, label: name };
    }),
  ], [providerList]);

  const apptStatusOptions = [
    { value: 'all', label: 'Select Status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'complete', label: 'CheckedoutCompleted' },
    { value: 'broken', label: 'Broken' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const [dateType, setDateType] = useState('aptDate');
  const [startDate, setStartDate] = useState(dayjs('2026-04-08'));
  const [endDate, setEndDate] = useState(dayjs('2026-05-08'));
  const [provider, setProvider] = useState('all');
  const [status, setStatus] = useState('all');
  const [locationType, setLocationType] = useState('office');
  const [includeShortlisted, setIncludeShortlisted] = useState(false);
  const [flagFilter, setFlagFilter] = useState('all');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const fetchReport = () => {
    dispatch(fetchAppointmentsReport({
      dateType,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
      provider,
      status,
      locationType,
      includeShortlisted,
      flagFilter
    }));
  };

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
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
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <RadioGroup row value={dateType} onChange={(e) => setDateType(e.target.value)} sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel 
            value="aptDate" 
            control={<Radio size="small" />} 
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Appointment Date:</Typography>} 
            sx={{ m: 0 }}
          />
          <FormControlLabel 
            value="created" 
            control={<Radio size="small" />} 
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Created Date:</Typography>} 
            sx={{ m: 0 }}
          />
        </RadioGroup>
        <ReportSelect defaultValue="range" options={[{ value: 'range', label: 'Range' }, { value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' }, { value: 'last7', label: 'Last 7 Days' }]} width="100px" />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          start date
        </Typography>
        <DatePicker
          value={startDate}
          onChange={(v) => setStartDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '180px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '32px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& .MuiInputBase-input': { padding: '4px 10px' },
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          end date
        </Typography>
        <DatePicker
          value={endDate}
          onChange={(v) => setEndDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '180px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '32px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& .MuiInputBase-input': { padding: '4px 10px' },
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>
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
        options={providerOptions} 
        width="160px"
      />
      <ReportSelect 
        label="Select Status" 
        prefix="Appointment Status:" 
        value={status} 
        onChange={(e) => setStatus(e.target.value)} 
        options={apptStatusOptions} 
        width="180px"
      />
      <ReportSelect 
        label="Select Appointment Location" 
        prefix="Appointment:" 
        value={locationType} 
        onChange={(e) => setLocationType(e.target.value)} 
        options={[{ value: 'office', label: 'Office Appointments' }, { value: 'online', label: 'Online Appointments' }]} 
        width="220px"
      />
      <ReportCheckbox 
        label="Include Shortlisted Appointments" 
        checked={includeShortlisted}
        onChange={(e) => setIncludeShortlisted(e.target.checked)}
      />
      <ReportSelect 
        value={flagFilter}
        onChange={(e) => setFlagFilter(e.target.value)}
        options={[
          { value: 'all', label: 'Pts With Or Without Flags' },
          { value: 'withFlags', label: 'Pts With Flags' },
          { value: 'withoutFlags', label: 'Pts Without Flags' }
        ]} 
        width="180px" 
      />
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

