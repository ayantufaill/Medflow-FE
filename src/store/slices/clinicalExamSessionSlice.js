/**
 * Clinical Exam Session Slice
 * 
 * Persists user-entered clinical data across tab navigation.
 * React Router unmounts components when switching routes, destroying
 * all useState data. This slice stores the data that should survive
 * those navigations so users don't lose their work.
 * 
 * What goes here: user-entered form data, selections, editor content.
 * What does NOT go here: dialog open/close, menu anchors, temporary UI state.
 */

import { createSlice } from '@reduxjs/toolkit';
import { clearCurrentPatient } from './patientSlice';
import { clearCurrentAppointment } from './appointmentSlice';

const initialState = {
  // Treatment Plan page state
  treatmentPlan: {
    selectedTeeth: [],
    missingTeeth: [],
    additionalTeeth: [],
    toothSurfaces: {},
    activeRestorativeCode: null,
    selectedProcedureIds: [],
    selectedVisitIds: [],
    activePlanId: null,
  },

  // Progress Notes page state
  progressNotes: {
    editorContent: '',
    progressSelectedTeeth: [],
    completedProcedures: null, // null means "use default"
    panoImages: {},
    formatState: { bold: false, italic: false, align: 'left' },
    checklistFindings: null, // null means "use default"
  },

  // Exam sub-tab states (keyed by sub-tab name)
  exam: {
    radiographic: {},
    headAndNeck: {},
    toothStructure: {},
    periodontal: {},
    dentofacial: {},
    airway: {},
    tmj: {},
    morphological: {},
    biomechanical: {},
    functional: {},
  },
};

const clinicalExamSessionSlice = createSlice({
  name: 'clinicalExamSession',
  initialState,
  reducers: {
    // --- Treatment Plan ---
    setTreatmentPlanSession: (state, action) => {
      state.treatmentPlan = { ...state.treatmentPlan, ...action.payload };
    },
    clearTreatmentPlanSession: (state) => {
      state.treatmentPlan = initialState.treatmentPlan;
    },

    // --- Progress Notes ---
    setProgressNotesSession: (state, action) => {
      state.progressNotes = { ...state.progressNotes, ...action.payload };
    },
    clearProgressNotesSession: (state) => {
      state.progressNotes = initialState.progressNotes;
    },

    // --- Exam sub-tabs ---
    setExamSubTabSession: (state, action) => {
      const { subTab, data } = action.payload;
      if (state.exam[subTab]) {
        state.exam[subTab] = { ...state.exam[subTab], ...data };
      }
    },
    clearExamSubTabSession: (state, action) => {
      const subTab = action.payload;
      if (state.exam[subTab]) {
        state.exam[subTab] = {};
      }
    },

    // --- Clear everything ---
    clearAllExamSessions: () => initialState,
  },
  extraReducers: (builder) => {
    // Auto-clear when patient or appointment changes
    builder
      .addCase(clearCurrentPatient, () => initialState)
      .addCase(clearCurrentAppointment, () => initialState);
  },
});

export const {
  setTreatmentPlanSession,
  clearTreatmentPlanSession,
  setProgressNotesSession,
  clearProgressNotesSession,
  setExamSubTabSession,
  clearExamSubTabSession,
  clearAllExamSessions,
} = clinicalExamSessionSlice.actions;

// Selectors
export const selectTreatmentPlanSession = (state) => state.clinicalExamSession.treatmentPlan;
export const selectProgressNotesSession = (state) => state.clinicalExamSession.progressNotes;
export const selectExamSubTabSession = (subTab) => (state) => state.clinicalExamSession.exam[subTab] || {};

export default clinicalExamSessionSlice.reducer;
