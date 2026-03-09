# Prompt: Build Patient Details Screen (Same as Reference)

Use this prompt with the reference screenshot to recreate the Patient Details screen inside Medflow-FE.

---

## Tech stack (Medflow-FE – must follow)

- **Build:** Vite  
- **UI:** React 19, **MUI (Material UI)** `@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`  
- **Styling:** **Emotion** (`@emotion/react`, `@emotion/styled`) for any custom styling beyond MUI  
- **Routing:** React Router DOM v7  
- **State:** Redux Toolkit + React Query (`@tanstack/react-query`) for server state  
- **Forms:** react-hook-form; MUI inputs (TextField, Select, RadioGroup, Checkbox)  
- **Icons:** `@mui/icons-material` (Edit, Phone, Chat, Star, etc.)  
- **Existing structure:** Reuse/align with `src/pages/patients/PatientDetailPage.jsx` and `src/components/patient-detail/*` (PatientSummaryCard, PatientDetailsSection, ContactInformationSection, FamilyMembersSection, PatientFlagsSection, EmergencyContactSection, AdditionalInformationSection, PatientDetailActions).  
- **Layout:** Use existing `Layout` / `Sidebar` / `Navbar` from `src/components/layout/` so header and sidebar match app shell.

---

## What to build (match reference exactly, no extra boxes)

**Layout**

- **Top bar:** Full-width light blue header. Left: user avatar + name (e.g. "Annie (A...)"). Center: tabs — PATIENT (active, darker blue), ANCILLARY TESTS, CLINICAL, FINANCE, PATIENT REPORTS. Right: icons (dropdown, chat, phone, red star with badge, document, yellow star, people, calendar, help, settings).
- **Left:** Narrow collapsed sidebar (dark blue) with expand/collapse arrow button.
- **Main:** White content area with patient summary at top, then action buttons, then form sections laid out with simple lines and spacing (no extra cards/boxes beyond what is visible in the screenshot).

**Patient summary (top center)**

- Large circular profile photo (left).
- Name in bold, then " | 27 years old".
- Email below name.
- Row of small icons under email (dollar, person, calendar, etc.).

**Action buttons (top right of summary)**

- **Edit** — light gray text, white background, pencil icon.
- **Deactivate Patient** — red background, white text.
- **Convert To Non-Patient** — blue background, white text.

**Panel: "Request Patient Updates" (floating over the page)**

- Floating white area with rounded corners and dark blue title bar (just like in the screenshot, not inside any extra card container).
- Checkbox list: Dental History, Medical History, HIPAA, Confidential — each with "Sent 1/22/2026" in gray.
- Subsection **Custom Forms:** checkboxes e.g. TDS Financial Agreement, HIPAA 2026.
- Footer: **Send Request** (orange, with down-arrow icon), **Close** (gray).

**Form sections (two-column grid where it fits, flat layout)**

- **Patient Details (pt #1189):** Title, First Name, Last Name, Preferred Name, DOB, Age, Sex at Birth, Gender Identity, Miscellaneous #1, #2.
- **Contact Information:** Mobile, Home Phone (with country/flag), Patient's Address (Country, Address Line 1 & 2, City, State, Zip), Email, Marital Status.
- **Patient flags:** "+add flags" link; **Preferred Dentist** / **Preferred Hygienist** (dropdowns); **Patient Profile** (Pediatric / Adult radio).
- **Family Members:** "Add New" button, list area, note "(One HOH per family)".
- **Financial Responsibility:** Radio (Self / HOH responsible), small info icon by title.
- **Head of Communication:** Avatar + name + dropdown, short description text.
- **Bottom row:** Section headers for Additional Information, Spouse Information, Emergency Contact.

**Styling**

- Primary blue for header, active tab, and primary actions; red for destructive (Deactivate); orange for "Send Request".
- Clean sans-serif (MUI default); dark gray/black text; section headers bold; white main background; use only light lines/dividers similar to the screenshot (no heavy boxes or cards).
- Left/right arrow buttons (black circle, white arrow) on sides of content for patient navigation.

**Implementation notes**

- Reuse or refactor existing `patient-detail` components and `PatientDetailPage.jsx` so the new UI matches this design without duplicating logic.
- Use MUI `Box`, `Grid`, `Dialog`, `Tabs`, `Button`, `TextField`, `Select`, `RadioGroup`, `Checkbox`, `Avatar` and Emotion only where MUI theme overrides are needed (avoid Card-like components so the layout stays flat like the screenshot).
- Keep same spacing, alignment, font sizes, and component styles as the reference for a pixel-accurate match, and **do not add any extra containers/boxes** that are not visible in the screenshot.
