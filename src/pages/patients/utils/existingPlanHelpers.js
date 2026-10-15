import { monthMapReverse } from './coverageConstants';

/**
 * Helpers for re-using an insurance plan that is already set up on another
 * patient. The BE has no standalone "employer plan" record that carries benefits —
 * deductibles, coverage limits, category percentages and downgrades all live on
 * each patient's coverage meta — so the most recently saved coverage for a given
 * carrier + group is the best source of truth for a new patient on that group.
 */

const norm = (v) => String(v ?? '').trim().toLowerCase();

/** Coverage categories are persisted as [{ category, items }] but the UI edits an object map. */
export const coverageCategoryTableToMap = (table) => {
  if (Array.isArray(table) && table.length > 0 && table[0]?.category) {
    return table.reduce((acc, group) => {
      acc[group.category] = group.items;
      return acc;
    }, {});
  }
  // Older rows may already be stored in map form.
  if (table && !Array.isArray(table) && Object.keys(table).length > 0) return table;
  return null;
};

/** A coverage is only worth offering as a plan source if it has benefit data to copy. */
const hasBenefitData = (ins) =>
  (ins.deductiblesGrid?.length ?? 0) > 0 ||
  Boolean(ins.coverageLimits) ||
  (ins.coverageCategoryTable?.length ?? 0) > 0 ||
  (ins.coverageBookData?.length ?? 0) > 0;

/**
 * Collapse every patient coverage into one search row per carrier + group, so the
 * carrier search can match on group name / number like a real plan lookup.
 * `excludeId` keeps the coverage being edited from being offered as its own source.
 */
export const buildExistingPlanOptions = (insurances = [], companies = [], excludeId) => {
  const byKey = new Map();

  insurances.forEach((ins) => {
    if ((ins._id || ins.id) === excludeId) return;
    // Without a group there is nothing plan-specific to match on.
    if (!ins.groupNumber && !ins.groupName) return;

    const carrierId = ins.insuranceCompanyId?._id || ins.insuranceCompanyId || '';
    const key = `${carrierId}|${norm(ins.groupNumber)}|${norm(ins.groupName)}`;
    const existing = byKey.get(key);

    // Prefer a row that actually has benefits, then the newest (PatPlanNum is sequential).
    const isBetter =
      !existing ||
      (hasBenefitData(ins) && !hasBenefitData(existing.sourceCoverage)) ||
      (hasBenefitData(ins) === hasBenefitData(existing.sourceCoverage) &&
        Number(ins._id) > Number(existing.sourceCoverage._id));
    if (!isBetter) return;

    const company = companies.find((c) => String(c._id || c.id) === String(carrierId));
    byKey.set(key, {
      _id: carrierId,
      carrierName: ins.insuranceCompanyId?.name || company?.name || '',
      payerId: ins.insuranceCompanyId?.payerId || company?.payerId || '',
      carrierPhone: company?.phone || '',
      payerAddress: company?.addressLine1 || company?.city || '',
      groupName: ins.groupName || '',
      groupNumber: ins.groupNumber || '',
      // The BE doesn't persist a plan name yet, so the carrier name is the best label.
      planName: ins.insuranceCompanyId?.name || company?.name || '',
      isExistingPlan: true,
      sourceCoverage: ins,
    });
  });

  return Array.from(byKey.values());
};

/**
 * Plan-level fields to copy from an existing coverage. Patient-specific usage
 * (deductible met amounts/dates, used maximums) is cleared — those belong to the
 * other patient and must not leak into this one's benefits.
 */
export const extractPlanBenefits = (ins) => {
  const benefits = {};

  if (ins.deductiblesGrid?.length) {
    benefits.deductibles = ins.deductiblesGrid.map((d) => ({ ...d, metAmount: '', metDate: '' }));
  }

  if (ins.coverageLimits && typeof ins.coverageLimits === 'object') {
    benefits.coverage = Object.fromEntries(
      Object.entries(ins.coverageLimits).map(([key, val]) => [
        key,
        val && typeof val === 'object' && !Array.isArray(val)
          ? { ...val, ...('usedAmount' in val ? { usedAmount: '' } : {}), ...('usedAmountDate' in val ? { usedAmountDate: '' } : {}) }
          : val,
      ]),
    );
  }

  if (ins.planFeeGuide) benefits.planFeeGuide = String(ins.planFeeGuide);
  if (ins.coverageType) benefits.coverageType = ins.coverageType;
  if (ins.renewalMonth && monthMapReverse[ins.renewalMonth]) benefits.renewalMonth = monthMapReverse[ins.renewalMonth];
  if (ins.assignmentOfBenefits) benefits.assignmentOfBenefits = parseInt(ins.assignmentOfBenefits, 10) || 1;
  if (ins.healthPlan != null) benefits.healthPlan = Boolean(ins.healthPlan);
  if (ins.honorWriteOff != null) benefits.honorWriteOff = Boolean(ins.honorWriteOff);
  if (ins.providersPlanFeeGuides?.length) benefits.providersPlanFeeGuides = ins.providersPlanFeeGuides;
  if (ins.insurancePlanNotes) benefits.insurancePlanNotes = ins.insurancePlanNotes;

  return {
    formFields: benefits,
    // Category percentages + downgrades and the coverage book are held outside formData.
    coverageCategoryData: coverageCategoryTableToMap(ins.coverageCategoryTable),
    coverageBookData: Array.isArray(ins.coverageBookData) && ins.coverageBookData.length ? ins.coverageBookData : null,
  };
};
