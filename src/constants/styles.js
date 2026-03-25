/**
 * Shared design tokens — type scale, weights, and reusable sx objects.
 * Import from here instead of hard-coding font sizes inline.
 *
 * Scale:
 *   xs  0.75rem  12px   caption / secondary text
 *   sm  0.8rem   12.8px body, labels, inputs  ← default UI text
 *   md  0.875rem 14px   section titles
 *   lg  1rem     16px   card / page headings
 */

// ── Primitives ────────────────────────────────────────────────────────────────

export const fontSize = {
  xs: '0.75rem',
  sm: '0.8rem',
  md: '0.875rem',
  lg: '1rem',
};

export const fontWeight = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
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
  fontSize:  fontSize.sm,
  fontWeight: fontWeight.semibold,
  color:     'text.secondary',
};

/** Standard body / input-value text. */
export const bodySx = {
  fontSize:  fontSize.sm,
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
  '& .MuiInput-root': { fontSize: fontSize.sm },
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
  fontSize:  fontSize.sm,
  fontWeight: fontWeight.medium,
  color:     '#5f6670',
};

/** sx for MUI input base text inside compact sidebar / form fields. */
export const compactInputValueSx = {
  fontSize: fontSize.sm,
};
