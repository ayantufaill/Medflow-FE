/**
 * Billing Slice - Redux State Management
 * 
 * Purpose:
 * Manages billing and revenue cycle state:
 * - Current invoice being processed
 * - Claim status tracking
 * - Payment plan management
 * - A/R aging calculations
 * 
 * Why Redux instead of local state:
 * - Invoice state affects multiple billing pages
 * - Claim status needs to be tracked across modules
 * - Payment plans need to be accessible from patient and billing modules
 * - Complex calculations (A/R aging) benefit from centralized state
 * - Financial data requires predictable state updates (audit compliance)
 * 
 * @author Senior Software Engineer
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Current invoice being viewed/edited
  currentInvoice: null,
  
  // Selected invoice ID
  selectedInvoiceId: null,
  
  // Claim status map (claimId -> status)
  claimStatus: {},
  
  // Payment plans
  paymentPlans: [],
  
  // A/R aging data
  arAging: null,
  
  // UI state
  loading: false,
  error: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    /**
     * Set current invoice
     */
    setCurrentInvoice: (state, action) => {
      state.currentInvoice = action.payload;
      state.selectedInvoiceId = action.payload?._id || action.payload?.id || null;
      state.error = null;
    },
    
    /**
     * Set selected invoice ID
     */
    setSelectedInvoiceId: (state, action) => {
      state.selectedInvoiceId = action.payload;
    },
    
    /**
     * Update claim status
     * Used for tracking claim processing across modules
     */
    updateClaimStatus: (state, action) => {
      const { claimId, status } = action.payload;
      state.claimStatus[claimId] = status;
    },
    
    /**
     * Set multiple claim statuses
     * Used when loading claim list
     */
    setClaimStatuses: (state, action) => {
      state.claimStatus = action.payload;
    },
    
    /**
     * Set payment plans
     */
    setPaymentPlans: (state, action) => {
      state.paymentPlans = action.payload;
    },
    
    /**
     * Add payment plan
     */
    addPaymentPlan: (state, action) => {
      state.paymentPlans.push(action.payload);
    },
    
    /**
     * Set A/R aging data
     */
    setArAging: (state, action) => {
      state.arAging = action.payload;
    },
    
    /**
     * Clear current invoice
     */
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
      state.selectedInvoiceId = null;
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
  setCurrentInvoice,
  setSelectedInvoiceId,
  updateClaimStatus,
  setClaimStatuses,
  setPaymentPlans,
  addPaymentPlan,
  setArAging,
  clearCurrentInvoice,
  setLoading,
  setError,
} = billingSlice.actions;

// Selectors
export const selectCurrentInvoice = (state) => state.billing.currentInvoice;
export const selectSelectedInvoiceId = (state) => state.billing.selectedInvoiceId;
export const selectClaimStatus = (state, claimId) => state.billing.claimStatus[claimId];
export const selectAllClaimStatuses = (state) => state.billing.claimStatus;
export const selectPaymentPlans = (state) => state.billing.paymentPlans;
export const selectArAging = (state) => state.billing.arAging;
export const selectBillingLoading = (state) => state.billing.loading;
export const selectBillingError = (state) => state.billing.error;

export default billingSlice.reducer;
