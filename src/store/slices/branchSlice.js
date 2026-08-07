import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { branchService } from '../../services/branch.service';

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchBranches = createAsyncThunk(
  'branch/fetchBranches',
  async (_, { rejectWithValue }) => {
    try {
      return await branchService.getBranches();
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch branches');
    }
  }
);

// Best-effort cross-device sync (PATCH /users/me/branch) — the local/localStorage value
// set by setCurrentBranch below is already the source of truth for this session, so a
// failure here is swallowed rather than surfaced as a user-facing error.
export const syncCurrentBranchToServer = createAsyncThunk(
  'branch/syncCurrentBranchToServer',
  async (branchId) => {
    try {
      await branchService.setCurrentBranch(branchId);
    } catch {
      // Intentionally silent — see comment above.
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────
// currentBranchId persists to localStorage the same way patientSlice's
// selectedPatientId does, so the active branch survives a page reload.

const initialState = {
  branches: [],
  currentBranchId: typeof window !== 'undefined' ? localStorage.getItem('currentBranchId') : null,
  loading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setCurrentBranch: (state, action) => {
      state.currentBranchId = action.payload;
      if (action.payload) {
        localStorage.setItem('currentBranchId', action.payload);
      } else {
        localStorage.removeItem('currentBranchId');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload || [];
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load branches';
      });
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const { setCurrentBranch } = branchSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectBranches = (state) => state.branch?.branches;
export const selectCurrentBranchId = (state) => state.branch?.currentBranchId;
export const selectBranchLoading = (state) => state.branch?.loading;

export default branchSlice.reducer;
