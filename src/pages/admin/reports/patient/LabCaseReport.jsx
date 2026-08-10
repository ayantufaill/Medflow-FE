import React, { useState } from 'react';
import {
  Box, Typography, Button, Checkbox, Select, MenuItem, Menu, IconButton, TableCell, TableRow
} from '@mui/material';
import {
  DeleteOutline, EditOutlined, VisibilityOutlined, CheckCircle
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';

const DUMMY_DATA = [
  { 
    patient: 'Stephanie Peterson', 
    provider: 'Evident', 
    procedures: '- Cd8999.1 Retainer delivery', 
    dueDate: '05/08/2026', 
    apptDate: '', 
    sharedDate: '', 
    status: 'Quality Checked',
  },
];

const LabCaseReport = () => {
  const [startDate, setStartDate] = useState(dayjs('2026-05-08'));
  const [endDate, setEndDate] = useState(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [dueDateAnchorEl, setDueDateAnchorEl] = useState(null);

  const handleStatusClick = (event) => setStatusAnchorEl(event.currentTarget);
  const handleStatusClose = () => setStatusAnchorEl(null);

  const handleDueDateClick = (event) => setDueDateAnchorEl(event.currentTarget);
  const handleDueDateClose = () => setDueDateAnchorEl(null);

  const columns = [
    { label: 'Patient' },
    { label: 'Lab Provider' },
    { label: 'Procedures' },
    { label: 'Due Date' },
    { label: 'Appointment Date' },
    { label: 'Shared Date' },
    { label: 'Status' },
    { label: 'Notes' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.provider}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.procedures}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.dueDate}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.apptDate}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.sharedDate}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ backgroundColor: '#10b981', color: '#fff', borderRadius: 1, p: 0.3, mr: 1, display: 'flex' }}>
            <CheckCircle sx={{ fontSize: '0.8rem' }} />
          </Box>
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{row.status}</Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" sx={{ p: 0.3 }}><DeleteOutline sx={{ fontSize: '1rem', color: '#666' }} /></IconButton>
          <IconButton size="small" sx={{ p: 0.3 }}><EditOutlined sx={{ fontSize: '1rem', color: '#666' }} /></IconButton>
          <IconButton size="small" sx={{ p: 0.3 }}><VisibilityOutlined sx={{ fontSize: '1rem', color: '#666' }} /></IconButton>
        </Box>
      </TableCell>
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
            textField: { variant: 'outlined', size: 'small', sx: { width: 140, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } }
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
            textField: { variant: 'outlined', size: 'small', sx: { width: 140, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } } }
          }}
        />
      </Box>
      <ReportSelect 
        label="Select Status" 
        prefix="Filter By:" 
        defaultValue="Select Status" 
        options={[
          { value: 'Select Status', label: 'Select Status' },
          { value: 'all', label: 'All Statuses' },
          { value: 'qc', label: 'Quality Checked' },
          { value: 'pending', label: 'Pending' },
          { value: 'sent', label: 'Sent to Lab' }
        ]} 
      />
      <ReportCheckbox label="Include Inactive" />
    </>
  );

  const bottomFilters = (
    <>
      <ReportSelect 
        label="Lab Due Date" 
        defaultValue="Lab Due Date" 
        options={[
          { value: 'Lab Due Date', label: 'Lab Due Date' },
          { value: 'Appointment Date', label: 'Appointment Date' },
          { value: 'Shared Date', label: 'Shared Date' }
        ]} 
      />
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="Lab Case Documents:">
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
              (number of lab cases = {DUMMY_DATA.length})
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ color: '#337ab7', cursor: 'pointer', fontSize: '0.7rem' }}>
                Expand Notes
              </Typography>
              <Box sx={{ transform: 'translateY(-2px)' }}>
                <ProductionReportActions
                  onExportCsv={() => alert('Exporting CSV...')}
                  onPrint={() => window.print()}
                  hasData={DUMMY_DATA.length > 0}
                />
              </Box>
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
export default LabCaseReport;
