export const mapClaimFields = (c, tab) => {
  const patCodes = [
    c?.patientCode ? String(c.patientCode).replace(/[()]/g, '').trim().toLowerCase() : null,
    c?.patient?.patientCode ? String(c.patient.patientCode).replace(/[()]/g, '').trim().toLowerCase() : null,
    c?.patientRefId ? String(c.patientRefId).trim().toLowerCase() : null,
    c?.patient?.patNum ? String(c.patient.patNum).trim().toLowerCase() : null,
    c?.patient?.PatNum ? String(c.patient.PatNum).trim().toLowerCase() : null,
  ].filter(Boolean);

  const isNotPatientCode = (val) => {
    if (val === null || val === undefined) return false;
    const str = String(val).trim();
    if (!str || str === '—' || str === '-' || str === 'undefined' || str === 'null') return false;
    const clean = str.replace(/[()]/g, '').trim().toLowerCase();
    return !patCodes.includes(clean);
  };

  const pickValid = (...candidates) => {
    for (const cand of candidates) {
      if (isNotPatientCode(cand)) return String(cand).trim();
    }
    return '';
  };

  const subscriberId = pickValid(
    c.subscriberId,
    c.subscriberDetails?.subscriberId,
    c.subscriberDetails?.memberId,
    c.subscriberDetails?.SubscriberID,
    c.subscriberNumber,
    c.policyNumber,
    c.meta?.subscriberId,
    c.meta?.policyNumber,
    c.inssub?.SubscriberID,
    c.inssub?.subscriberId,
    c.insurancePolicy?.policyNumber,
    c.insuranceSub?.subscriberId,
    c.patient?.subscriberId,
    c.patient?.insurance?.subscriberId,
    c.memberId
  );

  const memberId = pickValid(
    c.memberId,
    c.membershipNumber,
    c.membershipId,
    c.patient?.memberId,
    c.patient?.membershipNumber,
    c.membershipPlan?.membershipNumber,
    c.membershipPlan?.memberId,
    c.subscriberDetails?.memberId,
    c.subscriberDetails?.subscriberId,
    c.subscriberDetails?.SubscriberID,
    subscriberId
  );

  return {
    ...c,
    tab,
    patientName: c.patient
      ? `${c.patient.firstName} ${c.patient.lastName}`
      : "Unknown Patient",
    patientCode: c.patient ? `(${c.patient.patientCode})` : "",
    patientDob: c.patient?.dateOfBirth
      ? new Date(c.patient.dateOfBirth).toLocaleDateString()
      : (c.patientDob || ""),
    dob: c.patient?.dateOfBirth
      ? new Date(c.patient.dateOfBirth).toLocaleDateString()
      : (c.dob || c.patientDob || ""),
    memberId,
    subscriberId,
  hasMembershipPlan: Boolean(
    c.hasMembershipPlan ||
    c.isMembershipPlan ||
    c.patient?.hasMembershipPlan ||
    c.patient?.membershipPlan ||
    c.patient?.membership ||
    (Array.isArray(c.patient?.memberships) && c.patient.memberships.length > 0) ||
    c.membershipPlan ||
    c.membershipPlanId ||
    c.membershipNumber ||
    c.membershipId ||
    c.insuranceType === 'membership' ||
    c.planType === 'membership' ||
    (typeof c.planName === 'string' && c.planName.toLowerCase().includes('membership'))
  ),
  carrier: c.insuranceCompany?.name || c.carrier || "No Carrier",
  insuranceCompanyId:
    c.insuranceCompanyId?._id ||
    c.insuranceCompanyId?.id ||
    c.insuranceCompanyId ||
    c.insuranceCompany?._id ||
    c.insuranceCompany?.id ||
    null,
  subscriber:
    c.subscriberName ||
    (c.patient ? `${c.patient.firstName} ${c.patient.lastName}` : ""),
  subscriberFirstName:
    c.subscriberFirstName || c.patient?.firstName || "",
  subscriberLastName:
    c.subscriberLastName || c.patient?.lastName || "",
  subscriberNumber: subscriberId || c.subscriberNumber || c.policyNumber || memberId || "",
  subscriberDob:
    c.subscriberDob ||
    (c.patient?.dateOfBirth
      ? new Date(c.patient.dateOfBirth).toLocaleDateString()
      : ""),
  claimFormat: c.claimFormat || "Electronic",
  claimType: c.claimType || `${['Manual', 'Paper'].includes(c.claimFormat) ? "Manual" : "E-claim"} ${c.insuranceType ? c.insuranceType.charAt(0).toUpperCase() + c.insuranceType.slice(1) : "Primary"}`,
  claimNumber: c.claimNumber || c.claimCode || `#${c.id}`,
  dateOfService: c.dateOfService
    ? (typeof c.dateOfService === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(c.dateOfService) ? c.dateOfService : new Date(c.dateOfService).toLocaleDateString())
    : (c.procedures?.[0]?.dateOfService
        ? new Date(c.procedures[0].dateOfService).toLocaleDateString()
        : (c.dos || (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""))),
  dos: c.dateOfService
    ? (typeof c.dateOfService === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(c.dateOfService) ? c.dateOfService : new Date(c.dateOfService).toLocaleDateString())
    : (c.procedures?.[0]?.dateOfService
        ? new Date(c.procedures[0].dateOfService).toLocaleDateString()
        : (c.dos || (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""))),
  createdDate: c.createdAt
    ? new Date(c.createdAt).toLocaleDateString()
    : c.createdDate || "",
  sentDate: c.submittedDate
    ? new Date(c.submittedDate).toLocaleDateString()
    : c.submissionDate
      ? new Date(c.submissionDate).toLocaleDateString()
      : c.sentDate || "",
  printedDate: c.printedDate || "",
  latestStatusChangeDate: c.statusUpdatedAt 
    ? new Date(c.statusUpdatedAt).toLocaleDateString() 
    : (c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : ""),
  procedures: c.procedures || [],
  clearingHouseMessage: c.denialReason || c.clearingHouseMessage || "",
  eraStatus: c.eraStatus || "",
  description: c.description || "",
  notes: c.note || c.notes || "",
  submittedValue: c.submittedValue ?? c.submittedAmount ?? 0,
  planName: c.planName ?? c.policyNumber ?? (c.insuranceCompany?.name || "Standard Insurance Plan"),
  daysSinceSent: c.daysSinceSent ?? (
    c.submittedDate || c.submissionDate || c.sentDate || c.createdAt
      ? Math.floor(Math.abs(new Date().getTime() - new Date(c.submittedDate || c.submissionDate || c.sentDate || c.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0
  ),
  };
};
