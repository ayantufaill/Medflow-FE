import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Checkbox, Select, MenuItem, Menu, IconButton, TableCell, TableRow, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
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
import { fetchLabCaseReport, selectLabCaseData, selectLabCaseDataLoading } from '../../../../store/slices/patientReportSlice';



const LabCaseReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectLabCaseData) || [];
  const loading = useSelector(selectLabCaseDataLoading);

  const [startDate, setStartDate] = useState(dayjs('2026-05-08'));
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('all');
  const [dateFilterType, setDateFilterType] = useState('Lab Due Date');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const fetchReport = () => {
    dispatch(fetchLabCaseReport({
      startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
      status,
      dateFilterType,
      includeInactive
    }));
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleApply = () => {
    fetchReport();
  };

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
    { label: 'Actions' },
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
          <IconButton onClick={() => alert('Delete Lab Case')} size="small" sx={{ p: 0.3 }}><DeleteOutline sx={{ fontSize: '1rem', color: '#666' }} /></IconButton>
          <IconButton onClick={() => alert('Edit Lab Case')} size="small" sx={{ p: 0.3 }}><EditOutlined sx={{ fontSize: '1rem', color: '#666' }} /></IconButton>
          <IconButton onClick={() => alert('View Lab Case')} size="small" sx={{ p: 0.3 }}><VisibilityOutlined sx={{ fontSize: '1rem', color: '#666' }} /></IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
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
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
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
      <ReportSelect 
        label="Select Status" 
        prefix="Filter By:" 
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        options={[
          { value: 'all', label: 'All Statuses' },
          { value: 'qc', label: 'Quality Checked' },
          { value: 'pending', label: 'Pending' },
          { value: 'sent', label: 'Sent to Lab' }
        ]} 
      />
      <ReportCheckbox label="Include Inactive" checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} />
    </>
  );

  const bottomFilters = (
    <>
      <ReportSelect 
        label="Lab Due Date" 
        value={dateFilterType}
        onChange={(e) => setDateFilterType(e.target.value)}
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
              onApplyFilters={handleApply}
              onCreateTemplate={() => setTemplateDialogOpen(true)}
            />
          </Box>

          {/* Summary Text and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
              (number of lab cases = {reportData.length})
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ color: '#337ab7', cursor: 'pointer', fontSize: '0.7rem' }}>
                Expand Notes
              </Typography>
              <Box sx={{ transform: 'translateY(-2px)' }}>
                <ProductionReportActions
                  onExportCsv={() => alert('Exporting CSV...')}
                  onPrint={() => window.print()}
                  hasData={reportData.length > 0}
                />
              </Box>
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
export default LabCaseReport;
