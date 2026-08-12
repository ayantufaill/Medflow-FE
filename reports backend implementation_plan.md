# Patient Reports — Full API Binding & Alignment Audit

This plan covers all 15 patient report pages, auditing whether each is properly bound to backend APIs, and detailing exactly what needs to change to achieve full alignment.

---

## Executive Summary

| # | Report Page | API Bound? | Backend Handler Exists? | FE Dispatches to Redux? | Filter Params Sent? | Data Shape Match? | Status |
|---|---|---|---|---|---|---|---|
| 1 | PatientInsuranceCoverage | ✅ Partial | ✅ `insurance-coverage` | ✅ Yes | ❌ No filters sent | ✅ Yes | 🟡 Needs filter passthrough |
| 2 | PatientMembershipPlan | ❌ No | ✅ `membership-plan` | ❌ No | ❌ No | 🟡 Partial (BE returns hardcoded) | 🔴 Not bound |
| 3 | ReferralByPatientReport | ✅ Partial | ✅ `referral-by-patient` | ✅ Yes | ✅ Sends startDate/endDate/range | 🟡 Partial (missing phone/email) | 🟡 Needs data shape fix |
| 4 | OnlineSchedulingReferral | ❌ No | ✅ `online-scheduling-referral` | ❌ No | ❌ No | ❌ Completely different shape | 🔴 Not bound |
| 5 | PatientFlagsReport | ❌ Partial | ✅ `by-flag` | ❌ Not dispatching | ❌ No | 🟡 Partial | 🔴 Not bound |
| 6 | CancelledAppointmentsReport | ❌ Partial | ✅ `cancelled-appointments` | ❌ Not dispatching | ❌ No | ❌ Different shape | 🔴 Not bound |
| 7 | NoShowAppointmentsReport | ❌ No | ✅ `no-show-appointments` | ❌ No | ❌ No | ❌ Different shape | 🔴 Not bound |
| 8 | AppointmentsReport | ❌ No | ✅ `appointments` | ❌ No | ❌ No | ❌ Different shape | 🔴 Not bound |
| 9 | DuplicatePatientsReport | ❌ No | ✅ `duplicate-patients` | ❌ No | ❌ No | ❌ Different shape | 🔴 Not bound |
| 10 | PatientContactPreferencesReport | ❌ No | ✅ `contact-preferences` | ❌ No | ❌ No | ❌ Different shape | 🔴 Not bound |
| 11 | PatientLastAppointmentReport | ❌ No | ✅ `last-appointment` | ❌ No | ❌ No | ❌ Different shape | 🔴 Not bound |
| 12 | PatientNextAppointmentReport | ❌ No | ✅ `next-appointment` | ❌ No | ❌ No | ❌ Different shape | 🔴 Not bound |
| 13 | ReferralDocumentReport | ❌ No | ✅ `referral-document` | ❌ No | ❌ No | ❌ Different shape | 🔴 Not bound |
| 14 | LabCaseReport | ❌ No | ✅ `lab-case` | ❌ No | ❌ No | ❌ Different shape | 🔴 Not bound |
| 15 | PatientDiscountEditedFeeReport | ❌ No | ✅ `discount-edited-fee` | ❌ No | ❌ No | ❌ Different shape | 🔴 Not bound |

> [!WARNING]
> **Only 2 out of 15 pages** (Insurance Coverage & Referral By Patient) have any API binding at all, and even those are incomplete. The remaining 13 pages use only hardcoded `DUMMY_DATA` with zero backend integration.

---

## Detailed Findings Per Report

---

### 1. PatientInsuranceCoverage ⬤ 🟡

**Frontend**: Dispatches `fetchPatientInsuranceCoverageReport()` on mount. Uses `selectInsuranceCoverageData` and `selectInsuranceCoverageLoading`.

**Issue — No filters sent to API**: The dispatch on line 215 calls `fetchPatientInsuranceCoverageReport()` with **no parameters**. The filters (grouping, assignment, appt date range, showNoCoverage, search payer/plan) are all applied **client-side only** against `rawReportData`. This works for small datasets but won't scale.

