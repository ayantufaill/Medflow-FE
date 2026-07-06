import { Box, Select, MenuItem, FormControlLabel, Checkbox, IconButton, Tooltip } from '@mui/material';
import { Refresh as RefreshIcon, FilterAltOff } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { radius, fontSize } from '../../../constants/styles';

// Rounded pill Select — same shape as the operatory Select in AppointmentRightPanel.jsx.
const pillSelectSx = {
  minWidth: 140,
  height: '36px',
  fontFamily: 'Inter',
  fontSize: fontSize.md,
  color: COLORS.TEXT_BODY,
  backgroundColor: COLORS.SURFACE_CARD,
  borderRadius: radius.md,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.BORDER },
  '& .MuiSelect-select': { py: '8px' },
};

// The dropdown popup MUI renders for a Select is a separate Paper/Menu that
// doesn't inherit the pill's rounded styling by default — this gives it the
// same rounded-card treatment used by the other popovers/menus in the app
// (see the slot-options Popover in OperatorySchedulePage.jsx).
const pillSelectMenuProps = {
  PaperProps: {
    sx: {
      mt: '4px',
      borderRadius: radius.md,
      border: `1px solid ${COLORS.BORDER}`,
      boxShadow: '0px 4px 20px rgba(0,0,0,0.12)',
      '& .MuiMenuItem-root': {
        fontFamily: 'Inter',
        fontSize: fontSize.md,
        color: COLORS.TEXT_BODY,
        '&.Mui-selected': {
          backgroundColor: COLORS.ACCENT_BG,
          '&:hover': { backgroundColor: COLORS.ACCENT_BG },
        },
        '&:hover': { backgroundColor: COLORS.SURFACE_HOVER },
      },
    },
  },
};

// Row 2 of PatientsListPage: Status / Gender / Provider filters, Sort By Name,
// and the Refresh / Reset-filters icon buttons.
const PatientFiltersBar = ({
  statusFilter,
  onStatusFilterChange,
  genderFilter,
  onGenderFilterChange,
  providerFilter,
  onProviderFilterChange,
  providerList,
  sortByName,
  onSortByNameChange,
  loading,
  onRefresh,
  onResetFilters,
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '14px', flexWrap: 'wrap' }}>
    <Select value={statusFilter} displayEmpty onChange={(e) => onStatusFilterChange(e.target.value)} sx={pillSelectSx} MenuProps={pillSelectMenuProps}>
      <MenuItem value="">All Status</MenuItem>
      <MenuItem value="active">Active</MenuItem>
      <MenuItem value="inactive">Inactive</MenuItem>
    </Select>

    <Select value={genderFilter} displayEmpty onChange={(e) => onGenderFilterChange(e.target.value)} sx={pillSelectSx} MenuProps={pillSelectMenuProps}>
      <MenuItem value="">All Gender</MenuItem>
      <MenuItem value="male">Male</MenuItem>
      <MenuItem value="female">Female</MenuItem>
      <MenuItem value="unknown">Unknown</MenuItem>
    </Select>

    <Select value={providerFilter} displayEmpty onChange={(e) => onProviderFilterChange(e.target.value)} sx={{ ...pillSelectSx, minWidth: 170 }} MenuProps={pillSelectMenuProps}>
      <MenuItem value="">All Providers</MenuItem>
      {providerList.map((p) => {
        const u = p.userId || p;
        const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || p.providerCode || `Provider ${p._id}`;
        return (
          <MenuItem key={p._id} value={p._id}>
            {name}
          </MenuItem>
        );
      })}
    </Select>

    <FormControlLabel
      control={<Checkbox checked={sortByName} onChange={(e) => onSortByNameChange(e.target.checked)} size="small" />}
      label="Sort By Name"
      sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_BODY } }}
    />

    <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center', ml: 'auto' }}>
      <Tooltip title="Refresh">
        <IconButton size="small" onClick={onRefresh} disabled={loading} sx={{ color: COLORS.TEXT_MUTED }}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Reset Filters">
        <IconButton size="small" onClick={onResetFilters} sx={{ color: COLORS.TEXT_MUTED }}>
          <FilterAltOff fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>
);

export default PatientFiltersBar;
