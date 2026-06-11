import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { serviceCatalogService } from '../../services/service-catalog.service';

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (options, { rejectWithValue }) => {
    try {
      const response = await serviceCatalogService.getAllServices(options);
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch services'
      );
    }
  },
  {
    condition: (options, { getState }) => {
      const state = getState();
      // Deduplicate: If we are already loading services, don't fire another simultaneous request
      if (state.services.loading) {
        return false;
      }
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchServiceById',
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await serviceCatalogService.getServiceById(serviceId);
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch service'
      );
    }
  },
  {
    condition: (serviceId, { getState }) => {
      const state = getState();
      // Deduplicate: If we are already loading a service, don't fire another simultaneous request
      if (state.services.loading) {
        return false;
      }
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await serviceCatalogService.createService(serviceData);
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create service'
      );
    }
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await serviceCatalogService.updateService(id, updates);
      return response;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update service'
      );
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (serviceId, { rejectWithValue }) => {
    try {
      await serviceCatalogService.deleteService(serviceId);
      return serviceId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to delete service'
      );
    }
  }
);

export const toggleServiceStatus = createAsyncThunk(
  'services/toggleServiceStatus',
  async (serviceId, { rejectWithValue }) => {
    try {
      await serviceCatalogService.toggleServiceStatus(serviceId);
      return serviceId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to toggle service'
      );
    }
  }
);

const initialState = {
  list: [],
  total: 0,
  details: null,
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearServiceDetails: (state) => {
      state.details = null;
    },
    clearServicesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.services || [];
        state.total = action.payload.pagination?.total || 0;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Service By Id
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Service
      .addCase(createService.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.total += 1;
      })
      // Update Service
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.list.findIndex(s => (s.id || s._id) === (action.payload.id || action.payload._id));
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.details && (state.details.id || state.details._id) === (action.payload.id || action.payload._id)) {
          state.details = action.payload;
        }
      })
      // Delete Service
      .addCase(deleteService.fulfilled, (state, action) => {
        state.list = state.list.filter(s => (s.id || s._id) !== action.payload);
        state.total -= 1;
      })
      // Toggle Service
      .addCase(toggleServiceStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(s => (s.id || s._id) === action.payload);
        if (index !== -1) {
          state.list[index].isActive = !state.list[index].isActive;
        }
        if (state.details && (state.details.id || state.details._id) === action.payload) {
          state.details.isActive = !state.details.isActive;
        }
      });
  },
});

export const { clearServiceDetails, clearServicesError } = serviceSlice.actions;

export const selectServices = (state) => state.services.list;
export const selectTotalServices = (state) => state.services.total;
export const selectServiceDetails = (state) => state.services.details;
export const selectServicesLoading = (state) => state.services.loading;
export const selectServicesError = (state) => state.services.error;

export default serviceSlice.reducer;
