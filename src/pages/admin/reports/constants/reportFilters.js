export const BALANCE_OPTIONS = [
  { value: 'any', label: 'Any Balance' },
  { value: 'min_total', label: 'Minimum total balance' },
  { value: 'min_patient', label: 'Minimum patient balance' },
  { value: 'min_insurance', label: 'Minimum insurance balance' }
];

export const OWING_OPTIONS = [
  { value: 'any', label: 'Any Type of Owing' },
  { value: 'pt_individual', label: 'Patient With Individual Owings' },
  { value: 'pt_insurance', label: 'Patient With Insurance Owings' },
  { value: 'pt_payment_plan', label: 'Patient With Payment Plan Owings' }
];

export const BILLING_DATE_OPTIONS = [
  { value: 'any', label: 'Any Balance' },
  { value: 'pt_last_statement_before', label: 'Patient last statement before' },
  { value: 'day_since_last_statement', label: 'Day since last statement' }
];

export const CLAIMS_OPTIONS = [
  { value: 'with_or_without', label: 'With or without open claims' },
  { value: 'with', label: 'With open claims' },
  { value: 'without', label: 'Without open claims' }
];

export const PATIENTS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active Patients' },
  { value: 'inactive', label: 'Inactive Patients' }
];

export const PROVIDER_OPTIONS = [
  { value: 'all', label: 'All' }
];

export const AR_RANGE_OPTIONS = [
  { value: 'any', label: 'Any AR Range' },
  { value: '<30', label: '< 30 days' },
  { value: '>60', label: '> 60 days' },
  { value: '>90', label: '> 90 days' },
  { value: 'custom', label: 'Custom AR Range' }
];

export const FLAGS_OPTIONS = [
  { value: 'with_or_without', label: 'Pts With Or Without Flags' },
  { value: 'with', label: 'Pts with Flags' },
  { value: 'without', label: 'Pts without Flags' }
];

export const SORT_REPORT_OPTIONS = [
  { value: 'high_to_low', label: 'High to Low Owings' },
  { value: 'carrier', label: 'Carrier' },
  { value: 'flag', label: 'Flag' },
  { value: 'last_billed', label: 'Last Billed' },
  { value: 'pt_first_name', label: 'By Patient First Name' },
  { value: 'pt_last_name', label: 'By Patient Last Name' }
];

export const ON_PATIENT_PAYMENT_OPTIONS = [
  { value: 'dont_reset', label: "Don't reset invoice age" },
  { value: 'reset_any', label: 'Reset invoice age on Any Patient Payment' }
];

export const ON_INSURANCE_PAYMENT_OPTIONS = [
  { value: 'dont_reset', label: "Don't reset invoice age" },
  { value: 'reset', label: 'Reset invoice age' }
];

export const CARRIER_OPTIONS = [
  { value: 'all', label: 'All Carriers' },
  { value: 'delta', label: 'Delta Dental' },
  { value: 'cigna', label: 'Cigna' },
  { value: 'metlife', label: 'MetLife' },
  { value: 'aetna', label: 'Aetna' }
];

export const BRANCH_OPTIONS = [
  { value: 'all', label: 'All Branches' },
  { value: '1', label: 'Default Clinic' },
  { value: '2', label: 'Westside Branch' },
  { value: '3', label: 'Riverside Clinic' }
];