**Backend**: `getPatientInsuranceCoverage()` accepts no params — it just returns all patplan records with no filtering. Data shape matches FE expectations: `{ number, patient, email, planName, payer, lastAppointment, feeSchedule, planRenewalDate, assignmentStatus }`.

**What needs fixing**:
- FE is functionally working but filters are client-side only. For full alignment, the backend could accept filter params to reduce payload.
- Minor: No `onClearAll` handler dispatches a fresh fetch.

---

### 2. PatientMembershipPlan ⬤ 🔴

**Frontend**: **No Redux dispatch at all**. No `useDispatch`, no thunk import. Filters only against local `INITIAL_DATA`. No API call.

**Backend**: `getPatientMembershipPlan()` exists and returns hardcoded dummy data (7 items) with shape `{ number, patient, email, planName, lastAppointment, renewalMonth }` — which **matches** FE expectations.

**What needs fixing**:
- **FE**: Add async thunk `fetchPatientMembershipPlanReport` in `patientReportSlice.js` calling `reportingService.getPatientReport('membership-plan')`.
- **FE**: Wire the component to dispatch on mount, use redux state, and add loading indicator.
- **BE**: Currently returns hardcoded data — should query real membership/discount plans from DB.

---

### 3. ReferralByPatientReport ⬤ 🟡

**Frontend**: Dispatches `fetchReferralByPatientReport({ startDate, endDate, range: dateRange })` when dates/range change. Maps redux data using `{ patient: item.referred, referralSource: item.referredBy, phone: '', email: '' }`.

**Issue — phone/email always blank**: The FE mapping (line 187-188) hardcodes `phone: ''` and `email: ''` even though the backend returns `phone` and `email` fields from the patient record.

**Backend**: `getReferralByPatient(start, end)` queries `refattach` with patient+referral join. Returns `{ referred, phone, email, referredBy, date }`.

**What needs fixing**:
- **FE**: Map `phone: item.phone` and `email: item.email` instead of empty strings.
- The date range params pass `range` to backend, but backend uses `startDate`/`endDate` in query. The FE sends `{ startDate, endDate, range }` — the service method sends them as query params. The backend's `getRangeDates` uses `query.date` + `query.range`, not `query.startDate`/`query.endDate`. Need to align parameter names.

---

### 4. OnlineSchedulingReferral ⬤ 🔴

**Frontend**: Pure static — uses hardcoded `INITIAL_DATA` with UTM tracking fields `{ referral, utmSource, utmMedium, utmCampaign, clicks }`. No Redux, no dispatch, no API.

**Backend**: `getOnlineSchedulingReferral(start, end)` exists but returns completely different shape: `{ patient, date, referralSource }` — **no UTM fields**.

**What needs fixing**:
- **FE**: Add thunk, dispatch on mount, wire to Redux.
- **BE**: Rewrite handler to return UTM-tracking data or adjust FE columns to match what BE actually returns.
- **Decision needed**: Does this report track UTM params or patient referral sources?

---

### 5. PatientFlagsReport ⬤ 🔴

**Frontend**: Imports `useDispatch`/`useSelector` and reads `patientFlagsReportData` from redux, but **never dispatches** `fetchPatientFlagsReport`. Uses `DUMMY_DATA`. Also references undefined variables (`dialogMode`, `setIncludeFlags`, `setExcludeFlags`, `ALL_FLAGS`, `Tooltip`, `PrintOutlined`, `AttachMoneyOutlined`, `MedicationOutlined`, `ChatBubbleOutline`) — will cause runtime errors.

**Backend**: `getPatientByFlag(filterBy, includeFlags, excludeFlags)` exists and properly queries patients with flag filtering via `getPatientsMeta()`. Returns `{ number, patient, flags, lastAppointment }`.

**What needs fixing**:
- **FE**: Fix undefined variable references (critical broken code).
- **FE**: Add dispatch with params `{ filterBy, includeFlags, excludeFlags }` when "Apply Filters" is clicked.
- **FE**: Wire the flag selection dialog to actual state.
- **FE**: Use redux data instead of `DUMMY_DATA`.

