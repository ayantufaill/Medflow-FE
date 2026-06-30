import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import { useInsuranceCatalog } from '../../../../hooks/redux/useInsuranceCatalog';
import {
  fetchPatientInsuranceCoverageReport,
  selectInsuranceCoverageData,
  selectInsuranceCoverageLoading,
} from '../../../../store/slices/patientReportSlice';

const INITIAL_DATA = [
  {
    number: '1262',
    patient: 'John Doe',
    email: 'john.doe@example.com',
    planName: 'Standard Insurance (160-173134-1)',
    payer: 'Standard Insurance',
    lastAppointment: '',
    feeSchedule: '',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1254',
    patient: 'Jane Smith',
    email: 'jane.smith@example.com',
    planName: 'Walmart (8000-00010000)',
    payer: 'Delta Dental of Arkansas',
    lastAppointment: '05/05/2026',
    feeSchedule: '',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1247',
    patient: 'Robert Brown',
    email: 'robert.b@example.com',
    planName: 'Blue Cross Blue Shield of Texas (387291)',
    payer: 'Blue Cross Blue Shield of Texas',
    lastAppointment: '',
    feeSchedule: 'Careington PPO Platinum (directly in network)',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1247',
    patient: 'Michael Johnson',
    email: 'm.johnson@example.com',
    planName: 'United Concordia (858527000)',
    payer: 'United Concordia',
    lastAppointment: '',
    feeSchedule: '',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1246',
    patient: 'William Davis',
    email: 'w.davis@example.com',
    planName: 'CIGNA (3345155)',
    payer: 'CIGNA',
    lastAppointment: '',
    feeSchedule: 'Careington PPO Platinum (directly in network)',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1241',
    patient: 'Elizabeth Garcia',
    email: 'e.garcia@example.com',
    planName: 'Delta Dental of Pennsylvania (20657-05048)',
    payer: 'Delta Dental of Pennsylvania',
    lastAppointment: '05/05/2026',
    feeSchedule: '',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1239',
    patient: 'David Martinez',
    email: 'd.martinez@example.com',
    planName: 'CIGNA (0653848)',
    payer: 'CIGNA',
    lastAppointment: '',
    feeSchedule: 'Careington PPO Platinum (directly in network)',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1238',
    patient: 'Susan Wilson',
    email: 's.wilson@example.com',
    planName: 'Aetna Dental Plans (014197501000001)',
    payer: 'Aetna Dental Plans',
    lastAppointment: '04/15/2026',
    feeSchedule: 'Careington PPO Platinum (directly in network)',
    planRenewalDate: 'June',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1236',
    patient: 'Joseph Anderson',
    email: 'j.anderson@example.com',
    planName: 'ERICSSON INC. (069802102100001)',
    payer: 'Aetna Dental Plans',
    lastAppointment: '04/08/2026',
    feeSchedule: 'Careington PPO Platinum (directly in network)',
    planRenewalDate: 'January',
    assignmentStatus: 'Assignment',
  },
  {
    number: '1235',
    patient: 'Charles Green',
    email: 'c.green@example.com',
    planName: '',
    payer: '',
    lastAppointment: '03/20/2026',
    feeSchedule: '',
    planRenewalDate: '',
    assignmentStatus: '',
  },
];

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
  const [rawReportData, setRawReportData] = useState(INITIAL_DATA);
  const [data, setData] = useState(INITIAL_DATA);
  const [grouping, setGrouping] = useState('no');
  const [assignmentFilter, setAssignmentFilter] = useState('no');

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
    if (reduxData && reduxData.length > 0) {
      setRawReportData(reduxData);
      setData(reduxData);
    } else {
      setRawReportData(INITIAL_DATA);
      setData(INITIAL_DATA);
    }
  }, [reduxData]);

  const handleApplyFilters = () => {
    const filtered = rawReportData.filter((item) => {
      // 1. Search Query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || (
        (item.patient && item.patient.toLowerCase().includes(searchLower)) ||
        (item.planName && item.planName.toLowerCase().includes(searchLower)) ||
        (item.payer && item.payer.toLowerCase().includes(searchLower)) ||
        (item.number && String(item.number).toLowerCase().includes(searchLower))
      );

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
  };

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);
  const handleCreateTemplate = () => setTemplateDialogOpen(true);

  const renderTable = (tableData, tableId) => (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 0 }}>
      <Table id={tableId} size="small" stickyHeader>
        <TableHead>
          <TableRow>
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
              <TableCell 
                key={header} 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.72rem', 
                  py: 1,
                  px: 1,
                  borderBottom: '1px solid #ddd',
                  backgroundColor: '#fff'
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow 
              key={index} 
              sx={{ 
                backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc',
                '& td': { borderBottom: '1px solid #eee' }
              }}
            >
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.number}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1, color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.email}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.planName || 'N/A'}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.payer || 'N/A'}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.lastAppointment || 'N/A'}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.feeSchedule || 'N/A'}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.planRenewalDate || 'N/A'}</TableCell>
              <TableCell sx={{ fontSize: '0.72rem', py: 1, px: 1 }}>{row.assignmentStatus || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>
      {/* Title */}
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#337ab7', 
          fontWeight: 500, 
          mb: 2, 
          textDecoration: 'underline',
          cursor: 'pointer'
        }}
      >
        Patient by Insurance Coverage:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
        {/* Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Search by payer or plan:</Typography>
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
                  fontSize: '0.8rem',
                  backgroundColor: '#f9f9f9',
                  '& fieldset': { borderColor: '#ccc' }
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
                          setSearchQuery(item.planName || item.name || item.carrierName || '');
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
        </Box>

        {/* Grouping */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Grouping:</Typography>
          <RadioGroup 
            row 
            value={grouping} 
            onChange={(e) => setGrouping(e.target.value)}
          >
            <FormControlLabel value="no" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">No Grouping</Typography>} />
            <FormControlLabel value="payer" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Group By Payer</Typography>} />
            <FormControlLabel value="plan" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Group By Plan</Typography>} />
            <FormControlLabel value="fee" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Group By Fee Schedule</Typography>} />
          </RadioGroup>
        </Box>

        {/* Filter by past appointment date */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Filter by past appointment date:</Typography>
            <RadioGroup row value={apptFilterType} onChange={(e) => setApptFilterType(e.target.value)}>
              <FormControlLabel value="no" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">No filter</Typography>} />
              <FormControlLabel value="range" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Range</Typography>} />
              <FormControlLabel value="before" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Before specific date</Typography>} />
              <FormControlLabel value="after" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">After specific date</Typography>} />
            </RadioGroup>
          </Box>
          {apptFilterType === 'range' && (
            <Box sx={{ display: 'flex', gap: 2, pl: 21 }}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Start Date:
                <input 
                  type="date" 
                  value={apptStartDate} 
                  onChange={(e) => setApptStartDate(e.target.value)}
                  style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px' }}
                />
              </Typography>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                End Date:
                <input 
                  type="date" 
                  value={apptEndDate} 
                  onChange={(e) => setApptEndDate(e.target.value)}
                  style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px' }}
                />
              </Typography>
            </Box>
          )}
          {(apptFilterType === 'before' || apptFilterType === 'after') && (
            <Box sx={{ display: 'flex', gap: 2, pl: 21 }}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Date:
                <input 
                  type="date" 
                  value={apptSingleDate} 
                  onChange={(e) => setApptSingleDate(e.target.value)}
                  style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 4px', fontSize: '11px' }}
                />
              </Typography>
            </Box>
          )}
        </Box>

        {/* Filter by Assignment */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ minWidth: 160, fontWeight: 600 }}>Filter by Assignment:</Typography>
          <RadioGroup 
            row 
            value={assignmentFilter}
            onChange={(e) => setAssignmentFilter(e.target.value)}
          >
            <FormControlLabel value="no" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">No filter</Typography>} />
            <FormControlLabel value="assignment" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Assignment</Typography>} />
            <FormControlLabel value="non-assignment" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography variant="caption">Non-Assignment</Typography>} />
          </RadioGroup>
        </Box>

        {/* Checkbox */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <Checkbox 
            size="small" 
            sx={{ p: 0.5 }} 
            checked={showNoCoverage}
            onChange={(e) => setShowNoCoverage(e.target.checked)}
          />
          <Typography variant="caption">Show patients with no coverage</Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1.5 }}>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleApplyFilters}
          sx={{ 
            textTransform: 'none', 
            backgroundColor: '#4a89dc', 
            fontSize: '0.75rem',
            padding: '4px 12px'
          }}
        >
          Apply Filters
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          disabled
          onClick={handleCreateTemplate}
          sx={{ 
            textTransform: 'none', 
            backgroundColor: '#d9a366', 
            color: '#fff',
            fontSize: '0.75rem',
            padding: '4px 12px'
          }}
        >
          Create Template
        </Button>
        {grouping === 'no' && (
          <>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleExportCSV}
              sx={{ 
                textTransform: 'none', 
                backgroundColor: '#4a89dc', 
                fontSize: '0.75rem',
                padding: '4px 12px'
              }}
            >
              Export as CSV
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handlePrint}
              sx={{ 
                textTransform: 'none', 
                backgroundColor: '#da4453', 
                fontSize: '0.75rem',
                padding: '4px 12px'
              }}
            >
              Print
            </Button>
          </>
        )}
      </Box>

      {/* Summary Text */}
      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#333' }}>
        (number of patient policies = {data.length})
      </Typography>

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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FileDownloadIcon />}
                      onClick={() => handleExportGroupCSV(groupName, groupData)}
                      sx={{ fontSize: '0.7rem', py: 0.2 }}
                    >
                      Export CSV
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PrintIcon />}
                      onClick={() => handlePrintGroup(tableId, groupName)}
                      sx={{ fontSize: '0.7rem', py: 0.2 }}
                    >
                      Print
                    </Button>
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
        onSave={handleSaveTemplate} 
      />
    </Box>
  );
};

export default PatientInsuranceCoverage;
