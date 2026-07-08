import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { waitlistService } from '../../services/waitlist.service';

export const fetchWaitlist = createAsyncThunk(
  'waitlist/fetchWaitlist',
  async (args = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 50, providerId = '', patientId = '', status = 'pending', priority = '', search = '' } = args;
      return await waitlistService.getAllWaitlistEntries(page, limit, providerId, patientId, status, priority, search);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  waitlistEntries: [],
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 1,
  loading: false,
  error: null,
};

const waitlistSlice = createSlice({
  name: 'waitlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWaitlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWaitlist.fulfilled, (state, action) => {
        state.loading = false;
        state.waitlistEntries = action.payload.waitlistEntries;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchWaitlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default waitlistSlice.reducer;
