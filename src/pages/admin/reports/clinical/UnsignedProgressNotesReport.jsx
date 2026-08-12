import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Button, TableCell, TableRow, Collapse,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUnsignedProgressNotesReport,
  selectUnsignedProgressNotesData,
  selectClinicalReportLoading,
} from '../../../../store/slices/clinicalReportSlice';
import { fetchAllProvidersForDropdown, selectProviderDropdownList } from '../../../../store/slices/providerSlice';
import { ReportLayout, ReportDataTable } from '../../../../components/reports/ui';
import UnsignedProgressNotesFilters from '../../../../components/reports/clinical/UnsignedProgressNotesFilters';
import ProductionReportActions from '../../../../components/reports/financial/ProductionReportActions';
import dayjs from 'dayjs';


// ─── Row renderers ───────────────────────────────────────────────────────────
const columns = [
  { label: 'Patient' },
  { label: 'Created Date' },
  { label: 'Kind' },
  { label: 'Provider' },
  { label: '' },
];

const UnsignedRow = ({ row, index, expandedRow, setExpandedRow }) => {
  const isExpanded = expandedRow === row.id;
  return (
    <React.Fragment key={row.id}>
      <TableRow
        onClick={() => setExpandedRow(isExpanded ? null : row.id)}
        sx={{ cursor: 'pointer', backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc', '&:hover': { backgroundColor: '#f5f5f5' } }}
      >
        <TableCell sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.date}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.kind}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.provider}</TableCell>
        <TableCell align="right">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'text.secondary' }}>
            {isExpanded ? <KeyboardArrowUp sx={{ fontSize: 18 }} /> : <KeyboardArrowDown sx={{ fontSize: 18 }} />}
            <Typography variant="caption" sx={{ ml: 0.5 }}>View Note</Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0, borderBottom: isExpanded ? '1px solid rgba(224,224,224,1)' : 'none' }}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2.5, backgroundColor: '#f8fafc', borderLeft: '4px solid #3CA2E0' }}>
              {/* Note Content Card */}
              <Box sx={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                p: 2.5,
                mb: 2,
                minHeight: 60,
              }}>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.7, whiteSpace: 'pre-line', color: row.note ? '#1e293b' : '#94a3b8', fontStyle: row.note ? 'normal' : 'italic' }}>
                  {row.note || 'No note content available.'}
                </Typography>
              </Box>

              {/* Footer: Provider info + Action buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#3CA2E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                      {(row.provider || 'P').charAt(0).toUpperCase()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', display: 'block', lineHeight: 1.3 }}>
                      {row.provider || 'Provider'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                      {row.date || ''}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      borderColor: '#3CA2E0',
                      color: '#3CA2E0',
                      borderRadius: '6px',
                      px: 1.5,
                      py: 0.5,
                      '&:hover': { backgroundColor: 'rgba(60, 162, 224, 0.06)', borderColor: '#2b8ac3' },
                    }}
                  >
                    Edit Note
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: '#3CA2E0',
                      borderRadius: '6px',
                      px: 1.5,
                      py: 0.5,
                      boxShadow: 'none',
                      '&:hover': { backgroundColor: '#2b8ac3', boxShadow: 'none' },
                    }}
                  >
                    Sign Progress Note
                  </Button>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const SignedRow = ({ row, index, signedExpandedRow, setSignedExpandedRow }) => {
  const isExpanded = signedExpandedRow === row.id;
  return (
    <React.Fragment key={row.id}>
      <TableRow
        onClick={() => setSignedExpandedRow(isExpanded ? null : row.id)}
        sx={{ cursor: 'pointer', backgroundColor: index % 2 === 0 ? '#fff' : '#fcfcfc', '&:hover': { backgroundColor: '#f5f5f5' } }}
      >
        <TableCell sx={{ fontSize: '0.75rem', color: '#337ab7', fontWeight: 500 }}>{row.patient}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.date}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.kind}</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>{row.provider}</TableCell>
        <TableCell align="right">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'text.secondary' }}>
            {isExpanded ? <KeyboardArrowUp sx={{ fontSize: 18 }} /> : <KeyboardArrowDown sx={{ fontSize: 18 }} />}
            <Typography variant="caption" sx={{ ml: 0.5 }}>View Note</Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0, borderBottom: isExpanded ? '1px solid rgba(224,224,224,1)' : 'none' }}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2.5, backgroundColor: '#f8fafc', borderLeft: '4px solid #22c55e' }}>
              {/* Note Content Card */}
              <Box sx={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                p: 2.5,
                mb: 2,
                minHeight: 60,
              }}>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.7, whiteSpace: 'pre-line', color: row.note ? '#1e293b' : '#94a3b8', fontStyle: row.note ? 'normal' : 'italic' }}>
                  {row.note || 'This is a signed progress note. Content is locked for editing.'}
                </Typography>
              </Box>

              {/* Footer: Provider info + Signed badge */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                      {(row.provider || 'P').charAt(0).toUpperCase()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b', display: 'block', lineHeight: 1.3 }}>
                      {row.provider || 'Provider'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.65rem' }}>
                      {row.date || ''}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '6px',
                  px: 1.5,
                  py: 0.5,
                }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#16a34a' }}>✓ Signed</Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const UnsignedProgressNotesReport = () => {
  const dispatch = useDispatch();
  const apiData = useSelector(selectUnsignedProgressNotesData);
  const loading = useSelector(selectClinicalReportLoading);
  const providerList = useSelector(selectProviderDropdownList);

  const [expandedRow, setExpandedRow] = useState(null);
  const [signedExpandedRow, setSignedExpandedRow] = useState(null);

  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [kindFilter, setKindFilter] = useState('All');
  const [providerFilter, setProviderFilter] = useState('All');
  const [codeFilter, setCodeFilter] = useState('filter');
  const [codeText, setCodeText] = useState('');

  useEffect(() => {
    dispatch(fetchUnsignedProgressNotesReport({ startDate, endDate }));
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]);

  const handleApply = () => {
    dispatch(fetchUnsignedProgressNotesReport({ startDate, endDate }));
  };

  const handleClear = () => {
    const sd = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    const ed = dayjs().format('YYYY-MM-DD');
    setStartDate(sd);
    setEndDate(ed);
    setKindFilter('All');
    setProviderFilter('All');
    setCodeFilter('filter');
    setCodeText('');
    dispatch(fetchUnsignedProgressNotesReport({ startDate: sd, endDate: ed }));
  };

  // Helper: get provider display name from provider dropdown item
  const getProviderDisplayName = (p) => {
    const first = p.userId?.firstName || p.firstName || p.FName || '';
    const last = p.userId?.lastName || p.lastName || p.LName || '';
    return `${first} ${last}`.trim() || p.providerCode || p._id || 'Unknown';
  };

  // Build a lookup: provider _id -> display name
  const providerNameById = useMemo(() => {
    const map = {};
    (providerList || []).forEach((p) => {
      map[p._id] = getProviderDisplayName(p);
    });
    return map;
  }, [providerList]);

  const processedData = useMemo(() => {
    const source = (apiData || []).map((item, i) => ({
      id: item.id || item._id || i + 1000,
      patient: item.patient || item.patientName || 'Unknown Patient',
      date: item.date || (item.createdAt ? dayjs(item.createdAt).format('MM/DD/YYYY') : ''),
      kind: item.kind || item.type || 'General',
      provider: item.provider || item.providerName || 'Unknown Provider',
      note: item.note || item.content || '',
    }));

    let filtered = source;

    // Kind filter
    if (kindFilter !== 'All') {
      filtered = filtered.filter((r) => r.kind === kindFilter);
    }

    // Provider filter — compare selected provider name to row's provider string
    if (providerFilter !== 'All') {
      const selectedName = providerNameById[providerFilter] || providerFilter;
      filtered = filtered.filter((r) => r.provider === selectedName);
    }

    // Code filter — exclude rows whose kind matches the entered text
    if (codeFilter === 'exclude' && codeText.trim()) {
      const excludeTerms = codeText.toLowerCase().split(',').map((t) => t.trim()).filter(Boolean);
      filtered = filtered.filter((r) => {
        const kindLower = r.kind.toLowerCase();
        return !excludeTerms.some((term) => kindLower.includes(term));
      });
    }

    // Backend only returns unsigned notes (ProcStatus: 2), so all results are unsigned
    return { unsigned: filtered, signed: [] };
  }, [apiData, kindFilter, providerFilter, providerNameById, codeFilter, codeText]);

  const renderUnsignedRow = (row, index) => (
    <UnsignedRow
      key={row.id}
      row={row}
      index={index}
      expandedRow={expandedRow}
      setExpandedRow={setExpandedRow}
    />
  );

  const renderSignedRow = (row, index) => (
    <SignedRow
      key={row.id}
      row={row}
      index={index}
      signedExpandedRow={signedExpandedRow}
      setSignedExpandedRow={setSignedExpandedRow}
    />
  );

  return (
    <ReportLayout title="Unsigned Progress Notes Report:">
      <UnsignedProgressNotesFilters
        startDate={startDate}
        endDate={endDate}
        kindFilter={kindFilter}
        providerFilter={providerFilter}
        codeFilter={codeFilter}
        codeText={codeText}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setKindFilter={setKindFilter}
        setProviderFilter={setProviderFilter}
        setCodeFilter={setCodeFilter}
        setCodeText={setCodeText}
        providers={providerList}
        handleApply={handleApply}
        handleClear={handleClear}
      />

      <ProductionReportActions
        onExportCsv={() => {
          const headers = ['Patient', 'Created Date', 'Kind', 'Provider', 'Note'];
          const csvRows = [
            headers.join(','),
            ...processedData.unsigned.map((r) =>
              [
                `"${r.patient}"`,
                r.date,
                r.kind,
                `"${r.provider}"`,
                `"${(r.note || '').replace(/"/g, '""')}"`,
              ].join(',')
            ),
          ].join('\n');
          const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.setAttribute('href', URL.createObjectURL(blob));
          link.setAttribute('download', `unsigned_progress_notes_${new Date().toISOString().split('T')[0]}.csv`);
          link.click();
        }}
        onPrint={() => window.print()}
      />

      {/* Completed Procedures with Missing Progress Notes */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={700} color="#337ab7" sx={{ mb: 1 }}>
          Completed Procedures with Missing Progress Notes
        </Typography>
        <ReportDataTable
          columns={columns}
          data={[]}
          renderRow={renderUnsignedRow}
          emptyMessage="No Data Found"
        />
      </Box>

      {/* Unsigned Progress Notes */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={700} color="#337ab7" sx={{ mb: 1 }}>
          Unsigned Progress Notes
        </Typography>
        <ReportDataTable
          columns={columns}
          data={processedData.unsigned}
          renderRow={renderUnsignedRow}
          loading={loading}
          emptyMessage="No unsigned progress notes found"
        />
      </Box>

      {/* Signed Progress Notes */}
      <Box>
        <Typography variant="subtitle2" fontWeight={700} color="#337ab7" sx={{ mb: 1 }}>
          Signed Progress Notes
        </Typography>
        <ReportDataTable
          columns={columns}
          data={processedData.signed}
          renderRow={renderSignedRow}
          emptyMessage="No signed progress notes found"
        />
      </Box>
    </ReportLayout>
  );
};

export default UnsignedProgressNotesReport;
