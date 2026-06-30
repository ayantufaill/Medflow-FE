export const formatPhoneNumber = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export const getProcedureType = (codeStr) => {
  if (!codeStr || typeof codeStr !== 'string') return 'Other';
  const code = codeStr.toUpperCase();
  if (code.startsWith('D') || code.startsWith('C')) {
    const num = parseInt(code.substring(1), 10);
    if (!isNaN(num)) {
      if (num >= 100 && num <= 999) return 'Diagnostic';
      if (num >= 1000 && num <= 1999) return 'Preventive';
      if (num >= 2000 && num <= 2999) return 'Restorative';
      if (num >= 3000 && num <= 3999) return 'Endodontics';
      if (num >= 4000 && num <= 4999) return 'Periodontics';
      if (num >= 5000 && num <= 5899) return 'Prosthodontics, removable';
      if (num >= 5900 && num <= 5999) return 'Maxillofacial prosthetics';
      if (num >= 6000 && num <= 6199) return 'Implant services';
      if (num >= 6200 && num <= 6999) return 'Prosthodontics, fixed';
      if (num >= 7000 && num <= 7999) return 'Oral & maxillofacial surgery';
      if (num >= 8000 && num <= 8999) return 'Orthodontics';
      if (num >= 9000 && num <= 9999) return 'Adjunctive general services';
    }
  }
  return 'Other';
};
