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
import medflowLogo from '../../../../assets/medflow-logo.png';


// ─── Row renderers ───────────────────────────────────────────────────────────
const columns = [
  { label: 'Patient' },
  { label: 'Created Date' },
  { label: 'Kind' },
  { label: 'Provider' },
  { label: '', className: 'no-print' },
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
        <TableCell align="right" className="no-print">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'text.secondary' }}>
            {isExpanded ? <KeyboardArrowUp sx={{ fontSize: 18 }} /> : <KeyboardArrowDown sx={{ fontSize: 18 }} />}
            <Typography variant="caption" sx={{ ml: 0.5 }}>View Note</Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow className="no-print">
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
                {row.code && row.code !== '-' && (!row.note || !row.note.startsWith('Missing note')) && (
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, color: '#64748b' }}>
                    Procedure Code: {row.code}
                  </Typography>
                )}
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
        <TableCell align="right" className="no-print">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'text.secondary' }}>
            {isExpanded ? <KeyboardArrowUp sx={{ fontSize: 18 }} /> : <KeyboardArrowDown sx={{ fontSize: 18 }} />}
            <Typography variant="caption" sx={{ ml: 0.5 }}>View Note</Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow className="no-print">
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
                {row.code && row.code !== '-' && (!row.note || !row.note.startsWith('Missing note')) && (
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, color: '#64748b' }}>
                    Procedure Code: {row.code}
                  </Typography>
                )}
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
    dispatch(fetchUnsignedProgressNotesReport({ 
      startDate, endDate,
      provider: providerFilter !== 'All' ? providerFilter : undefined,
      kind: kindFilter !== 'All' ? kindFilter : undefined,
      code: codeText || undefined,
      codeFilterType: codeText ? codeFilter : undefined
    }));
    dispatch(fetchAllProvidersForDropdown());
  }, [dispatch]); // Initial load only

  const handleApply = () => {
    dispatch(fetchUnsignedProgressNotesReport({ 
      startDate, endDate,
      provider: providerFilter !== 'All' ? providerFilter : undefined,
      kind: kindFilter !== 'All' ? kindFilter : undefined,
      code: codeText || undefined,
      codeFilterType: codeText ? codeFilter : undefined
    }));
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
    const defaultData = { unsigned: [], signed: [], missing: [] };
    if (!apiData || Array.isArray(apiData)) return defaultData; // If still loading old array format
    
    return {
      unsigned: apiData.unsigned || [],
      signed: apiData.signed || [],
      missing: apiData.missing || []
    };
  }, [apiData]);

  const availableCodes = useMemo(() => {
    // Use availableCodes from API if available (includes codes from all three tables, unfiltered)
    if (apiData && !Array.isArray(apiData) && apiData.availableCodes) {
      return apiData.availableCodes;
    }
    // Fallback: extract from current data
    const codes = new Set();
    const extract = (arr) => arr.forEach((item) => {
      if (item.code && item.code !== '-') codes.add(item.code);
    });
    extract(processedData.unsigned);
    extract(processedData.signed);
    extract(processedData.missing);
    return Array.from(codes).sort();
  }, [apiData, processedData]);

  const handlePrint = () => {
    const printContent = document.getElementById('unsigned-notes-print-area');
    if (!printContent) return;

    const htmlContent = `
      <html>
        <head>
          <title>Unsigned Progress Notes Report</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; background-color: #fff; color: #000; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 4px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .MuiCollapse-root { display: none !important; } /* Hide expanded rows in print */
            .MuiCheckbox-root, input[type="checkbox"], button, .no-print, svg { display: none !important; }
            h6 { font-size: 16px !important; font-weight: bold !important; color: #337ab7 !important; margin: 15px 0 10px 0 !important; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${window.location.origin}${medflowLogo}" style="height: 45px; object-fit: contain;" alt="Medflow Logo" onerror="this.style.display='none'" />
          </div>
          <h2 style="text-align: center; margin-top: 0; color: #1e293b;">Unsigned Progress Notes Report</h2>
          <p style="text-align: center; margin-bottom: 20px;">Date Range: ${startDate} to ${endDate}</p>
          <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 10px;">
            ${printContent.outerHTML}
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
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 500);
    };
  };

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
        availableCodes={availableCodes}
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
        onPrint={handlePrint}
      />

      <Box id="unsigned-notes-print-area">

      {/* Completed Procedures with Missing Progress Notes */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={700} color="#337ab7" sx={{ mb: 1 }}>
          Completed Procedures with Missing Progress Notes
        </Typography>
        <ReportDataTable
          columns={columns}
          data={processedData.missing || []}
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
      </Box>
    </ReportLayout>
  );
};

export default UnsignedProgressNotesReport;
