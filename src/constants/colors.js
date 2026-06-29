/**
 * Shared color tokens for the MedFlow UI.
 * Import from here instead of hardcoding hex values inline.
 *
 * Usage:
 *   import { COLORS } from '../../constants/colors';
 *   sx={{ color: COLORS.TEXT_PRIMARY }}
 */

export const COLORS = {
  /* ── Text ───────────────────────────────────────────── */
  TEXT_PRIMARY:   '#09121f',   // headings, strong labels, primary body text
  TEXT_SECONDARY: '#5c646f',   // supporting text, subtitles, secondary info
  TEXT_MUTED:     '#9aa3ae',   // placeholders, counts, hints, disabled text
  TEXT_BODY:      '#374151',   // standard body text in detail rows

  /* ── Brand / Accent ─────────────────────────────────── */
  ACCENT:         '#2262ef',   // buttons, links, icons, active states
  ACCENT_HOVER:   '#1a50cc',   // button hover state
  ACCENT_BG:      'rgba(34, 98, 239, 0.10)',  // active icon background

  /* ── Status ─────────────────────────────────────────── */
  STATUS_CONFIRMED:    '#059669',
  STATUS_PRECONFIRMED: '#7c3aed',
  STATUS_UNCONFIRMED:  '#d97706',
  STATUS_ERROR:        '#ef4444',
  STATUS_SUCCESS:      '#16a34a',
  STATUS_WARNING:      '#ea580c',

  /* ── Surfaces ───────────────────────────────────────── */
  SURFACE_PAGE:   '#f0f2f5',   // page background
  SURFACE_CARD:   '#ffffff',   // card background
  SURFACE_TINT:   '#f3f8fd',   // card header / subtle tint background
  SURFACE_HOVER:  '#fafbfc',   // hover row
  SURFACE_INPUT:  '#f5f7fa',   // search bar / input background
  SURFACE_FOOTER: '#f8fafc',   // footer area

  /* ── Borders & Dividers ─────────────────────────────── */
  BORDER:         '#e0e5eb',   // card borders, dividers
  BORDER_LIGHT:   '#f0f2f5',   // subtle dividers, inner separators
  BORDER_VERY_LIGHT: '#f5f7fa', // row separators inside cards

  /* ── Avatars ────────────────────────────────────────── */
  AVATAR_BG:      '#dde4fb',   // avatar background
  AVATAR_TEXT:    '#3b5bd9',   // avatar initials

  /* ── Misc ───────────────────────────────────────────── */
  WHITE:          '#ffffff',
  PRICE_BG:       '#dcfce7',
  PRICE_TEXT:     '#16a34a',
  textHeader:     '#1a2735',   // legacy alias used in clinical pages
};
