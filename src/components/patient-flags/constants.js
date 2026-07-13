export const PATIENT_FLAGS_DATA = [
  { color: '#94bc74', label: 'appointment_reminder' },
  { color: '#7dab9f', label: 'alert' },
  { color: '#5e5ba8', label: 'old patient' },
  { color: '#bc6c73', label: 'family & friends' },
  { color: '#d9975b', label: 'late payment' },
  { color: '#88b7d6', label: 'needs special care' },
  { color: '#a6f272', label: 'TDS Member' },
  { color: '#eef681', label: 'Botox/Filler' },
  { color: '#cf5dbd', label: 'Bioclear Patient' },
  { color: '#4d39c0', label: 'Ortho Patient' },
  { color: '#d3562f', label: 'Balance Owed' },
];

export const BILLING_FLAGS = PATIENT_FLAGS_DATA.filter(flag => 
  ['alert', 'old patient', 'family & friends', 'late payment', 'needs special care', 'TDS Member', 'Botox/Filler'].includes(flag.label)
);

export const PATIENT_FLAGS = PATIENT_FLAGS_DATA.filter(flag => 
  ['Bioclear Patient', 'Ortho Patient', 'Balance Owed'].includes(flag.label)
);

export const getFlagColor = (label) => {
  const flag = PATIENT_FLAGS_DATA.find(f => f.label === label);
  return flag ? flag.color : '#cbd5e1';
};
