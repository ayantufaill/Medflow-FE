import React, { useState, useEffect, useMemo } from 'react';
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
  Divider,
  Collapse,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, FileDownload, Print } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnsignedProgressNotesReport, selectUnsignedProgressNotesData, selectClinicalReportLoading } from '../../../../store/slices/clinicalReportSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import RichTextEditor from '../../../../components/shared/RichTextEditor';

const UnsignedProgressNotesReport = () => {
  const dispatch = useDispatch();
  const apiData = useSelector(selectUnsignedProgressNotesData);
  const loading = useSelector(selectClinicalReportLoading);
  const providerOptions = useSelector(selectProviderDropdownList);

  const [expandedRow, setExpandedRow] = useState(null);
  const [signedExpandedRow, setSignedExpandedRow] = useState(null);
  
  const [startDate, setStartDate] = useState('2026-04-08');
  const [endDate, setEndDate] = useState('2026-05-08');
  const [kindFilter, setKindFilter] = useState('All');
  const [providerFilter, setProviderFilter] = useState('All');
  const [codeFilterMode, setCodeFilterMode] = useState('filter');

  // Inline Editor State
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [localNotes, setLocalNotes] = useState({});

  // Signing State
  const [signingRowId, setSigningRowId] = useState(null);

  const handleOpenEditor = (row) => {
    const currentNote = localNotes[row.id] !== undefined ? localNotes[row.id] : (row.note || '');
    setEditingContent(currentNote);
    setEditingRowId(row.id);
  };

  const handleSaveNote = (rowId) => {
    setLocalNotes(prev => ({ ...prev, [rowId]: editingContent }));
    setEditingRowId(null);
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
  };

  useEffect(() => {
    dispatch(fetchUnsignedProgressNotesReport({ startDate, endDate }));
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch, startDate, endDate]);

  // Helper: resolve provider display name
  const getProviderName = (p) => {
    if (p.firstName || p.lastName) return `${p.firstName || ''} ${p.lastName || ''}`.trim();
    if (p.userId && (p.userId.firstName || p.userId.lastName)) return `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim();
    return p.username || 'Unknown';
  };

  const handleApplyFilters = () => {
    dispatch(fetchUnsignedProgressNotesReport({ startDate, endDate }));
  };

  const rows = [
    { id: 1, patient: 'Francis Fuller', date: '05/07/2026', kind: 'Exam', provider: 'Dr. Smith', note: 'CC: "I have a broken tooth #31". Patient had veneers done March of 2026 in Smile Texas in Houston with Dr. Mackenzie McAfee-Dooley, #\'s 4-13 and 20-29. Patient had his jaw broken in 2017 and now has a chain on right side mandible. He started to notice pain about 2-3 months ago on tooth #31. Last dental cleaning was a year ago, is now looking for a general dentist in DFW as he has recently moved to the area from Houston.' },
    { id: 2, patient: 'John Doe', date: '05/07/2026', kind: 'Recare', provider: 'Hygienist A', note: '' },
    { id: 3, patient: 'Jane Smith', date: '05/05/2026', kind: 'Recare', provider: 'Hygienist B', note: '' },
    { id: 4, patient: 'Robert Brown', date: '05/07/2026', kind: 'Conversation', provider: 'Dr. Smith', note: '' },
    { id: 5, patient: 'Mary Johnson', date: '05/07/2026', kind: 'Treatment', provider: 'Dr. Wilson', note: '' },
    { id: 6, patient: 'William White', date: '05/07/2026', kind: 'Recare', provider: 'Hygienist A', note: '' },
    { id: 7, patient: 'Patricia Black', date: '05/06/2026', kind: 'Treatment', provider: 'Dr. Wilson', note: '' },
    { id: 8, patient: 'Michael Gray', date: '05/05/2026', kind: 'Treatment', provider: 'Dr. Wilson', note: '' },
    { id: 9, patient: 'Linda Green', date: '05/07/2026', kind: 'Recare', provider: 'Hygienist B', note: '' },
    { id: 10, patient: 'Barbara Brown', date: '05/06/2026', kind: 'Treatment', provider: 'Dr. Smith', note: '' },
    { id: 11, patient: 'James Wilson', date: '05/08/2026', kind: 'General', provider: 'Dr. Smith', note: '' },
  ];

  const signedRows = [
    { 
      id: 101, 
      patient: 'Patient X', 
      date: '04/13/2026', 
      kind: 'General', 
      provider: 'Dr. Smith',
      note: `bal on account -Two payments have been received and successfully posted for this claim:
• First Payment
Pending Date: 03/04/2025
Paid Amount: $750 (via Bulk Check)
Issued Date: 03/07/2025
Cashed Date: 03/20/2025
Claim #...

• Second Payment
For Payment Date: 09/01/2025
Paid Amount: $750 (Check)
Issued Date: 09/26/2025
Cashed Date: 10/07/2025
Claim #...

According to the payment schedule, the plan included a 6-month late payment period. The total lifetime orthodontic benefit was $2250, out of which $1500 has been paid, leaving a remaining balance of $750. However, the policy became inactive on 12/01/2025. Upon re-verification on 03/25/2026, the policy remains inactive. Therefore, no further payments are expected. Kindly advise if we should proceed with writing off the remaining balance of $750 and close the claim, or you will collect remaining $750 from patient?

Reference Details:
Rep B...
Rep H...
Rep C...
Thank you. YF`
    },
    { id: 102, patient: 'Patient Y', date: '04/21/2026', kind: 'Recare', provider: 'Hygienist A', note: '' },
    { id: 103, patient: 'Patient Z', date: '04/24/2026', kind: 'Conversation', provider: 'Dr. Smith', note: '' },
    { id: 104, patient: 'Patient W', date: '04/23/2026', kind: 'Treatment', provider: 'Dr. Wilson', note: '' },
    { id: 105, patient: 'Patient V', date: '04/14/2026', kind: 'Treatment', provider: 'Dr. Wilson', note: '' },
    { id: 106, patient: 'Patient U', date: '04/15/2026', kind: 'Recare', provider: 'Hygienist A', note: '' },
    { id: 107, patient: 'Patient T', date: '04/27/2026', kind: 'Conversation', provider: 'Dr. Smith', note: '' },
  ];

  const processedData = useMemo(() => {
    if (apiData && apiData.length > 0) {
      const parsed = apiData.map((item, i) => ({
        id: item.id || item._id || i + 1000,
        patient: item.patient || item.patientName || 'Unknown Patient',
        date: item.date || item.createdAt || '',
        kind: item.kind || item.type || 'General',
        provider: item.provider || item.providerName || 'Unknown Provider',
        note: item.note || item.content || '',
        isSigned: !!item.isSigned || item.status === 'signed',
      }));

      // Apply local filters if needed
      let filtered = parsed;
      if (kindFilter !== 'All') {
        filtered = filtered.filter(r => r.kind === kindFilter);
      }
      if (providerFilter !== 'All') {
        filtered = filtered.filter(r => r.provider === providerFilter);
      }
      if (startDate) {
        filtered = filtered.filter(r => new Date(r.date) >= new Date(startDate));
      }
      if (endDate) {
        filtered = filtered.filter(r => new Date(r.date) <= new Date(endDate));
      }

      return {
        unsigned: filtered.filter(r => !r.isSigned),
        signed: filtered.filter(r => r.isSigned)
      };
    }
    
    // Apply local filters to mock data if apiData is empty
    let filteredUnsigned = rows;
    let filteredSigned = signedRows;
    if (kindFilter !== 'All') {
      filteredUnsigned = filteredUnsigned.filter(r => r.kind === kindFilter);
      filteredSigned = filteredSigned.filter(r => r.kind === kindFilter);
    }
    if (providerFilter !== 'All') {
      filteredUnsigned = filteredUnsigned.filter(r => r.provider === providerFilter);
      filteredSigned = filteredSigned.filter(r => r.provider === providerFilter);
    }
    if (startDate) {
      filteredUnsigned = filteredUnsigned.filter(r => new Date(r.date) >= new Date(startDate));
      filteredSigned = filteredSigned.filter(r => new Date(r.date) >= new Date(startDate));
    }
    if (endDate) {
      filteredUnsigned = filteredUnsigned.filter(r => new Date(r.date) <= new Date(endDate));
      filteredSigned = filteredSigned.filter(r => new Date(r.date) <= new Date(endDate));
    }
    return { unsigned: filteredUnsigned, signed: filteredSigned };
  }, [apiData, kindFilter, providerFilter, startDate, endDate, rows, signedRows]);

  const displayUnsignedRows = processedData.unsigned;
  const displaySignedRows = processedData.signed;

  const handleRowClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleSignedRowClick = (id) => {
    setSignedExpandedRow(signedExpandedRow === id ? null : id);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline', mb: 2, cursor: 'pointer', display: 'inline-block' }}>
        Unsigned Progress Notes Report:
      </Typography>

      {/* Filters Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="primary">Start Date:</Typography>
            <TextField 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small" 
              variant="standard"
              sx={{ width: 130 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="primary">End Date:</Typography>
            <TextField 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small" 
              variant="standard"
              sx={{ width: 130 }}
            />
          </Box>
        </Box>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Kind</InputLabel>
          <Select value={kindFilter} onChange={(e) => setKindFilter(e.target.value)} label="Kind">
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Exam">Exam</MenuItem>
            <MenuItem value="Recare">Recare</MenuItem>
            <MenuItem value="Conversation">Conversation</MenuItem>
            <MenuItem value="Treatment">Treatment</MenuItem>
            <MenuItem value="General">General</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Provider</InputLabel>
          <Select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} label="Provider">
            <MenuItem value="All">All</MenuItem>
            {providerOptions.map(p => (
              <MenuItem key={p._id || p.id} value={p._id || p.id}>
                {getProviderName(p)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
        <RadioGroup 
          row 
          value={codeFilterMode} 
          onChange={(e) => setCodeFilterMode(e.target.value)}
          sx={{ display: 'flex', gap: 4 }}
        >
          <Box>
            <FormControlLabel 
              value="filter" 
              control={<Radio size="small" />} 
              label={<Typography variant="caption" color="text.secondary">Filter Codes</Typography>} 
            />
            <TextField 
              placeholder="Enter code or procedure" 
              size="small" 
              variant="standard" 
              disabled={codeFilterMode !== 'filter'}
              sx={{ width: 180, ml: 3 }} 
            />
          </Box>
          <Box>
            <FormControlLabel 
              value="exclude" 
              control={<Radio size="small" />} 
              label={<Typography variant="caption" color="text.secondary">Enter Codes to Exclude</Typography>} 
            />
            <TextField 
              placeholder="Enter code or procedure" 
              size="small" 
              variant="standard" 
              disabled={codeFilterMode !== 'exclude'}
              sx={{ width: 180, ml: 3 }} 
            />
          </Box>
        </RadioGroup>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Button onClick={handleApplyFilters} variant="contained" size="small" sx={{ backgroundColor: '#8db3d9', textTransform: 'none', px: 3 }}>Apply</Button>
        </Box>
      </Box>

      <Divider sx={{ my: 3, borderColor: '#d1a066' }} />

      {/* Export Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 4 }}>
        <Button variant="contained" size="small" startIcon={<FileDownload />} sx={{ backgroundColor: '#4a90e2', textTransform: 'none' }}>Export as CSV</Button>
        <Button variant="contained" size="small" startIcon={<Print />} sx={{ backgroundColor: '#d1a066', textTransform: 'none' }}>Print</Button>
      </Box>

      {/* Missing Notes Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="subtitle2" fontWeight={600} color="#1a3a6b" sx={{ mb: 2 }}>
          Completed Procedures with Missing Progress Notes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No Data Found
        </Typography>
      </Box>

      {/* Unsigned Notes Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="subtitle2" fontWeight={600} color="#1a3a6b" sx={{ mb: 2 }}>
          Unsigned Progress Notes
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Created Date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Kind</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Provider</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (!apiData || apiData.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : displayUnsignedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: 'text.secondary', fontSize: '0.8rem' }}>
                    No unsigned notes found.
                  </TableCell>
                </TableRow>
              ) : displayUnsignedRows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow 
                    onClick={() => handleRowClick(row.id)}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b' }}>{row.patient}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.date}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.kind}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.provider}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'text.secondary' }}>
                        {expandedRow === row.id ? <KeyboardArrowUp sx={{ fontSize: 18 }} /> : <KeyboardArrowDown sx={{ fontSize: 18 }} />}
                        <Typography variant="caption" sx={{ ml: 0.5 }}>View Note</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0, borderBottom: expandedRow === row.id ? '1px solid rgba(224, 224, 224, 1)' : 'none' }}>
                      <Collapse in={expandedRow === row.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, backgroundColor: '#fff' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            {editingRowId === row.id ? (
                              <Box sx={{ flex: 1, mr: 2 }}>
                                <RichTextEditor 
                                  value={editingContent} 
                                  onChange={setEditingContent} 
                                  minHeight={150} 
                                />
                              </Box>
                            ) : (
                              <Typography 
                                variant="body2" 
                                sx={{ fontSize: '0.8rem', lineHeight: 1.6, flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                                dangerouslySetInnerHTML={{ __html: localNotes[row.id] !== undefined ? localNotes[row.id] : (row.note || 'No note content available.') }}
                              />
                            )}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end', minWidth: 120 }}>
                              {signingRowId === row.id ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row.provider}</Typography>
                                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                    <TextField 
                                      placeholder="Pin Code" 
                                      size="small" 
                                      type="password"
                                      sx={{ width: 80, '& .MuiInputBase-root': { fontSize: '0.75rem', height: 24, padding: '0 8px' } }} 
                                    />
                                    <MuiButton 
                                      variant="contained" 
                                      size="small" 
                                      sx={{ backgroundColor: '#d1a066', textTransform: 'none', minWidth: 50, height: 24, fontSize: '0.7rem', padding: 0 }}
                                    >
                                      Sign
                                    </MuiButton>
                                    <MuiButton 
                                      variant="contained" 
                                      size="small" 
                                      onClick={() => setSigningRowId(null)} 
                                      sx={{ backgroundColor: '#9e9e9e', textTransform: 'none', minWidth: 50, height: 24, fontSize: '0.7rem', padding: 0 }}
                                    >
                                      Cancel
                                    </MuiButton>
                                  </Box>
                                </Box>
                              ) : (
                                <Typography 
                                  variant="caption" 
                                  color="primary" 
                                  onClick={() => setSigningRowId(row.id)}
                                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                >
                                  Sign Progress Note
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>NV:</Typography>
                              <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Franco RDA</Typography>
                              {editingRowId === row.id ? (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <MuiButton 
                                    variant="outlined" 
                                    size="small" 
                                    onClick={handleCancelEdit}
                                    sx={{ textTransform: 'none', fontSize: '0.7rem' }}
                                  >
                                    Cancel
                                  </MuiButton>
                                  <MuiButton 
                                    variant="contained" 
                                    size="small" 
                                    onClick={() => handleSaveNote(row.id)}
                                    sx={{ backgroundColor: '#4a90e2', textTransform: 'none', fontSize: '0.7rem' }}
                                  >
                                    Save
                                  </MuiButton>
                                </Box>
                              ) : (
                                <MuiButton 
                                  variant="contained" 
                                  size="small" 
                                  onClick={() => handleOpenEditor(row)}
                                  sx={{ backgroundColor: '#d1a066', textTransform: 'none', fontSize: '0.7rem' }}
                                >
                                  {(localNotes[row.id] || row.note) ? 'Edit Note' : 'Add Note'}
                                </MuiButton>
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">Babar Magsi</Typography>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Signed Notes Section */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} color="#1a3a6b" sx={{ mb: 2 }}>
          Signed Progress Notes
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Created Date</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Kind</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Provider</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (!apiData || apiData.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : displaySignedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: 'text.secondary', fontSize: '0.8rem' }}>
                    No signed notes found.
                  </TableCell>
                </TableRow>
              ) : displaySignedRows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow 
                    onClick={() => handleSignedRowClick(row.id)}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell sx={{ fontSize: '0.75rem', color: '#1a3a6b' }}>{row.patient}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.date}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.kind}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{row.provider}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'text.secondary' }}>
                        {signedExpandedRow === row.id ? <KeyboardArrowUp sx={{ fontSize: 18 }} /> : <KeyboardArrowDown sx={{ fontSize: 18 }} />}
                        <Typography variant="caption" sx={{ ml: 0.5 }}>View Note</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0, borderBottom: signedExpandedRow === row.id ? '1px solid rgba(224, 224, 224, 1)' : 'none' }}>
                      <Collapse in={signedExpandedRow === row.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, backgroundColor: '#fff' }}>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                            {row.note || 'This is a signed progress note. Content is locked for editing.'}
                          </Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Note Editor Dialog removed as it is now inline */}
    </Box>
  );
};

export default UnsignedProgressNotesReport;
