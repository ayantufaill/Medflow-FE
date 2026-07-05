# MedFlow Schedule Page — UI Consistency Audit

> **Scope:** `/appointments/` left panel, schedule grid, right panel, and global styles
> **Reference:** Figma design (`y6ldf49W6hHtPZo17XqGs3`, node `220-6381`) + Codebase
> **Last updated:** June 29, 2026

---

## Summary

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 7 | Visible to users, affects perceived quality |
| 🟡 Warning | 6 | Design drift, inconsistent patterns |
| 🔵 Housekeeping | 6 | Code debt, maintainability |

---

## 🔴 Critical Issues

### 1. Two font families in use — global says Manrope, components hardcode Inter

**Files affected:** `src/index.css`, all `appointments/` components (46+ occurrences)

`index.css` sets the body font to `Manrope`:

```css
/* index.css */
font-family: 'Manrope', 'Segoe UI', sans-serif;
```

Every component in `appointments/` overrides this inline with `fontFamily: 'Inter'`. The critical problem is **Inter is never imported anywhere**, so the browser silently falls back to system-ui / Arial — a font that matches neither the design nor the CSS intent.

**Fix:**
- Check your Figma style guide to confirm the canonical font
- If it's **Manrope**: remove all 46 inline `fontFamily: 'Inter'` overrides and let the global cascade work
- If it's **Inter**: add it to the Google Fonts import in `index.css` and remove the Manrope declaration
- Never hardcode `fontFamily` inline in individual components

---

### 2. Heading / section-title styles differ across every panel — 7 distinct styles found

**Files affected:** `RightPanelCard.jsx`, `PatientDetails.jsx`, `OperatoryHeaders.jsx`, `AppointmentHoverCard.jsx`, `PatientCard.jsx`, `TaskList.jsx`, `Messages.jsx`

The same visual role — a card/panel section title or heading — is rendered with **7 different type styles** across the page. All these headings should share the exact same `fontSize`, `fontWeight`, and `color`:

| Location | Component | fontSize | fontWeight | color | Role |
|----------|-----------|----------|------------|-------|------|
| Right panel card header | `RightPanelCard.jsx:39` | `12px` | `700` | `#09121f` | Card title ("Appointment Shortlist", "Task List", "Messages") |
| Left panel detail card title | `PatientDetails.jsx:83` | `14px` | `700` | `#09121f` | Collapsible card title ("Patient Details", "Family Details") |
| Left panel sub-section label | `PatientDetails.jsx:23` | `13px` | `600` | `#374151` | Sub-section label ("Preferred Providers", "Medical Alerts", etc.) |
| Operatory column header | `OperatoryHeaders.jsx:32` | `13px` | `600` | `#09121f` | Column name ("Hygiene 01", "Treatment 01") |
| Hover card section title | `AppointmentHoverCard.jsx:129` | `13px` | `700` | `#09121f` | Section heading ("Appointment Information", "Patient Information") |
| Patient name | `PatientCard.jsx:57` | `15px` | `700` | `#09121f` | Patient name in left panel |
| Hover card patient name | `AppointmentHoverCard.jsx:116` | `14px` | `700` | `#09121f` | Patient name in hover card header |

