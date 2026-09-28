export const PATIENT_FLAGS_DATA = [
  { color: '#22c55e', label: 'Send appointment reminder earlier than scheduled time' },
  { color: '#22c55e', label: 'appointment_reminder' },
  { color: '#3b82f6', label: 'alert' },
  { color: '#8b5cf6', label: 'old patient' },
  { color: '#ef4444', label: 'family & friends' },
  { color: '#ef4444', label: 'late payment' },
  { color: '#3b82f6', label: 'needs special care' },
  { color: '#22c55e', label: 'TDS Member' },
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
  if (!label) return '#cbd5e1';
  const flag = PATIENT_FLAGS_DATA.find(
    f => (f.label || '').toLowerCase() === String(label).toLowerCase()
  );
  return flag ? flag.color : '#cbd5e1';
};

/**
 * Resolve a flag's color using:
 * 1. Live admin-defined flags from Redux (practiceInfo.patientFlags)
 * 2. Embedded color if the flag is an object ({ name, color })
 * 3. Fallback to default PATIENT_FLAGS_DATA list
 * 4. Fallback to neutral grey
 *
 * @param {string|object} flag - The flag name or object
 * @param {Array}         globalFlags - practiceInfo?.patientFlags from Redux (pass [] if unavailable)
 * @returns {string} hex color
 */
export const resolveFlagColor = (flag, globalFlags = []) => {
  if (!flag) return '#cbd5e1';
  const flagName = typeof flag === 'string' ? flag : (flag.name || flag.label || '');
  const objectColor = typeof flag === 'object' ? flag.color : null;

  // 1. Check the live admin-defined list first
  if (Array.isArray(globalFlags) && globalFlags.length > 0) {
    const live = globalFlags.find(
      f => (f.name || f.label || '').toLowerCase() === String(flagName).toLowerCase()
    );
    if (live?.color) return live.color;
  }

  // 2. If the flag object itself carries a color, preserve it
  if (objectColor) return objectColor;

  // 3. Fall back to the hardcoded list with updated admin colors
  return getFlagColor(flagName);
};
