# AddCoveragePage.jsx Refactoring Plan

## 1. Current State
* **File Size:** ~750 lines.
* **Current Architecture:** UI is heavily modularized (e.g., `InsuranceInformation`, `DeductiblesTable`, `PlanFeeGuideSection`), but the main page component still handles all the business logic.
* **Bottlenecks:** Massive state management blocks, numerous `useEffect` hooks for API data fetching, complex UI handlers, and massive data payload transformation are all embedded directly inside the component.

## 2. Refactoring Strategy

### Phase 1: Static Constants Extraction
Move fixed, unchanging data outside the React render cycle to improve readability and performance.
* **Target File:** `src/pages/patients/utils/coverageConstants.js`
* **Content:** Options arrays (`COVERAGE_TYPES`, `ASSIGNMENT_OF_BENEFITS_OPTIONS`), configuration maps (`monthMap`), and UI stylistic constants (`blueHeader`, `inputBg`).

### Phase 2: State Management Extraction
Isolate local component state and all of its accompanying update handlers.
* **Target File:** `src/pages/patients/hooks/useCoverageForm.js`
* **Content:** `useState` blocks for `formData`, `coverageBookData`, `coverageCategoryData`, along with 15+ setter methods (e.g., `handleInputChange`, `handleSubscriberChange`, `handleAddDeductibleRow`).
* **Returns:** `{ formData, coverageBookData, coverageCategoryData, handlers }`

### Phase 3: Side Effects & API Logic Extraction
Isolate data fetching, loading states, and external side effects.
* **Target File:** `src/pages/patients/hooks/useCoverageData.js`
* **Content:** `useEffect` initializers, Redux integrations (`usePatient`, `usePatientInsurance`), and the submit/API logic.
* **Returns:** `{ loading, handleSave }`

### Phase 4: Payload Builder Separation
Extract the data transformation logic from the submit function.
* **Target File:** `src/pages/patients/utils/coveragePayloadBuilder.js`
* **Content:** A pure function `buildCoveragePayload(formData)` that maps the local UI state into the final backend JSON payload, significantly reducing the size of the save function.

### Phase 5: Header Component Extraction
Extract the remaining local UI elements that can stand alone.
* **Target File:** `src/components/insurance/AddCoverageHeader.jsx`
* **Content:** The top action bar containing the title, icon, "Cancel", and "Save" buttons.

## 3. Resulting Architecture
The **main file** will still be **`AddCoveragePage.jsx`**, but its role will transition into a lightweight controller (estimated 100-150 lines). It will be solely responsible for calling the custom hooks and passing their properties to the existing UI layout components.
