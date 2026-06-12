import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Collapse,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Search as SearchIcon,
  Add as AddIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { providerService } from '../../services/provider.service';
import {
  fetchProviders,
  activateProvider,
  deactivateProvider,
  selectProviderList,
  selectProviderPagination,
  selectProviderListLoading,
  selectProviderListError,
} from '../../store/slices/providerSlice';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import EditProviderDialog from '../../components/providers/EditProviderDialog';
import AddProviderDialog from '../../components/providers/AddProviderDialog';

// ─── Tab config ──────────────────────────────────────────────────────────────

const SUB_TABS = [
  {
    label: 'Active Providers',
    heading: 'In Office Providers:',
    buttonLabel: 'Add Provider',
    addPath: '/providers/new',
    useRedux: true,
    apiParams: { isActive: true },
    columns: ['provider', 'specialty', 'providerType', 'email', 'mobile', 'taxNumber', 'licenseNumber'],
  },
  {
    label: 'Referral Providers',
    heading: 'Referral Providers:',
    buttonLabel: 'Add Referral Provider',
    addPath: '/providers/new',
    useRedux: true,
    apiParams: { providerCategory: 'referral' },
    columns: ['provider', 'specialty', 'email', 'mobile', 'officePhone', 'verified'],
  },
  {
    label: 'Care Team Providers',
    heading: 'Care Team Providers:',
    buttonLabel: 'Add Care Team Provider',
    addPath: '/providers/new',
    useRedux: true,
    apiParams: { providerCategory: 'care_team' },
    columns: ['provider', 'specialty', 'email', 'mobile', 'officePhone'],
  },
  {
    label: 'Labs',
    heading: 'Labs:',
    buttonLabel: 'Add Lab Provider',
    addPath: '/providers/new',
    useRedux: true,
    apiParams: { providerCategory: 'lab' },
    columns: ['provider', 'specialty', 'email', 'mobile', 'officePhone', 'verified'],
    columnOverrides: { provider: 'Lab' },
    searchPlaceholder: 'Search by lab name',
  },
  {
    label: 'Inactive Providers',
    heading: 'Inactive Providers:',
    buttonLabel: 'Add Provider',
    addPath: '/providers/new',
    useRedux: true,
    apiParams: { isActive: false },
    columns: ['provider', 'specialty', 'providerType', 'email', 'mobile', 'taxNumber', 'licenseNumber'],
    inactive: true,
  },
];

const COLUMN_HEADERS = {
  provider: 'Provider',
  specialty: 'Specialty',
  providerType: 'Provider Type',
  email: 'Email',
  mobile: 'Mobile Phone Number',
  officePhone: 'Office Phone Number',
  taxNumber: 'Federal Tax Number',
  licenseNumber: 'License Number',
  verified: 'Verified',
};

const SPECIALTIES = [
  'General Dentist',
  'Dental Hygienist',
  'Orthodontist',
  'Periodontist',
  'Endodontist',
  'Oral Surgeon',
  'Prosthodontist',
  'Pedodontist',
  'Primary Care Doctor',
  'Radiology',
  'Other',
];

// ─── Verified badge ───────────────────────────────────────────────────────────

