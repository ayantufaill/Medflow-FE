export const normalizeGroupNumber = (value) => String(value ?? '').trim().toUpperCase();
export const normalizeGroupName = (value) => String(value ?? '').trim();

export const getGroupNumberError = (value) => {
  const number = normalizeGroupNumber(value);
  if (!number) return 'Group Number is required';
  if (number.length < 3 || number.length > 20) return 'Group Number must be 3 to 20 characters';
  if (!/^[A-Z0-9-]+$/.test(number) || number.startsWith('-') || number.endsWith('-') || number.includes('--')) {
    return 'Group Number may contain letters, numbers, and single inner hyphens';
  }
  return null;
};

export const getGroupNameError = (value) => {
  const name = normalizeGroupName(value);
  if (!name) return 'Group Name is required';
  if (name.length < 2 || name.length > 50) return 'Group Name must be 2 to 50 characters';
  if (!/^[A-Za-z0-9 .&,-]+$/.test(name)) return 'Group Name contains unsupported characters';
  return null;
};
