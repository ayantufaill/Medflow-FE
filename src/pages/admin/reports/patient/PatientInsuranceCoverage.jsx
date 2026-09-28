import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReportLayout, ReportFilterBar, ReportCheckbox, ReportSelect, ReportDivider, ReportSearchInput } from '../../../../components/reports/ui';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Autocomplete,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Search as SearchIcon } from '@mui/icons-material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { useInsuranceCatalog } from '../../../../hooks/redux/useInsuranceCatalog';
import {
  fetchPatientInsuranceCoverageReport,
  selectInsuranceCoverageData,
  selectInsuranceCoverageLoading,
} from '../../../../store/slices/patientReportSlice';
import medflowLogo from '../../../../assets/medflow-logo.png';



const PatientInsuranceCoverage = () => {
  const dispatch = useDispatch();
  const reduxData = useSelector(selectInsuranceCoverageData);
  const loading = useSelector(selectInsuranceCoverageLoading);

  const { companies: allCompanies, fetchCompanies } = useInsuranceCatalog();
  const initialFetchRef = useRef({ companies: false });

  useEffect(() => {
    if ((!allCompanies || allCompanies.length === 0) && !initialFetchRef.current.companies) {
      initialFetchRef.current.companies = true;
      fetchCompanies();
    }
  }, [allCompanies, fetchCompanies]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchItems, setSelectedSearchItems] = useState([]);
  const DUMMY_INSURANCE = [
    { payerId: '00621', carrierName: 'Blue Cross Blue Shield of Illinois', groupName: 'VIVID SEATS, LLC', groupNumber: '300871', planName: 'BCBS IL', payerAddress: '123 Blue St, Chicago, IL', carrierPhone: '800-123-4567' },
    { payerId: '52133', carrierName: 'United Healthcare Dental', groupName: 'DOXIM', groupNumber: '1602187', planName: 'UHC ( DOXIM )', payerAddress: '456 Health Way, Minnetonka, MN', carrierPhone: '800-987-6543' },
    { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'TEXAS HEALTH RESOURCES', groupNumber: '087639801300001', planName: 'Aetna Dental Plans', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
  ];
  const [rawReportData, setRawReportData] = useState([]);
  const [data, setData] = useState([]);
  const [grouping, setGrouping] = useState('no');
  const [assignmentFilter, setAssignmentFilter] = useState('no');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const [apptFilterType, setApptFilterType] = useState('no');
  const [apptStartDate, setApptStartDate] = useState('');
  const [apptEndDate, setApptEndDate] = useState('');
  const [apptSingleDate, setApptSingleDate] = useState('');
  const [showNoCoverage, setShowNoCoverage] = useState(false);

  const availablePlans = useMemo(() => {
    const plans = rawReportData.map(item => item.planName).filter(Boolean);
    return [...new Set(plans)].sort();
  }, [rawReportData]);

  useEffect(() => {
    dispatch(fetchPatientInsuranceCoverageReport({
      searchQuery,
      searchItems: selectedSearchItems.join('||'),
      assignmentFilter,
      apptFilterType,
      apptStartDate,
      apptEndDate,
      apptSingleDate,
      showNoCoverage
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduxData) {
      setRawReportData(reduxData);
    }
  }, [reduxData]);

  const handleApplyFilters = () => {
    dispatch(fetchPatientInsuranceCoverageReport({
      searchQuery,
      searchItems: selectedSearchItems.join('||'),
      assignmentFilter,
      apptFilterType,
      apptStartDate,
      apptEndDate,
      apptSingleDate,
      showNoCoverage
    }));
  };

  useEffect(() => {
    setData(rawReportData || []);
  }, [rawReportData]);

  const groupedData = useMemo(() => {
    if (grouping === 'no') return null;
    const groups = {};
    data.forEach((row) => {
      let key = 'Unassigned';
      if (grouping === 'payer') {
        key = row.payer || 'No Payer';
      } else if (grouping === 'plan') {
        key = row.planName || 'No Plan';
      } else if (grouping === 'fee') {
        key = row.feeSchedule || 'No Fee Schedule';
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });
    return groups;
  }, [data, grouping]);

  const generateCSVContent = (targetData) => {
    const headers = [
      'Patient Number',
      'Patient',
      'Email',
      'Plan Name',
      'Payer',
      'Last Appointment',
      'Fee Schedule',
      'Plan Renewal Date',
      'Assignment Status',
    ];

    return [
      headers.join(','),
      ...targetData.map((row) =>
        [
          row.number,
          `"${row.patient}"`,
          row.email,
          `"${row.planName || ''}"`,
          `"${row.payer || ''}"`,
          row.lastAppointment,
          `"${row.feeSchedule || ''}"`,
          row.planRenewalDate || '',
          row.assignmentStatus || '',
        ].join(',')
      ),
    ].join('\n');
  };

  const handleExportCSV = () => {
    const csvRows = generateCSVContent(data);
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patient_insurance_coverage_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportGroupCSV = (groupName, groupData) => {
    const csvRows = generateCSVContent(groupData);
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patient_insurance_${groupName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    handlePrintGroup('patient-insurance-coverage-table', 'All Patients');
  };

  const handlePrintGroup = (elementId, groupName) => {
    const tableEl = document.getElementById(elementId);
    if (!tableEl) return;

    const htmlContent = `
      <html>
        <head>
          <title>Patient Insurance - ${groupName}</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; }
            table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tfoot td, tfoot th { border: none !important; font-weight: bold; background-color: #f8f9fa; border-top: 2px solid #ddd !important; }
            .MuiCheckbox-root, input[type="checkbox"], button, .hide-on-print, .no-print, svg { display: none !important; }
            h6, h5 { font-family: sans-serif; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" />
          </div>
          <h2 style="text-align: center; margin-top: 0;">Patient Insurance - ${groupName}</h2>
          ${tableEl.outerHTML}
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

    iframe.onload = () => {
      iframe.contentWindow.onafterprint = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 15000);
    };

    document.body.appendChild(iframe);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSearchItems([]);
    setAssignmentFilter('no');
    setApptFilterType('no');
    setApptStartDate('');
    setApptEndDate('');
    setApptSingleDate('');
    setShowNoCoverage(false);
    setGrouping('no');
  };

  const topFilters = (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReportSelect 
        label="GROUP BY" 
        options={[
          { value: 'no', label: 'No Grouping' },
          { value: 'payer', label: 'Payer' },
          { value: 'plan', label: 'Plan' },
          { value: 'fee', label: 'Fee Schedule' }
        ]} 
        value={grouping} 
        onChange={(e) => setGrouping(e.target.value)} 
        width="160px" 
      />
      <ReportDivider />
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <RadioGroup row value={apptFilterType} onChange={(e) => setApptFilterType(e.target.value)}>
          <FormControlLabel value="no" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>No Appt Filter</Typography>} />
          <FormControlLabel value="range" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Range</Typography>} />
          <FormControlLabel value="before" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Before</Typography>} />
          <FormControlLabel value="after" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>After</Typography>} />
        </RadioGroup>
      </Box>

      {apptFilterType === 'range' && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>from date</Typography>
            <DatePicker
              value={apptStartDate ? dayjs(apptStartDate) : null}
              onChange={(newValue) => setApptStartDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
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
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>to date</Typography>
            <DatePicker
              value={apptEndDate ? dayjs(apptEndDate) : null}
              onChange={(newValue) => setApptEndDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
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
        </>
      )}

      {(apptFilterType === 'before' || apptFilterType === 'after') && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>date</Typography>
          <DatePicker
            value={apptSingleDate ? dayjs(apptSingleDate) : null}
            onChange={(newValue) => setApptSingleDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
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
      )}

      <ReportDivider />

      <ReportSelect 
        label="ASSIGNMENT" 
        options={[
          { value: 'no', label: 'No filter' },
          { value: 'assignment', label: 'Assignment' },
          { value: 'non-assignment', label: 'Non-Assignment' }
        ]} 
        value={assignmentFilter} 
        onChange={(e) => setAssignmentFilter(e.target.value)} 
        width="160px" 
      />
    </LocalizationProvider>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox 
        label="Show patients with no coverage" 
        checked={showNoCoverage} 
        onChange={(e) => setShowNoCoverage(e.target.checked)} 
      />

      <ReportDivider />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>SEARCH BY PAYER OR PLAN:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Autocomplete
            multiple
            freeSolo
            options={(allCompanies && allCompanies.length > 0) ? allCompanies : DUMMY_INSURANCE}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return option.carrierName || option.name || option.planName || option.groupName || '';
            }}
            filterOptions={(options, params) => {
              const { inputValue } = params;
              const val = inputValue.toLowerCase();
              if (!val) return options.slice(0, 50); // limit empty state
              return options.filter(item => 
                (item.payerId || item.id?.toString() || '').toLowerCase().includes(val) ||
                (item.carrierName || item.name || '').toLowerCase().includes(val) ||
                (item.groupName || '').toLowerCase().includes(val) ||
                (item.groupNumber || '').toLowerCase().includes(val) ||
                (item.planName || item.name || '').toLowerCase().includes(val)
              );
            }}
            value={selectedSearchItems}
            onChange={(event, newValue) => {
              const formattedValues = newValue.map(v => typeof v === 'string' ? v : (v.carrierName || v.name || v.planName || v.groupName || ''));
              setSelectedSearchItems([...new Set(formattedValues)]);
              setSearchQuery('');
            }}
            onInputChange={(e, val) => setSearchQuery(val)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={selectedSearchItems.length === 0 ? "Search for plan, patient, or payer" : ""}
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start" sx={{ pl: 1, mt: selectedSearchItems.length > 0 ? 0 : 0 }}>
                        <SearchIcon sx={{ fontSize: 18, color: '#999' }} />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
                sx={{
                  width: '320px',
                  backgroundColor: '#f8fafc',
                  '& .MuiInputBase-root': {
                    minHeight: 36,
                    fontSize: '0.75rem',
                  },
                  '& fieldset': { borderColor: '#e2e8f0' },
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  label={option}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: '4px', 
                    color: '#444', 
                    borderColor: '#ddd', 
                    bgcolor: '#fff',
                    m: '2px',
                    '& .MuiChip-deleteIcon': { color: '#e53935', fontSize: '16px' }
                  }}
                />
              ))
            }
            renderOption={(props, option) => {
              const name = option.carrierName || option.name || option.planName || '';
              const id = option.payerId || option.id || '';
              const group = option.groupName ? ` - Group: ${option.groupName}` : '';
              return (
                <li {...props} style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a3353' }}>{name}{group}</Typography>
                    {id && <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>Payer ID: {id}</Typography>}
                  </Box>
                </li>
              );
            }}
          />
        </Box>
      </Box>
    </>
  );

  const renderTable = (tableData, tableId) => (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', mt: 2, overflowX: 'auto', backgroundColor: '#fff' }}>
      <Table id={tableId} size="small" stickyHeader>
        <TableHead>
          <TableRow sx={{ '& th': { fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#f8f9fa', py: 1.5, borderBottom: '1px solid #e2e8f0', color: '#334155' } }}>
            {[
              'Patient Number', 
              'Patient', 
              'Email', 
              'Plan name(plan num)', 
              'Payer', 
              'Last Appointment', 
              'Fee Schedule', 
              'Plan Renewal Date', 
              'Assignment Status'
            ].map((header) => (
              <TableCell key={header}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow 
              key={index} 
              hover
              sx={{ 
                '& td': { fontSize: '0.75rem', py: 1, borderBottom: '1px solid #e2e8f0', color: '#1e293b' },
                '&:hover': { backgroundColor: '#f1f5f9' }
              }}
            >
              <TableCell>{row.number}</TableCell>
              <TableCell sx={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>{row.patient}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.planName || 'N/A'}</TableCell>
              <TableCell>{row.payer || 'N/A'}</TableCell>
              <TableCell>{row.lastAppointment || 'N/A'}</TableCell>
              <TableCell>{row.feeSchedule || 'N/A'}</TableCell>
              <TableCell>{row.planRenewalDate || 'N/A'}</TableCell>
              <TableCell>{row.assignmentStatus || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 0, '@media print': { '& .hide-on-print': { display: 'none !important' } } }}>
      <Typography variant="h6" className="hide-on-print" sx={{ mb: 2, fontWeight: 700, color: '#1e293b' }}>
        Patient Insurance Coverage
      </Typography>

      <Box className="hide-on-print" sx={{ mb: 2 }}>
        <ReportFilterBar 
          topRowFilters={topFilters}
          bottomRowFilters={bottomFilters}
          onApplyFilters={handleApplyFilters}
          onClearAll={handleClearFilters}
          onCreateTemplate={() => setTemplateDialogOpen(true)}
        />
      </Box>

      {/* Summary Text and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} className="hide-on-print">
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
          (number of patient policies = {data.length})
        </Typography>
        {grouping === 'no' && (
          <Box sx={{ transform: 'translateY(-4px)' }}>
            <ProductionReportActions
              onExportCsv={handleExportCSV}
              onPrint={handlePrint}
              hasData={data.length > 0}
            />
          </Box>
        )}
      </Box>

      {/* Table Section */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ color: '#4a89dc' }} />
        </Box>
      ) : grouping === 'no' ? (
        renderTable(data, 'patient-insurance-coverage-table')
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {Object.entries(groupedData).map(([groupName, groupData]) => {
            const tableId = `table-${groupName.replace(/[^a-zA-Z0-9]/g, '-')}`;
            return (
              <Box key={groupName} sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {grouping === 'payer' ? 'Payer' : grouping === 'plan' ? 'Plan' : 'Fee Schedule'}: {groupName} ({groupData.length} patients)
                  </Typography>
                  <Box sx={{ transform: 'translateY(-4px)' }}>
                    <ProductionReportActions
                      onExportCsv={() => handleExportGroupCSV(groupName, groupData)}
                      onPrint={() => handlePrintGroup(tableId, groupName)}
                      hasData={groupData.length > 0}
                    />
                  </Box>
                </Box>
                {renderTable(groupData, tableId)}
              </Box>
            );
          })}
        </Box>
      )}

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={(name) => alert(`Template "${name}" saved!`)} 
      />
    </Box>
  );
};
export default PatientInsuranceCoverage;
