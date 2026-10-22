import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import appointmentReducer from '../../../../store/slices/appointmentSlice';
import branchReducer from '../../../../store/slices/branchSlice';
import patientReducer from '../../../../store/slices/patientSlice';
import providerReducer from '../../../../store/slices/providerSlice';
import roomReducer from '../../../../store/slices/roomSlice';
import appointmentTypeReducer from '../../../../store/slices/appointmentTypeSlice';
import practiceInfoReducer from '../../../../store/slices/practiceInfoSlice';
import clinicalReducer from '../../../../store/slices/clinicalSlice';
import clinicalManagementReducer from '../../../../store/slices/clinicalManagementSlice';
import serviceReducer from '../../../../store/slices/serviceSlice';
import userReducer from '../../../../store/slices/userSlice';
import uiReducer from '../../../../store/slices/uiSlice';
import authReducer from '../../../../store/slices/authSlice';
import billingReducer from '../../../../store/slices/billingSlice';
import insuranceReducer from '../../../../store/slices/insuranceSlice';
import documentReducer from '../../../../store/slices/documentSlice';
import feeGuideReducer from '../../../../store/slices/feeGuideSlice';
import notificationReducer from '../../../../store/slices/notificationSlice';
import practiceGroupReducer from '../../../../store/slices/practiceGroupSlice';
import waitlistReducer from '../../../../store/slices/waitlistSlice';

import liveFixture from './fixtures/uat-live-schedule.json';

/**
 * Live payloads captured from the running API with the seeded UAT accounts
 * (james.downtown / emma.uptown / owner@citysmiles). Each branch carries a
 * different IANA zone, so the same wall clock is a different calendar day in
 * every clinic.
 */
export const LIVE = liveFixture;

export const BRANCHES = {
  A: { id: '245', name: 'Sunrise Downtown', timeZone: 'America/New_York' },
  B: { id: '246', name: 'Sunrise Uptown', timeZone: 'America/Los_Angeles' },
  CS: { id: '247', name: 'City Smiles Main', timeZone: 'America/Chicago' },
};

/** The live payload of one seeded branch. */
export const liveBranch = (key) => LIVE.branches[key];

/** The live appointments of a branch, as the API returned them. */
export const liveAppointments = (key) => liveBranch(key).patientAppointments.appointments;

const initialOf = (reducer) => reducer(undefined, { type: '@@conformance/init' });

/** The initial state of a slice, so a test can preload a single key of it. */
export const initialSliceState = initialOf;

export function makeStore({
  branch,
  appointment = {},
  patient = {},
  practiceInfo = {},
  extra = {},
} = {}) {
  return configureStore({
    reducer: {
      appointment: appointmentReducer,
      appointmentType: appointmentTypeReducer,
      auth: authReducer,
      billing: billingReducer,
      branch: branchReducer,
      clinical: clinicalReducer,
      clinicalManagement: clinicalManagementReducer,
      document: documentReducer,
      feeGuides: feeGuideReducer,
      insurance: insuranceReducer,
      notification: notificationReducer,
      patient: patientReducer,
      practiceGroup: practiceGroupReducer,
      practiceInfo: practiceInfoReducer,
      provider: providerReducer,
      room: roomReducer,
      service: serviceReducer,
      ui: uiReducer,
      user: userReducer,
      waitlist: waitlistReducer,
    },
    preloadedState: {
      branch: {
        ...initialOf(branchReducer),
        branches: branch ? [branch] : [],
        currentBranchId: branch?.id ?? null,
      },
      appointment: { ...initialOf(appointmentReducer), ...appointment },
      patient: { ...initialOf(patientReducer), ...patient },
      practiceInfo: { ...initialOf(practiceInfoReducer), ...practiceInfo },
      ...extra,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
  });
}

export function renderWithStore(ui, { store, ...options } = {}) {
  const testStore = store || makeStore();
  const result = render(<Provider store={testStore}>{ui}</Provider>, options);
  return { store: testStore, ...result };
}

/**
 * The clinic's wall clock for an instant: the civil date/time inside the
 * branch's IANA zone. Appointment rows are pseudo-instants whose UTC
 * components already ARE the clinic's wall clock, so this is the "now" the
 * schedule screen must compare slots against.
 */
export function clinicWallClock(instant, tz) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = {};
  for (const part of fmt.formatToParts(instant)) {
    if (part.type !== 'literal') parts[part.type] = part.value;
  }
  const hour = parts.hour === '24' ? '00' : parts.hour;
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${hour}:${parts.minute}`,
    key: `${parts.year}-${parts.month}-${parts.day} ${hour}:${parts.minute}`,
  };
}

/** The wall clock of a stored appointment (its UTC components). */
export function appointmentWallClock(appointment) {
  const iso = appointment.date || appointment.appointmentDate;
  const d = new Date(iso);
  return {
    date: d.toISOString().slice(0, 10),
    time: d.toISOString().slice(11, 16),
    key: `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 16)}`,
  };
}

/** MM/DD/YYYY of a stored appointment, as the clinic sees it. */
export function appointmentDateLabel(appointment) {
  const { date } = appointmentWallClock(appointment);
  const [y, m, d] = date.split('-');
  return `${m}/${d}/${y}`;
}

/** The appointment's start time, formatted the way the history table shows it. */
export function appointmentTimeLabel(appointment) {
  const [rawHour, rawMinute] = (appointment.startTime || '00:00').split(':');
  const hour = Number(rawHour);
  const minute = rawMinute;
  const suffix = hour < 12 ? 'AM' : 'PM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(display).padStart(2, '0')}:${minute} ${suffix}`;
}

/** "MM/DD/YYYY hh:mm AM" of a stored appointment, as the clinic sees it. */
export function appointmentLabel(appointment) {
  return `${appointmentDateLabel(appointment)} ${appointmentTimeLabel(appointment)}`;
}

/**
 * Freezes the clock at the moment the live fixture was captured, so the
 * past/future expectations are deterministic no matter when the suite runs.
 */
export function freezeAtCapture() {
  jest.useFakeTimers({ doNotFake: ['queueMicrotask'] });
  jest.setSystemTime(new Date(LIVE.capturedAt));
  return new Date(LIVE.capturedAt);
}
