/**
 * Mock imported coverage data - matches backend API structure.
 * Replace with real API response when backend endpoint is ready.
 *
 * Backend structure (patient insurance / imported coverage):
 * - _id, patientId
 * - insuranceCompanyId: { _id, name, payerId } or string
 * - policyNumber, groupNumber
 * - subscriberName, subscriberDateOfBirth
 * - relationshipToPatient: 'self' | 'spouse' | 'child' | 'parent' | 'other'
 * - insuranceType: 'primary' | 'secondary' | 'tertiary'
 * - effectiveDate, expirationDate
 * - employerName, employerAddress (optional - from eligibility/import)
 * - isActive: false for imported/pending
 */
export const MOCK_IMPORTED_COVERAGE = [
  {
    _id: 'mock-imported-1',
    patientId: null,
    insuranceCompanyId: {
      _id: 'carrier-1',
      name: 'Delta Dental Ins. Co. - Utah',
      payerId: 'DDUT1',
    },
    policyNumber: '2323232',
    groupNumber: '22222222',
    subscriberName: 'Melina Froster',
    subscriberDateOfBirth: '1992-02-12',
    relationshipToPatient: 'self',
    insuranceType: 'primary',
    effectiveDate: '2024-01-01',
    expirationDate: '2025-12-31',
    employerName: 'NASA',
    employerAddress: 'US',
    planName: 'NASA by Delta Dental Ins. Co. - Utah',
    isActive: false,
  },
  {
    _id: 'mock-imported-2',
    patientId: null,
    insuranceCompanyId: {
      _id: 'carrier-2',
      name: 'Blue Cross Blue Shield',
      payerId: '67890',
    },
    policyNumber: 'BCBS-98765',
    groupNumber: 'GRP-001',
    subscriberName: 'John Smith',
    subscriberDateOfBirth: '1985-06-15',
    relationshipToPatient: 'spouse',
    insuranceType: 'secondary',
    effectiveDate: '2024-03-01',
    expirationDate: null,
    employerName: 'Acme Corp',
    employerAddress: '123 Main St, City, ST 12345',
    planName: 'PPO Plan',
    isActive: false,
  },
];
