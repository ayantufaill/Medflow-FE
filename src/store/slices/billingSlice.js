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

export const fetchAdjustmentTypes = createAsyncThunk(
  'billing/fetchAdjustmentTypes',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/definitions/1', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.adjustmentTypesLoading || billing.adjustmentTypes.length > 0) return false;
      return true;
    }
  }
);

export const createAdjustmentType = createAsyncThunk(
  'billing/createAdjustmentType',
  async (adjustmentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/admin-finance/definitions/1', adjustmentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAdjustmentType = createAsyncThunk(
  'billing/updateAdjustmentType',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin-finance/definitions/item/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAdjustmentType = createAsyncThunk(
  'billing/deleteAdjustmentType',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin-finance/definitions/item/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPaymentTypes = createAsyncThunk(
  'billing/fetchPaymentTypes',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/definitions/4', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.paymentTypesLoading || billing.paymentTypes.length > 0) return false;
      return true;
    }
  }
);

export const createPaymentType = createAsyncThunk(
  'billing/createPaymentType',
  async (paymentData, { rejectWithValue }) => {
    try {
      const { name, id, isHidden, ...settings } = paymentData;
      const payload = {
        name,
        type: JSON.stringify({
          depositSlip: settings.depositSlip || false,
          openEdge: settings.openEdge || false,
          prosperipay: settings.prosperipay || false,
          smilepay: settings.smilepay || false,
          note: settings.note || '',
          deletable: true,
          disabled: false
        })
      };
      const response = await apiClient.post('/admin-finance/definitions/4', payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePaymentType = createAsyncThunk(
  'billing/updatePaymentType',
  async (updateData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const existing = state.billing.paymentTypes.find(pt => pt.id === updateData.id) || {};
      
      const newSettings = {
        depositSlip: existing.depositSlip,
        openEdge: existing.openEdge,
        prosperipay: existing.prosperipay,
        smilepay: existing.smilepay,
        note: existing.note,
        deletable: existing.deletable,
        disabled: existing.disabled,
        ...updateData
      };

      const payload = {
        name: updateData.name !== undefined ? updateData.name : existing.name,
        isHidden: updateData.isHidden !== undefined ? updateData.isHidden : existing.isHidden,
        type: JSON.stringify({
          depositSlip: newSettings.depositSlip || false,
          openEdge: newSettings.openEdge || false,
          prosperipay: newSettings.prosperipay || false,
          smilepay: newSettings.smilepay || false,
          note: newSettings.note || '',
          deletable: newSettings.deletable !== undefined ? newSettings.deletable : true,
          disabled: newSettings.disabled !== undefined ? newSettings.disabled : false
        })
      };

      const response = await apiClient.put(`/admin-finance/definitions/item/${updateData.id}`, payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePaymentType = createAsyncThunk(
  'billing/deletePaymentType',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin-finance/definitions/item/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPaymentTypeDefaults = createAsyncThunk(
  'billing/fetchPaymentTypeDefaults',
  async (_, { signal, rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin-finance/settings/payment_types_defaults', { signal });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { billing } = getState();
      if (billing.paymentTypeDefaultsLoading) return false;
      return true;
    }
  }
);

export const savePaymentTypeDefaults = createAsyncThunk(
  'billing/savePaymentTypeDefaults',
  async (defaultsData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/admin-finance/settings/payment_types_defaults', defaultsData);
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

  // Adjustment Types
  adjustmentTypes: [],
  adjustmentTypesLoading: false,

  // Payment Types
  paymentTypes: [],
  paymentTypesLoading: false,
  paymentTypeDefaults: { patient: 'Master Card', insurance: 'Master Card', family: '' },
  
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
      })
      // Adjustment Types
      .addCase(fetchAdjustmentTypes.pending, (state) => {
        state.adjustmentTypesLoading = true;
      })
      .addCase(fetchAdjustmentTypes.fulfilled, (state, action) => {
        state.adjustmentTypesLoading = false;
        state.adjustmentTypes = action.payload;
      })
      .addCase(fetchAdjustmentTypes.rejected, (state, action) => {
        state.adjustmentTypesLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(createAdjustmentType.fulfilled, (state, action) => {
        state.adjustmentTypes.push(action.payload);
      })
      .addCase(updateAdjustmentType.fulfilled, (state, action) => {
        const index = state.adjustmentTypes.findIndex((adj) => adj.id === action.payload.id);
        if (index !== -1) {
          state.adjustmentTypes[index] = action.payload;
        }
      })
      .addCase(deleteAdjustmentType.fulfilled, (state, action) => {
        const index = state.adjustmentTypes.findIndex((adj) => adj.id === action.payload);
        if (index !== -1) {
          state.adjustmentTypes[index].isHidden = true;
        }
      })
      // Payment Types
      .addCase(fetchPaymentTypes.pending, (state) => {
        state.paymentTypesLoading = true;
      })
      .addCase(fetchPaymentTypes.fulfilled, (state, action) => {
        state.paymentTypesLoading = false;
        state.paymentTypes = action.payload.map(pt => {
          let parsed = {};
          try {
            if (pt.type && pt.type.startsWith('{')) {
              parsed = JSON.parse(pt.type);
            }
          } catch(e) {}
          return { ...pt, ...parsed, type: pt.name }; // Map actual name to 'type' property for UI, and spread parsed JSON
        });
      })
      .addCase(fetchPaymentTypes.rejected, (state, action) => {
        state.paymentTypesLoading = false;
        if (action.meta.aborted) return;
        state.error = action.payload;
      })
      .addCase(createPaymentType.fulfilled, (state, action) => {
        const pt = action.payload;
        let parsed = {};
        try { if (pt.type && pt.type.startsWith('{')) parsed = JSON.parse(pt.type); } catch(e) {}
        state.paymentTypes.push({ ...pt, ...parsed, type: pt.name });
      })
      .addCase(updatePaymentType.fulfilled, (state, action) => {
        const pt = action.payload;
        let parsed = {};
        try { if (pt.type && pt.type.startsWith('{')) parsed = JSON.parse(pt.type); } catch(e) {}
        const index = state.paymentTypes.findIndex((p) => p.id === pt.id);
        if (index !== -1) {
          state.paymentTypes[index] = { ...pt, ...parsed, type: pt.name };
        }
      })
      .addCase(deletePaymentType.fulfilled, (state, action) => {
        const index = state.paymentTypes.findIndex((pt) => pt.id === action.payload);
        if (index !== -1) {
          state.paymentTypes[index].isHidden = true;
        }
      })
      .addCase(fetchPaymentTypeDefaults.fulfilled, (state, action) => {
        state.paymentTypeDefaults = action.payload;
      })
      .addCase(savePaymentTypeDefaults.fulfilled, (state, action) => {
        state.paymentTypeDefaults = action.payload;
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
export const selectAdjustmentTypes = (state) => state.billing.adjustmentTypes;
export const selectAdjustmentTypesLoading = (state) => state.billing.adjustmentTypesLoading;
export const selectPaymentTypes = (state) => state.billing.paymentTypes;
export const selectPaymentTypesLoading = (state) => state.billing.paymentTypesLoading;
export const selectPaymentTypeDefaults = (state) => state.billing.paymentTypeDefaults;
export const selectBillingLoading = (state) => state.billing.loading;
export const selectBillingError = (state) => state.billing.error;

export default billingSlice.reducer;
