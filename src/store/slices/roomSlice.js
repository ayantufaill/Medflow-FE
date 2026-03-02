import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roomService } from '../../services/room.service';

// ─── Async Thunks ────────────────────────────────────────────

export const fetchRooms = createAsyncThunk(
  'room/fetchRooms',
  async ({ page = 1, limit = 10, search = '', isActive = null } = {}, { rejectWithValue }) => {
    try {
      const result = await roomService.getAllRooms(page, limit, search, isActive);
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch rooms');
    }
  },
  {
    condition: (_, { getState }) => {
      const { room } = getState();
      return !room.listLoading;
    },
  }
);

// Fetch all rooms for dropdowns (cached)
export const fetchAllRoomsForDropdown = createAsyncThunk(
  'room/fetchAllForDropdown',
  async (_, { getState, rejectWithValue }) => {
    const { room } = getState();
    if (room.dropdownList.length > 0 && room.dropdownLastFetched) {
      const elapsed = Date.now() - room.dropdownLastFetched;
      if (elapsed < 10 * 60 * 1000) return null;
    }
    try {
      const result = await roomService.getAllRooms(1, 200, '', true);
      return result.rooms || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || 'Failed to fetch rooms');
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

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    invalidateRooms: (state) => {
      state.lastFetched = null;
      state.dropdownLastFetched = null;
    },
    updateRoomInList: (state, action) => {
      const updated = action.payload;
      const idx = state.list.findIndex(r => r._id === updated._id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...updated };
    },
    removeRoomFromList: (state, action) => {
      state.list = state.list.filter(r => r._id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.list = action.payload.rooms || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.listLoading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      })
      .addCase(fetchAllRoomsForDropdown.pending, (state) => {
        state.dropdownLoading = true;
      })
      .addCase(fetchAllRoomsForDropdown.fulfilled, (state, action) => {
        if (action.payload !== null) {
          state.dropdownList = action.payload;
          state.dropdownLastFetched = Date.now();
        }
        state.dropdownLoading = false;
      })
      .addCase(fetchAllRoomsForDropdown.rejected, (state) => {
        state.dropdownLoading = false;
      });
  },
});

export const {
  invalidateRooms,
  updateRoomInList,
  removeRoomFromList,
} = roomSlice.actions;

export const selectRoomList = (state) => state.room.list;
export const selectRoomPagination = (state) => state.room.pagination;
export const selectRoomListLoading = (state) => state.room.listLoading;
export const selectRoomListError = (state) => state.room.listError;
export const selectRoomDropdownList = (state) => state.room.dropdownList;
export const selectRoomDropdownLoading = (state) => state.room.dropdownLoading;

export default roomSlice.reducer;
