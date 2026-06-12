import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/user.service';

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async ({ page = 1, limit = 10, search = '', roleId = '', status = '' } = {}, { rejectWithValue }) => {
    try {
      const result = await userService.getAllUsers(page, limit, search, roleId, status);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch users');
    }
  },
  {
    condition: (_, { getState }) => {
      const { user } = getState();
      if (user.listLoading) return false;
      return true;
    },
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const result = await userService.createUser(userData);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to create user');
    }
  }
);
export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const result = await userService.getUserById(userId);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch user details');
    }
  },
  {
    condition: (userId, { getState }) => {
      const { user } = getState();
      if (user.currentUserLoading) return false;
      return true;
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ userId, updates }, { rejectWithValue }) => {
    try {
      const result = await userService.updateUser(userId, updates);
      return { userId, user: result.user || result };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await userService.deleteUser(userId);
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to delete user');
    }
  }
);

export const activateUser = createAsyncThunk(
  'user/activateUser',
  async (userId, { rejectWithValue }) => {
    try {
      const result = await userService.activateUser(userId);
      return { userId, status: 'active', user: result.user || result };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to activate user');
    }
  }
);

export const deactivateUser = createAsyncThunk(
  'user/deactivateUser',
  async (userId, { rejectWithValue }) => {
    try {
      const result = await userService.deactivateUser(userId);
      return { userId, status: 'inactive', user: result.user || result };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to deactivate user');
    }
  }
);

export const assignRole = createAsyncThunk(
  'user/assignRole',
  async ({ userId, roleId }, { rejectWithValue }) => {
    try {
      const result = await userService.assignRole(userId, roleId);
      return { userId, roleId, result };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to assign role');
    }
  }
);

export const removeRole = createAsyncThunk(
  'user/removeRole',
  async ({ userId, roleId }, { rejectWithValue }) => {
    try {
      const result = await userService.removeRole(userId, roleId);
      return { userId, roleId, result };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to remove role');
    }
  }
);
const initialState = {
  list: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  listLoading: false,
  listError: null,
  currentUser: null,
  currentUserLoading: false,
  currentUserError: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const users = action.payload.users || action.payload.data || action.payload || [];
        state.list = Array.isArray(users) ? users : [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.listLoading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        const newUser = action.payload.user || action.payload;
        if (newUser && newUser._id) {
          state.list.unshift(newUser);
          state.pagination.total += 1;
        }
      })
      // fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.currentUserLoading = true;
        state.currentUserError = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.currentUserLoading = false;
        state.currentUser = action.payload.user || action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.currentUserLoading = false;
        state.currentUserError = action.payload;
      })
      // updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        const { userId, user } = action.payload;
        if (state.currentUser && (state.currentUser._id === userId || state.currentUser.id === userId)) {
          state.currentUser = { ...state.currentUser, ...user };
        }
        const index = state.list.findIndex(u => u._id === userId || u.id === userId);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...user };
        }
      })
      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.payload;
        state.list = state.list.filter(u => u._id !== userId && u.id !== userId);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.currentUser && (state.currentUser._id === userId || state.currentUser.id === userId)) {
          state.currentUser = null;
        }
      })
      // activateUser / deactivateUser
      .addCase(activateUser.fulfilled, (state, action) => {
        const { userId, status, user } = action.payload;
        const index = state.list.findIndex(u => u._id === userId || u.id === userId);
        if (index !== -1) {
          state.list[index].status = status;
          if (user) state.list[index] = { ...state.list[index], ...user };
        }
        if (state.currentUser && (state.currentUser._id === userId || state.currentUser.id === userId)) {
          state.currentUser.status = status;
        }
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        const { userId, status, user } = action.payload;
        const index = state.list.findIndex(u => u._id === userId || u.id === userId);
        if (index !== -1) {
          state.list[index].status = status;
          if (user) state.list[index] = { ...state.list[index], ...user };
        }
        if (state.currentUser && (state.currentUser._id === userId || state.currentUser.id === userId)) {
          state.currentUser.status = status;
        }
      })
      // assignRole
      .addCase(assignRole.fulfilled, () => {
        // The service usually returns the updated user, but since we don't have the full role object, 
        // we rely on the component or another fetch to refresh if needed. Or we could re-fetch.
      })
      // removeRole
      .addCase(removeRole.fulfilled, () => {
      });
  },
});

export const selectUserList = (state) => state.user.list;
export const selectUserListLoading = (state) => state.user.listLoading;
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectCurrentUserLoading = (state) => state.user.currentUserLoading;

export default userSlice.reducer;
