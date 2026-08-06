import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { useAuth } from './AuthContext';
import { useSnackbar } from './SnackbarContext';
import { notificationReceived } from '../store/slices/notificationSlice';
import { API_BASE_URL } from '../config/api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, '');

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
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

    socket.on('notification:new', (notification) => {
      dispatch(notificationReceived(notification));
      showSnackbar(notification.title, 'info');
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
