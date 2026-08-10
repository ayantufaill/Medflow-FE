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
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const DUMMY_INSURANCE = [
    { payerId: '00621', carrierName: 'Blue Cross Blue Shield of Illinois', groupName: 'VIVID SEATS, LLC', groupNumber: '300871', planName: 'BCBS IL', payerAddress: '123 Blue St, Chicago, IL', carrierPhone: '800-123-4567' },
    { payerId: '52133', carrierName: 'United Healthcare Dental', groupName: 'DOXIM', groupNumber: '1602187', planName: 'UHC ( DOXIM )', payerAddress: '456 Health Way, Minnetonka, MN', carrierPhone: '800-987-6543' },
    { payerId: '60054', carrierName: 'Aetna Dental Plans', groupName: 'TEXAS HEALTH RESOURCES', groupNumber: '087639801300001', planName: 'Aetna Dental Plans', payerAddress: '789 Aetna Dr, Hartford, CT', carrierPhone: '800-111-2222' },
  ];

  const handleSearch = (val) => {
    setSearchQuery(val);

    const searchPool = (allCompanies && allCompanies.length > 0) ? allCompanies : DUMMY_INSURANCE;
    let filtered = searchPool;
    
    if (val) {
      filtered = searchPool.filter(item => 
        (item.payerId || item.id?.toString() || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.carrierName || item.name || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.groupName || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.groupNumber || '').toLowerCase().includes(val.toLowerCase()) ||
        (item.planName || item.name || '').toLowerCase().includes(val.toLowerCase())
      );
    }
    
    setSearchResults(filtered);
    setShowDropdown(true);
  };
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
    dispatch(fetchPatientInsuranceCoverageReport());
  }, [dispatch]);

  useEffect(() => {
    if (reduxData) {
      setRawReportData(reduxData);
      setData(reduxData);
    }
  }, [reduxData]);

  const handleApplyFilters = () => {
    const filtered = rawReportData.filter((item) => {
      // 1. Search Query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearchInput = !searchQuery || (
        (item.patient && item.patient.toLowerCase().includes(searchLower)) ||
        (item.planName && item.planName.toLowerCase().includes(searchLower)) ||
        (item.payer && item.payer.toLowerCase().includes(searchLower)) ||
        (item.number && String(item.number).toLowerCase().includes(searchLower))
      );

      const matchesSelectedItems = selectedSearchItems.length === 0 || selectedSearchItems.some(selected => {
        const sLower = selected.toLowerCase();
        return (
          (item.planName && item.planName.toLowerCase().includes(sLower)) ||
          (item.payer && item.payer.toLowerCase().includes(sLower))
        );
      });

      const matchesSearch = matchesSearchInput && matchesSelectedItems;

      // 2. Assignment Status
      const matchesAssignment = 
        assignmentFilter === 'no' || 
        (assignmentFilter === 'assignment' && item.assignmentStatus === 'Assignment') ||
        (assignmentFilter === 'non-assignment' && item.assignmentStatus !== 'Assignment');

      // 3. Appt Date
      let matchesApptDate = true;
      if (apptFilterType !== 'no') {
        if (!item.lastAppointment) {
          matchesApptDate = false;
        } else {
          const apptDate = new Date(item.lastAppointment);
          if (apptFilterType === 'range') {
            const start = apptStartDate ? new Date(apptStartDate) : null;
            const end = apptEndDate ? new Date(apptEndDate) : null;
            if (start && apptDate < start) matchesApptDate = false;
            if (end && apptDate > end) matchesApptDate = false;
          } else if (apptFilterType === 'before') {
            const single = apptSingleDate ? new Date(apptSingleDate) : null;
            if (single && apptDate >= single) matchesApptDate = false;
          } else if (apptFilterType === 'after') {
            const single = apptSingleDate ? new Date(apptSingleDate) : null;
            if (single && apptDate <= single) matchesApptDate = false;
          }
        }
      }

      // 4. Show patients with no coverage
      const hasCoverage = Boolean((item.payer && item.payer !== 'N/A') || (item.planName && item.planName !== 'N/A'));
      const matchesCoverage = showNoCoverage ? !hasCoverage : hasCoverage;

      return matchesSearch && matchesAssignment && matchesApptDate && matchesCoverage;
    });

    setData(filtered);
  };

  useEffect(() => {
    handleApplyFilters();
  }, [
    searchQuery,
    selectedSearchItems,
    rawReportData,
    assignmentFilter,
    apptFilterType,
    apptStartDate,
    apptEndDate,
    apptSingleDate,
    showNoCoverage
  ]);

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
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Patient Insurance - ' + groupName + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 10px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('button, .no-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Patient Insurance - ' + groupName + '</h2>');
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    printWindow.close();
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                textField: { size: 'small', sx: { width: '135px', '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '4px', height: '36px', backgroundColor: '#fafbfe', color: '#09121f' }, '& fieldset': { borderColor: '#e2e8f0' } } }
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
                textField: { size: 'small', sx: { width: '135px', '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '4px', height: '36px', backgroundColor: '#fafbfe', color: '#09121f' }, '& fieldset': { borderColor: '#e2e8f0' } } }
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
              textField: { size: 'small', sx: { width: '135px', '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '4px', height: '36px', backgroundColor: '#fafbfe', color: '#09121f' }, '& fieldset': { borderColor: '#e2e8f0' } } }
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
          <Box sx={{ position: 'relative', width: 300 }}>
            <TextField 
              fullWidth
              size="small" 
              placeholder="Search for plan, patient, or payer" 
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => handleSearch(searchQuery)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 1 }}>
                    <SearchIcon sx={{ fontSize: 18, color: '#999' }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  height: 36,
                  fontSize: '0.75rem',
                  '& fieldset': { borderColor: '#e2e8f0' },
                }
              }}
            />

            {showDropdown && searchResults.length > 0 && (
              <Paper 
                elevation={8} 
                sx={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  zIndex: 9999, 
                  maxHeight: '400px', 
                  overflowY: 'auto', 
                  border: '1px solid #ddd',
                  width: { xs: '300px', sm: '500px', md: '700px' },
                  mt: 0.5,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                }}
              >
                <Table size="small" stickyHeader>
                  <TableBody>
                    <TableRow sx={{ bgcolor: '#eef4ff' }}>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Payer ID</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Payer</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Group Name</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Group #</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a3353', py: 1 }}>Plan/Employer Name</TableCell>
                    </TableRow>
                    {searchResults.map((item, idx) => (
                      <TableRow 
                        key={idx} 
                        hover 
                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f9ff' } }}
                        onClick={() => {
                          const itemName = item.carrierName || item.name || item.planName || '';
                          if (itemName && !selectedSearchItems.includes(itemName)) {
                            setSelectedSearchItems([...selectedSearchItems, itemName]);
                          }
                          setSearchQuery('');
                          setShowDropdown(false);
                        }}
                      >
                        <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.payerId || item.id || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.carrierName || item.name || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.groupName || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.groupNumber || '-'}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', py: 1 }}>{item.planName || item.name || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </Box>
          
          {selectedSearchItems.map((item, idx) => (
            <Chip
              key={idx}
              label={item}
              onDelete={() => setSelectedSearchItems(selectedSearchItems.filter(i => i !== item))}
              variant="outlined"
              size="small"
              sx={{ 
                borderRadius: '4px', 
                color: '#444', 
                borderColor: '#ddd', 
                bgcolor: '#fff',
                '& .MuiChip-deleteIcon': { color: '#e53935', fontSize: '16px' }
              }}
            />
          ))}
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
