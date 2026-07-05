import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, TextField, Select, MenuItem, Button, TableCell, TableRow, RadioGroup, FormControlLabel, Radio, Collapse
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { ReportLayout, ReportFilterBar, ReportSelect, ReportDataTable } from '../../../../components/reports/ui';

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

  const columns = [
    { label: 'Patient' },
    { label: 'Created Date' },
    { label: 'Kind' },
    { label: 'Provider' },
    { label: '' }, // For collapse icon
  ];

  const renderUnsignedRow = (row, index) => (
    <React.Fragment key={row.id}>
      <TableRow 
        onClick={() => handleRowClick(row.id)}
        sx={{ cursor: 'pointer', backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc', '&:hover': { backgroundColor: '#f5f5f5' } }}
      >
        <TableCell sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
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
                <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.6, flex: 1, whiteSpace: 'pre-line' }}>
                  {row.note || 'No note content available.'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                  <Typography variant="caption" sx={{ color: '#337ab7', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                    Sign Progress Note
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>NV:</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Franco RDA</Typography>
                  <Button variant="contained" size="small" sx={{ backgroundColor: '#d9a366', textTransform: 'none', fontSize: '0.7rem', color: '#fff', '&:hover': { backgroundColor: '#c89255' } }}>Edit Note</Button>
                </Box>
                <Typography variant="caption" color="text.secondary">Babar Magsi</Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );

  const renderSignedRow = (row, index) => (
    <React.Fragment key={row.id}>
      <TableRow 
        onClick={() => handleSignedRowClick(row.id)}
        sx={{ cursor: 'pointer', backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc', '&:hover': { backgroundColor: '#f5f5f5' } }}
      >
        <TableCell sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
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
  );

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Start Date:</Typography>
        <TextField defaultValue="04/08/2026" size="small" variant="standard" sx={{ width: 120, '& .MuiInputBase-input': { fontSize: '0.75rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } } }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, mr: 2 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>End Date:</Typography>
        <TextField defaultValue="05/08/2026" size="small" variant="standard" sx={{ width: 120, '& .MuiInputBase-input': { fontSize: '0.75rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } } }} />
      </Box>
      <ReportSelect 
        label="All" 
        prefix="Kind:" 
        defaultValue="All"
        options={[{ value: 'All', label: 'All' }]}
        sx={{ mr: 2 }}
      />
      <ReportSelect 
        label="All" 
        prefix="Provider:" 
        defaultValue="All"
        options={[{ value: 'All', label: 'All' }]}
      />
    </>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 4 }}>
        <FormControlLabel value="filter" control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Filter Codes</Typography>} />
        <TextField placeholder="Enter code or procedure" size="small" variant="standard" sx={{ width: 180, '& .MuiInputBase-input': { fontSize: '0.75rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } } }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormControlLabel value="exclude" checked control={<Radio size="small" />} label={<Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>Enter Codes to Exclude</Typography>} />
        <TextField placeholder="Enter code or procedure" size="small" variant="standard" sx={{ width: 180, '& .MuiInputBase-input': { fontSize: '0.75rem', backgroundColor: '#fff', '&:before, &:after': { display: 'none' } } }} />
      </Box>
    </>
  );

  return (
    <ReportLayout title="Unsigned Progress Notes Report:">
      <ReportFilterBar 
        topRowFilters={topFilters}
        bottomRowFilters={bottomFilters}
        onApplyFilters={() => console.log('Apply')}
        onExportCsv={() => alert('Exporting as CSV...')}
        onPrint={() => window.print()}
      />

      {/* Missing Notes Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} color="#337ab7" sx={{ mb: 1 }}>
          Completed Procedures with Missing Progress Notes
        </Typography>
        <ReportDataTable 
          columns={columns} 
          data={[]} 
          renderRow={renderUnsignedRow} 
          emptyMessage="No Data Found"
        />
      </Box>

      {/* Unsigned Notes Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} color="#337ab7" sx={{ mb: 1 }}>
          Unsigned Progress Notes
        </Typography>
        <ReportDataTable 
          columns={columns} 
          data={rows} 
          renderRow={renderUnsignedRow} 
        />
      </Box>

      {/* Signed Notes Section */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} color="#337ab7" sx={{ mb: 1 }}>
          Signed Progress Notes
        </Typography>
        <ReportDataTable 
          columns={columns} 
          data={signedRows} 
          renderRow={renderSignedRow} 
        />
      </Box>
    </ReportLayout>
  );
};

export default UnsignedProgressNotesReport;

