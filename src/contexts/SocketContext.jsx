import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { useAuth } from './AuthContext';
import { useSnackbar } from './SnackbarContext';
import { notificationReceived } from '../store/slices/notificationSlice';
import { refreshUserProfile } from '../store/slices/authSlice';
import { API_BASE_URL } from '../config/api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, '');

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

// What decides which screens a user sees; a change means "your access changed".
const accessSignature = (user) => JSON.stringify({
  roles: (user?.roles || []).map((r) => (typeof r === 'string' ? r : r?.name)).sort(),
  permissions: [...(user?.permissions || [])].sort(),
  branches: [...(user?.branchIds || [])].map(String).sort(),
  coordinator: [...(user?.treatmentCoordinatorBranchIds || [])].map(String).sort(),
});

const ACCESS_POLL_MS = 30_000;

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const lastSignature = useRef(null);

  // Role or permission changes apply without a logout: refresh the profile on
  // a socket "access:changed" event, on a 30s poll and when the tab regains
  // focus, and tell the user when their access actually changed.
  useEffect(() => {
    if (!user) { lastSignature.current = null; return; }
    // The login response carries no roles or permissions; only compare full
    // profiles, or every sign-in would read as an access change.
    if (!Array.isArray(user.permissions)) return;
    const next = accessSignature(user);
    if (lastSignature.current && lastSignature.current !== next) {
      showSnackbar('Your access was updated.', 'info');
    }
    lastSignature.current = next;
  }, [user, showSnackbar]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const refresh = () => { if (document.visibilityState === 'visible') dispatch(refreshUserProfile()); };
    const timer = setInterval(refresh, ACCESS_POLL_MS);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [isAuthenticated, dispatch]);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return undefined;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return undefined;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: false,   // don't retry — backend has no socket.io server
      timeout: 5000,
    });

    socket.on('connect_error', () => {
      // Backend does not expose a socket.io server — suppress the error silently.
      socket.disconnect();
    });

    socket.on('access:changed', () => {
      dispatch(refreshUserProfile());
    });

    socket.on('notification:new', (notification) => {
      dispatch(notificationReceived(notification));
      showSnackbar(notification.title, 'success');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, dispatch, showSnackbar]);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
};
