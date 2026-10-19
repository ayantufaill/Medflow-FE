import { monthMap } from './coverageConstants';
import { formatDateForPayload } from '../../../utils/dateUtils';

// A "Copay/Fixed Plan" prices each code off its flat plan portion rather than a
// percentage, so its coverage tables must not persist coverage percentages.
export const isFixedBenefitPlan = (coverageType) =>
  ['flat', 'copay'].includes(String(coverageType || '').toLowerCase().trim());

const stripCoveragePercent = (items) =>
  (items || []).map((item) => {
    if (!item || typeof item !== 'object' || !('coverage' in item)) return item;
    const rest = { ...item };
    delete rest.coverage;
    return rest;
  });

export const sanitizeCoverageForType = (
  coverageCategoryData,
  coverageBookData,
  coverageType,
) => {
  if (!isFixedBenefitPlan(coverageType)) {
    return { coverageCategoryData, coverageBookData };
  }
  return {
    coverageCategoryData: Object.fromEntries(
      Object.entries(coverageCategoryData || {}).map(([key, items]) => [key, stripCoveragePercent(items)]),
    ),
    coverageBookData: stripCoveragePercent(coverageBookData),
  };
};

export const buildCoveragePayload = (formData, coverageBookData, coverageCategoryData) => {
  const renewalMonthNum = monthMap[formData.renewalMonth] || 1;
  const sanitized = sanitizeCoverageForType(coverageCategoryData, coverageBookData, formData.coverageType);

  const indMaxVal = formData.coverage?.individual?.annualMax;
  const indUsedVal = formData.coverage?.individual?.usedAmount;
  const parsedIndMax = indMaxVal != null && indMaxVal !== '' ? parseFloat(String(indMaxVal).replace(/[^0-9.-]+/g, "")) : undefined;
  const parsedIndUsed = indUsedVal != null && indUsedVal !== '' ? parseFloat(String(indUsedVal).replace(/[^0-9.-]+/g, "")) : undefined;

  return {
    insuranceCompanyId: String(formData.insuranceCompanyId || ''),
    policyNumber: formData.subscriber.subscriberId,
    groupNumber: formData.groupNumber || undefined,
    groupName: formData.groupName || undefined,
    insurancePlanName: formData.insurancePlan?.trim() || undefined,
    employerName: formData.employerName?.trim() || null,
    employerId: formData.employerId || null,
    subscriberName: formData.subscriber.name,
    subscriberDateOfBirth: formatDateForPayload(formData.subscriber.dateOfBirth),
    relationshipToPatient: formData.subscriber.relationship.toLowerCase(),
    effectiveDate: formatDateForPayload(formData.policyStarted),
    expirationDate: formData.policyEnds ? formatDateForPayload(formData.policyEnds) : undefined,
    deductibleAmount: parseFloat(formData.deductibles[0]?.individual?.replace(/[^0-9.-]+/g, "")) || 0,
    individualAnnualMax: !isNaN(parsedIndMax) ? parsedIndMax : undefined,
    usedAmount: !isNaN(parsedIndUsed) ? parsedIndUsed : undefined,

    // Advanced Dentistry Fields
    deductiblesGrid: formData.deductibles,
    coverageLimits: formData.coverage,
    coverageCategoryTable: Object.entries(sanitized.coverageCategoryData || {}).map(([key, items]) => ({ category: key, items })),
    coverageBookData: sanitized.coverageBookData,
    planFeeGuide: formData.planFeeGuide,
    providersPlanFeeGuides: formData.providersPlanFeeGuides || [],
    coverageType: formData.coverageType,
    subscriberSsn: formData.subscriber.ssn || undefined,
    renewalMonth: renewalMonthNum,
    assignmentOfBenefits: formData.assignmentOfBenefits.toString(),
    honorWriteOff: formData.honorWriteOff,

    // Notes
    policyNotes: formData.policyNotes || undefined,
    eligibilityPolicyNotes: formData.eligibilityPolicyNotes || undefined,
    insurancePlanNotes: formData.insurancePlanNotes || undefined
  };
};
