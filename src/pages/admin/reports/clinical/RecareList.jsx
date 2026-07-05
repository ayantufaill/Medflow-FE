import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Pagination,
  CircularProgress,
} from '@mui/material';
import { Search, Print, FileDownload, Add, EditOutlined } from '@mui/icons-material';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { fetchRecareReport, selectRecareData, selectClinicalReportLoading } from '../../../../store/slices/clinicalReportSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import PatientChat from '../../../../components/shared/PatientChat';

const ActionIcons = ({ onChatClick }) => (
  <Box className="no-print" sx={{ display: 'flex', gap: 0.5, mt: 0.5, alignItems: 'center' }}>
    <PrintOutlinedIcon sx={{ fontSize: 14, color: '#4a90e2', cursor: 'pointer' }} />
    <AttachMoneyOutlinedIcon sx={{ fontSize: 14, color: '#4a90e2', cursor: 'pointer' }} />
    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#4a90e2', cursor: 'pointer', lineHeight: 1 }}>Tx</Typography>
    <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: '#4a90e2', cursor: 'pointer' }} onClick={onChatClick} />
  </Box>
);

// Fallback mock data — ISO dates for reliable parsing
const MOCK_ROWS = [
  { id: 1, patient: 'Patient A', flags: 'red', age: 37, contact: '(555) 123-4567', recallDate: '2026-05-24', lastExam: '2026-02-24', lastProphy: '2026-02-24', lastMaintenance: '', lastComm: '', note: 'left message to schedule recare apt', contactAgain: 'Y', followUp: '', apptDate: '', contactCount: 1 },
  { id: 2, patient: 'Patient B', flags: '', age: 54, contact: '(555) 987-6543', recallDate: '2026-05-18', lastExam: '2025-11-18', lastProphy: '2025-11-18', lastMaintenance: '', lastComm: '', note: '', contactAgain: 'Y', followUp: '', apptDate: '', contactCount: 0 },
  { id: 3, patient: 'Patient C', flags: '', age: 44, contact: '(555) 456-7890', recallDate: '2026-06-13', lastExam: '2025-11-13', lastProphy: '2025-11-13', lastMaintenance: '', lastComm: '', note: '', contactAgain: 'Y', followUp: '', apptDate: '2026-07-01', contactCount: 0 },
  { id: 4, patient: 'Patient D', flags: 'red', age: 29, contact: '(555) 321-0987', recallDate: '2026-07-10', lastExam: '2026-01-10', lastProphy: '2026-01-10', lastMaintenance: '', lastComm: '2026-06-15', note: 'Requested callback', contactAgain: 'N', followUp: '2026-07-05', apptDate: '', contactCount: 2 },
  { id: 5, patient: 'Patient E', flags: '', age: 61, contact: '(555) 654-3210', recallDate: '2026-08-22', lastExam: '2026-02-22', lastProphy: '2026-02-22', lastMaintenance: '2025-08-22', lastComm: '', note: '', contactAgain: 'Y', followUp: '', apptDate: '2026-08-30', contactCount: 0 },
];

const PAGE_SIZE = 10;

