import React, { useState } from 'react';
import {
  Box, Typography, Checkbox, Button, TableCell, TableRow, Radio, RadioGroup, FormControlLabel, Select, MenuItem
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';

const DUMMY_DATA = [
  {
    patient: 'John Doe', flags: '', type: 'Treatment', status: 'Checked out complete', providers: 'KAR', operatory: 'Consult', aptDate: 'Apr 20, 2026', time: 'Mon, 08:00 AM', duration: '60 mins', procedures: 'fl / Scal w inflam', nextAptDate: 'Oct 01, 2026',
  },
  {
    patient: 'Jane Smith', flags: '', type: 'Recare', status: 'Checked out complete', providers: 'SAB', operatory: 'Operatory 2', aptDate: 'Apr 15, 2026', time: 'Wed, 10:30 AM', duration: '60 mins', procedures: 'fl / hygiene / URQ undefined / U...', nextAptDate: 'May 13, 2026',
  },
  {
    patient: 'Robert Brown', flags: '', type: 'Treatment', status: 'Cancelled Short Notice', providers: 'SAB', operatory: 'Operatory 4', aptDate: 'May 06, 2026', time: 'Wed, 12:30 PM', duration: '60 mins', procedures: '#30 OB, comp / #31 OB, comp', nextAptDate: '',
  },
];

const AppointmentsReport = () => {
  const [dateType, setDateType] = useState('aptDate');
  const [startDate, setStartDate] = useState(dayjs('2026-04-08'));
  const [endDate, setEndDate] = useState(dayjs('2026-05-08'));
  const [provider, setProvider] = useState('all');
  const [status, setStatus] = useState('all');
  const [locationType, setLocationType] = useState('office');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

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
          <ReportFilterBar 
            topRowFilters={topFilters}
            bottomRowFilters={bottomFilters}
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
    </LocalizationProvider>
  );
};

export default AppointmentsReport;

