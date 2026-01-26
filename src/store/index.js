/**
 * Redux Store Configuration
 * 
 * Architecture Decision:
 * - Using Redux Toolkit for predictable state management
 * - Centralized store for complex application state that needs to be shared across modules
 * - Enables time-travel debugging, middleware support, and scalable state management
 * 
 * Why Redux for MedFlow:
 * 1. Complex state interactions (appointments → billing → claims)
 * 2. Multiple modules need shared state (patient, appointment, billing, clinical)
 * 3. HIPAA compliance requires audit logging (middleware support)
 * 4. Enterprise-scale application (12 sprints, 10+ modules)
 * 5. Team scalability (clear patterns for multiple developers)
 * 
 * @author Senior Software Engineer
 * @date 2024
 */

import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import billingReducer from './slices/billingSlice';
import clinicalReducer from './slices/clinicalSlice';
import uiReducer from './slices/uiSlice';

/**
 * Redux Store
 * 
 * Configured with:
 * - Redux Toolkit (reduces boilerplate)
 * - DevTools enabled in development
 * - Middleware for async operations and logging
 */
export const store = configureStore({
  reducer: {
    patient: patientReducer,
    appointment: appointmentReducer,
    billing: billingReducer,
    clinical: clinicalReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values (dates, functions in actions)
        ignoredActions: [
          'appointment/setSelectedDate',
          'patient/setFilters',
          'billing/setDateRange',
        ],
        ignoredActionPaths: ['payload.date', 'payload.callback'],
        ignoredPaths: ['appointment.selectedDate', 'patient.filters.dateRange'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
