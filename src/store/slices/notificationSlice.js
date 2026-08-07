import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notification.service';

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (params, { rejectWithValue }) => {
    try {
      return await notificationService.getNotifications(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to fetch notifications'
      );
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'notification/markNotificationRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to mark notification as read'
      );
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notification/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        'Failed to mark all notifications as read'
      );
    }
  }
);

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notificationReceived(state, action) {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.items.find((item) => item.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach((item) => { item.isRead = true; });
        state.unreadCount = 0;
      });
  },
});

export const { notificationReceived } = notificationSlice.actions;

export const selectNotifications = (state) => state.notification.items;
export const selectUnreadCount = (state) => state.notification.unreadCount;
export const selectNotificationsLoading = (state) => state.notification.loading;

export default notificationSlice.reducer;
