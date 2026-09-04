import { formatDate as formatUtcDate, computeAge as computeUtcAge } from '../../utils/dateUtils';

/**
 * Shared helpers for patient-detail components.
 */
export function formatDate(dateString) {
  return formatUtcDate(dateString, 'MM/DD/YYYY');
}

export function computeAge(dateOfBirth) {
  return computeUtcAge(dateOfBirth);
}

export function formatGender(gender) {
  if (!gender) return '-';
  return gender
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function getInitials(firstName, lastName) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  return 'P';
}
