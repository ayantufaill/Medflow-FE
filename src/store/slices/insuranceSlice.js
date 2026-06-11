import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { insuranceCompanyService, insurancePlanService } from '../../services/insurance.service';

export const fetchAllInsuranceCompaniesThunk = createAsyncThunk(
  'insurance/fetchAllCompanies',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch a large number to ensure we get them all for the dropdowns
      const data = await insuranceCompanyService.getAllInsuranceCompanies(1, 500);
      return data?.companies || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch insurance companies');
    }
  },
  {
    condition: (_, { getState }) => {
      const { insurance } = getState();
      if (insurance.companiesLoading || insurance.companies.length > 0) {
        return false;
      }
      return true;
    }
  }
);

export const fetchInsurancePlansThunk = createAsyncThunk(
  'insurance/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const data = await insurancePlanService.getInsurancePlans(1, 100, '');
      return data?.plans || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch insurance plans');
    }
  },
  {
    condition: (_, { getState }) => {
      const { insurance } = getState();
      if (insurance.plansLoading || insurance.plans.length > 0) {
        return false;
      }
      return true;
    }
  }
);

export const fetchCoverageTemplatesThunk = createAsyncThunk(
  'insurance/fetchCoverageTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const data = await insurancePlanService.getCoverageTemplates();
      return data?.templates || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch coverage templates');
    }
  },
  {
    condition: (_, { getState }) => {
      const { insurance } = getState();
      if (insurance.templatesLoading || insurance.templates.length > 0) {
        return false;
      }
      return true;
    }
  }
);

// ─── ADMIN MANAGEMENT THUNKS ────────────────────────────────────────────────────────

export const fetchCarriersList = createAsyncThunk(
  'insurance/fetchCarriersList',
  async ({ page = 1, limit = 100, search = '', status = '' } = {}, { rejectWithValue }) => {
    try {
      const result = await insuranceCompanyService.getAllInsuranceCompanies(page, limit, search, status);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch carriers');
    }
  }
);

export const fetchPlansList = createAsyncThunk(
  'insurance/fetchPlansList',
  async ({ page = 1, limit = 100, search = '' } = {}, { rejectWithValue }) => {
    try {
      const result = await insurancePlanService.getInsurancePlans(page, limit, search);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch plans');
    }
  }
);

export const createCarrierThunk = createAsyncThunk(
  'insurance/createCarrier',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await insuranceCompanyService.createInsuranceCompany(payload);
      return response; // Assumes response is the created company object
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create carrier');
    }
  }
);

export const updateCarrierThunk = createAsyncThunk(
  'insurance/updateCarrier',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await insuranceCompanyService.updateInsuranceCompany(id, payload);
      return response; // Assumes response is the updated company object
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update carrier');
    }
  }
);

export const deleteCarrierThunk = createAsyncThunk(
  'insurance/deleteCarrier',
  async (carrierId, { rejectWithValue }) => {
    try {
      if (insuranceCompanyService.deleteInsuranceCompany) {
        await insuranceCompanyService.deleteInsuranceCompany(carrierId);
      }
      return carrierId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to delete carrier');
    }
  }
);

export const deletePlanThunk = createAsyncThunk(
  'insurance/deletePlan',
  async (planId, { rejectWithValue }) => {
    try {
      if (insurancePlanService.deleteInsurancePlan) {
        await insurancePlanService.deleteInsurancePlan(planId);
      }
      return planId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to delete plan');
    }
  }
);

export const deleteMembershipPlanThunk = createAsyncThunk(
  'insurance/deleteMembershipPlan',
  async (planId, { rejectWithValue }) => {
    // Mock deletion
    return planId;
  }
);

const INITIAL_MEMBERSHIP_PLANS = [
  { id: '1', name: 'Bright Beginning', templateName: '', subscribers: 1, annualFee: '$550.00', monthlyFee: '$46.00' },
  { id: '2', name: 'Clean + Confident - Existing Patient', templateName: '', subscribers: 2, annualFee: '$800.00', monthlyFee: '$75.00' },
  { id: '3', name: 'Clean + Confident - New Patient', templateName: '', subscribers: 0, annualFee: '$1,050.00', monthlyFee: '$89.00' },
  { id: '4', name: 'Foundations (Perio) Program - New Patient', templateName: 'Foundations', subscribers: 3, annualFee: '$1,495.00', monthlyFee: '$133.00' },
  { id: '5', name: 'Foundations (Perio) Program Existing Patient', templateName: '', subscribers: 1, annualFee: '$1,195.00', monthlyFee: '$105.00' },
];

const initialState = {
  // Dropdown lists
  companies: [],
  companiesLoading: false,
  companiesError: null,

  plans: [],
  plansLoading: false,
  plansError: null,

  templates: [],
  templatesLoading: false,
  templatesError: null,

  // Admin Management Lists
  carriersList: [],
  carriersTotal: 0,
  carriersLoading: false,
  carriersError: null,

  // Converted Carriers Match
  convertedOldPayers: [],
  convertedOryxPayers: [],
  convertedMatchedPayers: [],

  // Vyne Carriers Match
  vyneOfficePayers: Array(15).fill({ name: 'Arizona Blue Cross Blue Shield of Georgia', id: '60054' }),
  vynePayersList: [],
  vyneMatchedPayers: [],

  plansList: [],
  plansListLoading: false,
  plansListError: null,

  membershipPlansList: INITIAL_MEMBERSHIP_PLANS,
  membershipPlansLoading: false,
};

