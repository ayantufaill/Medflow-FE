/**
 * Patient Slice - Redux State Management
 * 
 * Purpose:
 * Manages patient-related application state that needs to be shared across multiple modules:
 * - Current selected patient (used in appointments, billing, clinical notes)
 * - Patient list filters (shared across patient pages)
 * - Patient selection state (prevents redundant API calls)
 * 
 * Why Redux instead of local state:
 * - Patient selection affects appointments, billing, and clinical modules
 * - Filters need to persist across navigation
 * - Multiple components need to react to patient changes
 * - Enables undo/redo and time-travel debugging for critical patient data
 * 
 * @author Senior Software Engineer
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Current patient being viewed/edited (shared across modules)
  currentPatient: null,
  
  // Selected patient ID (for navigation and API calls)
  selectedPatientId: null,
  
  // Patient list filters (persist across navigation)
  filters: {
    search: '',
    status: '',
    dateRange: null,
  },
  
  // UI state
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    /**
     * Set the current patient being viewed
     * Used when navigating to patient detail pages
     */
    setCurrentPatient: (state, action) => {
      state.currentPatient = action.payload;
      state.selectedPatientId = action.payload?._id || action.payload?.id || null;
      state.error = null;
    },
    
    /**
     * Set selected patient ID
     * Used for navigation and API calls without full patient object
     */
    setSelectedPatientId: (state, action) => {
      state.selectedPatientId = action.payload;
      // Clear current patient if ID changes
      if (state.currentPatient?._id !== action.payload && 
          state.currentPatient?.id !== action.payload) {
        state.currentPatient = null;
      }
    },
    
    /**
     * Update patient list filters
     * Persists across navigation for better UX
     */
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    /**
     * Clear patient filters
     */
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    /**
     * Clear current patient
     * Used when navigating away from patient context
     */
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
      state.selectedPatientId = null;
    },
    
    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    /**
     * Set error state
     */
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCurrentPatient,
  setSelectedPatientId,
  setFilters,
  clearFilters,
  clearCurrentPatient,
  setLoading,
  setError,
} = patientSlice.actions;

// Selectors for optimized component access
export const selectCurrentPatient = (state) => state.patient.currentPatient;
export const selectSelectedPatientId = (state) => state.patient.selectedPatientId;
export const selectPatientFilters = (state) => state.patient.filters;
export const selectPatientLoading = (state) => state.patient.loading;
export const selectPatientError = (state) => state.patient.error;

export default patientSlice.reducer;
