/**
 * CDT Category Helper Module
 * Classifies CDT procedure codes into 12 insurance categories
 * and computes coverage splits for invoices and claims.
 */

export const CATEGORIES_12 = {
  diagnostic: { name: 'Diagnostic', defaultPct: 100, range: [0, 999] },
  preventative: { name: 'Preventative', defaultPct: 100, range: [1000, 1999] },
  restorative: { name: 'Restorative', defaultPct: 80, range: [2000, 2999] },
  endodontics: { name: 'Endodontics', defaultPct: 80, range: [3000, 3999] },
  periodontics: { name: 'Periodontics', defaultPct: 80, range: [4000, 4999] },
  prosthodonticsRemovable: { name: 'Prosthodontics, Removable', defaultPct: 50, range: [5000, 5899] },
  maxillofacialProsthetics: { name: 'Maxillofacial Prosthetics', defaultPct: 50, range: [5900, 5999] },
  implantServices: { name: 'Implant Services', defaultPct: 50, range: [6000, 6199] },
  prosthodonticsFixed: { name: 'Prosthodontics, Fixed', defaultPct: 50, range: [6200, 6999] },
  oralSurgery: { name: 'Oral & Maxillofacial Surgery', defaultPct: 50, range: [7000, 7999] },
  orthodontics: { name: 'Orthodontics', defaultPct: 50, range: [8000, 8999] },
  adjunctGeneral: { name: 'Adjunctive General Services', defaultPct: 80, range: [9000, 9999] },
};

/**
 * Classify a CDT procedure code into one of the 12 categories
 */
export const getCategoryByCdtCode = (code = '') => {
  const clean = String(code).toUpperCase().trim();
  const numMatch = clean.match(/\d+/);
  if (!numMatch) return 'restorative';
  const num = parseInt(numMatch[0], 10);

  if (num < 1000) return 'diagnostic';
  if (num < 2000) return 'preventative';
  if (num < 3000) return 'restorative';
  if (num < 4000) return 'endodontics';
  if (num < 5000) return 'periodontics';
  if (num < 5900) return 'prosthodonticsRemovable';
  if (num < 6000) return 'maxillofacialProsthetics';
  if (num < 6200) return 'implantServices';
  if (num < 7000) return 'prosthodonticsFixed';
  if (num < 8000) return 'oralSurgery';
  if (num < 9000) return 'orthodontics';
  return 'adjunctGeneral';
};

/**
 * Normalizes category keys for map lookups
 */
export const normalizeCatKey = (key = '') => {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, '');
};

/**
 * Extract category coverage percentage from patient insurance coverage table
 */
export const getPatientCategoryCoverage = (categoryKey, coverageTable) => {
  if (!coverageTable) return null;
  const targetNorm = normalizeCatKey(categoryKey);

  if (Array.isArray(coverageTable)) {
    for (const item of coverageTable) {
      if (item && typeof item === 'object') {
        const catName = item.category || item.title || item.label || item.name;
        if (catName && normalizeCatKey(catName) === targetNorm && typeof item.coverage === 'number') {
          return item.coverage;
        }
      }
    }
  } else if (typeof coverageTable === 'object') {
    for (const [key, value] of Object.entries(coverageTable)) {
      if (normalizeCatKey(key) === targetNorm && typeof value === 'number') {
        return value;
      }
    }
  }
  return null;
};

/**
 * Calculate Insurance Portion, Patient Portion, and Total Balance
 */
export const calculatePortionsForCategory = ({
  charge = 0,
  writeoff = 0,
  code = '',
  dbi = false,
  coverageTable = null,
  explicitPct = null,
}) => {
  const owed = Math.max(0, charge - writeoff);
  if (dbi) {
    return {
      insPortion: 0,
      ptPortion: owed,
      balance: charge,
      coveragePct: explicitPct,
      categoryKey: getCategoryByCdtCode(code),
    };
  }

  const categoryKey = getCategoryByCdtCode(code);
  const patientPct = getPatientCategoryCoverage(categoryKey, coverageTable);
  const defaultPct = 100;

  const pct = explicitPct !== null && explicitPct !== undefined
    ? explicitPct
    : (patientPct !== null ? patientPct : defaultPct);

  const insVal = Math.round((owed * pct) / 100 * 100) / 100;
  const ptVal = Math.max(0, Math.round((owed - insVal) * 100) / 100);

  return {
    insPortion: insVal,
    ptPortion: ptVal,
    balance: charge,
    coveragePct: pct,
    categoryKey,
  };
};
