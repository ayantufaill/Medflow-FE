import React, { useState } from 'react';
import {
  Box, Typography, Button, Radio, RadioGroup, FormControlLabel, TableCell, TableRow, Select, MenuItem, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotificationsReport, selectNotificationsData, selectNotificationsDataLoading } from '../../../../store/slices/patientReportSlice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { exportToCSV } from '../../../../utils/exportUtils';
import medflowLogo from '../../../../assets/medflow-logo.png';

const formatRelatedInfo = (info) => {
  if (!info) return '--';
  
  let parsedInfo = info;
  if (typeof info === 'string') {
    try {
      parsedInfo = JSON.parse(info);
    } catch (e) {
      return info; 
    }
  }

  if (typeof parsedInfo === 'object' && parsedInfo !== null) {
    if (parsedInfo.type === 'patient_audit_event') {
      const formatString = (str) => {
        if (!str) return '';
        return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      };
      
      const action = formatString(parsedInfo.action);
      const section = formatString(parsedInfo.section);
      
      return `Audit: ${action} ${section ? `(${section})` : ''}`;
    }
    
    if (parsedInfo.message) return parsedInfo.message;
    if (parsedInfo.description) return parsedInfo.description;
    
    return 'System Event'; 
  }

  return parsedInfo;
};



const NotificationsReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectNotificationsData) || [];
  const loading = useSelector(selectNotificationsDataLoading);

  const [notificationType, setNotificationType] = useState('patient');
  const [plannedStart, setPlannedStart] = useState(dayjs('2026-05-08'));
  const [plannedEnd, setPlannedEnd] = useState(dayjs('2026-05-08'));
  const [sentStart, setSentStart] = useState(null);
  const [sentEnd, setSentEnd] = useState(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [template, setTemplate] = useState('none');
  const [status, setStatus] = useState('none');

  const fetchReport = () => {
    dispatch(fetchNotificationsReport({
      plannedStart: plannedStart ? plannedStart.format('YYYY-MM-DD') : '',
      plannedEnd: plannedEnd ? plannedEnd.format('YYYY-MM-DD') : '',
      sentStart: sentStart ? sentStart.format('YYYY-MM-DD') : '',
      sentEnd: sentEnd ? sentEnd.format('YYYY-MM-DD') : '',
      notificationType,
      template,
      status
    }));
  };

  React.useEffect(() => {
    fetchReport();
  }, [dispatch]);

  const handleApplyFilters = () => {
    fetchReport();
  };

  // Client-side filtering by status since backend returns all records
  const filteredData = status && status !== 'none'
    ? reportData.filter(row => row.status?.toLowerCase() === status.toLowerCase())
    : reportData;

  const handleExportCsv = () => {
    exportToCSV(filteredData, [
      { header: 'Date', key: 'date' },
      { header: 'User', key: 'user' },
      { header: 'Type', key: 'type' },
      { header: 'Alert Title', key: 'title' },
      { header: 'Alert Details', key: 'details' },
      { header: 'Status', key: 'status' }
    ], 'System_Notifications_Report');
  };

  const handlePrint = () => {
    const printArea = document.getElementById('notifications-print-area');
    if (!printArea) return;

    const htmlContent = `
      <html>
        <head>
          <title>Notifications Report</title>
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
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Notifications Report</h2>
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

  const columns = [
    { label: 'Date' },
    { label: 'User' },
    { label: 'Type' },
    { label: 'Alert Title' },
    { label: 'Alert Details' },
    { label: 'Status' }
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.date}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.user}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>{row.type ? row.type.replace('_', ' ') : ''}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1e293b' }}>{row.title}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem', color: '#64748b' }}>{row.details}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
    </TableRow>
  );

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          planned on start date
        </Typography>
        <DatePicker
          value={plannedStart}
          onChange={(v) => setPlannedStart(v)}
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
          planned on end date
        </Typography>
        <DatePicker
          value={plannedEnd}
          onChange={(v) => setPlannedEnd(v)}
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
          sent on start date
        </Typography>
        <DatePicker
          value={sentStart}
          onChange={(v) => setSentStart(v)}
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
          sent on end date
        </Typography>
        <DatePicker
          value={sentEnd}
          onChange={(v) => setSentEnd(v)}
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
          <Box className="hide-on-print" sx={{ mb: 2 }}>
            <ReportFilterBar 
              topRowFilters={topFilters}
              bottomRowFilters={bottomFilters}
              onApplyFilters={handleApplyFilters}
              onCreateTemplate={() => setTemplateDialogOpen(true)}
            />
          </Box>

          {/* Summary Text and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
              (number of notifications = {filteredData.length})
            </Typography>
            <Box sx={{ transform: 'translateY(-4px)' }}>
              <ProductionReportActions
                onExportCsv={handleExportCsv}
                onPrint={handlePrint}
                hasData={filteredData.length > 0}
              />
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <div id="notifications-print-area">
              <ReportDataTable 
                columns={columns} 
                data={filteredData} 
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
export default NotificationsReport;
