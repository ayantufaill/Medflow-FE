import { COVERAGE_BLOCKED_REASON_LABELS, getCoverageBlockedReasonLabel } from './cdtCategoryHelper';

describe('getCoverageBlockedReasonLabel', () => {
  it('maps every server reason to a human-readable label', () => {
    expect(getCoverageBlockedReasonLabel('not-covered')).toBe('Not covered');
    expect(getCoverageBlockedReasonLabel('waiting-period')).toBe('Waiting period');
    expect(getCoverageBlockedReasonLabel('age')).toBe('Age limit');
    expect(getCoverageBlockedReasonLabel('frequency')).toBe('Frequency limit');
    expect(getCoverageBlockedReasonLabel('lifetime-limit')).toBe('Lifetime limit reached');
    expect(getCoverageBlockedReasonLabel('teeth-limit')).toBe('Teeth limit');
  });

  it('returns an empty string for missing reasons so nothing renders', () => {
    expect(getCoverageBlockedReasonLabel(undefined)).toBe('');
    expect(getCoverageBlockedReasonLabel(null)).toBe('');
    expect(getCoverageBlockedReasonLabel('')).toBe('');
  });

  it('falls back to the raw reason for unknown values instead of hiding it', () => {
    expect(getCoverageBlockedReasonLabel('some-future-reason')).toBe('some-future-reason');
  });

  it('exposes the label map keyed by the exact server vocabulary', () => {
    expect(Object.keys(COVERAGE_BLOCKED_REASON_LABELS).sort()).toEqual([
      'age',
      'frequency',
      'lifetime-limit',
      'not-covered',
      'teeth-limit',
      'waiting-period',
    ]);
  });
});
