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
      { header: 'Sent to Patient', key: 'sentToPatient' },
      { header: 'Sent to User', key: 'sentToUser' },
      { header: 'Template', key: 'template' },
      { header: 'Status', key: 'status' },
      { header: 'Planned On', key: 'plannedOn' },
      { header: 'Sent On', key: 'sentOn' },
      { header: 'Related Info', key: (row) => formatRelatedInfo(row.info) },
      { header: 'Sent By', key: 'sentBy' },
      { header: 'Patient Reply', key: 'reply' },
    ], 'Notifications_Report');
  };

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
      <TableCell sx={{ fontSize: '0.7rem' }}>{formatRelatedInfo(row.info)}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.sentBy}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.reply}</TableCell>
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
                onPrint={() => window.print()}
                hasData={filteredData.length > 0}
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
              data={filteredData} 
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
export default NotificationsReport;
