import { formatDate as formatUtcDate, computeAge as computeUtcAge } from '../../../utils/dateUtils';

// Pure helpers shared by the patients list table (PatientsListPage + PatientRow).

export const getPatientInitials = (firstName, lastName) => {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  return 'P';
};

export const formatDate = (dateString) => {
  return formatUtcDate(dateString, 'MM/DD/YYYY');
};

export const computeAge = (dateOfBirth) => {
  const age = computeUtcAge(dateOfBirth);
  return age !== null && age !== undefined ? age : '-';
};

export const validatePhoneNumber = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.startsWith('1')) return true;
  return false;
};

export const validateDateOfBirth = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  return !isNaN(date.getTime()) && date <= now;
};
