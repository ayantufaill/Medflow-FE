import { Box, Typography, TextField } from '@mui/material';

const labelWidth = 200;

const standardFieldSx = {
  '& .MuiInput-root': { fontSize: '0.875rem' },
  '& .MuiInput-underline:before': { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.42)' },
  '& .MuiInput-underline:after': { borderBottomWidth: 1, borderBottomColor: 'primary.main' },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.87)' },
  '& .MuiInput-input': { minWidth: 0 },
  '& .MuiInput-input::placeholder': { opacity: 0.6, color: 'text.secondary' },
};

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
        py: 1.25,
        minHeight: 44,
      }}
    >
      <Typography
        component="label"
        sx={{
          fontWeight: 600,
          color: 'text.secondary',
          fontSize: '0.875rem',
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

export { standardFieldSx, labelWidth };
