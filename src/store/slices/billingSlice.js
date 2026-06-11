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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../config/api';

export const fetchBillingConfiguration = createAsyncThunk(
  'billing/fetchConfiguration',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/settings/billing_configuration', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.billingConfigLoading) return false;
    }
  }
);

export const saveBillingConfiguration = createAsyncThunk(
  'billing/saveConfiguration',
  async (configData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/admin-finance/settings/billing_configuration', configData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchARAutomationConfig = createAsyncThunk(
  'billing/fetchARAutomationConfig',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/settings/ar_automation_config', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.arAutomationLoading) return false;
    }
  }
);

export const saveARAutomationConfig = createAsyncThunk(
  'billing/saveARAutomationConfig',
  async (configData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/admin-finance/settings/ar_automation_config', configData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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
  
  // Billing Configuration
  billingConfiguration: null,
  billingConfigLoading: false,

  // AR Automation Configuration
  arAutomationConfig: null,
  arAutomationLoading: false,
  
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingConfiguration.pending, (state) => {
        state.billingConfigLoading = true;
      })
      .addCase(fetchBillingConfiguration.fulfilled, (state, action) => {
        state.billingConfigLoading = false;
        state.billingConfiguration = action.payload;
      })
      .addCase(fetchBillingConfiguration.rejected, (state, action) => {
        state.billingConfigLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(saveBillingConfiguration.pending, (state) => {
        state.billingConfigLoading = true;
      })
      .addCase(saveBillingConfiguration.fulfilled, (state, action) => {
        state.billingConfigLoading = false;
        state.billingConfiguration = action.payload;
      })
      .addCase(saveBillingConfiguration.rejected, (state, action) => {
        state.billingConfigLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchARAutomationConfig.pending, (state) => {
        state.arAutomationLoading = true;
      })
      .addCase(fetchARAutomationConfig.fulfilled, (state, action) => {
        state.arAutomationLoading = false;
        state.arAutomationConfig = action.payload;
      })
      .addCase(fetchARAutomationConfig.rejected, (state, action) => {
        state.arAutomationLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(saveARAutomationConfig.pending, (state) => {
        state.arAutomationLoading = true;
      })
      .addCase(saveARAutomationConfig.fulfilled, (state, action) => {
        state.arAutomationLoading = false;
        state.arAutomationConfig = action.payload;
      })
      .addCase(saveARAutomationConfig.rejected, (state, action) => {
        state.arAutomationLoading = false;
        state.error = action.payload;
      });
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
export const selectBillingConfiguration = (state) => state.billing.billingConfiguration;
export const selectBillingConfigLoading = (state) => state.billing.billingConfigLoading;
export const selectARAutomationConfig = (state) => state.billing.arAutomationConfig;
export const selectARAutomationLoading = (state) => state.billing.arAutomationLoading;
export const selectBillingLoading = (state) => state.billing.loading;
export const selectBillingError = (state) => state.billing.error;

export default billingSlice.reducer;
