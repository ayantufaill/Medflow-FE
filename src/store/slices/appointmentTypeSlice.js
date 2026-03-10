import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentTypeService } from '../../services/appointment-type.service';

// ─── Async Thunks ────────────────────────────────────────────

export const fetchAppointmentTypes = createAsyncThunk(
  'appointmentType/fetchAppointmentTypes',
  async ({ page = 1, limit = 10, search = '', isActive = null } = {}, { rejectWithValue }) => {
    try {
      const result = await appointmentTypeService.getAllAppointmentTypes(page, limit, search, isActive);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch appointment types');
    }
  },
  {
    condition: (_, { getState }) => {
      const { appointmentType } = getState();
      return !appointmentType.listLoading;
    },
  }
);

// Fetch all for dropdowns (cached)
export const fetchAllAppointmentTypesForDropdown = createAsyncThunk(
  'appointmentType/fetchAllForDropdown',
  async (_, { getState, rejectWithValue }) => {
    const { appointmentType } = getState();
    if (appointmentType.dropdownList.length > 0 && appointmentType.dropdownLastFetched) {
      const elapsed = Date.now() - appointmentType.dropdownLastFetched;
      if (elapsed < 10 * 60 * 1000) return null;
    }
    try {
      const result = await appointmentTypeService.getAllAppointmentTypes(1, 200, '', true);
      return result.appointmentTypes || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch appointment types');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────

const initialState = {
  list: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  listLoading: false,
  listError: null,
  lastFetched: null,

  dropdownList: [],
  dropdownLoading: false,
  dropdownLastFetched: null,
};

const appointmentTypeSlice = createSlice({
  name: 'appointmentType',
  initialState,
  reducers: {
    invalidateAppointmentTypes: (state) => {
      state.lastFetched = null;
      state.dropdownLastFetched = null;
    },
    updateAppointmentTypeInList: (state, action) => {
      const updated = action.payload;
      const idx = state.list.findIndex(t => t._id === updated._id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
    },
    removeAppointmentTypeFromList: (state, action) => {
      state.list = state.list.filter(t => t._id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointmentTypes.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchAppointmentTypes.fulfilled, (state, action) => {
        state.list = action.payload.appointmentTypes || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.listLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAppointmentTypes.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      })
      .addCase(fetchAllAppointmentTypesForDropdown.pending, (state) => {
        state.dropdownLoading = true;
      })
      .addCase(fetchAllAppointmentTypesForDropdown.fulfilled, (state, action) => {
        if (action.payload !== null) {
          state.dropdownList = action.payload;
          state.dropdownLastFetched = Date.now();
        }
        state.dropdownLoading = false;
      })
      .addCase(fetchAllAppointmentTypesForDropdown.rejected, (state) => {
        state.dropdownLoading = false;
      });
  },
});

export const {
  invalidateAppointmentTypes,
  updateAppointmentTypeInList,
  removeAppointmentTypeFromList,
} = appointmentTypeSlice.actions;

export const selectAppointmentTypeList = (state) => state.appointmentType.list;
export const selectAppointmentTypePagination = (state) => state.appointmentType.pagination;
export const selectAppointmentTypeListLoading = (state) => state.appointmentType.listLoading;
export const selectAppointmentTypeListError = (state) => state.appointmentType.listError;
export const selectAppointmentTypeDropdownList = (state) => state.appointmentType.dropdownList;
export const selectAppointmentTypeDropdownLoading = (state) => state.appointmentType.dropdownLoading;

export default appointmentTypeSlice.reducer;
