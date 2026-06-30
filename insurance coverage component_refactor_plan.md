# Implementation Plan: Modularizing Insurance Components

The four components (`InsuranceInformation`, `CoverageTable`, `CoverageBookSummary`, and `CoverageBookModal`) contain a mix of UI logic, duplicate dialogs, hardcoded data, and massive render blocks. 

By applying the separation of concerns, we can significantly reduce their sizes without altering any underlying code functionality. Here is the step-by-step implementation plan:

## 1. Extracting Hardcoded Data & Utilities
Many files define massive data structures or helper functions at the top or inside the component body. These should be moved to dedicated utility files.

*   **Create `src/components/insurance/utils/insuranceConstants.js`**:
    *   Move `DUMMY_INSURANCE` from `InsuranceInformation.jsx`.
    *   Move `DEFAULT_COVERAGE` and `COVERAGE_DATA` from `CoverageTable.jsx`.
    *   Move `rowData` template from `CoverageBookSummary.jsx`.
*   **Create `src/components/insurance/utils/insuranceHelpers.js`**:
    *   Move the `getProcedureType` function from `CoverageBookModal.jsx`.
    *   Move the phone number formatter from `InsuranceInformation.jsx`.
*   **Create `src/components/insurance/styles/coverageStyles.js`**:
    *   Extract styling constants (`inputFieldSx`, `deliveryPatternSx`, `headerCellSx`, `bodyCellSx`, `cellStyle`) from `CoverageBookSummary.jsx` and `CoverageBookModal.jsx`.

## 2. Shared Component Extraction (Crucial)
Both `CoverageBookSummary.jsx` and `CoverageBookModal.jsx` contain an **identical 60+ line "Tooth Selection Dialog"** (`<Dialog open={...}>`). 
*   **Create `src/components/insurance/ToothSelectionDialog.jsx`**:
    *   Extract the `Dialog` that renders the teeth grid. 
    *   **Props**: `open`, `onClose`, `selectedTeeth`, `onToothToggle`.
    *   Replace the inline dialog in both `CoverageBookSummary` and `CoverageBookModal` with this single shared component.

## 3. Refactoring `InsuranceInformation.jsx`
*Current Size: 426 lines*
*   **Create `CarrierSearchDropdown.jsx`**: Extract the `FormInput` and `Paper` dropdown that handles carrier searching and displaying the search results table.
*   **Create `PlanBillingTable.jsx`**: Extract the massive `<TableContainer>` that holds the Plan Name, Group Name, Group Number, Phone, Health Plan, and Assignment of Benefits rows.
*   **Main File Update**: `InsuranceInformation.jsx` will simply act as a wrapper rendering `<CarrierSearchDropdown />`, the generic carrier fields, and `<PlanBillingTable />`.

## 4. Refactoring `CoverageTable.jsx`
*Current Size: 583 lines* (Contains multiple components in one file)
*   **Extract `FinalCoverageSection.jsx`**: Move the `FinalCoverageSection` component (lines 498-579) into its own file.
*   **Extract `CoverageGroup.jsx`**: Move the `CoverageGroup` component (lines 353-445) into its own file.
*   **Extract `AnnualMaximumsTable.jsx`**: Move the top table (Individual, Family, Ortho rows) out of the main file.
*   **Main File Update**: `CoverageTable.jsx` will be stripped down to ~50 lines, just importing and rendering `<AnnualMaximumsTable />` and `<FinalCoverageSection />`.

## 5. Refactoring `CoverageBookSummary.jsx`
*Current Size: 346 lines*
*   **Create `CoverageBookRow.jsx`**: Extract the massive `renderRow` function into its own pure functional component. Pass down the `row`, `index`, and `handleFieldChange` as props.
*   **Main File Update**: Import the new `ToothSelectionDialog` and map over `displayData` using `<CoverageBookRow />`. The file size will drop by ~200 lines.

## 6. Refactoring `CoverageBookModal.jsx`
*Current Size: 442 lines*
*   **Create `hooks/useCoverageBook.js`**: Extract the `useState` blocks, the `useEffect` that calls `feeService`, and the `useMemo` hooks generating `mergedData` and `treeData`.
*   **Create `CoverageBookTreeRow.jsx`**: Extract the rendering logic for the expandable Type rows, Group rows, and the Procedure input cells into a distinct sub-component. 
*   **Main File Update**: The modal will call `useCoverageBook()`, render the layout, map over the data using `<CoverageBookTreeRow />`, and mount the shared `<ToothSelectionDialog />`.

---
**Summary of Benefits:**
By executing this plan, no application behavior will change. We will eliminate hundreds of lines of duplicated code, separate data models from UI components, and bring every file down to a highly readable size (under 150 lines).
