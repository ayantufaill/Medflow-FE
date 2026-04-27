import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { providerService } from '../../services/provider.service';

// ─── Async Thunks ────────────────────────────────────────────

export const fetchProviders = createAsyncThunk(
  'provider/fetchProviders',
  async ({ page = 1, limit = 10, search = '', isActive = null, specialty = '' } = {}, { rejectWithValue }) => {
    try {
      const result = await providerService.getAllProviders(page, limit, search, isActive, specialty);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch providers');
    }
  },
  {
    // Prevent duplicate in-flight requests
    condition: (_, { getState }) => {
      const { provider } = getState();
      return !provider.listLoading;
    },
  }
);

export const fetchProviderById = createAsyncThunk(
  'provider/fetchProviderById',
  async (providerId, { getState, rejectWithValue }) => {
    const { provider } = getState();
    const cached = provider.cache[providerId];
    if (cached?.data && cached.timestamp && provider.cacheMaxAgeMs != null) {
      const elapsed = Date.now() - cached.timestamp;
      if (elapsed < provider.cacheMaxAgeMs) return cached.data;
    }
    try {
      const providerData = await providerService.getProviderById(providerId);
      return providerData;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch provider');
    }
  },
  {
    condition: (_, { getState }) => {
      const { provider } = getState();
      return !provider.detailLoading;
    },
  }
);

// Fetch all providers for dropdowns (cached for a long time)
export const fetchAllProvidersForDropdown = createAsyncThunk(
  'provider/fetchAllForDropdown',
  async (_, { getState, rejectWithValue }) => {
    // Check if we already have dropdown data cached
    const { provider } = getState();
    if (provider.dropdownList.length > 0 && provider.dropdownLastFetched) {
      const elapsed = Date.now() - provider.dropdownLastFetched;
      if (elapsed < 10 * 60 * 1000) return null; // Still fresh, skip
    }
    try {
      // Removed isActive: true filter to ensure all providers are shown, same as patient search fix
      const result = await providerService.getAllProviders(1, 100, '', null);
      return result.providers || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch providers');
    }
  }
);

// Fetch specialties (cached for forms — e.g. ProviderForm)
const SPECIALTIES_CACHE_MS = 10 * 60 * 1000; // 10 min
export const fetchSpecialties = createAsyncThunk(
  'provider/fetchSpecialties',
  async (_, { getState, rejectWithValue }) => {
    const { provider } = getState();
    if (provider.specialties?.length > 0 && provider.specialtiesLastFetched) {
      const elapsed = Date.now() - provider.specialtiesLastFetched;
      if (elapsed < SPECIALTIES_CACHE_MS) return null;
    }
    try {
      const result = await providerService.getSpecialties();
      return result.specialties || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch specialties');
    }
  },
  {
    condition: (_, { getState }) => {
      const { provider } = getState();
      return !provider.specialtiesLoading;
    },
  }
);

// ─── Slice ───────────────────────────────────────────────────

const initialState = {
  // List state (for ProvidersListPage)
  list: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  filters: { search: '', statusFilter: '' },
  listLoading: false,
  listError: null,
  lastFetched: null,

  // Dropdown list (cached for forms — all active providers)
  dropdownList: [],
  dropdownLoading: false,
  dropdownLastFetched: null,

  // Detail cache (by provider id)
  cache: {},
  cacheMaxAgeMs: 5 * 60 * 1000, // 5 min — consider cached provider stale after this

  // Current provider
  currentProvider: null,
  detailLoading: false,
  detailError: null,

  // Specialties (for forms)
  specialties: [],
  specialtiesLoading: false,
  specialtiesLastFetched: null,
};

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    setCurrentProvider: (state, action) => {
      state.currentProvider = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    invalidateProviders: (state) => {
      state.lastFetched = null;
      state.dropdownLastFetched = null;
    },
    invalidateProviderDetail: (state, action) => {
      delete state.cache[action.payload];
    },
    updateProviderInList: (state, action) => {
      const updated = action.payload;
      const idx = state.list.findIndex(p => p._id === updated._id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
      const ddIdx = state.dropdownList.findIndex(p => p._id === updated._id);
      if (ddIdx !== -1) state.dropdownList[ddIdx] = { ...state.dropdownList[ddIdx], ...updated };
    },
    removeProviderFromList: (state, action) => {
      state.list = state.list.filter(p => p._id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        const providers = action.payload.providers || [];
        state.list = providers;
        state.pagination = action.payload.pagination || initialState.pagination;
        state.listLoading = false;
        state.lastFetched = Date.now();
        const now = Date.now();
        providers.forEach((p) => {
          if (p._id) {
            state.cache[p._id] = { data: p, timestamp: now };
          }
        });
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      })
      .addCase(fetchProviderById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchProviderById.fulfilled, (state, action) => {
        state.currentProvider = action.payload;
        state.detailLoading = false;
        if (action.payload?._id) {
          state.cache[action.payload._id] = { data: action.payload, timestamp: Date.now() };
        }
      })
      .addCase(fetchProviderById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      .addCase(fetchAllProvidersForDropdown.pending, (state) => {
        state.dropdownLoading = true;
      })
      .addCase(fetchAllProvidersForDropdown.fulfilled, (state, action) => {
        if (action.payload !== null) {
          state.dropdownList = action.payload;
          state.dropdownLastFetched = Date.now();
        }
        state.dropdownLoading = false;
      })
      .addCase(fetchAllProvidersForDropdown.rejected, (state, action) => {
        state.dropdownLoading = false;
      })
      .addCase(fetchSpecialties.pending, (state) => {
        state.specialtiesLoading = true;
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        if (action.payload !== null) {
          state.specialties = action.payload;
          state.specialtiesLastFetched = Date.now();
        }
        state.specialtiesLoading = false;
      })
      .addCase(fetchSpecialties.rejected, (state) => {
        state.specialtiesLoading = false;
      });
  },
});

export const {
  setCurrentProvider,
  setFilters,
  clearFilters,
  invalidateProviders,
  invalidateProviderDetail,
  updateProviderInList,
  removeProviderFromList,
} = providerSlice.actions;

// ─── Selectors ───────────────────────────────────────────────

export const selectProviderList = (state) => state.provider.list;
export const selectProviderPagination = (state) => state.provider.pagination;
export const selectProviderFilters = (state) => state.provider.filters;
export const selectProviderListLoading = (state) => state.provider.listLoading;
export const selectProviderListError = (state) => state.provider.listError;
export const selectProviderDropdownList = (state) => state.provider.dropdownList;
export const selectProviderDropdownLoading = (state) => state.provider.dropdownLoading;
export const selectCurrentProvider = (state) => state.provider.currentProvider;
export const selectProviderDetailLoading = (state) => state.provider.detailLoading;

/** Provider by id from cache or currentProvider (for Edit page — avoids refetch when already loaded). */
export const selectCachedProviderById = (state, providerId) => {
  if (!providerId) return null;
  const { cache, currentProvider, cacheMaxAgeMs } = state.provider;
  const cached = cache[providerId];
  if (cached?.data && cached.timestamp && Date.now() - cached.timestamp < cacheMaxAgeMs) {
    return cached.data;
  }
  if (currentProvider && (currentProvider._id === providerId || currentProvider.id === providerId)) {
    return currentProvider;
  }
  return null;
};

export const selectSpecialties = (state) => state.provider.specialties;
export const selectSpecialtiesLoading = (state) => state.provider.specialtiesLoading;

export default providerSlice.reducer;
