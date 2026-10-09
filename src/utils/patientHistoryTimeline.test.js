import { formatHistoryTimestamp, resolveHistoryTimeZone } from './dateUtils';
import { selectHistoryEvents, historyEventAction, historyEventActor, historyEventDifferences } from './patientHistoryTimeline';

test('keeps every recorded event for the correct patient and section, including same-day saves', () => {
  const records = Array.from({ length: 25 }, (_, index) => ({
    _id: String(index), patientId: '7', section: 'medical_history',
    changedAt: `2026-10-09T10:${String(index).padStart(2, '0')}:00Z`,
  }));
  const input = [...records].reverse().concat([
    { ...records[0], _id: 'other-patient', patientId: '8' },
    { ...records[0], _id: 'dental', section: 'dental_history' },
    { ...records[0], _id: 'legacy', changedAt: null },
  ]);
  const result = selectHistoryEvents(input, '7', 'medical_history');
  expect(result.map((event) => event._id)).toEqual(['legacy', ...records.map((event) => event._id)]);
  expect(input[0]._id).toBe('24');
});

test('formats an instant in the clinic timezone with labelled UTC fallback and no invented date', () => {
  const instant = '2026-10-09T20:00:00Z';
  expect(formatHistoryTimestamp(instant, 'Asia/Karachi', true)).toBe('Oct 10, 2026');
  expect(formatHistoryTimestamp(instant, 'America/Los_Angeles', true)).toBe('Oct 09, 2026');
  expect(formatHistoryTimestamp(instant, 'invalid')).toContain('UTC');
  expect(resolveHistoryTimeZone('invalid')).toBeNull();
  expect(formatHistoryTimestamp(null, 'Asia/Karachi')).toBe('Date unavailable');
  expect(formatHistoryTimestamp('bad date', 'UTC')).toBe('Date unavailable');
  // DST jumps from 1:59 to 3:01 on this day in New York.
  expect(formatHistoryTimestamp('2026-03-08T06:59:00Z', 'America/New_York')).toContain('01:59');
  expect(formatHistoryTimestamp('2026-03-08T07:01:00Z', 'America/New_York')).toContain('03:01');
});

test('labels a new review only when the recorded review values changed', () => {
  const review = { reviewedWithPatient: true, reviewedAt: '2026-10-09T10:00:00Z' };
  expect(historyEventAction({ oldValue: {}, newValue: { review } })).toBe('Reviewed');
  expect(historyEventAction({ oldValue: { review }, newValue: { review } })).toBe('Saved');
  expect(historyEventActor({ actor: { _id: '7' } })).toBe('User 7');
  expect(historyEventActor({ source: 'office' })).toBe('User not recorded');
});

test('shows clinical field differences, ignores row reorder, and does not expose signature data', () => {
  const row = { id: 'diabetes', question: 'Diabetes?', answer: 'No' };
  const other = { id: 'asthma', question: 'Asthma?', answer: 'No' };
  const result = historyEventDifferences({
    oldValue: { sections: [row, other], review: { signatureDataUrl: null } },
    newValue: { sections: [other, { ...row, answer: 'Yes' }], review: { signatureDataUrl: 'data:image/png;base64,secret' } },
  }, 'UTC');
  expect(result).toHaveLength(2);
  expect(result).toContainEqual(expect.objectContaining({ before: 'No', after: 'Yes' }));
  expect(JSON.stringify(result)).not.toContain('base64');
  expect(historyEventDifferences({ oldValue: { sections: [row, other] }, newValue: { sections: [other, row] } }, 'UTC')).toEqual([]);
});
