import {
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { COLORS } from '../../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../../constants/styles';

const fieldSx = {
  backgroundColor: COLORS.SURFACE_INPUT,
  borderRadius: radius.md,
  '& .MuiInputBase-root': { fontSize: fontSize.base, height: 38 },
  '& fieldset': { borderColor: 'transparent' },
};

/**
 * Search bar for the plan master list.
 *
 * Payer is a separate filter from the free-text search because plan names
 * repeat heavily across payers ("Choice Plus", "PPO 500"), so searching by
 * name alone returns a list nobody can pick from. Narrow by payer first.
 */
const PlanMasterActionBar = ({
  search,
  onSearchChange,
  carrierId,
  onCarrierChange,
  unconfirmedOnly,
  onUnconfirmedOnlyChange,
  carriers = [],
  total,
}) => (
  <Box sx={{ mb: 2 }}>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
      <TextField
        size="small"
        placeholder="Search plans by name or group number"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        inputProps={{ 'aria-label': 'Search plans' }}
        data-testid="plan-master-search"
        sx={{ ...fieldSx, flex: 1, minWidth: 220 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, color: COLORS.TEXT_MUTED }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        select
        size="small"
        label="Payer"
        value={carrierId}
        onChange={(e) => onCarrierChange(e.target.value)}
        data-testid="plan-master-payer-filter"
        SelectProps={{ inputProps: { 'aria-label': 'Filter by payer' } }}
        sx={{ ...fieldSx, minWidth: 200 }}
      >
        <MenuItem value="">All payers</MenuItem>
        {carriers.map((carrier) => (
          <MenuItem key={carrier.id} value={carrier.id}>
            {carrier.name}
          </MenuItem>
        ))}
      </TextField>

      {/* The backend's `unconfirmedOnly` filter: plans whose COB fields are
          still defaults, or whose payment method is Unknown. This is the
          data-quality worklist — the plans most likely to produce a wrong
          secondary estimate. */}
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={!!unconfirmedOnly}
            onChange={(e) => onUnconfirmedOnlyChange(e.target.checked)}
            inputProps={{ 'aria-label': 'Only plans nobody has confirmed' }}
            data-testid="plan-master-unconfirmed-filter"
          />
        }
        label="Only unconfirmed"
        sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'Inter', fontSize: fontSize.base } }}
      />

      {total != null && (
        <Typography
          sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_MUTED, fontWeight: fontWeight.medium }}
        >
          {total} plan{total === 1 ? '' : 's'}
        </Typography>
      )}
    </Stack>
  </Box>
);

export default PlanMasterActionBar;
