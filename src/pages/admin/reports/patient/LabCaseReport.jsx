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
import { exportToCSV } from '../../../../utils/exportUtils';
import { fetchLabCaseReport, selectLabCaseData, selectLabCaseDataLoading } from '../../../../store/slices/patientReportSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import medflowLogo from '../../../../assets/medflow-logo.png';



const LabCaseReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectLabCaseData) || [];
  const loading = useSelector(selectLabCaseDataLoading);

  const [startDate, setStartDate] = useState(dayjs('2026-05-08'));
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('all');
  const [dateFilterType, setDateFilterType] = useState('Lab Due Date');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [provider, setProvider] = useState('all');
  const providerList = useSelector(selectProviderDropdownList);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const providerOptions = React.useMemo(() => [
    { value: 'all', label: 'All' },
    ...(providerList || []).map((p) => {
      const first = p.userId?.firstName || p.firstName || p.FName || '';
      const last = p.userId?.lastName || p.lastName || p.LName || '';
      const name = `${first} ${last}`.trim() || p.providerCode || p._id || 'Unknown';
      return { value: p.ProvNum || p.id || name, label: name };
    }),
  ], [providerList]);

  const fetchReport = () => {
    dispatch(fetchLabCaseReport({
      startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
      status,
      dateFilterType,
      includeInactive,
      provider
    }));
  };

  useEffect(() => {
    dispatch(fetchAllProvidersForDropdown());
    fetchReport();
  }, []);

  const handleApply = () => {
    fetchReport();
  };

  const handleExportCsv = () => {
    exportToCSV(reportData, [
      { header: 'Patient', key: 'patient' },
      { header: 'Lab Provider', key: 'provider' },
      { header: 'Procedures', key: 'procedures' },
      { header: 'Due Date', key: 'dueDate' },
      { header: 'Appointment Date', key: 'apptDate' },
      { header: 'Shared Date', key: 'sharedDate' },
      { header: 'Status', key: 'status' },
    ], 'Lab_Case_Report');
  };

  const handlePrint = () => {
    const printArea = document.getElementById('lab-case-print-area');
    if (!printArea) return;

    const htmlContent = `
      <html>
        <head>
          <title>Lab Case Documents Report</title>
          <style>
            body { 
              font-family: sans-serif; 
              font-size: 12px; 
              background-color: #fff; 
              color: #000; 
              padding: 20px; 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa !important; font-weight: bold; }
            .no-print, button, svg.MuiSvgIcon-root { display: none !important; }
            .MuiTablePagination-root { display: none !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" />
          </div>
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Lab Case Documents Report</h2>
          <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 30px;">
            ${printArea.innerHTML}
          </div>
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.srcdoc = htmlContent;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    };
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
      <ReportSelect 
        label="Provider" 
        value={provider} 
        onChange={(e) => setProvider(e.target.value)} 
        options={providerOptions}
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
                  onExportCsv={handleExportCsv}
                  onPrint={handlePrint}
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
            <div id="lab-case-print-area">
              <ReportDataTable 
                columns={columns} 
                data={reportData} 
                renderRow={renderRow} 
              />
            </div>
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
