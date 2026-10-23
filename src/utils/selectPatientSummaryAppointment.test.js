import { selectPatientSummaryAppointment } from './selectPatientSummaryAppointment';

const past = { id: 'past', appointmentDate: '2026-10-20', status: 'canceled' };
const older = { id: 'older', appointmentDate: '2026-10-10' };
const future = { id: 'future', appointmentDate: '2026-10-25' };
const later = { id: 'later', appointmentDate: '2026-11-01' };
const today = { id: 'today', appointmentDate: '2026-10-23T00:00:00.000Z', startTime: '10:40' };

it('prefers an appointment on the selected clinic date', () => {
  expect(selectPatientSummaryAppointment([later, past, today, future], '2026-10-23')).toBe(today);
});

it('prefers the nearest future appointment over a more recent past appointment', () => {
  expect(selectPatientSummaryAppointment([later, past, future], '2026-10-23')).toBe(future);
});

it('falls back to the most recent past appointment including canceled appointments', () => {
  expect(selectPatientSummaryAppointment([past, older], '2026-10-23')).toBe(past);
});

it('uses the selected day when the calendar date changes', () => {
  expect(selectPatientSummaryAppointment([past, future, later], '2026-10-26')).toBe(later);
});

it('returns no appointment for empty or undated history', () => {
  expect(selectPatientSummaryAppointment([], '2026-10-23')).toBeNull();
  expect(selectPatientSummaryAppointment([{ id: 'undated' }], '2026-10-23')).toBeNull();
});
