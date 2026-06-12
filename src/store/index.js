import { configureStore, combineReducers } from '@reduxjs/toolkit';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import providerReducer from './slices/providerSlice';
import roomReducer from './slices/roomSlice';
import appointmentTypeReducer from './slices/appointmentTypeSlice';
import billingReducer from './slices/billingSlice';
import clinicalReducer from './slices/clinicalSlice';
import clinicalManagementReducer from './slices/clinicalManagementSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import insuranceReducer from './slices/insuranceSlice';
import documentReducer from './slices/documentSlice';
import serviceReducer from './slices/serviceSlice';
import practiceInfoReducer from './slices/practiceInfoSlice';
import userReducer from './slices/userSlice';
import feeGuideReducer from './slices/feeGuideSlice';
import dashboardGoalsReducer from './slices/dashboardGoalsSlice';

const appReducer = combineReducers({
  patient: patientReducer,
  appointment: appointmentReducer,
  provider: providerReducer,
  room: roomReducer,
  appointmentType: appointmentTypeReducer,
  billing: billingReducer,
  clinical: clinicalReducer,
  clinicalManagement: clinicalManagementReducer,
  ui: uiReducer,
  auth: authReducer,
  insurance: insuranceReducer,
  document: documentReducer,
  services: serviceReducer,
  practiceInfo: practiceInfoReducer,
  user: userReducer,
  feeGuides: feeGuideReducer,
  dashboardGoals: dashboardGoalsReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logoutUser/fulfilled' || action.type === 'auth/clearAuth') {
    // Reset the entire Redux state to undefined. This forces all reducers 
    // to return their initialState, effectively purging all cached PHI from memory.
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
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
