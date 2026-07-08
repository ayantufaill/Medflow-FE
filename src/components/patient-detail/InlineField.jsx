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

export function StackedFieldRow({ label, value, placeholder, input, required = false, isEditMode = false, labelWidth = 130, ...rest }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `${labelWidth}px 1fr`, gap: 1.5, alignItems: 'center', mb: 1.25, width: '100%' }}>
      {label && (
        <Typography
          component="label"
          sx={{
            fontWeight: 600,
            fontSize: '0.75rem',
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
          {required && <span style={{ color: '#dc2626', marginLeft: '2px' }}>*</span>}
        </Typography>
      )}
      <Box sx={{ minWidth: 0, width: '100%' }}>
        {input ?? (
          <TextField
            variant="outlined"
            fullWidth
            value={value ?? ''}
            placeholder={placeholder}
            slotProps={{
              input: {
                readOnly: !isEditMode,
              }
            }}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 38,
                fontSize: '0.8rem',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                '& fieldset': {
                  borderColor: '#e2e8f0',
                },
                '&:hover fieldset': {
                  borderColor: '#cbd5e1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                },
              },
            }}
            {...rest}
          />
        )}
      </Box>
    </Box>
  );
}

export { standardFieldSx, labelSx, labelWidth };

