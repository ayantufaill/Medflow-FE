import React, { useState } from 'react';
import {
  Box, Typography, Button, Radio, RadioGroup, FormControlLabel, TableCell, TableRow, Select, MenuItem
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';

const DUMMY_DATA = [
  { sentToPatient: 'Alice Smith (alice@example.com)', sentToUser: '', template: 'Save The Date', status: 'Pending', plannedOn: 'May 08, 2026', sentOn: '', info: 'Appt on 05/14/2026 @ 8:15 AM', sentBy: 'System', reply: '' },
  { sentToPatient: 'Bob Johnson (bob@example.com)', sentToUser: '', template: 'Patient Custom SMS', status: 'Sent', plannedOn: 'May 08, 2026', sentOn: 'May 08, 2026', info: '', sentBy: 'User', reply: '' },
  { sentToPatient: 'Charlie Brown (charlie@example.com)', sentToUser: '', template: 'Patient Welcome', status: 'Sent', plannedOn: 'May 08, 2026', sentOn: 'May 08, 2026', info: '', sentBy: 'User', reply: '' },
  { sentToPatient: 'David Lee (david@example.com)', sentToUser: '', template: 'Patient Custom SMS', status: 'Sent', plannedOn: 'May 08, 2026', sentOn: 'May 08, 2026', info: '', sentBy: 'User', reply: 'Great! Thank you! See you then!' },
];

const NotificationsReport = () => {
  const [notificationType, setNotificationType] = useState('patient');
  const [plannedStart, setPlannedStart] = useState(dayjs('2026-05-08'));
  const [plannedEnd, setPlannedEnd] = useState(dayjs('2026-05-08'));
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [template, setTemplate] = useState('none');
  const [status, setStatus] = useState('none');

  const columns = [
    { label: 'Sent to Patient' },
    { label: 'Sent to User' },
    { label: 'Template' },
    { label: 'Status' },
    { label: 'Planned On' },
    { label: 'Sent On' },
    { label: 'Related Info' },
    { label: 'Sent By' },
    { label: 'Patient Reply' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7' }}>{row.sentToPatient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.sentToUser}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.template}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.plannedOn}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.sentOn}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.info}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.sentBy}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.reply}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Planned On Start Date:</Typography>
        <DatePicker
          value={plannedStart}
          onChange={(v) => setPlannedStart(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'outlined', size: 'small', sx: { width: 120, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } },
            openPickerIcon: { sx: { display: 'none' } }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Planned On End Date:</Typography>
        <DatePicker
          value={plannedEnd}
          onChange={(v) => setPlannedEnd(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'outlined', size: 'small', sx: { width: 120, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } },
            openPickerIcon: { sx: { display: 'none' } }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Sent On Start Date:</Typography>
        <DatePicker
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'outlined', size: 'small', sx: { width: 120, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } },
            openPickerIcon: { sx: { display: 'none' } }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Sent On End Date:</Typography>
        <DatePicker
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Notification Type:</Typography>
        <RadioGroup row value={notificationType} onChange={(e) => setNotificationType(e.target.value)} sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel value="patient" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>Patient</Typography>} sx={{ m: 0, mr: 1 }} />
          <FormControlLabel value="internal" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>Internal</Typography>} sx={{ m: 0, mr: 1 }} />
          <FormControlLabel value="other" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{ fontSize: '0.8rem', color: '#1e293b', whiteSpace: 'nowrap' }}>Other</Typography>} sx={{ m: 0 }} />
        </RadioGroup>
      </Box>

      <ReportSelect 
        value={template} 
        onChange={(e) => setTemplate(e.target.value)} 
        options={[
          { value: 'none', label: 'Choose Template' },
          { value: 'save', label: 'Save The Date' },
          { value: 'custom', label: 'Patient Custom SMS' },
          { value: 'welcome', label: 'Patient Welcome' }
        ]} 
        width="160px"
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Notification Status:</Typography>
        <ReportSelect 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          options={[
            { value: 'none', label: 'Choose Status' },
            { value: 'sent', label: 'Sent' },
            { value: 'pending', label: 'Pending' },
            { value: 'failed', label: 'Failed' }
          ]} 
          width="140px"
        />
      </Box>
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="Notifications Report:">
          <ReportFilterBar 
            topRowFilters={topFilters}
            bottomRowFilters={bottomFilters}
            onApplyFilters={() => console.log('Apply')}
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
export default NotificationsReport;