const getVerifiedInfo = (provider) => {
  const status = provider.verificationStatus || provider.verified || null;
  const verifiedDate = provider.verifiedAt || provider.verificationDate || null;
  const sentDate = provider.verificationSentAt || provider.sentAt || null;

  if (status === 'verified' || (status === true && verifiedDate)) {
    const d = verifiedDate ? new Date(verifiedDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '';
    return { label: `Verified${d ? ` ${d}` : ''}`, color: '#e8f5e9', textColor: '#2e7d32' };
  }
  if (status === 'sent' || sentDate) {
    const d = sentDate ? new Date(sentDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '';
    return { label: `Sent On${d ? ` ${d}` : ''}`, color: '#fff8e1', textColor: '#f57c00' };
  }
  return null;
};

const VerifiedBadge = ({ provider }) => {
  const info = getVerifiedInfo(provider);
  if (!info) return (
    <Box sx={{ display: 'inline-block', px: 1, py: 0.25, borderRadius: 1, backgroundColor: '#f5f5f5', color: 'text.secondary', fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
      Not Sent - N/A
    </Box>
  );
  return (
    <Box
      sx={{
        display: 'inline-block',
        px: 1,
        py: 0.25,
        borderRadius: 1,
        backgroundColor: info.color,
        color: info.textColor,
        fontSize: '0.75rem',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {info.label}
    </Box>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatSpecialty = (value) => {
  if (!value) return '-';
  if (Array.isArray(value)) {
    const cleaned = value.map((v) => (typeof v === 'string' ? v.trim() : '')).filter(Boolean);
    return cleaned.length ? cleaned.join(', ') : '-';
  }
  return typeof value === 'string' ? value.trim() || '-' : '-';
};

const getProviderName = (provider) => {
  const first = provider.userId?.firstName || provider.firstName || '';
  const last = provider.userId?.lastName || provider.lastName || '';
  return [first, last].filter(Boolean).join(' ') || '-';
};

const getCellValue = (provider, col) => {
  switch (col) {
    case 'provider': return getProviderName(provider);
    case 'specialty': return formatSpecialty(provider.specialty);
    case 'providerType': return provider.providerType || provider.title || '-';
    case 'email': return provider.userId?.email || provider.email || '-';
    case 'mobile': return provider.phone || provider.userId?.phone || provider.mobilePhone || '-';
    case 'officePhone': return provider.officePhone || provider.workPhone || '-';
    case 'taxNumber': return provider.federalTaxId || provider.taxId || provider.federalTaxNumber || '-';
    case 'licenseNumber': return provider.licenseNumber || '-';
    default: return '-';
  }
};

// ─── Expanded row panel ───────────────────────────────────────────────────────

const DetailField = ({ label, value }) => (
  <Box>
    <Typography component="span" variant="body2" fontWeight={700}>{label}: </Typography>
    <Typography component="span" variant="body2">{value || ''}</Typography>
  </Box>
);

const ExpandedDetails = ({ provider, onDeactivate, onActivate, actionLoading }) => {
  const addr = provider.address || {};
  const userId = provider.userId || {};

  const fields = [
    [
      { label: 'Title', value: provider.title },
      { label: 'Middle Name', value: userId.middleName || provider.middleName },
      { label: 'Home Phone Number', value: provider.homePhone || userId.homePhone },
    ],
    [
      { label: 'Suffix Title', value: provider.suffixTitle || provider.suffix },
      { label: 'Preferred Name', value: provider.preferredName || userId.preferredName },
      { label: 'Color', value: null, color: provider.color },
    ],
    [
      { label: 'Organization Name', value: provider.organizationName },
      { label: 'NPI', value: provider.npiNumber },
      { label: 'Description', value: provider.description },
    ],
    [
      { label: 'Signature on File', value: provider.signatureOnFile ? 'Yes' : provider.signatureOnFile === false ? 'No' : '' },
      { label: 'Additional Provider ID', value: provider.additionalProviderId },
    ],
    [
      { label: 'Country', value: addr.country || provider.country },
      { label: 'Additional Address', value: addr.additionalAddress || addr.address2 },
      { label: 'State', value: addr.state || provider.state },
    ],
    [
      { label: 'Street Address', value: addr.street || addr.address1 || provider.streetAddress },
      { label: 'City', value: addr.city || provider.city },
      { label: 'Zip Code', value: addr.zipCode || addr.zip || provider.zipCode },
    ],
  ];

  return (
    <Box sx={{ p: 2.5, backgroundColor: '#eef2f8', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Grid container spacing={1}>
        {fields.map((col, ci) => (
          <Grid key={ci} size={2}>
            {col.map((f) =>
              f.color !== undefined ? (
                <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" fontWeight={700}>{f.label}: </Typography>
                  {f.color ? (
                    <Box sx={{ width: 16, height: 16, borderRadius: '2px', backgroundColor: f.color, border: '1px solid rgba(0,0,0,0.15)' }} />
                  ) : null}
                </Box>
              ) : (
                <DetailField key={f.label} label={f.label} value={f.value} />
              )
            )}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
        {provider.isActive ? (
          <Button
            variant="contained"
            size="small"
            onClick={onDeactivate}
            disabled={actionLoading}
            sx={{ backgroundColor: '#e53935', '&:hover': { backgroundColor: '#c62828' } }}
          >
            Deactivate
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={onActivate}
            disabled={actionLoading}
            color="success"
          >
            Activate
          </Button>
        )}
      </Box>
    </Box>
  );
};

// ─── Inactive providers multi-section view ────────────────────────────────────

const INACTIVE_SECTIONS = [
  {
    key: 'inOffice',
    heading: 'In Office Providers:',
    apiParams: { isActive: false },
    columns: ['provider', 'specialty', 'providerType', 'email', 'mobile', 'taxNumber', 'licenseNumber'],
  },
  {
    key: 'referral',
    heading: 'Referral Providers:',
    apiParams: { isActive: false, providerCategory: 'referral' },
    columns: ['provider', 'specialty', 'email', 'mobile', 'officePhone', 'verified'],
  },
  {
    key: 'careTeam',
    heading: 'Care Team Providers:',
    apiParams: { isActive: false, providerCategory: 'care_team' },
    columns: ['provider', 'specialty', 'email', 'mobile', 'officePhone'],
  },
  {
    key: 'lab',
    heading: 'LabCase Providers:',
    apiParams: { isActive: false, providerCategory: 'lab' },
    columns: ['provider', 'specialty', 'email', 'mobile', 'officePhone', 'verified'],
  },
];

const InactiveSectionTable = ({ section, onEdit, onActivate, actionLoading }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const isActive = section.apiParams.isActive;
  const providerCategory = section.apiParams.providerCategory;

  useEffect(() => {
    let cancelled = false;
    providerService
      .getAllProviders(1, 50, '', isActive, '', providerCategory || '')
      .then((result) => { if (!cancelled) { setRows(result.providers || []); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isActive, providerCategory]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 1.5, color: '#1a6b9e', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
      >
        {section.heading}
      </Typography>
      <Paper variant="outlined">
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}><CircularProgress size={24} /></Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 700, backgroundColor: '#f8fafc', fontSize: '0.8rem' } }}>
                  {section.columns.map((col) => (
                    <TableCell key={col}>{COLUMN_HEADERS[col]}</TableCell>
                  ))}
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={section.columns.length + 1} sx={{ py: 2, color: 'text.secondary', fontSize: '0.82rem' }} />
                  </TableRow>
                ) : (
                  rows.map((provider) => {
                    const id = provider._id || provider.id;
                    return (
                      <TableRow key={id} hover sx={{ '& .MuiTableCell-root': { fontSize: '0.82rem', py: 1.2 } }}>
                        {section.columns.map((col) => (
                          <TableCell key={col}>
                            {col === 'provider' ? (
                              <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
                                {getCellValue(provider, col)}
                              </Typography>
                            ) : col === 'verified' ? (
                              <VerifiedBadge provider={provider} />
                            ) : (
                              getCellValue(provider, col)
                            )}
                          </TableCell>
                        ))}
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                            <Tooltip title="Activate">
                              <span>
                                <IconButton size="small" disabled={actionLoading}
                                  onClick={() => onActivate(provider)}
                                  sx={{ color: 'text.disabled' }}>
                                  <CheckCircleOutlineIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => onEdit(provider)} sx={{ color: 'text.secondary' }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

const InactiveProvidersView = ({ onEdit, onActivate, actionLoading }) => (
  <Box>
    {INACTIVE_SECTIONS.map((section) => (
      <InactiveSectionTable
        key={section.key}
        section={section}
        onEdit={onEdit}
        onActivate={onActivate}
        actionLoading={actionLoading}
      />
    ))}
  </Box>
);

// ─── Component ────────────────────────────────────────────────────────────────

const ProvidersListPage = () => {
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  // Redux state (used for Active + Inactive tabs)
  const reduxProviders = useSelector(selectProviderList);
  const reduxPagination = useSelector(selectProviderPagination);
  const reduxLoading = useSelector(selectProviderListLoading);
  const reduxError = useSelector(selectProviderListError);

  // Local state (used for Referral / CareTeam / Labs tabs)
  const [localProviders, setLocalProviders] = useState([]);
  const [localTotal, setLocalTotal] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const [activeSubTab, setActiveSubTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [dragEnabled, setDragEnabled] = useState(false);
  const [error, setError] = useState('');
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [addDialog, setAddDialog] = useState({ open: false });
  const [editDialog, setEditDialog] = useState({ open: false, providerId: null, providerName: '' });
  const [deactivateDialog, setDeactivateDialog] = useState({ open: false, providerId: null, providerName: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const tabConfig = SUB_TABS[activeSubTab];
  const useRedux = tabConfig.useRedux;

  const providers = useRedux ? reduxProviders : localProviders;
  const loading = useRedux ? reduxLoading : localLoading;

  // ─── Fetch (Redux tabs) ───────────────────────────────────────
  useEffect(() => {
    if (!useRedux) return;
    dispatch(fetchProviders({
      page: 1,
      limit: 100,
      ...tabConfig.apiParams,
    }));
  }, [dispatch, activeSubTab, useRedux]);

  useEffect(() => { if (reduxError) setError(reduxError); }, [reduxError]);

  // ─── Fetch (local tabs) ───────────────────────────────────────
  const fetchLocal = useCallback(async () => {
    setLocalLoading(true);
    setLocalError('');
    try {
      const result = await providerService.getAllProviders(
        1,
        100,
        '', // search
        null, // isActive
        '', // specialtyFilter
        tabConfig.apiParams.providerCategory || ''
      );
      setLocalProviders(result.providers || []);
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to load providers';
      setLocalError(msg);
      setLocalProviders([]);
    } finally {
      setLocalLoading(false);
    }
  }, [tabConfig.apiParams.providerCategory]);

  useEffect(() => {
    if (useRedux) return;
    fetchLocal();
  }, [fetchLocal, useRedux]);

  // ─── Frontend Filtering ────────────────────────────────────────
  const normalizeSpecialty = (str) => {
    if (!str) return '';
    return str.toLowerCase()
      .replace(/orthodont(ist|ics?)/g, 'orthodont')
      .replace(/periodont(ist|ics?)/g, 'periodont')
      .replace(/endodont(ist|ics?)/g, 'endodont')
      .replace(/prosthodont(ist|ics?)/g, 'prosthodont')
      .replace(/pedodont(ist|ics?)/g, 'pedodont')
      .replace(/dent(ist|istry?)/g, 'dent')
      .replace(/surge(on|ry)/g, 'surge')
      .replace(/hygien(ist|e)/g, 'hygien')
      .replace(/radiolog(ist|y)/g, 'radiolog')
      .replace(/physician/g, 'doctor');
  };

  const filteredProviders = providers.filter((p) => {
    if (specialtyFilter) {
      const specialtyValue = typeof p.specialty === 'string' 
        ? p.specialty 
        : (Array.isArray(p.specialty) ? p.specialty.join(' ') : '');
      const normalizedProviderSpecialty = normalizeSpecialty(specialtyValue);
      const normalizedFilter = normalizeSpecialty(specialtyFilter);
      
      if (!normalizedProviderSpecialty.includes(normalizedFilter)) {
        return false;
      }
    }
    if (debouncedSearch) {
      const searchStr = debouncedSearch.toLowerCase();
      const name = getProviderName(p).toLowerCase();
      const email = (p.userId?.email || p.email || '').toLowerCase();
      const phone = (p.phone || p.userId?.phone || p.mobilePhone || '').toLowerCase();
      if (!name.includes(searchStr) && !email.includes(searchStr) && !phone.includes(searchStr)) {
        return false;
      }
    }
    return true;
  });

  const displayedProviders = filteredProviders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalProviders = filteredProviders.length;

  // ─── Handlers ────────────────────────────────────────────────
  const handleSubTabChange = (_, newValue) => {
    setActiveSubTab(newValue);
    setPage(0);
    setSearch('');
    setSpecialtyFilter('');
    setLocalProviders([]);
    setLocalError('');
    setExpandedRowId(null);
  };

  const handleToggleActive = async (provider) => {
    const id = provider._id || provider.id;
    const name = getProviderName(provider);
    if (provider.isActive) {
      setDeactivateDialog({ open: true, providerId: id, providerName: name });
    } else {
      try {
        setActionLoading(true);
        if (useRedux) {
          await dispatch(activateProvider(id)).unwrap();
        } else {
          await providerService.activateProvider(id);
          fetchLocal();
        }
        showSnackbar(`Provider "${name}" activated`, 'success');
      } catch (err) {
        if (err?.name === 'ConditionError') return;
        const msg = typeof err === 'string' ? err : 
          (err?.message || 'Failed to activate provider');
        showSnackbar(msg, 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeactivateConfirm = async () => {
    try {
      setActionLoading(true);
      if (useRedux) {
        await dispatch(deactivateProvider(deactivateDialog.providerId)).unwrap();
      } else {
        await providerService.deactivateProvider(deactivateDialog.providerId);
        fetchLocal();
      }
      showSnackbar(`Provider "${deactivateDialog.providerName}" deactivated`, 'success');
      setDeactivateDialog({ open: false, providerId: null, providerName: '' });
    } catch (err) {
      if (err?.name === 'ConditionError') return;
      const msg = typeof err === 'string' ? err : 
        (err?.message || 'Failed to deactivate provider');
      showSnackbar(msg, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <Box>
      {(error || localError) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => { setError(''); setLocalError(''); }}>
          {error || localError}
        </Alert>
      )}

      {/* Sub-tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeSubTab}
          onChange={handleSubTabChange}
          sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.875rem' } }}
        >
          {SUB_TABS.map((tab) => (
            <Tab
              key={tab.label}
              label={tab.label}
              disableRipple
              sx={tab.inactive ? { color: 'error.main', '&.Mui-selected': { color: 'error.main' } } : {}}
            />
          ))}
        </Tabs>
      </Box>

      {tabConfig.inactive ? (
        <InactiveProvidersView
          actionLoading={actionLoading}
          onActivate={(provider) => handleToggleActive(provider)}
          onEdit={(provider) => setEditDialog({ open: true, providerId: provider._id || provider.id, providerName: getProviderName(provider) })}
        />
      ) : (
        <>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            {tabConfig.heading}
          </Typography>

          {/* Controls row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder={tabConfig.searchPlaceholder || 'Search by provider name'}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              sx={{ width: 260 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              }}
            />

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                displayEmpty
                value={specialtyFilter}
                onChange={(e) => { setSpecialtyFilter(e.target.value); setPage(0); }}
                renderValue={(v) => v || 'Filter by Specialty'}
              >
                <MenuItem value=""><em>All Specialties</em></MenuItem>
                {SPECIALTIES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ flex: 1 }} />

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={dragEnabled}
                  onChange={(e) => setDragEnabled(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                  Drag and drop table<br />rows to reorder
                </Typography>
              }
              sx={{ mr: 1 }}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialog({ open: true, title: tabConfig.buttonLabel, providerCategory: tabConfig.apiParams.providerCategory || null })}
              sx={{ backgroundColor: '#1a3a6b', whiteSpace: 'nowrap' }}
            >
              {tabConfig.buttonLabel}
            </Button>

            <Button
              variant="outlined"
              onClick={() => { if (useRedux) { setSearch(''); setSpecialtyFilter(''); } else fetchLocal(); }}
              sx={{ whiteSpace: 'nowrap', color: 'text.secondary', borderColor: 'divider' }}
            >
              Reset Providers Order
            </Button>
          </Box>

          {/* Table */}
          <Paper variant="outlined">
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
            ) : (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '& .MuiTableCell-head': { fontWeight: 700, backgroundColor: '#f8fafc', fontSize: '0.8rem' } }}>
                        {dragEnabled && <TableCell sx={{ width: 40 }} />}
                        {tabConfig.columns.map((col) => (
                          <TableCell key={col}>
                            {(tabConfig.columnOverrides?.[col]) || COLUMN_HEADERS[col]}
                          </TableCell>
                        ))}
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedProviders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={tabConfig.columns.length + (dragEnabled ? 2 : 1)} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">No providers found</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        displayedProviders.map((provider) => {
                          const id = provider._id || provider.id;
                          const isExpanded = expandedRowId === id;
                          const totalCols = tabConfig.columns.length + (dragEnabled ? 2 : 1);
                          return (
                            <>
                              <TableRow
                                key={id}
                                hover
                                onClick={() => setExpandedRowId(isExpanded ? null : id)}
                                sx={{
                                  cursor: 'pointer',
                                  '& .MuiTableCell-root': { fontSize: '0.82rem', py: 1.2 },
                                  ...(isExpanded && { backgroundColor: '#f0f4fa' }),
                                }}
                              >
                                {dragEnabled && (
                                  <TableCell sx={{ cursor: 'grab', color: 'text.disabled' }} onClick={(e) => e.stopPropagation()}>
                                    <DragIndicatorIcon fontSize="small" />
                                  </TableCell>
                                )}
                                {tabConfig.columns.map((col) => (
                                  <TableCell key={col}>
                                    {col === 'provider' ? (
                                      <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
                                        {getCellValue(provider, col)}
                                      </Typography>
                                    ) : col === 'verified' ? (
                                      <VerifiedBadge provider={provider} />
                                    ) : (
                                      getCellValue(provider, col)
                                    )}
                                  </TableCell>
                                ))}
                                <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                    <Tooltip title={provider.isActive ? 'Deactivate' : 'Activate'}>
                                      <span>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleToggleActive(provider)}
                                          disabled={actionLoading}
                                          sx={{ color: provider.isActive ? 'primary.main' : 'text.disabled' }}
                                        >
                                          <CheckCircleOutlineIcon fontSize="small" />
                                        </IconButton>
                                      </span>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                      <IconButton
                                        size="small"
                                        onClick={() => setEditDialog({ open: true, providerId: id, providerName: getProviderName(provider) })}
                                        sx={{ color: 'text.secondary' }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>

                              {/* Expanded details panel */}
                              <TableRow key={`${id}-expanded`}>
                                <TableCell colSpan={totalCols} sx={{ p: 0, borderBottom: isExpanded ? '1px solid rgba(224,224,224,1)' : 'none' }}>
                                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <ExpandedDetails
                                      provider={provider}
                                      actionLoading={actionLoading}
                                      onDeactivate={() => setDeactivateDialog({ open: true, providerId: id, providerName: getProviderName(provider) })}
                                      onActivate={() => handleToggleActive(provider)}
                                    />
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={totalProviders}
                  page={page}
                  onPageChange={(_, p) => setPage(p)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </>
            )}
          </Paper>
        </>
      )}

      <AddProviderDialog
        open={addDialog.open}
        title={addDialog.title}
        providerCategory={addDialog.providerCategory}
        onClose={() => setAddDialog({ open: false })}
        onSaved={() => {
          setAddDialog({ open: false });
          if (useRedux) {
            dispatch(fetchProviders({ page: 1, limit: 100, ...tabConfig.apiParams }));
          } else {
            fetchLocal();
          }
        }}
      />

      <ConfirmationDialog
        open={deactivateDialog.open}
        onClose={() => setDeactivateDialog({ open: false, providerId: null, providerName: '' })}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Provider"
        message={`Deactivate "${deactivateDialog.providerName}"? They will be marked inactive.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        confirmColor="warning"
        loading={actionLoading}
      />

      <EditProviderDialog
        open={editDialog.open}
        providerId={editDialog.providerId}
        providerName={editDialog.providerName}
        onClose={() => setEditDialog({ open: false, providerId: null, providerName: '' })}
        onSaved={() => {
          setExpandedRowId(null);
          if (!useRedux) fetchLocal();
        }}
      />
    </Box>
  );
};

export default ProvidersListPage;
