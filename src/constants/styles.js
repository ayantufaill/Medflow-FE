/**
 * Shared design tokens — type scale, weights, radii, spacing, and reusable sx objects.
 * Import from here instead of hard-coding font sizes inline.
 *
 * Scale:
 *   xs  '10px'   caption / very small labels
 *   sm  '11px'   secondary text, tabs, time labels
 *   base '12px'  default UI text, body, inputs
 *   md  '13px'   section titles, sub-headings
 *   lg  '14px'   card / panel headings
 *   xl  '15px'   featured text (patient name in focus)
 */

import { COLORS } from './colors';

// ── Font Size Primitives ──────────────────────────────────────────────────────

export const fontSize = {
  xs:   '10px',
  sm:   '11px',
  base: '12px',
  md:   '13px',
  lg:   '14px',
  xl:   '15px',
};

// ── Font Weight Primitives ────────────────────────────────────────────────────

export const fontWeight = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
  extrabold: 800,
};

// ── Border Radius Scale ───────────────────────────────────────────────────────

export const radius = {
  sm:   '6px',     // small pills, badges, form badges
  md:   '8px',     // buttons, inputs, tags, task rows
  lg:   '12px',    // cards, panels, containers
  xl:   '16px',    // modals, hover cards, popovers
  pill: '9999px',  // fully round pills / status badges
};

// ── Avatar Size Scale ─────────────────────────────────────────────────────────

export const avatarSize = {
  xs: '20px',  // inline badge / footer initials
  sm: '26px',  // tags, mini avatars, form badges
  md: '36px',  // list row avatars (messages, shortlist)
  lg: '48px',  // featured / selected patient
};

// ── Spacing Tokens ────────────────────────────────────────────────────────────

export const spacing = {
  cardPx:       '14px',  // card horizontal padding
  cardPy:       '12px',  // card header vertical padding
  cardContentPy: '10px', // card content vertical padding
  cardGap:      '8px',   // gap between cards in a stack
  innerGap:     '6px',   // gap between elements inside a card
};

// ── Heading sx Objects ────────────────────────────────────────────────────────

/** Primary heading — card titles ("Patient Details", "Appointment Shortlist"). */
export const headingPrimarySx = {
  fontSize:   fontSize.lg,
  fontWeight: fontWeight.bold,
  color:      COLORS.TEXT_PRIMARY,
};

/** Secondary heading — sub-section labels, operatory names, hover card sections. */
export const headingSecondarySx = {
  fontSize:   fontSize.md,
  fontWeight: fontWeight.semibold,
  color:      COLORS.TEXT_PRIMARY,
};

// ── Composite sx objects ──────────────────────────────────────────────────────

/** Top-level section title inside a card column (e.g. "Patient Details", "Contact Information"). */
export const sectionTitleSx = {
  fontSize:  fontSize.md,
  fontWeight: fontWeight.bold,
  color:     'primary.main',
  mb:        1.5,
};

/** Field label — left side of InlineFieldRow, form input labels. */
export const labelSx = {
  fontSize:  fontSize.base,
  fontWeight: fontWeight.semibold,
  color:     'text.secondary',
};

/** Standard body / input-value text. */
export const bodySx = {
  fontSize:  fontSize.base,
  fontWeight: fontWeight.regular,
};

/** Secondary / caption text below a field or section. */
export const captionSx = {
  fontSize:  fontSize.xs,
  fontWeight: fontWeight.regular,
};

// ── Appointment form compact tokens ───────────────────────────────────────────
// Used inside the Add New Patient Appointment modal where space is tight.

/** Slightly enlarged body text for modal column headers / buttons. */
export const FONT_SM = { fontSize: '12px' };

/** Compact label / input text inside the appointment modal. */
export const FONT_XS = { fontSize: '11px' };

// ── Patient-details inline field (bordered-box variant) ────────────────────────

/**
 * sx for MUI TextField variant="outlined" used in patient detail
 * InlineFieldRows — a gray-bordered box, matching the New Patient Intake
 * form's OutlinedInput instead of an underlined field. Works for both
 * `readOnly` (view mode) and editable (edit mode) states; readOnly fields
 * keep the same box so nothing visually jumps when toggling edit mode.
 */
export const standardFieldSx = {
  '& .MuiOutlinedInput-root': {
    height: '40px',
    borderRadius: radius.md,
    backgroundColor: COLORS.SURFACE_CARD,
    fontFamily: 'Inter',
    '& fieldset': { borderWidth: '1.2px', borderColor: COLORS.BORDER },
    '&:hover fieldset': { borderColor: COLORS.TEXT_MUTED },
    '&.Mui-focused fieldset': { borderColor: COLORS.ACCENT, borderWidth: '1.2px' },
  },
  '& .MuiOutlinedInput-input': { padding: '8px 12px', fontSize: fontSize.base, minWidth: 0 },
  '& .MuiOutlinedInput-input::placeholder': { opacity: 0.6, color: COLORS.TEXT_MUTED },
};

// ── Sidebar / compact form input styling ─────────────────────────────────────

/** sx for MUI InputLabel inside compact sidebar / form selects. */
export const compactInputLabelSx = {
  fontSize:  fontSize.base,
  fontWeight: fontWeight.medium,
  color:     '#5f6670',
};

/** sx for MUI input base text inside compact sidebar / form fields. */
export const compactInputValueSx = {
  fontSize: fontSize.base,
};

// ── Select dropdown popup ─────────────────────────────────────────────────────

/**
 * MenuProps for a MUI <Select> / <TextField select> so its dropdown popup
 * gets the app's rounded-card treatment (border, shadow, accent-tinted
 * selected/hover rows) instead of MUI's plain square default. Used by every
 * filter/form select across the app (patients list filters, the new-patient
 * intake form, etc.) — import this instead of redefining it per component.
 */
export const roundedSelectMenuProps = {
  PaperProps: {
    sx: {
      mt: '4px',
      borderRadius: radius.md,
      border: `1px solid ${COLORS.BORDER}`,
      boxShadow: '0px 4px 20px rgba(0,0,0,0.12)',
      '& .MuiMenuItem-root': {
        fontFamily: 'Inter',
        fontSize: fontSize.md,
        color: COLORS.TEXT_BODY,
        '&.Mui-selected': {
          backgroundColor: COLORS.ACCENT_BG,
          '&:hover': { backgroundColor: COLORS.ACCENT_BG },
        },
        '&:hover': { backgroundColor: COLORS.SURFACE_HOVER },
      },
    },
  },
};
