import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feeService } from '../../services/fee.service';

export const fetchFeeGuides = createAsyncThunk(
  'feeGuides/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await feeService.getFeeSchedules();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { feeGuides } = getState();
      if (feeGuides.loading || feeGuides.feeGuides.length > 0) return false;
      return true;
    }
  }
);

export const createFeeGuide = createAsyncThunk(
  'feeGuides/create',
  async (name, { rejectWithValue }) => {
    try {
      const data = await feeService.createFeeSchedule(name);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateFeeGuide = createAsyncThunk(
  'feeGuides/update',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const data = await feeService.updateFeeSchedule(id, name);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteFeeGuide = createAsyncThunk(
  'feeGuides/delete',
  async (id, { rejectWithValue }) => {
    try {
      await feeService.deleteFeeSchedule(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const copyFeeGuide = createAsyncThunk(
  'feeGuides/copy',
  async ({ sourceId, newName }, { rejectWithValue }) => {
    try {
      const data = await feeService.copyFeeSchedule(sourceId, newName);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFeeGuideDetails = createAsyncThunk(
  'feeGuides/fetchDetails',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const data = await feeService.getFeeScheduleFees(id, params);
      return data; // Returns { data: [...], total }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProcedureCodes = createAsyncThunk(
  'feeGuides/fetchProcedureCodes',
  async (params, { rejectWithValue }) => {
    try {
      const response = await feeService.getProcedureCodes(params);
      return response.data; // The API returns { total, page, limit, data }, we return data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { feeGuides } = getState();
      if (feeGuides.procedureCodesLoading || feeGuides.procedureCodes.length > 0) return false;
      return true;
    }
  }
);

export const updateProcedureFee = createAsyncThunk(
  'feeGuides/updateProcedureFee',
  async ({ id, procCode, amount }, { rejectWithValue }) => {
    try {
      // The API takes an array of fees
      await feeService.updateFeeScheduleFees(id, [{ procCode, amount }]);
      return { procCode, amount };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const roundFeeGuideFees = createAsyncThunk(
  'feeGuides/roundFees',
  async ({ id, toNearest }, { rejectWithValue }) => {
    try {
      await feeService.roundFeeScheduleFees(id, toNearest);
      // We don't return the full list here, it's easier to just re-fetch details in the component
      return toNearest;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const savedDefaultId = localStorage.getItem('defaultFeeGuideId');

const initialState = {
  feeGuides: [],
  defaultFeeGuideId: savedDefaultId || null,
  loading: false,
  error: null,
  // Added for Fee Guide Details page
  selectedFeeGuideFees: [],
  selectedFeeGuideTotal: 0,
  detailsLoading: false,
  detailsError: null,
  procedureCodes: [],
  procedureCodesLoading: false,
  procedureCodesError: null,
};

const feeGuideSlice = createSlice({
  name: 'feeGuides',
  initialState,
  reducers: {
    setDefaultFeeGuide: (state, action) => {
      state.defaultFeeGuideId = action.payload;
      if (action.payload) {
        localStorage.setItem('defaultFeeGuideId', action.payload);
      } else {
        localStorage.removeItem('defaultFeeGuideId');
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchFeeGuides.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeeGuides.fulfilled, (state, action) => {
        state.loading = false;
        state.feeGuides = action.payload;
      })
      .addCase(fetchFeeGuides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createFeeGuide.fulfilled, (state, action) => {
        state.feeGuides.push(action.payload);
      })
      // Update
      .addCase(updateFeeGuide.fulfilled, (state, action) => {
        const payloadId = action.payload?._id?.toString() || action.payload?.FeeSchedNum?.toString() || action.payload?.id?.toString();
        const index = state.feeGuides.findIndex(fg => {
          const fgId = fg?._id?.toString() || fg?.FeeSchedNum?.toString() || fg?.id?.toString();
          return fgId === payloadId;
        });
        if (index !== -1) {
          state.feeGuides[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteFeeGuide.fulfilled, (state, action) => {
        state.feeGuides = state.feeGuides.filter(fg => {
          const fgId = fg?._id?.toString() || fg?.FeeSchedNum?.toString() || fg?.id?.toString();
          return fgId !== action.payload?.toString();
        });
      })
      // Copy
      .addCase(copyFeeGuide.fulfilled, (state, action) => {
        state.feeGuides.push(action.payload);
      })
      // Fetch Details
      .addCase(fetchFeeGuideDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchFeeGuideDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedFeeGuideFees = action.payload.data || [];
        state.selectedFeeGuideTotal = action.payload.total || 0;
      })
      .addCase(fetchFeeGuideDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload;
      })
      // Update Procedure Fee
      .addCase(updateProcedureFee.fulfilled, (state, action) => {
        const { procCode, amount } = action.payload;
        const index = state.selectedFeeGuideFees.findIndex(f => f.code === procCode);
        if (index !== -1) {
          state.selectedFeeGuideFees[index].fee = amount;
        }
      })
      // Fetch Procedure Codes
      .addCase(fetchProcedureCodes.pending, (state) => {
        state.procedureCodesLoading = true;
        state.procedureCodesError = null;
      })
      .addCase(fetchProcedureCodes.fulfilled, (state, action) => {
        state.procedureCodesLoading = false;
        state.procedureCodes = action.payload || [];
      })
      .addCase(fetchProcedureCodes.rejected, (state, action) => {
        state.procedureCodesLoading = false;
        state.procedureCodesError = action.payload;
      });
  },
});

export const { setDefaultFeeGuide } = feeGuideSlice.actions;

export const selectFeeGuides = (state) => state.feeGuides.feeGuides;
export const selectDefaultFeeGuideId = (state) => state.feeGuides.defaultFeeGuideId;
export const selectFeeGuidesLoading = (state) => state.feeGuides.loading;
export const selectFeeGuidesError = (state) => state.feeGuides.error;
export const selectFeeGuideDetails = (state) => state.feeGuides.selectedFeeGuideFees;
export const selectFeeGuideDetailsLoading = (state) => state.feeGuides.detailsLoading;
export const selectProcedureCodes = (state) => state.feeGuides.procedureCodes;
export const selectProcedureCodesLoading = (state) => state.feeGuides.procedureCodesLoading;

export default feeGuideSlice.reducer;
