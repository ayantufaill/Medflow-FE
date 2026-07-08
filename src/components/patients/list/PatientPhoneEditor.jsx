import { TextField } from '@mui/material';

// Keys allowed through the digit-only filter below — anything that isn't a
// digit but is needed for basic text-field navigation/editing.
const NON_DIGIT_KEYS_ALLOWED = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];

// US phone numbers are stored as either 10 digits, or 11 digits with a
// leading "1" country code — this editor enforces that shape as the user types
// rather than validating after the fact, so typos are caught immediately.
const isCompletePhoneNumber = (digits) => digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));

const PatientPhoneEditor = ({ phoneDraft, onPhoneDraftChange, fieldSx, inputPropsSx }) => {
  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (digits.length > 11) return; // hard cap — never store more than 11 digits
    if (digits.length === 11 && !digits.startsWith('1')) return; // 11th digit must be the "1" country code
    onPhoneDraftChange(digits);
  };

  const handleKeyDown = (e) => {
    if (!/\d/.test(e.key) && !NON_DIGIT_KEYS_ALLOWED.includes(e.key)) e.preventDefault();
  };

  const hasCountryCode = phoneDraft.length === 11 && phoneDraft.startsWith('1');

  return (
    <TextField
      size="small" autoFocus fullWidth
      value={phoneDraft}
      placeholder="1234567890 or 11234567890"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
      error={phoneDraft.length > 0 && !isCompletePhoneNumber(phoneDraft)}
      helperText={phoneDraft.length > 0
        ? (hasCountryCode ? 'Valid: 1 country code included' : `${phoneDraft.length}/10 or 11 digits`)
        : ''}
      sx={fieldSx}
      inputProps={{ maxLength: 11, inputMode: 'numeric', pattern: '[0-9]*', ...inputPropsSx }}
    />
  );
};

export default PatientPhoneEditor;
