import React, { useState } from 'react';
import {
  Box, Typography, Checkbox, Button, TableCell, TableRow, Select, MenuItem, TableHead, Table, TableBody
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';

const DUMMY_DATA = [
  { id: '192', patient: 'Alice Smith', status: 'Active', apptDate: 'Jul 21, 2026', type: 'Recare', apptStatus: 'Unconfirmed', newPatient: 'No', provider: 'Christina Sabour', email: 'alice@example.com', phone: '123-456-7890', text: 'Yes', emailPerm: 'Yes', review: 'No' },
  { id: '610', patient: 'Bob Johnson', status: 'Active', apptDate: 'May 14, 2026', type: 'Recare', apptStatus: 'Unconfirmed', newPatient: 'No', provider: 'Christina Sabour', email: 'bob@example.com', phone: '123-456-7891', text: 'Yes', emailPerm: 'Yes', review: 'No' },
];

const PatientNextAppointmentReport = () => {
  const [startDate, setStartDate] = useState(dayjs('2026-05-08'));
  const [endDate, setEndDate] = useState(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const columns = [
    { label: 'ID' },
    { label: 'Patient' },
    { label: 'Patient Status' },
    { label: 'Appt Date' },
    { label: 'Appt Type' },
    { label: 'Appt Status' },
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
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Start Date:</Typography>
        <DatePicker
          value={startDate}
          onChange={(v) => setStartDate(v)}
          format="MM/DD/YYYY"
          slotProps={{ 
            textField: { variant: 'outlined', size: 'small', sx: { width: 140, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } },
            openPickerIcon: { sx: { display: 'none' } }
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
            textField: { variant: 'outlined', size: 'small', sx: { width: 140, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } },
            openPickerIcon: { sx: { display: 'none' } }
          }}
        />
      </Box>
      <ReportSelect 
        label="Active Patients Only" 
        prefix="Filter Report By:" 
        defaultValue="active" 
        options={[{ value: 'active', label: 'Active Patients Only' }]} 
      />
      <ReportSelect label="All Providers" defaultValue="all" options={[{ value: 'all', label: 'All Providers' }]} />
      <ReportSelect label="All Appointment Status" defaultValue="all" options={[{ value: 'all', label: 'All Appointment Status' }]} />
      <ReportSelect label="Default" prefix="Sort Report By:" defaultValue="default" options={[{ value: 'default', label: 'Default' }]} />
    </>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox label="Show Flags in Report" />
      <ReportSelect label="Pts With Or Without Flags" defaultValue="all" options={[{ value: 'all', label: 'Pts With Or Without Flags' }]} />
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="Patient By Next Appointment Report:">
          <Box className="hide-on-print" sx={{ mb: 2 }}>
            <ReportFilterBar 
              topRowFilters={topFilters}
              bottomRowFilters={bottomFilters}
              onApplyFilters={() => console.log('Apply Filters')}
              onCreateTemplate={() => setTemplateDialogOpen(true)}
            />
          </Box>

          {/* Summary Text and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
              (number of patients = {DUMMY_DATA.length})
            </Typography>
            <Box sx={{ transform: 'translateY(-4px)' }}>
              <ProductionReportActions
                onExportCsv={() => alert('Exporting CSV...')}
                onPrint={() => window.print()}
                hasData={DUMMY_DATA.length > 0}
              />
            </Box>
          </Box>

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
export default PatientNextAppointmentReport;
