import { COLORS } from '../../../constants/colors';

// ─── Layout ───────────────────────────────────────────────────────────────────

export const TIME_LABEL_WIDTH = 52;   // px — width of the time gutter on the left
export const COLUMN_MIN_WIDTH = 260;  // px — minimum width per operatory column
export const HOUR_HEIGHT      = 150;  // px — height of one hour row in the grid
export const START_HOUR       = 7;    // 7 AM — first visible hour
export const END_HOUR         = 21;   // 9 PM — last visible hour (exclusive)

// Generates [7, 8, 9, ..., 20] — one entry per rendered hour row
export const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

// ─── Colours ──────────────────────────────────────────────────────────────────

// Cycling palette assigned to operatory column headers.
// Index wraps with `% OPERATORY_COLORS.length` when there are more rooms than colours.
export const OPERATORY_COLORS = [
  '#2262ef', '#4caf50', '#f59e0b', '#8b5cf6',
  '#ef4444', '#06b6d4', '#ec4899', '#14b8a6',
];

// Maps appointment status (lowercase) → card accent colour used in the grid.
export const STATUS_COLORS = COLORS.APPOINTMENT_STATUS;

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Formats a 24-hour integer into a readable AM/PM label for the time gutter.
export const formatHour = (h) => {
  if (h === 12) return '12 PM';
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
};
