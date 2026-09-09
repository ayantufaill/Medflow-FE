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

/**
 * Resolve a flag's color using the live admin-defined flags from Redux (practiceInfo.patientFlags).
 * Falls back to the hardcoded PATIENT_FLAGS_DATA list, then to a neutral grey.
 *
 * @param {string} flagName - The flag name/label to look up
 * @param {Array}  globalFlags - practiceInfo?.patientFlags from Redux (pass [] if unavailable)
 * @returns {string} hex color
 */
export const resolveFlagColor = (flagName, globalFlags = []) => {
  if (!flagName) return '#cbd5e1';
  // 1. Check the live admin-defined list first
  const live = globalFlags.find(
    f => (f.name || f.label || '').toLowerCase() === String(flagName).toLowerCase()
  );
  if (live?.color) return live.color;
  // 2. Fall back to the hardcoded list
  return getFlagColor(flagName);
};
