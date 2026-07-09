import { Box, TextField } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { InlineFieldRow, standardFieldSx } from './InlineField';
import { fontSize } from '../../constants/styles';

/**
 * Format a raw digit string (as stored/passed around, e.g. "12065551234") for
 * read-only display, e.g. "+1 (206) 555-1234".
 */
const formatPhoneNumber = (value) => {
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

// Only safe, non-geometric overrides. The library positions the flag icon with
// `position: absolute` + a fixed `margin-top`/`left` tuned to its own default height and
// padding — overriding height/padding/width on .form-control, .selected-flag,
// .flag-dropdown, or .country-list .country reintroduces the misaligned-flag bug this
// was fixed for (see the Contact Information / Emergency Contact dropdown fixes).
const phoneInputWrapperSx = {
  '& .react-tel-input': {
    fontFamily: 'Inter',
    width: '100%',
  },
  '& .react-tel-input .form-control': {
    width: '100%',
    fontFamily: 'Inter',
    fontSize: fontSize.base,
  },
  '& .react-tel-input .country-list': {
    fontFamily: 'Inter',
  },
};

/**
 * Shared phone field for the Patient Detail page (Contact Information,
 * Emergency Contact, Spouse Information, ...): a read-only formatted box in view
 * mode, react-phone-input-2's flag-dropdown + country search in edit mode.
 *
 * `onChange` is called with an event-shaped object (`{ target: { value } }`),
 * matching every other InlineFieldRow-based field on this page — even though
 * react-phone-input-2 itself hands back the raw digit string directly, not an
 * event (a mismatch that caused real bugs before this was centralized).
 */
const PhoneField = ({ value, label, isEditMode, onChange }) => {
  if (!isEditMode) {
    return (
      <InlineFieldRow
        label={label}
        input={
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={formatPhoneNumber(value || '')}
            placeholder="(XXX) XXX-XXXX"
            InputProps={{ readOnly: true, inputProps: { title: value || '' } }}
            sx={{ ...standardFieldSx, minWidth: 0 }}
          />
        }
      />
    );
  }

  return (
    <InlineFieldRow
      label={label}
      input={
        <Box sx={phoneInputWrapperSx}>
          <PhoneInput
            country="us"
            value={value || ''}
            onChange={(rawValue) => onChange({ target: { value: rawValue } })}
            enableSearch
            searchPlaceholder="Search"
            specialLabel=""
          />
        </Box>
      }
    />
  );
};

export default PhoneField;
