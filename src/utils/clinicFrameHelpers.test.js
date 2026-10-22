import dayjs from 'dayjs';

import {
  calendarDateStr,
  clinicCivilDate,
  clinicCivilDayjs,
  clinicDateOffset,
  clinicNow,
  clinicStartOfDayInstant,
  clinicWallClockAt,
  clinicWallClockOf,
  formatBranchDate,
  formatBranchTime,
  formatClinicInstant,
  isPastSlotInClinic,
  resolveClinicTimeZone,
  todayInBranch,
  wallClockStr,
} from './dateUtils';

const NY = 'America/New_York';
const LA = 'America/Los_Angeles';
const CHI = 'America/Chicago';

describe('clinic frame helpers', () => {
  describe('calendarDateStr', () => {
    it('reads the day a picker hands back without moving it', () => {
      // A picker value is anchored to the day the user picked, whatever the
      // host zone is.
      const picked = dayjs('2026-10-22T00:00:00');
      expect(calendarDateStr(picked)).toBe('2026-10-22');
    });

    it('keeps date-only strings on their own day', () => {
      expect(calendarDateStr('2026-10-22')).toBe('2026-10-22');
    });

    it('reads an instant on its UTC day', () => {
      expect(calendarDateStr('2026-10-22T04:30:00.000Z')).toBe('2026-10-22');
      expect(calendarDateStr('2026-10-22T23:30:00.000Z')).toBe('2026-10-22');
    });

    it('returns an empty string for missing values', () => {
      expect(calendarDateStr(null)).toBe('');
      expect(calendarDateStr('')).toBe('');
    });
  });

  describe('wallClockStr', () => {
    it('formats the value own clock', () => {
      expect(wallClockStr(dayjs('2026-10-22T14:30:00'), 'YYYY-MM-DDTHH:mm')).toBe(
        '2026-10-22T14:30'
      );
    });

    it('returns an empty string for missing values', () => {
      expect(wallClockStr(null)).toBe('');
    });
  });

  describe('formatClinicInstant', () => {
    it('shows a real instant in the clinic zone', () => {
      // 2026-10-22T02:30Z is still the 21st in New York.
      const instant = '2026-10-22T02:30:00.000Z';
      expect(formatClinicInstant(instant, NY, 'MM/DD/YYYY')).toBe('10/21/2026');
      expect(formatClinicInstant(instant, LA, 'MM/DD/YYYY')).toBe('10/21/2026');
      expect(formatClinicInstant(instant, CHI, 'MM/DD/YYYY')).toBe('10/21/2026');
      expect(formatClinicInstant(instant, 'Pacific/Kiritimati', 'MM/DD/YYYY')).toBe(
        '10/22/2026'
      );
    });

    it('falls back for missing values', () => {
      expect(formatClinicInstant(null, NY)).toBe('-');
    });
  });

  describe('clinic civil day', () => {
    it('reads an instant on the calendar day of the clinic', () => {
      // 2026-10-22T02:30Z is the 21st in New York and the 22nd in Kiritimati.
      const instant = '2026-10-22T02:30:00.000Z';
      expect(clinicCivilDate(instant, NY)).toBe('2026-10-21');
      expect(clinicCivilDate(instant, 'Pacific/Kiritimati')).toBe('2026-10-22');
    });

    it('anchors a dayjs to the clinic day', () => {
      const d = clinicCivilDayjs('2026-10-22T02:30:00.000Z', NY);
      expect(d.format('YYYY-MM-DD')).toBe('2026-10-21');
      expect(d.format('YYYY-MM-DD HH:mm')).toBe('2026-10-21 22:30');
    });

    it('keeps the clinic start of day on that clinic day', () => {
      const start = clinicStartOfDayInstant('2026-10-22', NY);
      expect(start.toISOString()).toBe('2026-10-22T04:00:00.000Z');
    });
  });

  describe('clinic wall clock', () => {
    it('reads a stored pseudo-instant as the clinic wall clock', () => {
      // The stored UTC components already are the clinic wall clock.
      expect(clinicWallClockOf('2026-10-22T09:00:00.000Z', NY).format('YYYY-MM-DD HH:mm')).toBe(
        '2026-10-22 09:00'
      );
    });

    it('builds a clinic wall clock from a date and a time', () => {
      const at = clinicWallClockAt('2026-10-22', '09:30', NY);
      expect(at.format('YYYY-MM-DD HH:mm')).toBe('2026-10-22 09:30');
    });
  });

  describe('clinic today', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('is the clinic calendar day, not the host one', () => {
      // 2026-10-22T02:30Z: still the 21st in New York, already the 22nd in
      // Kiritimati.
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-10-22T02:30:00.000Z'));

      expect(todayInBranch(NY)).toBe('2026-10-21');
      expect(todayInBranch('Pacific/Kiritimati')).toBe('2026-10-22');
      expect(clinicDateOffset(NY, 1)).toBe('2026-10-22');
      expect(clinicDateOffset(NY, -1)).toBe('2026-10-20');
    });
  });

  describe('isPastSlotInClinic', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('compares the slot against the clinic clock', () => {
      jest.useFakeTimers();
      // The clinic in New York is at 22:30 on the 21st.
      jest.setSystemTime(new Date('2026-10-22T02:30:00.000Z'));

      expect(isPastSlotInClinic('2026-10-21', '22:00', NY)).toBe(true);
      expect(isPastSlotInClinic('2026-10-21', '23:00', NY)).toBe(false);
      expect(isPastSlotInClinic('2026-10-20', '09:00', NY)).toBe(true);
      expect(isPastSlotInClinic('2026-10-22', '09:00', NY)).toBe(false);
    });
  });

  describe('branch formatting of pseudo-instants', () => {
    it('never drifts with the host zone', () => {
      expect(formatBranchDate('2026-10-21T09:00:00.000Z')).toBe('10/21/2026');
      expect(formatBranchTime('2026-10-21T09:00:00.000Z')).toBe('9:00 AM');
      expect(formatBranchTime('09:00')).toBe('9:00 AM');
    });

    it('keeps the meridiem of a wall-clock time', () => {
      expect(formatBranchTime('09:00')).toBe('9:00 AM');
      expect(formatBranchTime('14:05')).toBe('2:05 PM');
      expect(formatBranchTime('9:30 AM')).toBe('9:30 AM');
      expect(formatBranchTime('10:30 AM')).toBe('10:30 AM');
      expect(formatBranchTime('12:00 AM')).toBe('12:00 AM');
      expect(formatBranchTime('12:30 PM')).toBe('12:30 PM');
      expect(formatBranchTime('2:05 pm')).toBe('2:05 PM');
      expect(formatBranchTime('09:00:00')).toBe('9:00 AM');
      expect(formatBranchTime('14:05:00')).toBe('2:05 PM');
    });
  });

  describe('resolveClinicTimeZone', () => {
    it('falls back to the default zone', () => {
      expect(resolveClinicTimeZone('UTC')).toBe('America/New_York');
      expect(resolveClinicTimeZone({ timeZone: LA })).toBe(LA);
    });
  });

  describe('clinicNow', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('is the wall clock of the clinic', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-10-22T02:30:00.000Z'));

      expect(clinicNow(NY).format('YYYY-MM-DD HH:mm')).toBe('2026-10-21 22:30');
      expect(clinicNow('Pacific/Kiritimati').format('YYYY-MM-DD HH:mm')).toBe(
        '2026-10-22 16:30'
      );
    });
  });
});
