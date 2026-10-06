import { Box, Typography, TextField, Button, CircularProgress, Radio } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { COLORS } from '../../../../../constants/colors';
import { fontSize, fontWeight, radius, standardFieldSx } from '../../../../../constants/styles';
import { formatPhoneNumber } from '../../../../shared/PhoneNumberInput';

const ChooseNumberStep = ({
  areaCode,
  onAreaCodeChange,
  onSearch,
  searching,
  searchError,
  numbers,
  selectedNumber,
  onSelect,
  disabled,
}) => (
  <Box>
    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B', mb: 0.5 }}>
      Choose Your Number
    </Typography>
    <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 3 }}>
      Search by area code and pick the number patients will text your practice at.
    </Typography>

    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}
    >
      <Box sx={{ width: 200 }}>
        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, mb: 0.75 }}>
          Area Code
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="201"
          value={areaCode}
          onChange={(e) => onAreaCodeChange(e.target.value.replace(/\D/g, '').slice(0, 3))}
          error={Boolean(searchError)}
          disabled={disabled}
          inputProps={{ inputMode: 'numeric', maxLength: 3 }}
          sx={standardFieldSx}
        />
      </Box>
      <Button
        type="submit"
        variant="outlined"
        disabled={disabled || searching || areaCode.length !== 3}
        startIcon={searching ? <CircularProgress size={14} /> : <SearchIcon />}
        sx={{
          mt: '26px',
          height: 40,
          textTransform: 'none',
          borderRadius: radius.md,
          fontFamily: 'Inter',
          fontSize: fontSize.base,
          fontWeight: fontWeight.semibold,
        }}
      >
        {searching ? 'Searching...' : 'Search'}
      </Button>
    </Box>
    <Typography sx={{ fontSize: fontSize.sm, color: COLORS.STATUS_ERROR, mt: 0.5, minHeight: 16 }}>{searchError}</Typography>

    {numbers && (
      <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_SECONDARY, mb: 1 }}>
          Available Numbers
        </Typography>
        {numbers.length === 0 ? (
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
            No numbers are available for this area code. Try a nearby one.
          </Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
            {numbers.map((number) => {
              const selected = number === selectedNumber;
              return (
                <Box
                  key={number}
                  onClick={() => !disabled && onSelect(number)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.75,
                    cursor: disabled ? 'default' : 'pointer',
                    borderRadius: radius.md,
                    border: `1.2px solid ${selected ? COLORS.ACCENT : COLORS.BORDER}`,
                    bgcolor: selected ? COLORS.ACCENT_BG : COLORS.SURFACE_CARD,
                    transition: 'all 0.15s',
                    '&:hover': { borderColor: selected ? COLORS.ACCENT : COLORS.TEXT_MUTED },
                  }}
                >
                  <Radio size="small" checked={selected} disabled={disabled} sx={{ p: 0.5 }} />
                  <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>
                    {formatPhoneNumber(number)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    )}
  </Box>
);

export default ChooseNumberStep;
