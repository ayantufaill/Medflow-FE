import {
  formatBranchDate, formatBranchDateTime,
  formatBranchDateLong, formatBranchTime, branchDateStr,
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
});
