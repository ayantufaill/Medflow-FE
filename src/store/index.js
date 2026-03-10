import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import providerReducer from './slices/providerSlice';
import roomReducer from './slices/roomSlice';
import appointmentTypeReducer from './slices/appointmentTypeSlice';
import billingReducer from './slices/billingSlice';
import clinicalReducer from './slices/clinicalSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    patient: patientReducer,
    appointment: appointmentReducer,
    provider: providerReducer,
    room: roomReducer,
    appointmentType: appointmentTypeReducer,
    billing: billingReducer,
    clinical: clinicalReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'appointment/setSelectedDate',
          'patient/setFilters',
          'billing/setDateRange',
        ],
        ignoredActionPaths: ['payload.date', 'payload.callback'],
        ignoredPaths: ['appointment.selectedDate', 'patient.filters.dateRange'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export default store;
