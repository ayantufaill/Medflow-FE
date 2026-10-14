// Preserve leading zeros and invalid characters for validation. Only ASCII
// lowercase letters are normalized; Unicode characters must not become valid IDs.
export const normalizePayerId = (value) =>
  String(value ?? '').replace(/[a-z]/g, (letter) => letter.toUpperCase());

export const getPayerIdError = (value, { allowIncomplete = false } = {}) => {
  if (!value && !allowIncomplete) return 'Payer ID is required';
  if (/[^A-Z0-9]/.test(value)) {
    return 'Payer ID can only contain letters and numbers, without spaces or special characters';
  }
  if (value.length > 10 || (!allowIncomplete && value.length < 3)) {
    return 'Payer ID must be between 3 and 10 characters';
  }
  return null;
};
