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

// ── Patient-details inline field (underline variant) ──────────────────────────

/** Standard sx for MUI TextField variant="standard" used in patient detail InlineFieldRows. */
export const standardFieldSx = {
  '& .MuiInput-root': { fontSize: fontSize.base },
  '& .MuiInput-underline:before': {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.42)',
  },
  '& .MuiInput-underline:after': {
    borderBottomWidth: 1,
    borderBottomColor: 'primary.main',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.87)',
  },
  '& .MuiInput-input': { minWidth: 0 },
  '& .MuiInput-input::placeholder': { opacity: 0.6, color: 'text.secondary' },
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
