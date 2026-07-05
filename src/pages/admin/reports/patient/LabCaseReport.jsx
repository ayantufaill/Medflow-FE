import React, { useState } from 'react';
import {
  Box, Typography, Button, Checkbox, Select, MenuItem, Menu, IconButton, TableCell, TableRow
} from '@mui/material';
import {
  ChevronLeft, ChevronRight, DeleteOutline, EditOutlined, VisibilityOutlined, CheckCircle
} from '@mui/icons-material';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';

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
  const [dateRange, setDateRange] = useState('daily');
  const [currentDate, setCurrentDate] = useState(dayjs('2026-05-08'));
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const handlePrevDate = () => setCurrentDate(prev => prev.subtract(1, 'day'));
  const handleNextDate = () => setCurrentDate(prev => prev.add(1, 'day'));

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReportSelect 
          label={dateRange} 
          prefix="Date Range:" 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)} 
          options={['daily', 'weekly', 'monthly']} 
          width="130px" 
        />
        <IconButton size="small" onClick={handlePrevDate}><ChevronLeft fontSize="small" /></IconButton>
        <Typography sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 600, minWidth: 80, textAlign: 'center', whiteSpace: 'nowrap' }}>
          {currentDate.format('MMM DD, YYYY')}
        </Typography>
        <IconButton size="small" onClick={handleNextDate}><ChevronRight fontSize="small" /></IconButton>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Date:</Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#337ab7', whiteSpace: 'nowrap' }}>
          {currentDate.format('MM/DD/YYYY')}
        </Typography>
      </Box>

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
    <React.Fragment>
      <ReportLayout title="Lab Case Documents:">
        <ReportFilterBar 
          topRowFilters={topFilters}
          bottomRowFilters={bottomFilters}
          onApplyFilters={() => console.log('Apply Filters')}
          onCreateTemplate={() => setTemplateDialogOpen(true)}
          onExportCsv={() => alert('Exporting CSV...')}
          onPrint={() => window.print()}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#337ab7', cursor: 'pointer', fontSize: '0.7rem' }}>
            Expand Notes
          </Typography>
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
  );
};
export default LabCaseReport;
