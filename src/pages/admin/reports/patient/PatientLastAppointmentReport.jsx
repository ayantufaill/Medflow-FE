import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Checkbox, Button, TableCell, TableRow, Select, MenuItem, TableHead, Table, TableBody, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportCheckbox, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { exportToCSV } from '../../../../utils/exportUtils';
import { fetchPatientLastAppointmentReport, selectLastAppointmentData, selectLastAppointmentDataLoading } from '../../../../store/slices/patientReportSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import medflowLogo from '../../../../assets/medflow-logo.png';



const PatientLastAppointmentReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectLastAppointmentData) || [];
  const loading = useSelector(selectLastAppointmentDataLoading);
  const providerList = useSelector(selectProviderDropdownList);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(dayjs());
  
  const [patientStatus, setPatientStatus] = useState('active');
  const [provider, setProvider] = useState('all');
  const [appointmentStatus, setAppointmentStatus] = useState('all');
  const [flagsFilter, setFlagsFilter] = useState('all');
  const [showFlags, setShowFlags] = useState(false);

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const providerOptions = useMemo(() => [
    { value: 'all', label: 'All Providers' },
    ...(providerList || []).map((p) => {
      const first = p.userId?.firstName || p.firstName || p.FName || '';
      const last = p.userId?.lastName || p.lastName || p.LName || '';
      const name = `${first} ${last}`.trim() || p.providerCode || p._id || 'Unknown';
      return { value: p.ProvNum || p.id || name, label: name };
    }),
  ], [providerList]);

  const apptStatusOptions = [
    { value: 'all', label: 'All Appointment Status' },
    { value: '1', label: 'Scheduled' },
    { value: '2', label: 'CheckedoutCompleted' },
    { value: '3', label: 'Broken' },
    { value: '4', label: 'Cancelled' },
    { value: '5', label: 'CancelledShortNotice' },
    { value: '6', label: 'Unconfirmed' },
  ];

  const fetchReport = () => {
    let filterBy = patientStatus;
    if (patientStatus === 'active') filterBy = undefined;

    dispatch(fetchPatientLastAppointmentReport({
      startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
      filterBy,
      provider,
      appointmentStatus,
      flagsFilter,
      showFlags
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
      { header: 'ID', key: 'id' },
      { header: 'Patient', key: 'patient' },
      { header: 'Flags', key: (row) => Array.isArray(row.flags) ? row.flags.map(f => typeof f === 'object' ? (f.name || f.label) : String(f)).join(', ') : '' },
      { header: 'Patient Status', key: 'status' },
      { header: 'Appt Date', key: 'apptDate' },
      { header: 'Appt Type', key: 'type' },
      { header: 'Appt Status', key: 'apptStatus' },
      { header: 'Next Appt Date', key: 'nextAppt' },
      { header: 'New Patient Appt', key: 'newPatient' },
      { header: 'Provider', key: 'provider' },
      { header: 'Email', key: 'email' },
      { header: 'Phone Number', key: 'phone' },
      { header: 'Permission to Text', key: 'text' },
      { header: 'Permission to Email', key: 'emailPerm' },
      { header: 'Request Review', key: 'review' },
    ], 'Patient_Last_Appointment_Report');
  };

  const handlePrint = () => {
    const printArea = document.getElementById('last-appointment-print-area');
    if (!printArea) return;

    const htmlContent = `
      <html>
        <head>
          <title>Patient By Last Appointment Report</title>
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
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Patient By Last Appointment Report</h2>
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
    { label: 'ID' },
    { label: 'Patient' },
    ...(showFlags ? [{ label: 'Flags' }] : []),
    { label: 'Patient Status' },
    { label: 'Appt Date' },
    { label: 'Appt Type' },
    { label: 'Appt Status' },
    { label: 'Next Appt Date' },
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
      {showFlags && (
        <TableCell>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {Array.isArray(row.flags) && row.flags.map((flag, idx) => {
              const flagObj = typeof flag === 'object' ? flag : { name: String(flag), color: '#3b82f6' };
              return (
                <div 
                  key={idx}
                  title={flagObj.name || flagObj.label || 'Flag'}
                  style={{ 
                    width: '14px', 
                    height: '14px', 
                    backgroundColor: flagObj.color || '#cccccc', 
                    borderRadius: '2px',
                    border: '1px solid #d1d5db',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact'
                  }} 
                />
              );
            })}
          </div>
        </TableCell>
      )}
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.apptDate}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.type}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.apptStatus}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.nextAppt}</TableCell>
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
      
      <ReportSelect value={patientStatus} onChange={(e) => setPatientStatus(e.target.value)} prefix="Filter Report By:" options={[{ value: 'active', label: 'Active Patients Only' }, { value: 'inactive', label: 'Inactive Patients' }, { value: 'all', label: 'All Patients' }]} width="140px" />
      <ReportSelect value={provider} onChange={(e) => setProvider(e.target.value)} options={providerOptions} width="120px" />
      <ReportSelect value={appointmentStatus} onChange={(e) => setAppointmentStatus(e.target.value)} options={apptStatusOptions} width="160px" />
      
      <ReportSelect defaultValue="default" prefix="Sort Report By:" options={[{ value: 'default', label: 'Default' }]} width="100px" />
    </>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox 
        label="Show Flags in Report" 
        checked={showFlags}
        onChange={(e) => setShowFlags(e.target.checked)}
      />
      <ReportSelect 
        value={flagsFilter} 
        onChange={(e) => setFlagsFilter(e.target.value)} 
        options={[
          { value: 'all', label: 'Pts With Or Without Flags' },
          { value: 'withFlags', label: 'Pts With Flags' },
          { value: 'withoutFlags', label: 'Pts Without Flags' }
        ]} 
        width="180px" 
      />
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="Patient By Last Appointment Report:">
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
              (number of patients = {reportData.length})
            </Typography>
            <Box sx={{ transform: 'translateY(-4px)' }}>
              <ProductionReportActions
                onExportCsv={handleExportCsv}
                onPrint={handlePrint}
                hasData={reportData.length > 0}
              />
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <div id="last-appointment-print-area">
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
export default PatientLastAppointmentReport;
