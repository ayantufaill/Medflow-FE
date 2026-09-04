import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
