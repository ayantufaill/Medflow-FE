export const mapClaimFields = (c, tab) => ({
  ...c,
  tab,
  patientName: c.patient
    ? `${c.patient.firstName} ${c.patient.lastName}`
    : "Unknown Patient",
  patientCode: c.patient ? `(${c.patient.patientCode})` : "",
  patientDob: c.patient?.dateOfBirth
    ? new Date(c.patient.dateOfBirth).toLocaleDateString()
    : "",
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
  subscriberNumber: c.subscriberNumber || c.policyNumber || "",
  subscriberDob:
    c.subscriberDob ||
    (c.patient?.dateOfBirth
      ? new Date(c.patient.dateOfBirth).toLocaleDateString()
      : ""),
  claimFormat: c.claimFormat || "Electronic",
  claimType: c.claimType || `${c.claimFormat === "Manual" ? "Manual" : "E-claim"} ${c.insuranceType ? c.insuranceType.charAt(0).toUpperCase() + c.insuranceType.slice(1) : "Primary"}`,
  claimNumber: c.claimNumber || c.claimCode || `#${c.id}`,
  createdDate: c.createdAt
    ? new Date(c.createdAt).toLocaleDateString()
    : c.createdDate || "",
  sentDate: c.submittedDate
    ? new Date(c.submittedDate).toLocaleDateString()
    : c.submissionDate
      ? new Date(c.submissionDate).toLocaleDateString()
      : c.sentDate || "",
  printedDate: c.printedDate || "",
  procedures: c.procedures || [],
  clearingHouseMessage: c.denialReason || c.clearingHouseMessage || "",
  eraStatus: c.eraStatus || "",
  description: c.notes || c.description || "",
});
