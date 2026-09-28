import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Button, Select, MenuItem, TableCell, TableRow, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import { exportToCSV } from '../../../../utils/exportUtils';
import { fetchReferralDocumentReport, selectReferralDocumentData, selectReferralDocumentDataLoading } from '../../../../store/slices/patientReportSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import medflowLogo from '../../../../assets/medflow-logo.png';



const ReferralDocumentReport = () => {
  const dispatch = useDispatch();
  const reportData = useSelector(selectReferralDocumentData) || [];
  const loading = useSelector(selectReferralDocumentDataLoading);
  const providerList = useSelector(selectProviderDropdownList);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(dayjs());
  const [status, setStatus] = useState('none');
  const [provider, setProvider] = useState('all');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const providerOptions = useMemo(() => [
    { value: 'all', label: 'All' },
    ...(providerList || []).map((p) => {
      const first = p.userId?.firstName || p.firstName || p.FName || '';
      const last = p.userId?.lastName || p.lastName || p.LName || '';
      const name = `${first} ${last}`.trim() || p.providerCode || p._id || 'Unknown';
      return { value: p.ProvNum || p.id || name, label: name };
    }),
  ], [providerList]);

  const fetchReport = () => {
    dispatch(fetchReferralDocumentReport({
      startDate: startDate ? startDate.format('YYYY-MM-DD') : undefined,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : undefined,
      status, 
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
      { header: 'Referral Patient', key: 'patient' },
      { header: 'Referral Provider', key: 'provider' },
      { header: 'Created Date', key: 'created' },
      { header: 'Due Date', key: 'due' },
      { header: 'Shared Date', key: 'shared' },
      { header: 'Status', key: 'status' },
    ], 'Referral_Document_Report');
  };

  const handlePrint = () => {
    const printArea = document.getElementById('referral-document-print-area');
    if (!printArea) return;

    const htmlContent = `
      <html>
        <head>
          <title>Referral Document Report</title>
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
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Referral Document Report</h2>
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
    { label: 'Referral Patient' },
    { label: 'Referral Provider' },
    { label: 'Created Date' },
    { label: 'Due Date' },
    { label: 'Shared Date' },
    { label: 'Status' },
  ];

  const renderRow = (row, i) => (
    <TableRow key={i} sx={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc' }}>
      <TableCell sx={{ fontSize: '0.7rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.provider}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.created}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.due}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.shared}</TableCell>
      <TableCell sx={{ fontSize: '0.7rem' }}>{row.status}</TableCell>
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
      <Typography variant="caption" sx={{ fontWeight: 600, mr: 1, ml: 1, color: '#1e293b' }}>Filter By:</Typography>
      <ReportSelect 
        label="None" 
        prefix="Status:" 
        value={status} 
        onChange={(e) => setStatus(e.target.value)} 
        options={[
          { value: 'none', label: 'None' },
          { value: 'new', label: 'New' },
          { value: 'sent', label: 'Sent Out' }
        ]}
      />
      <ReportSelect 
        label="All" 
        prefix="Provider:" 
        value={provider} 
        onChange={(e) => setProvider(e.target.value)} 
        options={providerOptions}
      />
    </>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <ReportLayout title="Referral Document:">
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
              (number of documents = {reportData.length})
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
            <div id="referral-document-print-area">
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
export default ReferralDocumentReport;