---

### 6. CancelledAppointmentsReport ⬤ 🔴

**Frontend**: Imports `useDispatch`/`useSelector` and reads `cancelledAppointmentsData` from Redux, but **never dispatches** `fetchCancelledAppointmentsReport`. Filters only against local `DUMMY_DATA`.

**Backend**: Returns `{ id, patient, provider, date, reason }` — missing `type`, `duration`, `prefDay`, `prefTime`, `procedures`, `aptDate`, `nextAptDate` that FE expects.

**What needs fixing**:
- **FE**: Dispatch `fetchCancelledAppointmentsReport({ startDate, endDate })` on apply.
- **FE**: Wire redux data, add loading state.
- **BE**: Expand the query to return the additional fields the FE displays (type, duration, procedures, etc.) from the `appointment` table.

---

### 7. NoShowAppointmentsReport ⬤ 🔴

**Frontend**: No Redux at all. Filters locally against `DUMMY_DATA`. Same columns as Cancelled Appointments.

**Backend**: `getCancelledOrNoShowAppointments(start, end, true)` handles `no-show-appointments`. Same limited response shape as cancelled.

**What needs fixing**:
- **FE**: Add thunk in slice, dispatch with date params, wire Redux state.
- **BE**: Expand response to include type, duration, procedures, prefDay, prefTime, nextAptDate.

---

### 8. AppointmentsReport ⬤ 🔴

**Frontend**: No Redux. Uses `DUMMY_DATA` only. Has rich filters (dateType, provider, status, locationType, shortlisted, flags) but none are functional — `onApplyFilters` just does `console.log('Apply Filters')`.

**Backend**: `getAppointmentsReport(start, end)` returns `{ id, patient, provider, date, time, status }` — missing `flags`, `type`, `operatory`, `duration`, `procedures`, `nextAptDate`.

**What needs fixing**:
- **FE**: Add thunk, dispatch, wire Redux. Pass all filter params.
- **BE**: Expand query to return all needed fields. Accept filter params (provider, status, locationType).

---

### 9. DuplicatePatientsReport ⬤ 🔴

**Frontend**: No Redux. Uses static `DUMMY_DATA`. No filters at all.

**Backend**: `getDuplicatePatients()` returns `{ patientId, name, dob, matchesWith }` — different from FE shape `{ id, firstName, lastName, dob, status, subscriber }`.

**What needs fixing**:
- **FE**: Add thunk, dispatch on mount, wire Redux.
- **BE**: Rewrite to actually find duplicate patients (same name + DOB combinations) and return shape matching FE columns: `{ id, firstName, lastName, dob, status, subscriber }`.

---

### 10. PatientContactPreferencesReport ⬤ 🔴

**Frontend**: No Redux. Static `DUMMY_DATA`. FE expects `{ firstName, lastName, email, phone, text (Permission to Text), emailPerm (Permission to Email), review (Request Review) }`.

**Backend**: `getPatientContactPreferences()` returns `{ patientId, name, preference }` — completely different and much simpler shape. Missing email, phone, individual permission fields.

**What needs fixing**:
- **FE**: Add thunk, dispatch, wire Redux.
- **BE**: Expand query to return full patient contact preferences: firstName, lastName, email, phone, text permission, email permission, review opt-in.

---

### 11. PatientLastAppointmentReport ⬤ 🔴

**Frontend**: No Redux. Static `DUMMY_DATA`. FE expects 14 columns: `{ id, patient, status, apptDate, type, apptStatus, nextAppt, newPatient, provider, email, phone, text, emailPerm, review }`.

**Backend**: `getPatientAppointmentMilestones(false)` returns `{ patientId, name, date }` — only 3 fields.

**What needs fixing**:
- **FE**: Add thunk, dispatch, wire Redux. Pass filter params (startDate, endDate, filterBy, provider, apptStatus, sortBy, showFlags, flagFilter).
- **BE**: Major expansion needed — query patients with their last appointment details, join provider, contact prefs.

---

### 12. PatientNextAppointmentReport ⬤ 🔴

