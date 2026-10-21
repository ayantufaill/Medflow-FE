import {
  isPastDateInClinic,
  isTodayInClinic,
  isPastSlotInClinic,
  todayInBranch,
  clinicNow,
  resolveClinicTimeZone,
  getTimeZoneAbbr,
  isDifferentFromUserTz,
  DEFAULT_CLINIC_TIMEZONE,
  formatBranchDate,
  formatBranchTime,
} from './dateUtils';

describe('Appointment Timezone Behavior for Creating, Showing, and Editing', () => {
  const nyTz = 'America/New_York';
  const karachiTz = 'Asia/Karachi';

  describe('resolveClinicTimeZone', () => {
    it('resolves explicit timezone string or branch object', () => {
      expect(resolveClinicTimeZone(karachiTz)).toBe(karachiTz);
      expect(resolveClinicTimeZone({ timeZone: nyTz })).toBe(nyTz);
      expect(resolveClinicTimeZone({ id: '1', name: 'Main', timeZone: 'America/Chicago' })).toBe('America/Chicago');
    });

    it('falls back to DEFAULT_CLINIC_TIMEZONE for null/empty/UTC', () => {
      expect(resolveClinicTimeZone(null)).toBe(DEFAULT_CLINIC_TIMEZONE);
      expect(resolveClinicTimeZone(undefined)).toBe(DEFAULT_CLINIC_TIMEZONE);
      expect(resolveClinicTimeZone('')).toBe(DEFAULT_CLINIC_TIMEZONE);
      expect(resolveClinicTimeZone('   ')).toBe(DEFAULT_CLINIC_TIMEZONE);
      expect(resolveClinicTimeZone('UTC')).toBe(DEFAULT_CLINIC_TIMEZONE);
    });
  });

  describe('Creating & Back-dated checks (isPastDateInClinic & todayInBranch)', () => {
    it('evaluates past dates strictly against the clinic date', () => {
      const nyToday = todayInBranch(nyTz);
      // Future date in NY is never past
      expect(isPastDateInClinic('2099-01-01', nyTz)).toBe(false);
      // Past date is always past
      expect(isPastDateInClinic('2000-01-01', nyTz)).toBe(true);
      // Today in NY is not past
      expect(isPastDateInClinic(nyToday, nyTz)).toBe(false);
      expect(isTodayInClinic(nyToday, nyTz)).toBe(true);
    });

    it('returns false for empty or null date values', () => {
      expect(isPastDateInClinic(null, nyTz)).toBe(false);
      expect(isPastDateInClinic('', nyTz)).toBe(false);
      expect(isPastDateInClinic(undefined, nyTz)).toBe(false);
    });
  });

  describe('Showing & Schedule Grid slot availability (isPastSlotInClinic)', () => {
    it('returns false for falsy date or time', () => {
      expect(isPastSlotInClinic(null, '10:00', nyTz)).toBe(false);
      expect(isPastSlotInClinic('2026-10-25', null, nyTz)).toBe(false);
    });

    it('marks all slots on a past date as past', () => {
      expect(isPastSlotInClinic('2000-01-01', '08:00', nyTz)).toBe(true);
      expect(isPastSlotInClinic('2000-01-01', '17:00', nyTz)).toBe(true);
    });

    it('marks all slots on a future date as NOT past', () => {
      expect(isPastSlotInClinic('2099-12-31', '08:00', nyTz)).toBe(false);
      expect(isPastSlotInClinic('2099-12-31', '17:00', nyTz)).toBe(false);
    });

    it('correctly compares slots on clinic today against clinic now', () => {
      const nowInNy = clinicNow(nyTz);
      const todayNy = nowInNy.format('YYYY-MM-DD');

      // Slot 2 hours before now is past
      const pastHour = Math.max(0, nowInNy.hour() - 2);
      const pastTimeStr = `${String(pastHour).padStart(2, '0')}:00`;
      if (nowInNy.hour() >= 2) {
        expect(isPastSlotInClinic(todayNy, pastTimeStr, nyTz)).toBe(true);
      }

      // Slot 2 hours after now is NOT past
      const futureHour = Math.min(23, nowInNy.hour() + 2);
      const futureTimeStr = `${String(futureHour).padStart(2, '0')}:00`;
      if (nowInNy.hour() <= 21) {
        expect(isPastSlotInClinic(todayNy, futureTimeStr, nyTz)).toBe(false);
      }
    });
  });

  describe('Displaying Appointment times & Timezone abbreviations', () => {
    it('formats appointment time in 12-hour format without timezone distortion', () => {
      expect(formatBranchTime('09:30')).toBe('9:30 AM');
      expect(formatBranchTime('14:45')).toBe('2:45 PM');
      expect(formatBranchTime('2026-10-25T14:30:00.000Z')).toBe('2:30 PM');
    });

    it('formats appointment date without timezone distortion', () => {
      expect(formatBranchDate('2026-10-25T14:30:00.000Z')).toBe('10/25/2026');
      expect(formatBranchDate('2026-10-25')).toBe('10/25/2026');
    });

    it('returns a non-empty abbreviation for timezone', () => {
      const abbrNy = getTimeZoneAbbr(nyTz);
      expect(typeof abbrNy).toBe('string');
      expect(abbrNy.length).toBeGreaterThan(0);

      const abbrKhi = getTimeZoneAbbr(karachiTz);
      expect(['PKT', 'GMT+5']).toContain(abbrKhi);
    });
  });
});