> **Heading consistency check result:** The headings do **NOT** share the same styling. Across all headings on this page:
> - **font-weight** varies: `600` vs `700` — sub-section labels and operatory headers use `600`, while card titles use `700`
> - **font color** varies: `#09121f` vs `#374151` — the sub-section label in `PatientDetails` uses a lighter gray (`#374151`) while all others use the dark primary (`#09121f`)
> - **font-family** is consistently `Inter` across all headings (but see Issue #1 — Inter is never imported)
> - **font-size** varies wildly: `12px`, `13px`, `14px`, `15px` for elements serving the same visual role

**Fix:**
Define exactly two heading tiers and apply them everywhere:

```js
// src/constants/styles.js
export const HEADING_PRIMARY_SX = {
  fontFamily: 'Manrope', // or whichever is canonical
  fontSize: '14px',
  fontWeight: 700,
  color: '#09121f',
};

export const HEADING_SECONDARY_SX = {
  fontFamily: 'Manrope',
  fontSize: '13px',
  fontWeight: 600,
  color: '#09121f',   // NOT #374151 — use same primary for all headings
};
```

---

### 3. 17+ hardcoded text colors — no single token for "body text"

**Files affected:** All `appointments/` components

Text across the schedule page uses all of these as interchangeable "normal" text color:

```
#09121f   #333   #374151   #445164   #5c646f
#5c7cbc   #64748b   #666   #6b7280   #1a3353
#9aa3ae   #aaa   #94a3b8   #999   ...
```

These are all slightly different dark grays with no semantic distinction. A user can't tell why one paragraph is `#374151` and another is `#5c646f`.

**Fix:**
Create a color token file and replace every ad-hoc value:

```js
// src/constants/colors.js
export const COLORS = {
  // Text
  TEXT_PRIMARY:   '#09121f',   // headings, strong labels
  TEXT_SECONDARY: '#5c646f',   // supporting text, subtitles
  TEXT_MUTED:     '#9aa3ae',   // placeholders, counts, hints

  // Brand
  ACCENT:         '#2262ef',   // buttons, links, icons
  ACCENT_LIGHT:   '#f3f8fd',   // icon backgrounds, hover fills

  // Borders & surfaces
  BORDER:         '#e0e5eb',
  SURFACE_CARD:   '#ffffff',
  SURFACE_TINT:   '#f3f8fd',
  SURFACE_PAGE:   '#f4f7fc',
};
```

---

### 4. Icon accent color is inconsistent — cyan vs blue

**Files affected:** `AppointmentShortlist.jsx`, `TaskList.jsx`, `Messages.jsx`

The Appointment Shortlist and Task List card icons use `#06b6d4` (cyan). The Messages card icon, all Patient Details icons, and every action button use `#2262ef` (blue). These are two different hues applied to the same visual role (section header icon) with no apparent reason.

```jsx
// AppointmentShortlist.jsx — cyan
<PlaylistAddCheck sx={{ fontSize: '20px', color: '#06b6d4' }} />

// TaskList.jsx — also cyan
<AssignmentTurnedIn sx={{ fontSize: '20px', color: '#06b6d4' }} />

// Messages.jsx — blue
<MapsUgc sx={{ fontSize: '20px', color: '#2262ef' }} />
```

**Fix:**
Pick one accent color (Figma style guide decides — likely `#2262ef`) and apply it to all three card header icons.

---

### 5. Date format differs between right panel sections

**Files affected:** `AppointmentShortlist.jsx`, `TaskList.jsx`

Two formats used in the same panel, side by side:

| Section | Format | Example |
|---------|--------|---------|
| Appointment Shortlist | `MMM DD, YYYY` | `Feb 07, 2022` |
| Task List | `MM/DD/YYYY` | `06/29/2022` |

**Fix:**
Create a shared date formatter and use it everywhere:

```js
// src/utils/format.js
import dayjs from 'dayjs';
export const formatDate = (date) => dayjs(date).format('MMM DD, YYYY');
```

---

### 6. Appointment card text rendered at 8px — below legibility threshold

**Files affected:** `appointments/schedule/AppointmentCard.jsx`

Patient name and appointment time are rendered at `fontSize: '8px'`. This is below the WCAG recommended minimum for body text and will be unreadable on standard displays without zooming.

```jsx
// Current — too small
<Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '8px', color: '#fff' }}>
  {appointment.patientName}
</Typography>
```

**Fix:**
Set a hard minimum of `10px`. Use `overflow: hidden` and `textOverflow: 'ellipsis'` to handle tight card heights rather than shrinking text below legibility:

```jsx
sx={{ fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
```

---

### 7. Right panel card content-row title weight is inconsistent across cards

**Files affected:** `AppointmentShortlist.jsx`, `TaskList.jsx`, `Messages.jsx`

All three right-panel cards display item titles inside `RightPanelCard`, but use different `fontWeight` values for the same visual role (bold item title in a card row):

| Card | Item title fontWeight | Source |
|------|-----------------------|--------|
| Appointment Shortlist | `700` | `AppointmentShortlist.jsx:58` — patient name |
| Task List | `600` | `TaskList.jsx:50` — task title |
| Messages | `600` | `Messages.jsx:44` — message title |

**Fix:**
Standardize all card content-row titles to the same `fontWeight` (recommended `600` for content items to distinguish from the `700` card header):

```jsx
// Apply consistently in all three card components:
sx={{ fontWeight: 600 }}
```

---

## 🟡 Warnings

### 8. font-size uses mixed units — px and rem with no consistent scale

**Files affected:** `appointments/schedule/` components

Body text sizes are expressed inconsistently:

```
'12px'    '0.75rem'    '0.72rem'    '0.85rem'    '0.8rem'
'0.9rem'  '0.7rem'     '0.6rem'     '1rem'
```

All of these approximate the same size range (10–14px) but are written differently, making a global type scale impossible to reason about.

**Fix:**
Standardise on `px` throughout (it matches the dominant pattern in the codebase). Define a type scale:

```js
export const FONT_SIZE = {
  XS:   '10px',
  SM:   '11px',
  BASE: '12px',
  MD:   '13px',
  LG:   '14px',
};
```

---

### 9. Patient name casing is inconsistent

**Files affected:** `AppointmentShortlist.jsx`, `scheduleConstants.js`

The first shortlist entry is stored/displayed as `JOHN CLAD` (all caps) while all others are title case (`Melina Freschi`, `Sabrina Gauthier`). The `scheduleConstants.js` mock data also stores patient names as `ALI TARIQ` (all caps). Even if the API returns all-caps data, it should be normalised on render.

**Fix:**

```jsx
// Add to the patient name Typography
sx={{ textTransform: 'capitalize', ... }}

// Or normalise in JS
const displayName = name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
```

---

### 10. Status stripe visual language is inconsistent

**Files affected:** `AppointmentCard.jsx`

All statuses (PRECONFIRMED, UNCONFIRMED, CONFIRMED) use the **same** diagonal hatch `backgroundImage` pattern on line 101. However, the Figma design shows distinct visual treatments per status — some flat, some textured. The current code applies the hatch universally rather than differentiating statuses visually.

**Fix:**
Use flat solid stripes for all statuses with semantically distinct colors. Reserve the hatch/stripe pattern for a distinct state (e.g., `BLOCKED` or `CANCELLED`).

---

### 11. `border-radius` values are inconsistent — 8 different radii in use

**Files affected:** All `appointments/` components

The same page uses at least 8 different `borderRadius` values with no clear system:

| Radius | Used in |
|--------|---------|
| `4px` | `ActionIconsBar` icon buttons |
| `5px` | `PatientDetails` `FormBadge` |
| `6px` | `RightPanelCard` "Add" button |
| `8px` | Buttons, search bar, schedule cards, task rows |
| `10px` | `DetailCard`, `PatientCard` outer container, `ActionIconsBar` container |
| `12px` | `OperatorySchedulePage` panels, `RightPanelCard` container |
| `16px` | `AppointmentHoverCard` |
| `20px` | Status badge pill, price pill |

Cards of the same hierarchy level use different radii — `RightPanelCard` has `12px`, `DetailCard` has `10px`, and `PatientCard` has `10px`. They should match.

**Fix:**
Define a radius scale:

```js
export const RADIUS = {
  SM:   '6px',   // small pills, badges
  MD:   '8px',   // buttons, inputs, tags
  LG:   '12px',  // cards, panels
  XL:   '16px',  // modals, hover cards
  PILL: '9999px', // fully round pills
};
```

---

### 12. `ViewToggle` uses `fontWeight: 300` for inactive state — lighter than any other element

**Files affected:** `ViewToggle.jsx`

The inactive `Day/Week/Month` toggle uses `fontWeight: 300` (Light), which is the **only occurrence** of weight 300 in the entire codebase. Every other element uses `400` minimum for inactive/default text. This makes the inactive toggle text appear visually thinner and disconnected from the rest of the UI.

```jsx
// ViewToggle.jsx:37
fontWeight: isActive ? 500 : 300,
```

**Fix:**
Change inactive weight to `400` (Regular) to match the rest of the app:

```jsx
fontWeight: isActive ? 600 : 400,
```

---

### 13. Button text color is inconsistent — `#ffffff` vs `#fcfcfc`

**Files affected:** `NewAppointmentButton.jsx`, `PatientActions.jsx`, `RightPanelCard.jsx`

Primary action buttons use slightly different "white" text colors:

| Component | color |
|-----------|-------|
| `NewAppointmentButton.jsx:19` | `#fcfcfc` |
| `PatientActions.jsx:57` | `#ffffff` |
| `RightPanelCard.jsx:68` (Add button) | `#ffffff` |

`#fcfcfc` is very slightly off-white and will render identically on most screens, but it's an unnecessary deviation from `#ffffff` that adds noise to the token palette.

**Fix:**
Use `#ffffff` everywhere for white text on blue buttons.

---

## 🔵 Housekeeping

### 14. fontWeight uses numeric, string, and conditional values — no shared constant

**Files affected:** All `appointments/` components

```js
// All found in the codebase:
fontWeight: 700
fontWeight: 600
fontWeight: 500
fontWeight: 'bold'
fontWeight: "bold"
fontWeight: isSelected || isToday ? 700 : 600
fontWeight: bold ? 700 : 600
fontWeight: activeTab === i ? 700 : 400
```

Mixing numeric values, the string `'bold'`, and conditional expressions makes the weight scale invisible and hard to audit.

> **Note:** A `fontWeight` constants object **already exists** in `src/constants/styles.js` (lines 21–26), but it is **not used** by any appointments component. All 46+ components in the appointments directory hardcode their weights inline.

**Fix:**

```js
// Already defined in src/constants/styles.js:
export const fontWeight = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
};

// Usage — import and use everywhere:
fontWeight: fontWeight.bold
fontWeight: isSelected ? fontWeight.bold : fontWeight.semibold
```

---

### 15. No shared design token file — all values repeated inline

**Files affected:** 15+ files across `appointments/`

Colors like `#2262ef`, `#e0e5eb`, `#f3f8fd`, `#09121f` are copied and pasted across the entire codebase. A single brand color change requires a grep-and-replace across 15+ files with risk of missing occurrences.

**Fix:**
Create `src/constants/theme.js` as the single source of truth for all design tokens (colors, font sizes, weights, border radii, spacing). Import from there in every component — never hardcode inline.

---

### 16. Third font (Space Grotesk) imported but barely used

**Files affected:** `src/index.css`, `PortalLayout.jsx`

`index.css` loads Space Grotesk via Google Fonts:

```css
@import url('...family=Space+Grotesk:wght@500;600;700...');
```

It is only applied in `PortalLayout.jsx` on a single element. This is an unnecessary ~15KB network request for a font that contributes nothing to the schedule page.

**Fix:**
If Space Grotesk is not in the Figma style guide, remove it from the import and from `PortalLayout.jsx`. If it is in the style guide, document exactly which UI elements are allowed to use it.

---

### 17. Avatar circle sizes are inconsistent across the page

**Files affected:** `PatientCard.jsx`, `AppointmentShortlist.jsx`, `AppointmentCard.jsx`

The same visual pattern — a circular avatar with initials — uses 4 different sizes with no apparent hierarchy:

| Component | Size | Purpose |
|-----------|------|---------|
| `PatientCard.jsx:46` | `48x48px` | Selected patient avatar |
| `AppointmentShortlist.jsx:43` | `38x38px` | Shortlist row avatar |
| `PatientCard.jsx:121` | `26x26px` | Tag circles & MH avatar |
| `AppointmentCard.jsx:176` | `20x20px` | Footer initials |

**Fix:**
Define avatar size tokens:

```js
export const AVATAR_SIZE = {
  XS: '20px',  // inline badge
  SM: '26px',  // tags, mini avatars
  MD: '36px',  // list row avatars
  LG: '48px',  // featured/selected patient
};
```

---

### 18. Padding and spacing values are inconsistent across same-level cards

**Files affected:** `RightPanelCard.jsx`, `PatientDetails.jsx`, `PatientCard.jsx`

Cards at the same hierarchy level use different internal padding:

| Card | px | py |
|------|----|----|
| `RightPanelCard` header | `14px` | `12px` |
| `RightPanelCard` content | `14px` | `10px` |
| `DetailCard` header | `14px` | `12px` |
| `DetailCard` content | `14px` | `12px` |
| `PatientCard` body | `12px` | `12px` |
| Task row | `12px` | `10px` |

While header padding is reasonably consistent (`14px / 12px`), content areas drift between `10px` and `12px` vertical padding, and outer card padding varies between `12px` and `14px`.

**Fix:**
Define spacing tokens:

```js
export const SPACING = {
  CARD_PX: '14px',
  CARD_PY: '12px',
  CARD_CONTENT_PY: '10px',
  CARD_GAP: '8px',
};
```

---

### 19. `AppointmentHoverCard` header label uses `9px` text — inconsistent with other uppercase labels

**Files affected:** `AppointmentHoverCard.jsx`

The hover card header uses a `9px` uppercase label ("APPOINTMENT SUMMARY FOR") which is smaller than any other text on the page except the 8px appointment card text. No other component uses 9px.

```jsx
// AppointmentHoverCard.jsx:112
sx={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}
```

**Fix:**
Use `10px` minimum for any visible text, or use the `XS` token (`10px`) from the type scale.

---

## Recommended Fix Order

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | Create `src/constants/colors.js` with all color tokens | Unblocks all other color fixes |
| 2 | Create `src/constants/styles.js` with font scale + weights + radii | Unblocks all type fixes |
| 3 | Decide on one font family (Figma → `index.css`) and import it | Fixes the most widespread issue |
| 4 | Define two heading tiers (`HEADING_PRIMARY_SX`, `HEADING_SECONDARY_SX`) and apply everywhere | Visible heading consistency |
| 5 | Unify icon accent color to `#2262ef` | Quick — 3 file changes |
| 6 | Standardize right panel card item title `fontWeight` to `600` | Quick — 3 file changes |
| 7 | Fix `ViewToggle` inactive weight from `300` → `400` | Quick — 1 file change |
| 8 | Fix button text color `#fcfcfc` → `#ffffff` | Quick — 1 file change |
| 9 | Add shared `formatDate()` util and replace all date strings | Fixes format inconsistency |
| 10 | Raise min font-size to `10px` in AppointmentCard and HoverCard | Accessibility |
| 11 | Standardize `borderRadius` to defined scale | Visual polish |
| 12 | Normalize patient name casing | Data display consistency |
| 13 | Flatten status stripe styles | Visual language consistency |
| 14 | Remove Space Grotesk import | Performance |

---

*Audit based on: `Medflow-FE` codebase + Figma: `y6ldf49W6hHtPZo17XqGs3` (node `220-6381`)*