**Frontend**: No Redux. Static `DUMMY_DATA`. Same 13 columns as Last Appointment minus `nextAppt`.

**Backend**: `getPatientAppointmentMilestones(true)` — same 3-field response.

**What needs fixing**:
- Same as #11 but for future appointments.

---

### 13. ReferralDocumentReport ⬤ 🔴

**Frontend**: No Redux. Static `DUMMY_DATA`. FE expects `{ patient, provider, created, due, shared, status }`. Has filter by status and provider.

**Backend**: `getReferralDocuments()` returns `{ date, patient, documentName }` — completely different shape.

**What needs fixing**:
- **FE**: Add thunk, dispatch with filter params (status, provider), wire Redux.
- **BE**: Rewrite to query referral documents with proper fields.

---

### 14. LabCaseReport ⬤ 🔴

**Frontend**: No Redux. Static `DUMMY_DATA`. FE expects `{ patient, provider (lab), procedures, dueDate, apptDate, sharedDate, status }`. Has filters for date range, status, dateType.

**Backend**: `getLabCaseReport(start, end)` queries `labcase` but returns `{ caseId, patient, dueDate, instructions }` — missing provider, procedures, apptDate, sharedDate, status.

**What needs fixing**:
- **FE**: Add thunk, dispatch, wire Redux. Pass filters (status, dateType, includeInactive).
- **BE**: Expand query with joins to lab provider, procedures, appointment dates.

---

### 15. PatientDiscountEditedFeeReport ⬤ 🔴

**Frontend**: No Redux. Static `DUMMY_DATA`. FE expects `{ patient, date, code, description, fee, editedFee, discount, provider }`.

**Backend**: `getDiscountEditedFeeReport(start, end)` returns hardcoded `{ code, originalFee, actualFee, discount, date }` — missing patient, description, provider.

**What needs fixing**:
- **FE**: Add thunk, dispatch, wire Redux.
- **BE**: Query adjustments/fee modifications with patient+procedure+provider joins.

---

## Proposed Changes

### Frontend — Redux Slice
#### [MODIFY] [patientReportSlice.js](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/store/slices/patientReportSlice.js)
- Add 12 new async thunks for the unbound reports:
  - `fetchPatientMembershipPlanReport`
  - `fetchOnlineSchedulingReferralReport`
  - `fetchNoShowAppointmentsReport`
  - `fetchAppointmentsReport`
  - `fetchDuplicatePatientsReport`
  - `fetchPatientContactPreferencesReport`
  - `fetchPatientLastAppointmentReport`
  - `fetchPatientNextAppointmentReport`
  - `fetchReferralDocumentReport`
  - `fetchLabCaseReport`
  - `fetchPatientDiscountEditedFeeReport`
- Add corresponding state fields and extraReducers
- Add selector functions for each

---

### Frontend — Report Pages (13 pages need binding)
Each of these pages needs:
1. Import thunk + selectors from slice
2. Add `useDispatch`/`useSelector`
3. Dispatch on mount / on filter apply
4. Replace DUMMY_DATA with redux state
5. Add loading indicator
6. Map API response to table columns

#### [MODIFY] [PatientMembershipPlan.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/PatientMembershipPlan.jsx)
#### [MODIFY] [OnlineSchedulingReferral.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/OnlineSchedulingReferral.jsx)
#### [MODIFY] [PatientFlagsReport.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/PatientFlagsReport.jsx) — also fix broken imports/references
#### [MODIFY] [CancelledAppointmentsReport.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/CancelledAppointmentsReport.jsx)
#### [MODIFY] [NoShowAppointmentsReport.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/NoShowAppointmentsReport.jsx)
#### [MODIFY] [AppointmentsReport.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/AppointmentsReport.jsx)
#### [MODIFY] [DuplicatePatientsReport.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/DuplicatePatientsReport.jsx)
#### [MODIFY] [PatientContactPreferencesReport.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/PatientContactPreferencesReport.jsx)
#### [MODIFY] [PatientLastAppointmentReport.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/PatientLastAppointmentReport.jsx)
#### [MODIFY] [PatientNextAppointmentReport.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/PatientNextAppointmentReport.jsx)
#### [MODIFY] [ReferralDocumentReport.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/ReferralDocumentReport.jsx)
#### [MODIFY] [LabCaseReport.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/LabCaseReport.jsx)
#### [MODIFY] [PatientDiscountEditedFeeReport.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/PatientDiscountEditedFeeReport.jsx)

