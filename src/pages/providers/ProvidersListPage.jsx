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
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight } from '../../constants/styles';
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

// Import new modular UI components
import ProvidersHeaderTabs from '../../components/providers/ProvidersHeaderTabs';
import ProvidersFilterBar from '../../components/providers/ProvidersFilterBar';
import ProvidersTable from '../../components/providers/ProvidersTable';
import InactiveProvidersView from '../../components/providers/InactiveProvidersView';

// ─── Tab config ──────────────────────────────────────────────────────────────

const SUB_TABS = [
  {
    label: 'Active Providers',
    heading: 'InOffice Providers:',
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

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', gap: 1, py: 0.4, alignItems: 'baseline' }}>
    <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED, whiteSpace: 'nowrap', flexShrink: 0 }}>
      {label}:
    </Typography>
    <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semibold, wordBreak: 'break-word' }}>
      {value || '—'}
    </Typography>
  </Box>
);

const ExpandedDetails = ({ provider, onDeactivate, onActivate, actionLoading }) => {
  const addr = provider.address || {};
  const userId = provider.userId || {};

  return (
    <Box sx={{ px: 3, pb: 3, pt: 1.5, backgroundColor: COLORS.SURFACE_HOVER }}>
      <Box sx={{ display: 'flex', width: '100%', gap: 0 }}>
        {/* Column 1: Personal Info */}
        <Box sx={{ flex: 1, pr: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <InfoRow label="Title" value={provider.title} />
            <InfoRow label="Middle Name" value={userId.middleName || provider.middleName} />
            <InfoRow label="Suffix Title" value={provider.suffixTitle || provider.suffix} />
            <InfoRow label="Preferred Name" value={provider.preferredName || userId.preferredName} />
            <Box sx={{ display: 'flex', gap: 1, py: 0.4, alignItems: 'center' }}>
              <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED, whiteSpace: 'nowrap', flexShrink: 0 }}>
                Color:
              </Typography>
              {provider.color ? (
                <Box sx={{ width: 14, height: 14, borderRadius: '2px', backgroundColor: provider.color, border: '1px solid rgba(0,0,0,0.15)' }} />
              ) : (
                <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semibold }}>—</Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Column 2: Contact Info */}
        <Box sx={{ flex: 1, px: 3, borderLeft: `1px solid ${COLORS.BORDER_LIGHT}` }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <InfoRow label="Email" value={userId.email || provider.email} />
            <InfoRow label="Mobile Phone" value={provider.phone || userId.phone || provider.mobilePhone} />
            <InfoRow label="Home Phone" value={provider.homePhone || userId.homePhone} />
            <InfoRow label="Office Phone" value={provider.officePhone || provider.workPhone} />
          </Box>
        </Box>

        {/* Column 3: Professional Info 1 */}
        <Box sx={{ flex: 1, px: 3, borderLeft: `1px solid ${COLORS.BORDER_LIGHT}` }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <InfoRow label="Specialty" value={formatSpecialty(provider.specialty) === '-' ? '' : formatSpecialty(provider.specialty)} />
            <InfoRow label="Organization Name" value={provider.organizationName} />
            <InfoRow label="NPI" value={provider.npiNumber} />
            <InfoRow label="License Number" value={provider.licenseNumber} />
          </Box>
        </Box>

        {/* Column 4: Professional Info 2 */}
        <Box sx={{ flex: 1, px: 3, borderLeft: `1px solid ${COLORS.BORDER_LIGHT}` }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <InfoRow label="Tax Number" value={provider.federalTaxId || provider.taxId || provider.federalTaxNumber} />
            <InfoRow label="Additional Provider ID" value={provider.additionalProviderId} />
            <InfoRow label="Signature on File" value={provider.signatureOnFile ? 'Yes' : provider.signatureOnFile === false ? 'No' : ''} />
            <InfoRow label="Description" value={provider.description} />
          </Box>
        </Box>

        {/* Column 5: Address Info */}
        <Box sx={{ flex: 1, pl: 3, borderLeft: `1px solid ${COLORS.BORDER_LIGHT}` }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <InfoRow label="Street Address" value={addr.street || addr.address1 || provider.streetAddress} />
            <InfoRow label="Additional Address" value={addr.additionalAddress || addr.address2} />
            <InfoRow label="City" value={addr.city || provider.city} />
            <InfoRow label="State" value={addr.state || provider.state} />
            <InfoRow label="Zip Code" value={addr.zipCode || addr.zip || provider.zipCode} />
            <InfoRow label="Country" value={addr.country || provider.country} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        {provider.isActive ? (
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => { e.stopPropagation(); onDeactivate(); }}
            disabled={actionLoading}
            sx={{
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '8px',
              px: 2.5,
              py: 0.6,
              color: '#DC2626',
              borderColor: '#FECACA',
              bgcolor: '#FEF2F2',
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#FEE2E2',
                borderColor: '#F87171',
                boxShadow: 'none',
              },
              '&.Mui-disabled': {
                opacity: 0.45,
                borderColor: '#FECACA',
                color: '#DC2626',
              },
            }}
          >
            Deactivate
          </Button>
        ) : (
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => { e.stopPropagation(); onActivate(); }}
            disabled={actionLoading}
            sx={{
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '8px',
              px: 2.5,
              py: 0.6,
              color: '#16A34A',
              borderColor: '#BBF7D0',
              bgcolor: '#F0FDF4',
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#DCFCE7',
                borderColor: '#4ADE80',
                boxShadow: 'none',
              },
              '&.Mui-disabled': {
                opacity: 0.45,
                borderColor: '#BBF7D0',
                color: '#16A34A',
              },
            }}
          >
            Activate
          </Button>
        )}
      </Box>
    </Box>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [draggedId, setDraggedId] = useState(null);
  const [reorderedProviders, setReorderedProviders] = useState(null);
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

  // When drag reorder is active, use the reordered list; otherwise use filtered
  const baseProviders = (dragEnabled && reorderedProviders) ? reorderedProviders : filteredProviders;
  const displayedProviders = baseProviders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalProviders = baseProviders.length;

  // ─── Handlers ────────────────────────────────────────────────

  // Drag & Drop handlers
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Initialize reordered list from current filtered set if not already set
    if (!reorderedProviders) {
      setReorderedProviders([...filteredProviders]);
    }
  };

  const handleDragOver = (e, overId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!draggedId || draggedId === overId || !reorderedProviders) return;

    const dragIndex = reorderedProviders.findIndex((p) => (p._id || p.id) === draggedId);
    const overIndex = reorderedProviders.findIndex((p) => (p._id || p.id) === overId);
    if (dragIndex === -1 || overIndex === -1 || dragIndex === overIndex) return;

    const updated = [...reorderedProviders];
    const [draggedItem] = updated.splice(dragIndex, 1);
    updated.splice(overIndex, 0, draggedItem);
    setReorderedProviders(updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  // Clear reorder when drag is disabled
  useEffect(() => {
    if (!dragEnabled) {
      setReorderedProviders(null);
      setDraggedId(null);
    }
  }, [dragEnabled]);

  const handleSubTabChange = (_, newValue) => {
    setActiveSubTab(newValue);
    setPage(0);
    setSearch('');
    setSpecialtyFilter('');
    setLocalProviders([]);
    setLocalError('');
    setExpandedRowId(null);
    setReorderedProviders(null);
    setDraggedId(null);
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
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 3, backgroundColor: '#ffffff', border: '1px solid #E5E7EB', boxShadow: '0px 2px 4px rgba(0,0,0,0.02)' }}>
      {(error || localError) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => { setError(''); setLocalError(''); }}>
          {error || localError}
        </Alert>
      )}

      {/* Sub-tabs Component */}
      <ProvidersHeaderTabs
        activeSubTab={activeSubTab}
        handleSubTabChange={handleSubTabChange}
        SUB_TABS={SUB_TABS}
      />

      {tabConfig.inactive ? (
        <InactiveProvidersView
          actionLoading={actionLoading}
          onActivate={(provider) => handleToggleActive(provider)}
          onEdit={setEditDialog}
          getCellValue={getCellValue}
          VerifiedBadge={VerifiedBadge}
          getProviderName={getProviderName}
        />
      ) : (
        <>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '18px', lineHeight: '32px', color: '#111', mb: '24px' }}>
            {tabConfig.heading.replace(':', '')}
          </Typography>

          {/* Filter Bar Component */}
          <ProvidersFilterBar
            tabConfig={tabConfig}
            search={search}
            setSearch={setSearch}
            setPage={setPage}
            specialtyFilter={specialtyFilter}
            setSpecialtyFilter={setSpecialtyFilter}
            SPECIALTIES={SPECIALTIES}
            dragEnabled={dragEnabled}
            setDragEnabled={setDragEnabled}
            setAddDialog={setAddDialog}
            useRedux={useRedux}
            fetchLocal={fetchLocal}
          />

          {/* Table Component */}
          <ProvidersTable
            loading={loading}
            displayedProviders={displayedProviders}
            tabConfig={tabConfig}
            dragEnabled={dragEnabled}
            draggedId={draggedId}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            expandedRowId={expandedRowId}
            setExpandedRowId={setExpandedRowId}
            getCellValue={getCellValue}
            VerifiedBadge={VerifiedBadge}
            handleToggleActive={handleToggleActive}
            setEditDialog={setEditDialog}
            actionLoading={actionLoading}
            getProviderName={getProviderName}
            ExpandedDetails={ExpandedDetails}
            onDeactivateConfirm={handleDeactivateConfirm}
          />

          {/* Pagination */}
          <TablePagination
            component="div"
            count={totalProviders}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{ borderTop: 'none', mt: 1 }}
          />
        </>
      )}
      {/* Dialogs */}
      {addDialog.open && (
        <AddProviderDialog
          open={addDialog.open}
          onClose={() => setAddDialog({ open: false })}
          title={addDialog.title}
          providerCategory={addDialog.providerCategory}
          onSuccess={() => {
            if (!useRedux) fetchLocal();
            else {
              dispatch(fetchProviders({ page: 1, limit: 100, ...tabConfig.apiParams }));
            }
          }}
        />
      )}

      {editDialog.open && (
        <EditProviderDialog
          open={editDialog.open}
          providerId={editDialog.providerId}
          providerName={editDialog.providerName}
          onClose={() => setEditDialog({ open: false, providerId: null, providerName: '' })}
          onSuccess={() => {
            setExpandedRowId(null);
            if (!useRedux) fetchLocal();
            else {
              dispatch(fetchProviders({ page: 1, limit: 100, ...tabConfig.apiParams }));
            }
          }}
        />
      )}

      <ConfirmationDialog
        open={deactivateDialog.open}
        title="Confirm Deactivation"
        content={`Are you sure you want to deactivate ${deactivateDialog.providerName}?`}
        onConfirm={handleDeactivateConfirm}
        onCancel={() => setDeactivateDialog({ open: false, providerId: null, providerName: '' })}
        confirmText="Deactivate"
        confirmColor="error"
        loading={actionLoading}
      />
    </Paper>
  );
};

export default ProvidersListPage;
