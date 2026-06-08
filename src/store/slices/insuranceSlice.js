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
        // If we already have companies loaded or loading, don't fetch again
        // (Unless we want to force refresh, but catalog data rarely changes)
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

const initialState = {
  companies: [],
  companiesLoading: false,
  companiesError: null,

  plans: [],
  plansLoading: false,
  plansError: null,

  templates: [],
  templatesLoading: false,
  templatesError: null,
};

const insuranceSlice = createSlice({
  name: 'insurance',
  initialState,
  reducers: {
    invalidateInsuranceCatalog: (state) => {
      state.companies = [];
      state.plans = [];
      state.templates = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Companies
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
      // Plans
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
      });
  }
});

export const { invalidateInsuranceCatalog } = insuranceSlice.actions;

export const selectAllCompanies = (state) => state.insurance.companies;
export const selectCompaniesLoading = (state) => state.insurance.companiesLoading;
export const selectAllPlans = (state) => state.insurance.plans;
export const selectPlansLoading = (state) => state.insurance.plansLoading;
export const selectCoverageTemplates = (state) => state.insurance.templates;
export const selectTemplatesLoading = (state) => state.insurance.templatesLoading;

export default insuranceSlice.reducer;
