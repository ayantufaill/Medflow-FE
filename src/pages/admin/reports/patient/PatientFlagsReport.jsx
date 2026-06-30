import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Print as PrintIcon, 
  FileDownload as DownloadIcon,
  PrintOutlined,
  AttachMoneyOutlined,
  MedicationOutlined,
  ChatBubbleOutline
} from '@mui/icons-material';
import CreateTemplateDialog from '../../../../components/admin/reports/CreateTemplateDialog';
import FilterByFlagsDialog, { ALL_FLAGS } from '../../../../components/admin/reports/FilterByFlagsDialog';
import { fetchPatientFlagsReport } from '../../../../store/slices/patientReportSlice';

const DUMMY_DATA = [
  {
    patient: 'Torrii huseman',
    dob: '11/21/2000',
    phone: '+1 (843) 599-3751',
    email: 'torriihuseman64@icloud.com',
    flags: ['ALLERGY', 'review requested'],
  },
  {
    patient: 'crystal gonzalez',
    dob: '11/18/2002',
    phone: '+1 (512) 253-8600',
    email: 'sandmail@hotmail.com',
    flags: ['TRICARE', 'review requested', 'Severe anxiety'],
  },
  {
    patient: 'Sara West',
    dob: '01/25/1983',
    phone: '+1 (817) 229-5655',
    email: 'dina+test03@oryxdentalsoftware.com',
    flags: ['family & friends'],
  },
  {
    patient: 'Kevin Wells',
    dob: '02/14/1978',
    phone: '+1 (201) 555-0123',
    email: 'charlyn+test0525@oryxdentalsoftware.com',
    flags: ['NEEDS Pre-Meds!!!!!', 'ALLERGY', 'late payment', 'Active Phase I'],
  },
];

const ActionIcons = () => (
  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
    <PrintOutlined sx={{ fontSize: 14, color: '#ccc', cursor: 'not-allowed' }} />
    <AttachMoneyOutlined sx={{ fontSize: 14, color: '#ccc', cursor: 'not-allowed' }} />
    <MedicationOutlined sx={{ fontSize: 14, color: '#ccc', cursor: 'not-allowed' }} />
    <ChatBubbleOutline sx={{ fontSize: 14, color: '#ccc', cursor: 'not-allowed' }} />
  </Box>
);

