import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { practiceGroupService } from '../../services/practiceGroup.service';

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchPracticeGroups = createAsyncThunk(
  'practiceGroup/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await practiceGroupService.getPracticeGroups();
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch practice groups');
    }
  }
);

export const createPracticeGroup = createAsyncThunk(
  'practiceGroup/create',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const group = await practiceGroupService.createPracticeGroup(payload);
      dispatch(fetchPracticeGroups());
      return group;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to create practice group');
    }
  }
);

export const updatePracticeGroup = createAsyncThunk(
  'practiceGroup/update',
  async ({ groupId, payload }, { dispatch, rejectWithValue }) => {
    try {
      const group = await practiceGroupService.updatePracticeGroup(groupId, payload);
      dispatch(fetchPracticeGroups());
      return group;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to update practice group');
    }
  }
);

export const fetchGroupUsers = createAsyncThunk(
  'practiceGroup/fetchGroupUsers',
  async (groupId, { rejectWithValue }) => {
    try {
      return await practiceGroupService.getGroupUsers(groupId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to fetch group users');
    }
  }
);

export const createBranch = createAsyncThunk(
  'practiceGroup/createBranch',
  async ({ groupId, payload }, { dispatch, rejectWithValue }) => {
    try {
      const branch = await practiceGroupService.createBranch(groupId, payload);
      dispatch(fetchPracticeGroups());
      return branch;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to create branch');
    }
  }
);

export const createGroupAdmin = createAsyncThunk(
  'practiceGroup/createGroupAdmin',
  async ({ groupId, payload }, { rejectWithValue }) => {
    try {
      return await practiceGroupService.createGroupAdmin(groupId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || err.message || 'Failed to create group admin');
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  groups: [],
  loading: false,
  error: null,
  mutationLoading: false,
  mutationError: null,

  groupUsers: [],
  groupUsersLoading: false,
  groupUsersError: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const practiceGroupSlice = createSlice({
  name: 'practiceGroup',
  initialState,
  reducers: {
    clearMutationError: (state) => {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPracticeGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPracticeGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload || [];
      })
      .addCase(fetchPracticeGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load practice groups';
      });

    [createPracticeGroup, updatePracticeGroup, createBranch, createGroupAdmin].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.mutationLoading = true;
          state.mutationError = null;
        })
        .addCase(thunk.fulfilled, (state) => {
          state.mutationLoading = false;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.mutationLoading = false;
          state.mutationError = action.payload || 'Action failed';
        });
    });

    builder
      .addCase(fetchGroupUsers.pending, (state) => {
        state.groupUsersLoading = true;
        state.groupUsersError = null;
      })
      .addCase(fetchGroupUsers.fulfilled, (state, action) => {
        state.groupUsersLoading = false;
        state.groupUsers = action.payload || [];
      })
      .addCase(fetchGroupUsers.rejected, (state, action) => {
        state.groupUsersLoading = false;
        state.groupUsersError = action.payload || 'Failed to load group users';
      });
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const { clearMutationError } = practiceGroupSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectPracticeGroups = (state) => state.practiceGroup?.groups;
export const selectPracticeGroupLoading = (state) => state.practiceGroup?.loading;
export const selectPracticeGroupError = (state) => state.practiceGroup?.error;
export const selectPracticeGroupMutationLoading = (state) => state.practiceGroup?.mutationLoading;
export const selectPracticeGroupMutationError = (state) => state.practiceGroup?.mutationError;
export const selectGroupUsers = (state) => state.practiceGroup?.groupUsers;
export const selectGroupUsersLoading = (state) => state.practiceGroup?.groupUsersLoading;
export const selectGroupUsersError = (state) => state.practiceGroup?.groupUsersError;

export default practiceGroupSlice.reducer;
