import { getGroupNameError, getGroupNumberError, normalizeGroupNumber } from './groupValidation';

test('normalizes group number while preserving leading zeroes', () => {
  expect(normalizeGroupNumber('  ab-001  ')).toBe('AB-001');
});

test('requires a valid group number and permits inner hyphens', () => {
  expect(getGroupNumberError('')).toBeTruthy();
  expect(getGroupNumberError('AB-001')).toBeNull();
  expect(getGroupNumberError('AB 001')).toBeTruthy();
  expect(getGroupNumberError('AB')).toBeTruthy();
});

test('requires a valid group name when a number is entered', () => {
  expect(getGroupNameError('')).toBeTruthy();
  expect(getGroupNameError('Blue Cross & Co., Inc')).toBeNull();
  expect(getGroupNameError('<script>')).toBeTruthy();
});
