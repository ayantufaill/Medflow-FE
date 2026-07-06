// Pure helpers shared by the patients list table (PatientsListPage + PatientRow).

export const getPatientInitials = (firstName, lastName) => {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  return 'P';
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try { return new Date(dateString).toLocaleDateString(); }
  catch { return '-'; }
};

export const computeAge = (dateOfBirth) => {
  if (!dateOfBirth) return '-';
  try {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  } catch {
    return '-';
  }
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