const RecareList = ({ setSubtitle, hideFilters = false, forcedCategory = null, getRowCategory = null }) => {
  const dispatch = useDispatch();
  const apiData = useSelector(selectRecareData);
  const loading = useSelector(selectClinicalReportLoading);
  const allProviders = useSelector(selectProviderDropdownList);

  const [chatPatient, setChatPatient] = useState(null);
  const [editedRows, setEditedRows] = useState({}); // Local mock save for row edits
  const [filterType, setFilterType] = useState('range');
  const [dentist, setDentist] = useState('None');
  const [hygienist, setHygienist] = useState('None');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeAppointed, setIncludeAppointed] = useState(false);
  const [flagFilter, setFlagFilter] = useState('both');
  const [showFlagsCol, setShowFlagsCol] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Fetch on mount
  useEffect(() => {
    if (!hideFilters) {
      dispatch(fetchRecareReport({}));
    }
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch, hideFilters]);

  // Helper: resolve provider display name (name may be nested under userId)
  const getProviderName = (p) => {
    const first = p.userId?.firstName || p.firstName || p.FName || '';
    const last  = p.userId?.lastName  || p.lastName  || p.LName  || '';
    return `${first} ${last}`.trim() || p.providerCode || p._id || 'Unknown';
  };

  // Split providers by specialty — safely handle non-string values
  const getSpecialty = (p) => {
    const raw = p.specialty || p.specialtyId?.name || p.providerType || '';
    if (typeof raw === 'string') return raw.toLowerCase();
    if (Array.isArray(raw)) return raw.join(' ').toLowerCase();
    if (typeof raw === 'object' && raw !== null) return JSON.stringify(raw).toLowerCase();
    return String(raw).toLowerCase();
  };
  const dentists = allProviders.filter(p => {
    const sp = getSpecialty(p);
    return sp.includes('dentist') || sp.includes('dds') || sp.includes('dmd') || sp.includes('doctor');
  });
  const hygienists = allProviders.filter(p => {
    const sp = getSpecialty(p);
    return sp.includes('hygien');
  });
  // If we couldn't classify by specialty, fall back to showing all in both
  const dentistOptions = dentists.length > 0 ? dentists : allProviders;
  const hygienistOptions = hygienists.length > 0 ? hygienists : allProviders;

  // Handlers for dynamic row edits
  const handleRowChange = (rowId, field, value) => {
    setEditedRows(prev => ({
      ...prev,
      [rowId]: {
        ...(prev[rowId] || {}),
        [field]: value
      }
    }));
  };

  const handleAddNoteClick = (row) => {
    if (!editedRows[row.id]?.noteText && !row.note) {
      setEditedRows(prev => ({
        ...prev,
        [row.id]: {
          ...(prev[row.id] || {}),
          noteText: '',
          noteDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
        }
      }));
    }
  };

  const handleNoteChange = (rowId, newText) => {
    handleRowChange(rowId, 'noteText', newText);
  };

  const handleNoteSave = (rowId, text) => {
    // In a real app, dispatch an API call to save the note here.
    console.log(`Saved note for row ${rowId}:`, text);
  };

  // Update parent subtitle
  useEffect(() => {
    if (!setSubtitle) return;
    
    const formatDate = (isoStr) => {
      if (!isoStr) return '';
      const [year, month, day] = isoStr.split('-');
      return `${month}/${day}/${year}`;
    };

    if (startDate && endDate) {
      setSubtitle(`Patients due for their recare between ${formatDate(startDate)} and ${formatDate(endDate)}`);
    } else if (startDate) {
      setSubtitle(`Patients due for their recare from ${formatDate(startDate)}`);
    } else if (endDate) {
      setSubtitle(`Patients due for their recare until ${formatDate(endDate)}`);
    } else {
      setSubtitle(`Patients due for their recare`);
    }
  }, [startDate, endDate, setSubtitle]);

  // Normalize API data into display rows
  const baseRows = useMemo(() => {
    let rows = (apiData && apiData.length > 0) ? [...apiData] : [...MOCK_ROWS];

    // Apply forced category from dialog
    if (forcedCategory && getRowCategory) {
      rows = rows.filter(r => {
        const cat = getRowCategory(r);
        // Allow broken appointments to match our combined No Appointment mapping
        if (forcedCategory.includes('Broken Appointment') && cat.includes('No Appointment')) {
          return cat.split('No Appointment')[0] === forcedCategory.split('Broken Appointment')[0];
        }
        return cat === forcedCategory;
      });
    }

    // Dentist filter
    if (dentist !== 'None') {
      rows = rows.filter(r => r.dentistId === dentist);
    }
    
    return rows.map((item, i) => ({
        id: item.id || item.PatNum || i + 1,
        patient: item.patient || `${item['First Name'] || ''} ${item['Last Name'] || ''}`.trim() || 'Unknown',
        flags: item.flags || '',
        age: item.age || '',
        contact: item.contact || item.phone || item.email || '',
        recallDate: item.recallDate || item.nextRecareAppt || '',
        lastExam: item.lastExam || item.lastAppt || '',
        lastProphy: item.lastProphy || '',
        lastMaintenance: item.lastMaintenance || '',
        lastComm: item.lastComm || '',
        note: item.note || '',
        contactAgain: item.contactAgain || '',
        followUp: item.followUp || '',
        apptDate: item.apptDate || item.nextTreatmentAppt || '',
        contactCount: item.contactCount || 0,
      }));
  }, [apiData, forcedCategory, getRowCategory, dentist]);

  // Apply all filters
  const filteredRows = useMemo(() => {
    let rows = [...baseRows];

    // 1. Patient name search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(r => r.patient.toLowerCase().includes(q));
    }

    // 2. Include Appointed (patients with an upcoming apptDate)
    if (!includeAppointed) {
      rows = rows.filter(r => !r.apptDate);
    }

    // 3. Flags filter
    if (flagFilter === 'with') {
      rows = rows.filter(r => r.flags && r.flags !== '');
    } else if (flagFilter === 'without') {
      rows = rows.filter(r => !r.flags || r.flags === '');
    }

    // 4. Date range filter on recallDate
    if (startDate || endDate) {
      const startT = startDate ? new Date(startDate).getTime() : 0;
      const endT   = endDate   ? new Date(endDate).getTime() + 86400000 : Infinity;
      rows = rows.filter(r => {
        if (!r.recallDate) return true;
        const t = new Date(r.recallDate).getTime();
        if (isNaN(t)) return true;
        return t >= startT && t < endT;
      });
    }

    return rows;
  }, [baseRows, searchQuery, includeAppointed, flagFilter, startDate, endDate]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pagedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleApplyFilters = () => {
    setPage(1);
    // Re-fetch from API with date params
    dispatch(fetchRecareReport({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setDentist('None');
    setHygienist('None');
    setIncludeAppointed(false);
    setFlagFilter('both');
    setShowFlagsCol(true);
    setPage(1);
    dispatch(fetchRecareReport({}));
  };

  const handlePrint = () => {
    const tableEl = document.getElementById('recare-list-table');
    if (!tableEl) return;
    const win = window.open('', '_blank');
    win.document.write('<html><head><title>Recare List Report</title>');
    win.document.write('<style>table{width:100%;border-collapse:collapse;font-family:sans-serif;font-size:11px}th,td{border:1px solid #ddd;padding:6px;text-align:left}th{background:#f8f9fa;font-weight:bold} .no-print { display: none !important; } .print-only { display: inline !important; }</style>');
    win.document.write('</head><body><h2>Recare List Report</h2>');
    win.document.write(tableEl.outerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const handleExportCSV = () => {
    const headers = ['Patient', 'Flags', 'Age', 'Contact', 'Recall Date', 'Last Exam', 'Last Prophy', 'Last Main.', 'Last Comm.', 'Contact Again', 'Appt Date', 'Count'];
    const csvRows = [
      headers.join(','),
      ...filteredRows.map(r =>
        [`"${r.patient}"`, `"${r.flags}"`, r.age, `"${r.contact}"`, r.recallDate, r.lastExam, r.lastProphy, r.lastMaintenance, r.lastComm, r.contactAgain, r.apptDate, r.contactCount].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `recare_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <Box sx={{ p: hideFilters ? 0 : 3, backgroundColor: hideFilters ? 'transparent' : '#f5f7fa', minHeight: '100vh' }}>
      
      {!hideFilters && (
        <Paper sx={{ p: 3, mb: 3, backgroundColor: '#fdfcfb' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Filters:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
            <RadioGroup row value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <FormControlLabel value="range" control={<Radio size="small" />} label={<Typography variant="body2">Range</Typography>} />
              <FormControlLabel value="monthly" control={<Radio size="small" />} label={<Typography variant="body2">Monthly</Typography>} />
            </RadioGroup>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="primary">From Date:</Typography>
                <TextField
                  variant="standard" type="date" size="small"
                  value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  sx={{ width: 130 }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="primary">To Date:</Typography>
                <TextField
                  variant="standard" type="date" size="small"
                  value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  sx={{ width: 130 }}
                />
              </Box>
            </Box>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Dentist</InputLabel>
              <Select value={dentist} label="Dentist" onChange={(e) => setDentist(e.target.value)}>
                <MenuItem value="None"><em>None</em></MenuItem>
                {dentistOptions.map(p => (
                  <MenuItem key={p._id || p.id} value={p._id || p.id}>
                    {getProviderName(p)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Hygienist</InputLabel>
              <Select value={hygienist} label="Hygienist" onChange={(e) => setHygienist(e.target.value)}>
                <MenuItem value="None"><em>None</em></MenuItem>
                {hygienistOptions.map(p => (
                  <MenuItem key={p._id || p.id} value={p._id || p.id}>
                    {getProviderName(p)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Checkbox size="small" checked={includeAppointed} onChange={(e) => setIncludeAppointed(e.target.checked)} />}
              label={<Typography variant="body2">Include Appointed</Typography>}
            />
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select value={flagFilter} onChange={(e) => setFlagFilter(e.target.value)}>
                <MenuItem value="both">Pts With Or Without Flags</MenuItem>
                <MenuItem value="with">Pts With Flags</MenuItem>
                <MenuItem value="without">Pts Without Flags</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Checkbox size="small" checked={showFlagsCol} onChange={(e) => setShowFlagsCol(e.target.checked)} />}
              label={<Typography variant="body2">{showFlagsCol ? 'Hide Flags in Report' : 'Show Flags in Report'}</Typography>}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Filter by Patient:</Typography>
              <TextField
                size="small" placeholder="Search Patient"
                value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                sx={{ width: 250 }}
                InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="text" size="small" onClick={handleClearFilters} sx={{ textTransform: 'none', color: 'error.main' }}>Clear all filters</Button>
              <Button variant="contained" size="small" onClick={handleApplyFilters} sx={{ textTransform: 'none', backgroundColor: '#4a90e2' }}>Apply Filters</Button>
              <Button variant="contained" size="small" disabled sx={{ textTransform: 'none', backgroundColor: '#d1a066' }}>Create Template</Button>
              <Button variant="contained" size="small" onClick={handlePrint} sx={{ textTransform: 'none', backgroundColor: '#4a90e2' }} startIcon={<Print />}>Print</Button>
              <Button variant="contained" size="small" onClick={handleExportCSV} sx={{ textTransform: 'none', backgroundColor: '#d1a066' }} startIcon={<FileDownload />}>Export as CSV</Button>
            </Box>
          </Box>
        </Paper>
      )}

      <Typography variant="subtitle2" sx={{ textAlign: 'center', mb: 2 }}>({filteredRows.length} Patient/s)</Typography>

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
            <Table id="recare-list-table" size="small">
              <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Patient</TableCell>
                  {showFlagsCol && <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Flags</TableCell>}
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Recall Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Last Exam</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Last Prophy</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Last Main.</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Last Comm.</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Note</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Contact Again</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Follow up</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Appt Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Count</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Reset</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showFlagsCol ? 15 : 14} sx={{ textAlign: 'center', py: 4, color: 'text.secondary', fontSize: '0.8rem' }}>
                      No patients match the current filters.
                    </TableCell>
                  </TableRow>
                ) : pagedRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b', fontWeight: 600 }}>
                      {row.patient}
                      <ActionIcons onChatClick={() => setChatPatient(row)} />
                    </TableCell>
                    {showFlagsCol && (
                      <TableCell>
                        {row.flags && row.flags !== '' && (
                          <Box sx={{ width: 12, height: 12, backgroundColor: row.flags === 'red' ? 'error.main' : row.flags, borderRadius: '2px' }} />
                        )}
                      </TableCell>
                    )}
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.age}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#4a90e2' }}>{row.contact}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.recallDate}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.lastExam}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.lastProphy}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.lastMaintenance}</TableCell>
                    
                    {/* Editable Last Comm Date */}
                    <TableCell sx={{ fontSize: '0.75rem', verticalAlign: 'top', pt: 1.5 }}>
                      <span className="print-only" style={{ display: 'none' }}>
                        {editedRows[row.id]?.lastComm !== undefined ? editedRows[row.id].lastComm : (row.lastComm || '')}
                      </span>
                      <TextField
                        className="no-print"
                        type="date"
                        variant="standard"
                        size="small"
                        value={editedRows[row.id]?.lastComm !== undefined ? editedRows[row.id].lastComm : (row.lastComm || '')}
                        onChange={(e) => handleRowChange(row.id, 'lastComm', e.target.value)}
                        InputProps={{ disableUnderline: true, sx: { fontSize: '0.75rem', color: '#1a3a6b' } }}
                      />
                    </TableCell>

                    {/* Editable Note */}
                    <TableCell sx={{ fontSize: '0.75rem', maxWidth: 220, verticalAlign: 'top', pt: 1.5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography 
                          className="no-print"
                          variant="caption" 
                          sx={{ color: '#1a3a6b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          onClick={() => handleAddNoteClick(row)}
                        >
                          <EditOutlined sx={{ fontSize: 14, mr: 0.5 }} /> Add note
                        </Typography>
                        {(() => {
                          const stateNoteText = editedRows[row.id]?.noteText;
                          const stateNoteDate = editedRows[row.id]?.noteDate;
                          const hasNote = stateNoteText !== undefined || row.note;
                          
                          if (!hasNote) return null;
                          
                          const text = stateNoteText !== undefined ? stateNoteText : row.note;
                          const date = stateNoteDate || (row.lastComm ? `${row.lastComm} 12:00 PM` : '07/15/2022 12:38 PM');

                          return (
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                                {date}
                              </Typography>
                              <span className="print-only" style={{ display: 'none' }}>{text}</span>
                              <TextField
                                className="no-print"
                                multiline
                                minRows={2}
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={text}
                                onChange={(e) => handleNoteChange(row.id, e.target.value)}
                                onBlur={(e) => handleNoteSave(row.id, e.target.value)}
                                InputProps={{
                                  sx: { fontSize: '0.75rem', p: 1, borderRadius: 0 }
                                }}
                              />
                            </Box>
                          );
                        })()}
                      </Box>
                    </TableCell>

                    {/* Editable Contact Again */}
                    <TableCell sx={{ fontSize: '0.75rem', verticalAlign: 'top', pt: 1 }}>
                      <span className="print-only" style={{ display: 'none' }}>
                        {editedRows[row.id]?.contactAgain !== undefined ? editedRows[row.id].contactAgain : (row.contactAgain === 'Y' || row.contactAgain === 'N' ? row.contactAgain : '')}
                      </span>
                      <Select
                        className="no-print"
                        variant="standard"
                        disableUnderline
                        value={editedRows[row.id]?.contactAgain !== undefined ? editedRows[row.id].contactAgain : (row.contactAgain === 'Y' || row.contactAgain === 'N' ? row.contactAgain : '')}
                        onChange={(e) => handleRowChange(row.id, 'contactAgain', e.target.value)}
                        displayEmpty
                        sx={{ fontSize: '0.75rem', color: '#1a3a6b', '& .MuiSelect-select': { py: 0.5 } }}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.75rem' }}><em>&nbsp;</em></MenuItem>
                        <MenuItem value="Y" sx={{ fontSize: '0.75rem' }}>Y</MenuItem>
                        <MenuItem value="N" sx={{ fontSize: '0.75rem' }}>N</MenuItem>
                      </Select>
                    </TableCell>

                    {/* Editable Follow Up Date */}
                    <TableCell sx={{ fontSize: '0.75rem', verticalAlign: 'top', pt: 1.5 }}>
                      <span className="print-only" style={{ display: 'none' }}>
                        {editedRows[row.id]?.followUp !== undefined ? editedRows[row.id].followUp : (row.followUp || '')}
                      </span>
                      <TextField
                        className="no-print"
                        type="date"
                        variant="standard"
                        size="small"
                        value={editedRows[row.id]?.followUp !== undefined ? editedRows[row.id].followUp : (row.followUp || '')}
                        onChange={(e) => handleRowChange(row.id, 'followUp', e.target.value)}
                        InputProps={{ disableUnderline: true, sx: { fontSize: '0.75rem', color: '#1a3a6b' } }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontSize: '0.75rem', verticalAlign: 'top', pt: 1.5 }}>{row.apptDate}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', verticalAlign: 'top', pt: 1.5 }}>{row.contactCount}</TableCell>
                    <TableCell sx={{ verticalAlign: 'top', pt: 1.5 }}>
                      <Button className="no-print" size="small" variant="contained" sx={{ fontSize: '0.65rem', p: '2px 8px', backgroundColor: '#d1a066' }}>Reset</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              size="small"
              variant="outlined"
              shape="rounded"
            />
          </Box>
        </>
      )}

      {/* Patient Chat Dialog */}
      <PatientChat 
        open={!!chatPatient} 
        onClose={() => setChatPatient(null)} 
        patientName={chatPatient?.patient} 
      />
    </Box>
  );
};

export default RecareList;
