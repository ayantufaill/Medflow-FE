# Finance Page UI Revamp Implementation Plan

## Overview
The goal is to achieve the pixel-perfect layout from the provided Figma designs by safely refactoring the existing components used within the `/finance` route. Instead of creating an entirely new component tree, we will revamp the existing sub-components to prevent breaking the extensive dialog and state management already wired up.

## Main Orchestrator File
**`src/pages/finance/FinancePage.jsx`**
- **Role:** This is the main parent file that holds the patient context, the `view` state (invoices/individual/family), and controls all the modal dialogs (Payment Plan, Account Adjustments, etc.).
- **Changes Needed:** 
  - Update the layout wrapper (`Box` components) to use CSS Grid/Flexbox with precise gap spacing (`gap: 3`) to match the new structural layout.
  - The "View" radio group (currently floating freely at the top of the page) will need to be passed down into or absorbed by the revamped `PatientFinanceInfo` card to match the visual design.

---

## Component-Wise Revamp Plan

### 1. `src/components/finance/PatientFinanceInfo.jsx` (Top Left Card)
* **Current State:** Displays the patient name, billing flags, and a horizontal row of `pixelIcons` (action icons).
* **Revamp Plan:**
  - **Visuals:** Refactor into a distinct card container (Width ~654px, Height ~254px, `border-radius: 22px`, 1px grey border).
  - **Content Shift:** 
    - Absorb the "VIEW" radio selector (Invoices, Individual, Family).
    - Render the active patient pill ("Amanda Wilson") with the custom blue left-border style.
    - Keep the "Billing flags" and "+ add account note" text buttons.
    - **CRITICAL:** Remove the `pixelIcons` mapping from here. In the new design, these action icons belong in the middle action bar.

### 2. `src/components/finance/AgingTable.jsx` (Top Right Card)
* **Current State:** A standard, lightly styled Material-UI table.
* **Revamp Plan:**
  - **Visuals:** Constrain to exact dimensions (~718x252px) with `border-radius: 22px`.
  - **Styling Complexity:** Implement the complex bi-color row layout:
    - Top 3 rows (Family Outstanding, Family Balance, Insurance Balance) get a white background.
    - Bottom 3 rows (Outstanding Bills, Balance, Insurance Balance) get a solid blue background (`#2362EF`) with white text.
    - The "TOTAL" column must override row backgrounds to display a solid teal (`#00BBAB`) color.
  - Add the "RESET" and arrow `>` `<` navigational buttons on the far right edge.

### 3. `src/components/finance/FinanceActions.jsx` (Middle Action Bar)
* **Current State:** Renders some filters and an expand toggle.
* **Revamp Plan:**
  - **Visuals:** Redesign as a full-width toolbar (Width ~1398px, Height ~62px, `border-radius: 12px`, with a light blue border).
  - **Content Shift:**
    - **Left Side:** Migrate all the `pixelIcons` (Receipt, Link, Shield, Print, etc.) from `PatientFinanceInfo` into this bar. We will maintain their exact `onClick` callbacks (e.g., `onCashMinusClick`, `onAddFlagsClick`) by passing them down from `FinancePage.jsx`.
    - **Right Side:** Implement the new styled buttons: "Collapse Invoices" (outlined), "Past Statements" (solid blue), "INS. COVERAGE" (solid blue dropdown), and the Refresh icon square.

### 4. `src/components/finance/LedgerList.jsx` (Bottom List)
* **Current State:** A standard expanding table or list mapping over invoices.
* **Revamp Plan:**
  - **Visuals:** Update the main list container. Extract the specific radio filters ("Include voided transactions", "Hide billing transfers") to sit immediately above the list.
  - **Row Redesign:** Refactor the internal invoice mapping to render individual `Card`-like rows.
    - **Parent Row:** `border-radius: 18px`, light border. Must use a strict 3-column Flexbox layout in the center to perfectly align the balances (Ins WO, Pt Balance, Ins Balance). Add the status checkmark and action icons on the right.
    - **Child Rows (Expanded):** Redesign the nested line items (e.g., Courtesy Credit Adjustments) to feature grey text, no borders, and their own specific right-aligned action icons (Document, Sync, Block).

## Execution Strategy
1. **No Backend Changes:** All API calls, Redux dispatchers, and dialog toggles in `FinancePage.jsx` remain untouched.
2. **Prop Drilling:** Because we are moving the `pixelIcons` from `PatientFinanceInfo` to `FinanceActions`, the toggle functions (like `setShowCourtesyRefund`) will need to be passed from `FinancePage.jsx` into `FinanceActions.jsx`.
3. **Iterative Styling:** We will refactor one component at a time, ensuring it matches the Figma spec before moving to the next.
