import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  fetchAppointmentById, setSelectedAppointmentId, setCurrentAppointment, clearCurrentAppointment,
} from './appointmentSlice';
import { appointmentService } from '../../services/appointment.service';

jest.mock('../../services/appointment.service', () => ({
  appointmentService: { getAppointmentById: jest.fn() },
}));

const makeStore = () => configureStore({ reducer: { appointment: reducer } });
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};

beforeEach(() => { jest.clearAllMocks(); localStorage.clear(); });

test('selects a cached appointment without another network call or extending its cache age', async () => {
  const store = makeStore();
  const visitA = { _id: '10', appointmentDate: '2026-10-10' };
  appointmentService.getAppointmentById.mockResolvedValueOnce(visitA);
  await store.dispatch(fetchAppointmentById('10'));
  const timestamp = store.getState().appointment.cache['10'].timestamp;
  store.dispatch(setCurrentAppointment({ _id: '20' }));
  store.dispatch(setSelectedAppointmentId('10'));
  await store.dispatch(fetchAppointmentById('10'));
  expect(appointmentService.getAppointmentById).toHaveBeenCalledTimes(1);
  expect(store.getState().appointment.currentAppointment).toEqual(visitA);
  expect(store.getState().appointment.cache['10'].timestamp).toBe(timestamp);
  expect(localStorage.getItem('selectedAppointmentId')).toBe('10');
});

test('fetches a different visit during an active request and ignores the late earlier response', async () => {
  const store = makeStore();
  const a = deferred(), b = deferred();
  appointmentService.getAppointmentById.mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise);
  const requestA = store.dispatch(fetchAppointmentById('10'));
  const requestB = store.dispatch(fetchAppointmentById('20'));
  expect(appointmentService.getAppointmentById).toHaveBeenCalledTimes(2);
  b.resolve({ id: '20' });
  await requestB;
  a.resolve({ _id: '10' });
  await requestA;
  expect(store.getState().appointment).toMatchObject({ currentAppointment: { id: '20' }, selectedAppointmentId: '20', detailLoading: false });
});

test('ignores a superseded failure while the current appointment is loading', async () => {
  const store = makeStore();
  const a = deferred(), b = deferred();
  appointmentService.getAppointmentById.mockReturnValueOnce(a.promise).mockReturnValueOnce(b.promise);
  const requestA = store.dispatch(fetchAppointmentById('10'));
  const requestB = store.dispatch(fetchAppointmentById('20'));
  a.reject(new Error('old request failed'));
  await requestA;
  expect(store.getState().appointment).toMatchObject({ detailLoading: true, detailError: null, selectedAppointmentId: '20' });
  b.resolve({ id: '20' });
  await requestB;
});

test('suppresses duplicate requests for the same active appointment', async () => {
  const store = makeStore();
  const pending = deferred();
  appointmentService.getAppointmentById.mockReturnValue(pending.promise);
  const first = store.dispatch(fetchAppointmentById('10'));
  store.dispatch(setSelectedAppointmentId(10));
  await store.dispatch(fetchAppointmentById(10));
  expect(appointmentService.getAppointmentById).toHaveBeenCalledTimes(1);
  pending.resolve({ id: '10' });
  await first;
  expect(store.getState().appointment.currentAppointment).toEqual({ id: '10' });
});

test('clears the old detail and reports failure for the newly requested appointment', async () => {
  const store = makeStore();
  store.dispatch(setCurrentAppointment({ _id: '10' }));
  appointmentService.getAppointmentById.mockRejectedValue(new Error('offline'));
  await store.dispatch(fetchAppointmentById('20'));
  expect(store.getState().appointment).toMatchObject({ currentAppointment: null, selectedAppointmentId: '20', detailLoading: false, detailError: 'Failed to fetch appointment' });
});

test.each([
  ['selecting another visit', () => setSelectedAppointmentId('20'), null],
  ['setting a clicked visit', () => setCurrentAppointment({ id: '20' }), { id: '20' }],
  ['ending the session', () => clearCurrentAppointment(), null],
])('%s prevents an in-flight response from restoring the previous visit', async (_name, action, expected) => {
  const store = makeStore();
  const pending = deferred();
  appointmentService.getAppointmentById.mockReturnValue(pending.promise);
  const request = store.dispatch(fetchAppointmentById('10'));
  store.dispatch(action());
  pending.resolve({ _id: '10' });
  await request;
  expect(store.getState().appointment.currentAppointment).toEqual(expected);
  expect(store.getState().appointment.detailLoading).toBe(false);
});
