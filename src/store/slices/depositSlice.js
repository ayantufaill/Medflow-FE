import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { depositService } from '../../services/deposit.service';

// Thunks
export const fetchDepositSlips = createAsyncThunk(
  'deposits/fetchDepositSlips',
  async ({ page, limit } = {}, { rejectWithValue }) => {
    try {
      const result = await depositService.getAllDepositSlips(page, limit);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch deposit slips');
    }
  }
);

export const fetchUnDepositedPayments = createAsyncThunk(
  'deposits/fetchUnDepositedPayments',
  async (_, { rejectWithValue }) => {
    try {
      const result = await depositService.getUnDepositedPayments();
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch un-deposited payments');
    }
  }
);

export const createDepositSlip = createAsyncThunk(
  'deposits/createDepositSlip',
  async (slipData, { dispatch, rejectWithValue }) => {
    try {
      const result = await depositService.createDepositSlip(slipData);
      // Reload deposit slips list
      dispatch(fetchDepositSlips());
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create deposit slip');
    }
  }
);

const initialState = {
  slips: [],
  unDeposited: {
    patientPayments: [],
    insurancePayments: [],
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
};

const depositSlice = createSlice({
  name: 'deposits',
  initialState,
  reducers: {
    clearDepositError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDepositSlips
      .addCase(fetchDepositSlips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepositSlips.fulfilled, (state, action) => {
        state.loading = false;
        state.slips = action.payload.slips || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchDepositSlips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchUnDepositedPayments
      .addCase(fetchUnDepositedPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnDepositedPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.unDeposited = action.payload || { patientPayments: [], insurancePayments: [] };
      })
      .addCase(fetchUnDepositedPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createDepositSlip
      .addCase(createDepositSlip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDepositSlip.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createDepositSlip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDepositError } = depositSlice.actions;

export default depositSlice.reducer;
