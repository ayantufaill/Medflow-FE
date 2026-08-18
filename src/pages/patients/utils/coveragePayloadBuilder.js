import { monthMap } from './coverageConstants';

export const buildCoveragePayload = (formData, coverageBookData, coverageCategoryData) => {
  const renewalMonthNum = monthMap[formData.renewalMonth] || 1;

  const indMaxVal = formData.coverage?.individual?.annualMax;
  const indUsedVal = formData.coverage?.individual?.usedAmount;
  const parsedIndMax = indMaxVal != null && indMaxVal !== '' ? parseFloat(String(indMaxVal).replace(/[^0-9.-]+/g, "")) : undefined;
  const parsedIndUsed = indUsedVal != null && indUsedVal !== '' ? parseFloat(String(indUsedVal).replace(/[^0-9.-]+/g, "")) : undefined;

  return {
    insuranceCompanyId: String(formData.insuranceCompanyId || '1'),
    policyNumber: formData.subscriber.subscriberId,
    groupNumber: formData.groupNumber || undefined,
    groupName: formData.groupName || undefined,
    subscriberName: formData.subscriber.name,
    subscriberDateOfBirth: new Date(formData.subscriber.dateOfBirth).toISOString(),
    relationshipToPatient: formData.subscriber.relationship.toLowerCase(),
    effectiveDate: new Date(formData.policyStarted).toISOString(),
    expirationDate: formData.policyEnds ? new Date(formData.policyEnds).toISOString() : undefined,
    deductibleAmount: parseFloat(formData.deductibles[0]?.individual?.replace(/[^0-9.-]+/g, "")) || 0,
    individualAnnualMax: !isNaN(parsedIndMax) ? parsedIndMax : undefined,
    usedAmount: !isNaN(parsedIndUsed) ? parsedIndUsed : undefined,

    // Advanced Dentistry Fields
    deductiblesGrid: formData.deductibles,
    coverageLimits: formData.coverage,
    coverageCategoryTable: Object.entries(coverageCategoryData || {}).map(([key, items]) => ({ category: key, items })),
    coverageBookData: coverageBookData,
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
