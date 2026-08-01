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

// ─── Mock data (used as fallback when API returns no data) ───────────────────
const MOCK_UNSIGNED = [
  { id: 1, patient: 'Francis Fuller', date: '05/07/2026', kind: 'Exam', provider: 'Dr. Smith', note: 'CC: "I have a broken tooth #31". Patient had veneers done March of 2026...' },
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

const MOCK_SIGNED = [
  { id: 101, patient: 'Patient X', date: '04/13/2026', kind: 'General', provider: 'Dr. Smith', note: 'bal on account - Two payments have been received and successfully posted for this claim...' },
  { id: 102, patient: 'Patient Y', date: '04/21/2026', kind: 'Recare', provider: 'Hygienist A', note: '' },
  { id: 103, patient: 'Patient Z', date: '04/24/2026', kind: 'Conversation', provider: 'Dr. Smith', note: '' },
  { id: 104, patient: 'Patient W', date: '04/23/2026', kind: 'Treatment', provider: 'Dr. Wilson', note: '' },
  { id: 105, patient: 'Patient V', date: '04/14/2026', kind: 'Treatment', provider: 'Dr. Wilson', note: '' },
];

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
                  <Button variant="contained" size="small" sx={{ backgroundColor: '#d9a366', textTransform: 'none', fontSize: '0.7rem', color: '#fff', '&:hover': { backgroundColor: '#c89255' } }}>
                    Edit Note
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary">Babar Magsi</Typography>
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

  const processedData = useMemo(() => {
    const source = apiData && apiData.length > 0
      ? apiData.map((item, i) => ({
          id: item.id || item._id || i + 1000,
          patient: item.patient || item.patientName || 'Unknown Patient',
          date: item.date || (item.createdAt ? dayjs(item.createdAt).format('MM/DD/YYYY') : ''),
          kind: item.kind || item.type || 'General',
          provider: item.provider || item.providerName || 'Unknown Provider',
          note: item.note || item.content || '',
          isSigned: !!item.isSigned || item.status === 'signed',
        }))
      : null;

    const applyFilters = (list) => {
      let filtered = list;
      if (kindFilter !== 'All') filtered = filtered.filter((r) => r.kind === kindFilter);
      if (providerFilter !== 'All') filtered = filtered.filter((r) => r.provider === providerFilter);
      return filtered;
    };

    if (source) {
      const filtered = applyFilters(source);
      return { unsigned: filtered.filter((r) => !r.isSigned), signed: filtered.filter((r) => r.isSigned) };
    }

    return {
      unsigned: applyFilters(MOCK_UNSIGNED),
      signed: applyFilters(MOCK_SIGNED),
    };
  }, [apiData, kindFilter, providerFilter]);

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
        onExportCsv={() => alert('Exporting CSV...')}
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