#### [MODIFY] [ReferralByPatientReport.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/ReferralByPatientReport.jsx) — fix phone/email mapping

#### [MODIFY] [PatientInsuranceCoverage.jsx](file:///c:/Users/Huzaifa/Desktop/Medflow-FE/src/pages/admin/reports/patient/PatientInsuranceCoverage.jsx) — minor: pass filter params

---

### Backend — Report Generation Service
#### [MODIFY] [report-generation.service.ts](file:///c:/Users/Huzaifa/Desktop/medflow-BE/src/services/report-generation.service.ts)

Expand the following backend methods to return data shapes matching what the FE columns expect:

| Method | Current Fields | Missing Fields to Add |
|---|---|---|
| `getPatientMembershipPlan` | Hardcoded static | Query from real DB membership plans |
| `getOnlineSchedulingReferral` | `patient, date, referralSource` | `utmSource, utmMedium, utmCampaign, clicks` OR redesign |
| `getCancelledOrNoShowAppointments` | `id, patient, provider, date, reason` | `type, duration, prefDay, prefTime, procedures, aptDate, nextAptDate` |
| `getAppointmentsReport` | `id, patient, provider, date, time, status` | `flags, type, operatory, duration, procedures, nextAptDate` + filter params |
| `getDuplicatePatients` | `patientId, name, dob, matchesWith` | `firstName, lastName, status, subscriber` + actual duplicate detection |
| `getPatientContactPreferences` | `patientId, name, preference` | `firstName, lastName, email, phone, permToText, permToEmail, requestReview` |
| `getPatientAppointmentMilestones` | `patientId, name, date` | Full 14-column response with provider, status, contact prefs, etc. |
| `getReferralDocuments` | `date, patient, documentName` | `provider, created, due, shared, status` |
| `getLabCaseReport` | `caseId, patient, dueDate, instructions` | `provider, procedures, apptDate, sharedDate, status` |
| `getDiscountEditedFeeReport` | `code, originalFee, actualFee, discount, date` | `patient, description, provider` |

---

## Open Questions

> [!IMPORTANT]
> **1. Online Scheduling Referral**: The FE shows UTM tracking data (utmSource, utmMedium, utmCampaign, clicks) but the backend has no UTM data source. Should we:
> - (a) Design this report around what the backend can provide (patient referral sources)?
> - (b) Create a new UTM tracking system in the backend?
> - (c) Keep it as static/placeholder for now?

> [!IMPORTANT]
> **2. Membership Plan data source**: There's no dedicated membership/discount plan table in the OpenDental schema. Where should membership plan data come from? Should we use `payplan` with a specific type, or is there a separate membership system?

> [!IMPORTANT]
> **3. Pagination**: None of these reports have pagination. The backend uses `take: 20-50` limits. Should we add pagination support for reports that could return large datasets (Insurance Coverage, Contact Preferences, Appointments)?

> [!IMPORTANT]
> **4. Filter passthrough strategy**: Should filters be applied server-side (reduces payload, better for large datasets) or client-side (simpler, current pattern for Insurance Coverage)? The hybrid approach (fetch all, filter client-side) works for small practices but won't scale.

---

## Verification Plan

### Automated Tests
- No existing test suite detected; verification will be manual.

### Manual Verification
1. For each report page, verify:
   - API is called on page load / filter apply
   - Loading spinner shows during fetch
   - Data from API renders correctly in table columns
   - Filters properly narrow results
   - Export CSV works with real data
   - Print works with real data
   - Falls back gracefully if API returns empty array
2. Check browser Network tab to confirm correct API endpoint + params for each page
3. Verify no console errors on any report page
