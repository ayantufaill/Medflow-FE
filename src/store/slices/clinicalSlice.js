/**
 * Clinical Slice - Redux State Management
 * 
 * Purpose:
 * Manages clinical documentation state:
 * - Current clinical note being written/viewed
 * - Selected note template
 * - Draft state management
 * 
 * Why Redux instead of local state:
 * - Clinical notes link to appointments and billing
 * - Note templates need to be accessible across clinical pages
 * - Draft state should persist across navigation
 * - Multiple components need to react to note changes
 * 
 * @author Senior Software Engineer
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Current clinical note being viewed/edited
  currentNote: null,
  
  // Selected note ID
  selectedNoteId: null,
  
  // Selected template for note creation
  selectedTemplate: null,
  
  // Draft notes (keyed by appointmentId or noteId)
  drafts: {},
  
  // UI state
  loading: false,
  error: null,
};

const clinicalSlice = createSlice({
  name: 'clinical',
  initialState,
  reducers: {
    /**
     * Set current clinical note
     */
    setCurrentNote: (state, action) => {
      state.currentNote = action.payload;
      state.selectedNoteId = action.payload?._id || action.payload?.id || null;
      state.error = null;
    },
    
    /**
     * Set selected note ID
     */
    setSelectedNoteId: (state, action) => {
      state.selectedNoteId = action.payload;
    },
    
    /**
     * Set selected template
     * Used when creating new notes
     */
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
    
    /**
     * Save draft note
     * Persists draft across navigation
     */
    saveDraft: (state, action) => {
      const { key, draft } = action.payload;
      state.drafts[key] = draft;
    },
    
    /**
     * Load draft note
     */
    loadDraft: (state, action) => {
      const draft = state.drafts[action.payload];
      if (draft) {
        state.currentNote = draft;
      }
    },
    
    /**
     * Clear draft
     */
    clearDraft: (state, action) => {
      delete state.drafts[action.payload];
    },
    
    /**
     * Clear all drafts
     */
    clearAllDrafts: (state) => {
      state.drafts = {};
    },
    
    /**
     * Clear current note
     */
    clearCurrentNote: (state) => {
      state.currentNote = null;
      state.selectedNoteId = null;
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
  setCurrentNote,
  setSelectedNoteId,
  setSelectedTemplate,
  saveDraft,
  loadDraft,
  clearDraft,
  clearAllDrafts,
  clearCurrentNote,
  setLoading,
  setError,
} = clinicalSlice.actions;

// Selectors
export const selectCurrentNote = (state) => state.clinical.currentNote;
export const selectSelectedNoteId = (state) => state.clinical.selectedNoteId;
export const selectSelectedTemplate = (state) => state.clinical.selectedTemplate;
export const selectDraft = (state, key) => state.clinical.drafts[key];
export const selectAllDrafts = (state) => state.clinical.drafts;
export const selectClinicalLoading = (state) => state.clinical.loading;
export const selectClinicalError = (state) => state.clinical.error;

export default clinicalSlice.reducer;
