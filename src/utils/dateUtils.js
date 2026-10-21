import dayjs from 'dayjs';
// Registers the dayjs plugins (utc/timezone/...) once for the whole app.
// See src/config/dayjs.js.
import '../config/dayjs';

// Audit timestamps represent instants, unlike date-only clinical fields.
export function resolveHistoryTimeZone(timeZone) {
  if (typeof timeZone === 'string' && timeZone.trim()) {
    try {
      return new Intl.DateTimeFormat('en-US', { timeZone }).resolvedOptions().timeZone;
    } catch { /* Use an explicit UTC fallback for missing/invalid clinic settings. */ }
  }
  return null;
}

export function formatHistoryTimestamp(value, timeZone, dateOnly = false) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: resolveHistoryTimeZone(timeZone) || 'UTC',
    month: 'short', day: '2-digit', year: 'numeric',
    ...(dateOnly ? {} : {
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short',
    }),
  }).format(date);
}

/**
 * System-independent date formatter:
 * 1. Immune to laptop timezone (no -1 day shift in US/Western timezones)
 * 2. Immune to laptop OS locale (consistently outputs standard format everywhere)
 *
 * @param {string|Date|dayjs.Dayjs} dateValue - The input date to format
 * @param {string} format - The dayjs format template (default: 'MM/DD/YYYY')
 * @returns {string} Formatted date string, or '-' if invalid/empty
 */
export function formatDate(dateValue, format = 'MM/DD/YYYY') {
  if (!dateValue) return '-';

  try {
    // If it's a string, extract the date part (YYYY-MM-DD) or parse in UTC
    let parsed;
    if (typeof dateValue === 'string') {
      const cleanDate = dateValue.trim();
      // If it contains a T or Z (ISO timestamp), parse with UTC to prevent local offset shifts
      if (cleanDate.includes('T') || cleanDate.endsWith('Z')) {
        parsed = dayjs.utc(cleanDate);
      } else {
        parsed = dayjs.utc(cleanDate, 'YYYY-MM-DD');
      }
    } else if (dayjs.isDayjs(dateValue)) {
      parsed = dateValue.utc ? dateValue.utc() : dayjs.utc(dateValue.toDate());
    } else {
      parsed = dayjs.utc(dateValue);
    }

    if (!parsed.isValid()) return '-';
    return parsed.format(format);
  } catch {
    return '-';
  }
}

/**
 * Formats a date into a human-readable compact/standard display format: "May 15, 1990" or "15 May 1990"
 */
export function formatDisplayDate(dateValue, format = 'MMM DD, YYYY') {
  return formatDate(dateValue, format);
}

/**
 * Formats a date specifically for backend API payload submission: "YYYY-MM-DD"
 */
export function formatDateForPayload(dateValue) {
  if (!dateValue) return undefined;
  try {
    let parsed;
    if (typeof dateValue === 'string') {
      const clean = dateValue.trim().split('T')[0];
      parsed = dayjs.utc(clean, 'YYYY-MM-DD');
    } else if (dayjs.isDayjs(dateValue)) {
      parsed = dateValue;
    } else {
      parsed = dayjs.utc(dateValue);
    }
    return parsed.isValid() ? parsed.format('YYYY-MM-DD') : undefined;
  } catch {
    return undefined;
  }
}

/**
 * System-independent age computer.
 */
export function computeAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  try {
    let dob;
    if (typeof dateOfBirth === 'string') {
      const clean = dateOfBirth.trim().split('T')[0];
      const parts = clean.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const today = new Date();
        let age = today.getFullYear() - year;
        const m = today.getMonth() - month;
        if (m < 0 || (m === 0 && today.getDate() < day)) age--;
        return age >= 0 ? age : null;
      }
      dob = dayjs.utc(dateOfBirth);
    } else {
      dob = dayjs.utc(dateOfBirth);
    }

    if (!dob || !dob.isValid()) return null;
    const now = dayjs();
    return Math.max(0, now.diff(dob, 'year'));
  } catch {
    return null;
  }
}

/**
 * The current instant expressed in a branch's wall clock.
 *
 * Appointments and other clinic-facing datetimes are stored as
 * pseudo-instants: the UTC wall-clock equals the clinic's wall-clock. So the
 * branch's "now" is the UTC wall-clock of the current instant, not the host
 * machine's local time.
 *
 * @param {string} [timeZone] - the branch's IANA zone
 * @returns {import('dayjs').Dayjs} the current wall clock
 */
export function clinicNow(timeZone) {
  if (typeof timeZone === 'string' && timeZone.trim()) {
    try {
      return dayjs().utc().tz(timeZone.trim());
    } catch {
      /* Fall through to the UTC wall-clock for an invalid zone. */
    }
  }
  return dayjs().utc();
}

/**
 * Normalizes any stored date value to a UTC dayjs instance.
 *
 * Values may be pseudo-instants (UTC wall-clock == clinic wall-clock), plain
 * ISO strings, or dayjs instances. Date-only strings stay on their own day
 * instead of drifting across the host's midnight.
 */
function branchDayjs(value) {
  if (!value) return dayjs.utc(NaN);
  if (dayjs.isDayjs(value)) return value.utc();
  if (typeof value === 'string') {
    const clean = value.trim();
    return clean.includes('T') || clean.endsWith('Z')
      ? dayjs.utc(clean)
      : dayjs.utc(clean, 'YYYY-MM-DD');
  }
  return dayjs.utc(value);
}

export function formatBranchDate(value, format = 'MM/DD/YYYY') {
  if (!value) return '-';
  const d = branchDayjs(value);
  return d.isValid() ? d.format(format) : '-';
}

export function formatBranchDateTime(value, format = 'MM/DD/YYYY h:mm A') {
  if (!value) return '-';
  const d = branchDayjs(value);
  return d.isValid() ? d.format(format) : '-';
}

export function formatBranchDateLong(value, format = 'MMM D, YYYY') {
  if (!value) return '-';
  const d = branchDayjs(value);
  return d.isValid() ? d.format(format) : '-';
}

export function formatBranchTime(value, format = 'h:mm A') {
  if (!value) return '-';
  if (typeof value === 'string' && /^\d{1,2}:\d{2}/.test(value.trim()))
    return dayjs.utc(`2000-01-01T${value.trim()}`).format(format);
  const d = branchDayjs(value);
  return d.isValid() ? d.format(format) : '-';
}

export function branchDateStr(value) {
  if (!value) return '';
  const d = branchDayjs(value);
  return d.isValid() ? d.format('YYYY-MM-DD') : '';
}

export function todayInBranch(tz) {
  return clinicNow(tz).format('YYYY-MM-DD');
}