const insuranceSlice = createSlice({
  name: 'insurance',
  initialState,
  reducers: {
    invalidateInsuranceCatalog: (state) => {
      state.companies = [];
      state.plans = [];
      state.templates = [];
    },
    addCarrierOptimistic: (state, action) => {
      state.carriersList = [action.payload, ...state.carriersList];
    },
    addPlanOptimistic: (state, action) => {
      state.plansList = [action.payload, ...state.plansList];
    },
    addMembershipPlanOptimistic: (state, action) => {
      state.membershipPlansList = [...state.membershipPlansList, action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      // Dropdown Companies
      .addCase(fetchAllInsuranceCompaniesThunk.pending, (state) => {
        state.companiesLoading = true;
        state.companiesError = null;
      })
      .addCase(fetchAllInsuranceCompaniesThunk.fulfilled, (state, action) => {
        state.companies = action.payload;
        state.companiesLoading = false;
      })
      .addCase(fetchAllInsuranceCompaniesThunk.rejected, (state, action) => {
        state.companiesLoading = false;
        state.companiesError = action.payload;
      })
      // Dropdown Plans
      .addCase(fetchInsurancePlansThunk.pending, (state) => {
        state.plansLoading = true;
        state.plansError = null;
      })
      .addCase(fetchInsurancePlansThunk.fulfilled, (state, action) => {
        state.plans = action.payload;
        state.plansLoading = false;
      })
      .addCase(fetchInsurancePlansThunk.rejected, (state, action) => {
        state.plansLoading = false;
        state.plansError = action.payload;
      })
      // Templates
      .addCase(fetchCoverageTemplatesThunk.pending, (state) => {
        state.templatesLoading = true;
        state.templatesError = null;
      })
      .addCase(fetchCoverageTemplatesThunk.fulfilled, (state, action) => {
        state.templates = action.payload;
        state.templatesLoading = false;
      })
      .addCase(fetchCoverageTemplatesThunk.rejected, (state, action) => {
        state.templatesLoading = false;
        state.templatesError = action.payload;
      })
      // Admin Carriers List
      .addCase(fetchCarriersList.pending, (state) => {
        state.carriersLoading = true;
        state.carriersError = null;
      })
      .addCase(fetchCarriersList.fulfilled, (state, action) => {
        state.carriersList = action.payload.companies || [];
        state.carriersTotal = action.payload.pagination?.total || 0;
        state.carriersLoading = false;
      })
      .addCase(fetchCarriersList.rejected, (state, action) => {
        state.carriersLoading = false;
        state.carriersError = action.payload;
      })
      .addCase(deleteCarrierThunk.fulfilled, (state, action) => {
        state.carriersList = state.carriersList.filter(c => (c._id || c.id) !== action.payload);
      })
      .addCase(createCarrierThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.carriersList = [action.payload, ...state.carriersList];
        }
      })
      .addCase(updateCarrierThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.carriersList.findIndex(c => (c._id || c.id) === (action.payload._id || action.payload.id));
          if (index !== -1) {
            state.carriersList[index] = action.payload;
          }
        }
      })
      // Admin Plans List
      .addCase(fetchPlansList.pending, (state) => {
        state.plansListLoading = true;
        state.plansListError = null;
      })
      .addCase(fetchPlansList.fulfilled, (state, action) => {
        state.plansList = action.payload.plans || [];
        state.plansListLoading = false;
      })
      .addCase(fetchPlansList.rejected, (state, action) => {
        state.plansListLoading = false;
        state.plansListError = action.payload;
      })
      .addCase(deletePlanThunk.fulfilled, (state, action) => {
        state.plansList = state.plansList.filter(p => (p._id || p.id) !== action.payload);
      })
      // Admin Membership Plans List (mock deletes)
      .addCase(deleteMembershipPlanThunk.fulfilled, (state, action) => {
        state.membershipPlansList = state.membershipPlansList.filter(p => p.id !== action.payload);
      });
  }
});

export const { 
  invalidateInsuranceCatalog, 
  addCarrierOptimistic, 
  addPlanOptimistic, 
  addMembershipPlanOptimistic 
} = insuranceSlice.actions;

// Dropdown selectors
export const selectAllCompanies = (state) => state.insurance.companies;
export const selectCompaniesLoading = (state) => state.insurance.companiesLoading;
export const selectAllPlans = (state) => state.insurance.plans;
export const selectPlansLoading = (state) => state.insurance.plansLoading;
export const selectCoverageTemplates = (state) => state.insurance.templates;
export const selectTemplatesLoading = (state) => state.insurance.templatesLoading;

// Admin List Selectors
export const selectCarriersList = (state) => state.insurance.carriersList;
export const selectCarriersTotal = (state) => state.insurance.carriersTotal;
export const selectCarriersLoading = (state) => state.insurance.carriersLoading;
export const selectPlansList = (state) => state.insurance.plansList;
export const selectPlansListLoading = (state) => state.insurance.plansListLoading;
export const selectMembershipPlansList = (state) => state.insurance.membershipPlansList;
export const selectMembershipPlansLoading = (state) => state.insurance.membershipPlansLoading;

// Match Carrier Selectors
export const selectConvertedOldPayers = (state) => state.insurance.convertedOldPayers;
export const selectConvertedOryxPayers = (state) => state.insurance.convertedOryxPayers;
export const selectConvertedMatchedPayers = (state) => state.insurance.convertedMatchedPayers;

export const selectVyneOfficePayers = (state) => state.insurance.vyneOfficePayers;
export const selectVynePayersList = (state) => state.insurance.vynePayersList;
export const selectVyneMatchedPayers = (state) => state.insurance.vyneMatchedPayers;

export default insuranceSlice.reducer;