const PatientFlagsReport = () => {
  const dispatch = useDispatch();
  const { patientFlagsReportData, loading } = useSelector((state) => state.patientReport || { patientFlagsReportData: [], loading: false });

  const [filterBy, setFilterBy] = useState('active');
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState(DUMMY_DATA);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  const [dialogMode, setDialogMode] = useState(null); // 'include', 'exclude', or null
  const [includeFlags, setIncludeFlags] = useState([]);
  const [excludeFlags, setExcludeFlags] = useState([]);

  useEffect(() => {
    let baseData = DUMMY_DATA;
    if (patientFlagsReportData && patientFlagsReportData.length > 0) {
      baseData = patientFlagsReportData.map(item => ({
        patient: item.patient,
        dob: item.dob || 'N/A',
        phone: item.phone || 'N/A',
        email: item.email || 'N/A',
        flags: item.flags || (item.flag ? [item.flag] : [])
      }));
    } else if (loading || !showData) {
      return;
    }

    // 1. Remove patients with no flags
    let filtered = baseData.filter(patient => patient.flags && patient.flags.length > 0);
    
    // Helper to normalize and split clumped flags
    const getNormalizedFlags = (rawFlags) => {
      const arr = Array.isArray(rawFlags) ? rawFlags : [rawFlags].filter(Boolean);
      let splitFlags = [];
      arr.forEach(flagObj => {
        if (typeof flagObj === 'string') {
          // Split by comma or semicolon in case they are clumped
          splitFlags.push(...flagObj.split(/[,;]/).map(s => s.trim()).filter(Boolean));
        } else {
          splitFlags.push(flagObj);
        }
      });
      return splitFlags;
    };

    // 2. Apply "Include" filters
    if (includeFlags && includeFlags.length > 0) {
      const lowerIncludes = includeFlags.map(f => typeof f === 'string' ? f.toLowerCase() : String(f));
      filtered = filtered.filter(patient => {
        const flagsArray = getNormalizedFlags(patient.flags);
        return flagsArray.length > 0 && flagsArray.some(flagObj => {
          const val = typeof flagObj === 'object' ? (flagObj.id || flagObj.name || flagObj.label) : flagObj;
          return typeof val === 'string' && lowerIncludes.includes(val.toLowerCase());
        });
      });
    }
    
    // 3. Apply "Exclude" filters
    if (excludeFlags && excludeFlags.length > 0) {
      const lowerExcludes = excludeFlags.map(f => typeof f === 'string' ? f.toLowerCase() : String(f));
      filtered = filtered.filter(patient => {
        const flagsArray = getNormalizedFlags(patient.flags);
        return !(flagsArray.length > 0 && flagsArray.some(flagObj => {
          const val = typeof flagObj === 'object' ? (flagObj.id || flagObj.name || flagObj.label) : flagObj;
          return typeof val === 'string' && lowerExcludes.includes(val.toLowerCase());
        }));
      });
    }
    
    setData(filtered);
  }, [patientFlagsReportData, loading, showData, includeFlags, excludeFlags]);

  const handleApplyFilters = () => {
    setShowData(true);
    dispatch(fetchPatientFlagsReport({ filterBy, includeFlags, excludeFlags }));
  };

  const handleExportCSV = () => {
    if (!showData) {
      alert('Please apply filters first to generate data.');
      return;
    }
    const headers = ['Flags', 'Patient Name', 'Patient DOB', 'Phone Number', 'Email Address'];
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        [`"${row.flags.join('; ')}"`, `"${row.patient}"`, row.dob, row.phone, row.email].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patient_flags_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('patient-flags-report-table');
    if (!tableEl) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Patient Flags Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('@media print { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 11px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }');
    printWindow.document.write('th { background-color: #f8f9fa; font-weight: bold; }');
    printWindow.document.write('.hide-print { display: none !important; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h2>Patient Flags Report</h2>');
    printWindow.document.write(tableEl.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 100);
  };

  const handleSaveTemplate = (name) => alert(`Template "${name}" saved!`);
  const handleCreateTemplate = () => setTemplateDialogOpen(true);

  const handleSaveFlags = (flags) => {
    if (dialogMode === 'include') {
      setIncludeFlags(flags);
    } else if (dialogMode === 'exclude') {
      setExcludeFlags(flags);
    }
  };

  const renderFlagSquares = (flagIds) => {
    if (!flagIds) return null;
    const idsArray = Array.isArray(flagIds) ? flagIds : [flagIds];
    let splitIds = [];
    idsArray.forEach(f => {
      if (typeof f === 'string') {
        splitIds.push(...f.split(/[,;]/).map(s => s.trim()).filter(Boolean));
      } else {
        splitIds.push(f);
      }
    });

    if (splitIds.length === 0) return null;
    
    return (
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {splitIds.map((flagObj, i) => {
          const flagId = typeof flagObj === 'object' ? (flagObj.id || flagObj.name || flagObj.label) : flagObj;
          const flagDef = ALL_FLAGS.find(f => f.id === flagId || (typeof flagId === 'string' && f.label.toLowerCase() === flagId.toLowerCase()));
          
          if (!flagDef) {
            return (
              <Tooltip key={`unknown-${i}`} title={typeof flagId === 'string' ? flagId : 'Flag'} arrow>
                <Box 
                  sx={{ 
                    width: 16, 
                    height: 16, 
                    backgroundColor: '#ccc', 
                    borderRadius: '2px',
                    cursor: 'pointer'
                  }} 
                />
              </Tooltip>
            );
          }
          
          return (
            <Tooltip key={`${flagId}-${i}`} title={flagDef.label} arrow>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: flagDef.color, 
                  borderRadius: '2px',
                  cursor: 'pointer'
                }} 
              />
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 1, backgroundColor: '#fff', textAlign: 'left' }}>

      {/* Filter Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 4, pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#555' }}>Including Flags:</Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => setDialogMode('include')}
              endIcon={<EditIcon sx={{ fontSize: 14 }} />}
              sx={{ backgroundColor: '#4a89dc', textTransform: 'none', fontSize: '0.8rem', height: 32, minWidth: 80, boxShadow: 'none' }}
            >
              Flags
            </Button>
            {includeFlags.length > 0 && (
              <Box sx={{ ml: 1 }}>
                {renderFlagSquares(includeFlags)}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#555' }}>Excluding Flags:</Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => setDialogMode('exclude')}
              endIcon={<EditIcon sx={{ fontSize: 14 }} />}
              sx={{ backgroundColor: '#4a89dc', textTransform: 'none', fontSize: '0.8rem', height: 32, minWidth: 80, boxShadow: 'none' }}
            >
              Flags
            </Button>
            {excludeFlags.length > 0 && (
              <Box sx={{ ml: 1 }}>
                {renderFlagSquares(excludeFlags)}
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button 
            variant="contained" 
            size="small" 
            onClick={handleApplyFilters}
            sx={{ textTransform: 'none', backgroundColor: '#3b5998', fontSize: '0.75rem', padding: '6px 16px', boxShadow: 'none' }}
          >
            Apply Filters
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            disabled
            onClick={handleCreateTemplate}
            sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', padding: '6px 16px', boxShadow: 'none' }}
          >
            Create Template
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 2, borderColor: '#f0e3d3', borderBottomWidth: 2 }} />

      {/* Results Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ fontWeight: 600, textDecoration: 'underline', color: '#555' }}
        >
          Number of Patients: {showData ? data.length : 0}
        </Typography>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handlePrint}
          sx={{ textTransform: 'none', backgroundColor: '#d9a366', color: '#fff', fontSize: '0.75rem', px: 3, boxShadow: 'none' }}
        >
          Print
        </Button>
      </Box>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ color: '#4a89dc' }} />
        </Box>
      ) : !showData ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body2" color="text.secondary">
            Please select which flags you would like to include/exclude, then click on "apply filters"
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: 'none', borderRadius: 0 }}>
          <Table id="patient-flags-report-table" size="small">
            <TableHead>
              <TableRow>
                {['Flags', 'Patient Name', 'Patient DOB', 'Phone Number', 'Email Address'].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 600, fontSize: '0.75rem', py: 1.5, px: 1, borderBottom: '1px solid #ddd', backgroundColor: '#fff', color: '#555' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} sx={{ backgroundColor: '#fff', '& td': { borderBottom: '1px solid #f0f0f0' } }}>
                  <TableCell sx={{ py: 1.5, px: 1 }}>
                    {renderFlagSquares(row.flags)}
                  </TableCell>
                  <TableCell sx={{ py: 1.5, px: 1 }}>
                    <Typography sx={{ fontSize: '0.8rem', color: '#337ab7', fontWeight: 500 }}>
                      {row.patient}
                    </Typography>
                    <Box className="hide-print">
                      <ActionIcons />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#666', py: 1.5, px: 1 }}>{row.dob}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#666', py: 1.5, px: 1 }}>{row.phone}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#666', py: 1.5, px: 1 }}>{row.email}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#888' }}>
                    No patients found with the selected flags.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateTemplateDialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)} 
        onSave={handleSaveTemplate} 
      />

      <FilterByFlagsDialog 
        open={Boolean(dialogMode)} 
        onClose={() => setDialogMode(null)} 
        onSave={handleSaveFlags}
        initialSelected={dialogMode === 'include' ? includeFlags : excludeFlags}
      />
    </Box>
  );
};

export default PatientFlagsReport;
