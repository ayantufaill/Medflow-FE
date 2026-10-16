import dayjs from 'dayjs';
import { getOutstandingDateBounds } from './outstandingDateBounds';

test('sends local calendar boundaries as exclusive ISO timestamps', () => {
  const now = dayjs('2026-10-16T12:00:00');
  const week = getOutstandingDateBounds('last7Days', {}, now);
  expect(dayjs(week.start).format('YYYY-MM-DD')).toBe('2026-10-10');
  expect(dayjs(week.end).format('YYYY-MM-DD')).toBe('2026-10-17');

  const range = getOutstandingDateBounds('range', {
    start: dayjs('2026-10-01'), end: dayjs('2026-10-02'),
  }, now);
  expect(dayjs(range.start).format('YYYY-MM-DD')).toBe('2026-10-01');
  expect(dayjs(range.end).format('YYYY-MM-DD')).toBe('2026-10-03');
});
