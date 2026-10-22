import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { COLORS } from '../../constants/colors';

/**
 * Width and metrics for the field. Kept as constants so a blank placeholder
 * can be laid out with exactly the same geometry as a real input — a dash
 * rendered at the cell's far edge lines up with nothing.
 */
const FIELD_WIDTH = '100px';
/** px 0.75 + border + the "$" adornment and its margin. */
const TEXT_INSET = '18px';
/** Matches the small outlined field: py 0.5 + 12px line + 2px border. */
const FIELD_HEIGHT = '26px';

/**
 * Currency field, matching the CHARGE column in InvoiceModal.
 *
 * The key detail is that the "$" is a start adornment rather than part of the
 * value. Baking it into the value (`value={`$${amount}`}`) forces the user to
 * delete the symbol before typing a digit, because the field is controlled — the
 * stripped value is immediately re-rendered with the "$" back on the front.
 *
 * Values are stored as bare strings ("74.50"), so the parent handlers keep
 * receiving plain digits.
 *
 * `blank` renders an empty-state dash in the same footprint, so a column that
 * holds an input on one row and a dash on the next stays aligned.
 */
const CurrencyInput = ({ value, onChange, disabled = false, blank = false, sx, ...rest }) => {
  if (blank) {
    return (
      <Box
        sx={{
          boxSizing: 'border-box',
          width: FIELD_WIDTH,
          height: FIELD_HEIGHT,
          px: TEXT_INSET,
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Inter',
          fontSize: '12px',
          color: COLORS.TEXT_SECONDARY,
          ...sx,
        }}
      >
        —
      </Box>
    );
  }

  return (
    <TextField
      size="small"
      disabled={disabled}
      value={(value ?? '').toString().replace(/^\$/, '')}
      onChange={(e) => onChange?.(e.target.value)}
      InputProps={{
        startAdornment: (
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontSize: '12px',
              fontWeight: 600,
              color: '#09121f',
              mr: 0.5,
            }}
          >
            $
          </Typography>
        ),
      }}
      sx={{
        // InvoiceModal uses 80px, which is not enough once the adornment and
        // padding are accounted for: a four-figure amount ("1000.00") came up
        // against the limit and the input scrolled horizontally mid-edit.
        width: FIELD_WIDTH,
        '& .MuiInputBase-input': {
          py: 0.5,
          px: 0.75,
          fontSize: '12px',
        },
        ...sx,
      }}
      {...rest}
    />
  );
};

export default CurrencyInput;