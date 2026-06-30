import { monthMap } from './coverageConstants';

export const buildCoveragePayload = (formData, coverageBookData, coverageCategoryData) => {
  const renewalMonthNum = monthMap[formData.renewalMonth] || 1;

  return {
    insuranceCompanyId: String(formData.insuranceCompanyId || '1'),
    policyNumber: formData.subscriber.subscriberId,
    groupNumber: formData.groupNumber || undefined,
    groupName: formData.groupName || undefined,
    subscriberName: formData.subscriber.name,
    subscriberDateOfBirth: new Date(formData.subscriber.dateOfBirth).toISOString(),
    relationshipToPatient: formData.subscriber.relationship.toLowerCase(),
    insuranceType: 'primary', // Hardcoded as primary for initial coverage
    effectiveDate: new Date(formData.policyStarted).toISOString(),
    expirationDate: formData.policyEnds ? new Date(formData.policyEnds).toISOString() : undefined,
    deductibleAmount: parseFloat(formData.deductibles[0]?.individual?.replace(/[^0-9.-]+/g, "")) || 0,

    // Advanced Dentistry Fields
    deductiblesGrid: formData.deductibles,
    coverageLimits: formData.coverage,
    coverageCategoryTable: Object.entries(coverageCategoryData || {}).map(([key, items]) => ({ category: key, items })),
    coverageBookData: coverageBookData,
    planFeeGuide: formData.planFeeGuide,
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
