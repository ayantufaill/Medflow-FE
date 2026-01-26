/**
 * Appointment Slice - Redux State Management
 * 
 * Purpose:
 * Manages appointment-related state that affects multiple modules:
 * - Current appointment (affects billing, clinical notes, check-in)
 * - Calendar view state (day/week/month) - persists across navigation
 * - Selected date (shared across appointment pages)
 * - Conflict detection state
 * 
 * Why Redux instead of local state:
 * - Appointment selection affects billing module (invoice generation)
 * - Calendar view preference should persist
 * - Selected date needs to be shared across multiple appointment pages
 * - Conflict detection state needs to be accessible from multiple components
 * 
 * @author Senior Software Engineer
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Current appointment being viewed/edited
  currentAppointment: null,
  
  // Selected appointment ID
  selectedAppointmentId: null,
  
  // Calendar view preference (persists across navigation)
  calendarView: 'week', // 'day' | 'week' | 'month'
  
  // Selected date for calendar (shared across appointment pages)
  selectedDate: new Date().toISOString(),
  
  // Conflict detection state
  conflicts: [],
  
  // UI state
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    /**
     * Set current appointment
     * Used when viewing/editing appointments
     */
    setCurrentAppointment: (state, action) => {
      state.currentAppointment = action.payload;
      state.selectedAppointmentId = action.payload?._id || action.payload?.id || null;
      state.error = null;
    },
    
    /**
     * Set selected appointment ID
     */
    setSelectedAppointmentId: (state, action) => {
      state.selectedAppointmentId = action.payload;
    },
    
    /**
     * Set calendar view preference
     * Persists across navigation for better UX
     */
    setCalendarView: (state, action) => {
      state.calendarView = action.payload;
    },
    
    /**
     * Set selected date for calendar
     * Shared across all appointment pages
     */
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    
    /**
     * Set appointment conflicts
     * Used for conflict detection and prevention
     */
    setConflicts: (state, action) => {
      state.conflicts = action.payload;
    },
    
    /**
     * Clear conflicts
     */
    clearConflicts: (state) => {
      state.conflicts = [];
    },
    
    /**
     * Clear current appointment
     */
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
      state.selectedAppointmentId = null;
      state.conflicts = [];
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
  setCurrentAppointment,
  setSelectedAppointmentId,
  setCalendarView,
  setSelectedDate,
  setConflicts,
  clearConflicts,
  clearCurrentAppointment,
  setLoading,
  setError,
} = appointmentSlice.actions;

// Selectors
export const selectCurrentAppointment = (state) => state.appointment.currentAppointment;
export const selectSelectedAppointmentId = (state) => state.appointment.selectedAppointmentId;
export const selectCalendarView = (state) => state.appointment.calendarView;
export const selectSelectedDate = (state) => state.appointment.selectedDate;
export const selectConflicts = (state) => state.appointment.conflicts;
export const selectAppointmentLoading = (state) => state.appointment.loading;
export const selectAppointmentError = (state) => state.appointment.error;

export default appointmentSlice.reducer;
