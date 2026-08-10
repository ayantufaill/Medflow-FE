import React, { useState } from 'react';
import {
  Box, Typography, Checkbox, Button, TableCell, TableRow
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';

const DUMMY_DATA = [
  { patient: 'Alice Smith', type: 'Recare', providers: 'SAB', duration: '70 mins', prefDay: 'Thurs', prefTime: '09:30 AM', procedures: 'BW4, hygiene, fl, PA1, compex, PAadd...', aptDate: 'Apr 23, 2026', nextAptDate: '', reason: 'No show - please take deposit next time scheduling. KMH' },
  { patient: 'Bob Johnson', type: 'Recare', providers: 'SAB', duration: '85 mins', prefDay: 'Thurs', prefTime: '08:15 AM', procedures: 'FMX, compex, 3d scan', aptDate: 'Apr 23, 2026', nextAptDate: '', reason: 'no show please take deposit yf' },
];

const NoShowAppointmentsReport = () => {
  const [startDate, setStartDate] = useState(dayjs('2026-04-08'));
  const [endDate, setEndDate] = useState(dayjs('2026-05-08'));
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
export default NoShowAppointmentsReport;
