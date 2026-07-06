import { Box, Checkbox, CircularProgress, IconButton, Tooltip, Button } from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
  PersonAdd as PersonAddIcon,
  Upload as UploadIcon,
  PersonOff as PersonOffIcon,
} from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { radius, fontSize, fontWeight } from '../../../constants/styles';

const actionButtonSx = {
  textTransform: 'none', borderRadius: radius.md,
  fontFamily: 'Inter', fontSize: fontSize.base, fontWeight: fontWeight.semibold,
};

// Row 1 of PatientsListPage: search box, select-all checkbox, and the
// Add / Import / Deactivate action buttons.
const PatientSearchActionsBar = ({
  search,
  onSearchChange,
  loading,
  allSelected,
  someSelected,
  onSelectAll,
  onAddPatient,
  onImportPatient,
  onDeactivateSelected,
  deactivateDisabled,
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '14px', flexWrap: 'wrap' }}>
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: '8px',
      flex: '1 1 280px', maxWidth: 420,
      backgroundColor: COLORS.SURFACE_INPUT,
      borderRadius: radius.md,
      px: '10px', py: '7px',
      border: '1.5px solid transparent',
      '&:focus-within': { borderColor: COLORS.ACCENT },
    }}>
      <SearchIcon sx={{ fontSize: '16px', color: COLORS.TEXT_MUTED, flexShrink: 0 }} />
      <Box
        component="input"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Patient Name"
        sx={{
          flex: 1, border: 'none', outline: 'none',
          backgroundColor: 'transparent',
          fontFamily: 'Inter', fontSize: fontSize.md, color: COLORS.TEXT_BODY,
          '&::placeholder': { color: COLORS.TEXT_MUTED },
        }}
      />
      {loading && search ? (
        <CircularProgress size={16} sx={{ color: COLORS.ACCENT, flexShrink: 0 }} />
      ) : search ? (
        <IconButton size="small" onClick={() => onSearchChange('')} aria-label="clear" sx={{ p: '2px' }}>
          <ClearIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      ) : null}
    </Box>
    <Tooltip title="Search help">
      <IconButton size="small" sx={{ color: COLORS.TEXT_MUTED }}><InfoIcon fontSize="small" /></IconButton>
    </Tooltip>

    <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', ml: 'auto', alignItems: 'center' }}>
      <Checkbox size="small" indeterminate={someSelected} checked={allSelected} onChange={onSelectAll} />
      <Button
        variant="contained"
        disableElevation
        startIcon={<PersonAddIcon sx={{ fontSize: '16px' }} />}
        onClick={onAddPatient}
        sx={{ ...actionButtonSx, backgroundColor: COLORS.ACCENT, '&:hover': { backgroundColor: COLORS.ACCENT_HOVER } }}
      >
        Add Patient
      </Button>
      <Button
        variant="contained"
        disableElevation
        startIcon={<UploadIcon sx={{ fontSize: '16px' }} />}
        onClick={onImportPatient}
        sx={{ ...actionButtonSx, backgroundColor: COLORS.ACCENT, '&:hover': { backgroundColor: COLORS.ACCENT_HOVER } }}
      >
        Import Patient
      </Button>
      <Button
        variant="contained"
        disableElevation
        startIcon={<PersonOffIcon sx={{ fontSize: '16px' }} />}
        disabled={deactivateDisabled}
        onClick={onDeactivateSelected}
        sx={{
          ...actionButtonSx,
          backgroundColor: COLORS.SURFACE_INPUT, color: COLORS.TEXT_MUTED, boxShadow: 'none',
          '&:hover': { backgroundColor: COLORS.SURFACE_INPUT, boxShadow: 'none' },
          '&.Mui-disabled': { backgroundColor: COLORS.SURFACE_INPUT, color: COLORS.TEXT_MUTED },
        }}
      >
        Deactivate Patient(s)
      </Button>
    </Box>
  </Box>
);

export default PatientSearchActionsBar;
