import { Box, TextField, Typography, MenuItem } from '@mui/material';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, roundedSelectMenuProps } from '../../constants/styles';
import { formatPhoneInput } from '../patients/form-components/formatters';

/**
 * Format a raw digit string (as stored/passed around, e.g. "12065551234") for
 * read-only display, e.g. "+1 (206) 555-1234".
 */
export const formatPhoneNumber = (value) => {
  if (!value) return '';

  const digitsOnly = value.replace(/\D/g, '');

  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  } else if (digitsOnly.length <= 3) {
    return digitsOnly;
  } else if (digitsOnly.length <= 6) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  } else {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
};



/**
 * Shared low-level phone input: a read-only formatted box, or
 * react-phone-input-2's flag-dropdown + country search widget. No label —
 * callers own their own label layout (InlineFieldRow, FormInput, a table
 * cell, ...) and pass this in as the field body.
 *
 * `onChange` is called with an event-shaped object (`{ target: { value } }`),
 * matching form fields elsewhere — even though react-phone-input-2 itself
 * hands back the raw digit string directly, not an event.
 */
const PhoneNumberInput = ({ value, onChange, readOnly, placeholder, sx }) => {
  if (readOnly) {
    return (
      <TextField
        variant="outlined"
        size="small"
        fullWidth
        value={formatPhoneNumber(value || '')}
        placeholder={placeholder || '(XXX) XXX-XXXX'}
        InputProps={{ readOnly: true, inputProps: { title: value || '' } }}
        sx={sx}
      />
    );
  }

  // Edit mode - "US" prefix UI
  let currentVal = value || '';
  const digitsOnly = currentVal.replace(/\D/g, '');
  if (digitsOnly.length >= 11 && digitsOnly.startsWith('1')) {
    currentVal = digitsOnly.slice(1);
  }

  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      value={formatPhoneInput(currentVal)}
      placeholder={placeholder || '(XXX) XXX-XXXX'}
      onChange={(e) => {
        const formatted = formatPhoneInput(e.target.value);
        onChange({ target: { value: formatted } });
      }}
      InputProps={{
        startAdornment: (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1, pr: 1, borderRight: `1px solid ${COLORS.BORDER}` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.TEXT_SECONDARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none" }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <TextField
              select
              variant="standard"
              defaultValue="US"
              InputProps={{ disableUnderline: true }}
              SelectProps={{ IconComponent: () => null, MenuProps: roundedSelectMenuProps }}
              sx={{
                "& .MuiSelect-select": {
                  py: 0, pl: 0, pr: "0 !important",
                  fontFamily: "Inter", fontSize: fontSize.md, fontWeight: fontWeight.medium, color: COLORS.TEXT_BODY
                }
              }}
            >
              <MenuItem value="US">US</MenuItem>
            </TextField>
          </Box>
        ),
      }}
      sx={sx}
    />
  );
};

export default PhoneNumberInput;
