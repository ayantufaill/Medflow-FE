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

/**
 * Crown procedures that downgrade to a cheaper alternative when the downgrade
 * flag is checked. Keyed by the procedure's own CDT code.
 */
export const DOWNGRADE_CODE_MAP = {
  D2391: 'D2140',
  D2392: 'D2150',
  D2393: 'D2160',
  D2394: 'D2161',
  D2740: 'D2791',
  D2750: 'D2790',
};

/** Returns the auto-assigned downgrade code for a procedure, or '' if none. */
export const getDowngradeCode = (code) =>
  DOWNGRADE_CODE_MAP[String(code || '').trim().toUpperCase()] || '';

// ── Coverage amount helpers ───────────────────────────────────────────────────
// Lifted out of PatientInsuranceTabContent so the coverage list and the family
// coverage matrix read benefit amounts the exact same way — the two views sit
// side by side in the same tab strip, so any drift between them is visible to
// the user as two different dollar figures for one policy.

/** Coerce "$1,740.00" | 1740 | null into a number (or null when unusable). */
export const parseAmount = (val) => {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  const cleaned = String(val).replace(/[^0-9.-]+/g, '');
  if (!cleaned) return null;
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

/**
 * Pull the individual used/annual-max pair off a coverage record. `usage`
 * (from the eligibility-check redux cache) wins when present; coverageLimits
 * is next, arriving as either an object or a JSON string depending on the
 * endpoint; legacy records fall back to their flat copay/deductible columns.
 */
export const getCoverageAmounts = (ins, usage) => {
  let coverageLimits = ins?.coverageLimits;
  if (typeof coverageLimits === 'string') {
    try {
      coverageLimits = JSON.parse(coverageLimits);
    } catch {
      coverageLimits = null;
    }
  }
  const limitsInd = coverageLimits?.individual;

  const rawUsed =
    usage?.usedAmount ??
    limitsInd?.usedAmount ??
    ins?.usedAmount ??
    ins?.copayAmount;

  const rawMax =
    usage?.annualMax ??
    limitsInd?.annualMax ??
    ins?.individualAnnualMax ??
    ins?.deductibleAmount;

  const usedAmount = parseAmount(rawUsed) ?? 0;
  const maxAmount = parseAmount(rawMax) ?? 0;

  return { usedAmount, maxAmount };
};

/** Benefits still available on a policy; never negative (over-use shows as $0). */
export const getRemainingBenefits = (ins, usage) => {
  const { usedAmount, maxAmount } = getCoverageAmounts(ins, usage);
  return Math.max(maxAmount - usedAmount, 0);
};

/**
 * Identity of a *policy* rather than of a coverage row. Each family member owns
 * their own coverage record for the same employer policy, so the matrix groups
 * columns by carrier + group/plan instead of by record id.
 */
export const getPolicyKey = (ins, companyName = '') => {
  const companyId =
    (ins?.insuranceCompanyId && typeof ins.insuranceCompanyId === 'object'
      ? ins.insuranceCompanyId._id || ins.insuranceCompanyId.id
      : ins?.insuranceCompanyId) || companyName;
  const group = ins?.groupNumber || ins?.groupName || ins?.planName || ins?.employerName || '';
  return `${companyId}|${String(group).trim().toLowerCase()}`;
};

/** Column heading, e.g. "Lowe's Companies, Inc $2000 by Delta Dental". */
export const getPolicyLabel = (ins, companyName) => {
  const employer = ins?.employerName || ins?.groupName || ins?.planName?.split(' by ')[0] || companyName;
  const { maxAmount } = getCoverageAmounts(ins);
  const maxText = maxAmount ? ` $${Math.round(maxAmount).toLocaleString()}` : '';
  return `${employer}${maxText} by ${companyName}`;
};
