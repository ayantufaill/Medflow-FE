/**
 * UI Slice - Redux State Management
 * 
 * Purpose:
 * Manages UI state that needs to be shared across components:
 * - Sidebar state
 * - Active module tracking
 * - Modal states
 * - Loading states for complex operations
 * 
 * Why Redux instead of local state:
 * - Sidebar state needs to be accessible from multiple components
 * - Active module tracking helps with navigation and breadcrumbs
 * - Modal states sometimes need to be controlled from multiple places
 * - Loading states for complex operations need to be coordinated
 * 
 * Note: Simple UI state (like button disabled) should remain in component state
 * This slice is only for UI state that needs to be shared across components
 * 
 * @author Senior Software Engineer
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Sidebar state
  sidebarOpen: true,
  
  // Active module (for navigation and breadcrumbs)
  activeModule: null,
  
  // Modal states (keyed by modal name)
  modals: {},
  
  // Global loading states (keyed by operation)
  loading: {},
  
  // Notifications (if not using SnackbarContext)
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Toggle sidebar
     */
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    /**
     * Set sidebar open state
     */
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    /**
     * Set active module
     * Used for navigation and breadcrumbs
     */
    setActiveModule: (state, action) => {
      state.activeModule = action.payload;
    },
    
    /**
     * Open modal
     */
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    
    /**
     * Close modal
     */
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    
    /**
     * Close all modals
     */
    closeAllModals: (state) => {
      state.modals = {};
    },
    
    /**
     * Set loading state for an operation
     */
    setLoading: (state, action) => {
      const { key, loading } = action.payload;
      if (loading) {
        state.loading[key] = true;
      } else {
        delete state.loading[key];
      }
    },
    
    /**
     * Check if any operation is loading
     */
    clearLoading: (state) => {
      state.loading = {};
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setActiveModule,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  clearLoading,
} = uiSlice.actions;

// Selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectActiveModule = (state) => state.ui.activeModule;
export const selectModalOpen = (state, modalName) => state.ui.modals[modalName] || false;
export const selectIsLoading = (state, key) => state.ui.loading[key] || false;
export const selectAnyLoading = (state) => Object.keys(state.ui.loading).length > 0;

export default uiSlice.reducer;
