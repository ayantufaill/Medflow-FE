import { Box, Typography, TextField } from '@mui/material';
import { labelSx, standardFieldSx } from '../../constants/styles';

const labelWidth = 200;

/**
 * Inline field: label left (bold), underlined input right.
 * Uses grid for consistent alignment - all labels same width, all inputs align.
 */
export function InlineFieldRow({ label, value, placeholder, input, ...rest }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `${labelWidth}px 1fr`,
        gap: 1,
        alignItems: 'center',
        py: 0.75,
        minHeight: 36,
      }}
    >
      <Typography
        component="label"
        sx={{
          ...labelSx,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}:
      </Typography>
      <Box sx={{ minWidth: 0 }} title={value ?? ''}>
        {input ?? (
          <TextField
            variant="standard"
            fullWidth
            value={value ?? ''}
            placeholder={placeholder}
            InputProps={{
              readOnly: true,
              disableUnderline: false,
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

export { standardFieldSx, labelSx, labelWidth };
