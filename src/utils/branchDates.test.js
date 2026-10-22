import {
  formatBranchDate, formatBranchDateTime,
  formatBranchDateLong, formatBranchTime, branchDateStr,
  isPastDateInClinic, isTodayInClinic, isPastSlotInClinic,
  resolveClinicTimeZone, DEFAULT_CLINIC_TIMEZONE,
} from './dateUtils';

describe('branch date helpers', () => {
  it('formats pseudo-instant as clinic wall clock not host clock', () => {
    const v = '2026-10-21T09:00:00.000Z';
    expect(formatBranchDate(v)).toBe('10/21/2026');
    expect(formatBranchDateTime(v)).toBe('10/21/2026 9:00 AM');
    expect(formatBranchDateLong(v)).toBe('Oct 21, 2026');
    expect(formatBranchTime(v)).toBe('9:00 AM');
    expect(branchDateStr(v)).toBe('2026-10-21');
  });

  it('keeps date-only values on their own day', () => {
    expect(formatBranchDate('2026-10-21')).toBe('10/21/2026');
    expect(branchDateStr('2026-10-21')).toBe('2026-10-21');
  });

  it('returns placeholder for missing values', () => {
    expect(formatBranchDate(null)).toBe('-');
    expect(branchDateStr(null)).toBe('');
  });

  it('correctly checks isPastDateInClinic, isTodayInClinic, and isPastSlotInClinic', () => {
    const tz = 'America/New_York';
    expect(isPastDateInClinic('2000-01-01', tz)).toBe(true);
    expect(isPastDateInClinic('2099-12-31', tz)).toBe(false);

    expect(isTodayInClinic('2000-01-01', tz)).toBe(false);
    expect(isTodayInClinic('2099-12-31', tz)).toBe(false);

    expect(isPastSlotInClinic('2000-01-01', '09:00', tz)).toBe(true);
    expect(isPastSlotInClinic('2099-12-31', '09:00', tz)).toBe(false);
  });

  it('resolves clinic timezones correctly', () => {
    expect(resolveClinicTimeZone('Asia/Karachi')).toBe('Asia/Karachi');
    expect(resolveClinicTimeZone({ timeZone: 'America/New_York' })).toBe('America/New_York');
    expect(resolveClinicTimeZone(null)).toBe(DEFAULT_CLINIC_TIMEZONE);
    expect(resolveClinicTimeZone('')).toBe(DEFAULT_CLINIC_TIMEZONE);
  });
});
