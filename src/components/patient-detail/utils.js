/**
 * Shared helpers for patient-detail components.
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return '-';
  }
}

export function computeAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  try {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  } catch {
    return null;
  }
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
