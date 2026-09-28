import { Box, Typography, TextField } from '@mui/material';
import { standardFieldSx } from '../../constants/styles';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';

const labelWidth = 200; // kept for any remaining consumers of the old grid layout

/**
 * Inline field: uppercase gray label above a gray-bordered box input —
 * matches the New Patient Intake form's FormField + OutlinedInput, instead
 * of the old label-left/underlined-input row.
 */
export function InlineFieldRow({ label, value, placeholder, input, required, ...rest }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 0.75 }}>
      <Typography
        component="label"
        sx={{
          fontFamily: 'Inter',
          fontSize: fontSize.xs,
          fontWeight: fontWeight.semibold,
          color: COLORS.TEXT_SECONDARY,
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
        }}
      >
        {label}
        {required && (
          <Box component="span" sx={{ color: COLORS.ACCENT, ml: 0.5, fontWeight: "bold" }}>
            *
          </Box>
        )}
      </Typography>
      <Box title={value ?? ''}>
        {input ?? (
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={value ?? ''}
            placeholder={placeholder}
            InputProps={{
              readOnly: true,
              inputProps: { title: value ?? '' },
            }}
            sx={standardFieldSx}
            {...rest}
          />
        )}
      </Box>
    </Box>
  );
}

// Full-width tinted pill used to head off a nested address block ("Patient's
// Address", "Work Address") within a larger card, matching the rounded
// icon+label bar from Figma instead of a plain bold caption.
export function AddressSectionLabel({ icon: Icon, children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: COLORS.SURFACE_TINT,
        borderRadius: radius.md,
        px: 1.5,
        py: 1,
        mt: 2.5,
        mb: 1.5,
      }}
    >
      {Icon && <Icon sx={{ fontSize: 16, color: COLORS.TEXT_SECONDARY }} />}
      <Typography
        sx={{
          fontFamily: 'Inter',
          fontSize: fontSize.xs,
          fontWeight: fontWeight.semibold,
          color: COLORS.TEXT_SECONDARY,
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

export { standardFieldSx, labelWidth };
