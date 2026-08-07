import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Popover, MenuItem, Typography, Divider, Button, Badge } from '@mui/material';
import { NotificationsNone, Settings } from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  selectNotifications,
  selectUnreadCount,
} from '../../../store/slices/notificationSlice';
import { appointmentService } from '../../../services/appointment.service';

dayjs.extend(relativeTime);

const iconStyle = {
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: '#ffffff',
  borderRadius: '50%',
  boxShadow: '0px 1px 4px rgba(0,0,0,0.08)',
};

const ActionIcons = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);

  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  useEffect(() => {
    dispatch(fetchNotifications({ limit: 20 }));
  }, [dispatch]);

  const handleSettingsOpen = (event) => {
    if (settingsAnchor) {
      setSettingsAnchor(null);
    } else {
      setSettingsAnchor(event.currentTarget);
    }
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const handleNotificationOpen = (event) => {
    if (notificationAnchor) {
      setNotificationAnchor(null);
    } else {
      setNotificationAnchor(event.currentTarget);
    }
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      dispatch(markNotificationRead(notification.id));
    }

    if (notification.relatedType !== 'appointment' || !notification.relatedId) {
      return;
    }

    handleNotificationClose();
    try {
      const appointment = await appointmentService.getAppointmentById(notification.relatedId);
      const date = appointment?.appointmentDate
        ? appointment.appointmentDate.slice(0, 10)
        : null;
      const params = new URLSearchParams();
      if (date) params.set('date', date);
      params.set('highlightAppointmentId', notification.relatedId);
      navigate(`/appointments/operatory-schedule?${params.toString()}`);
    } catch (error) {
      navigate(`/appointments/operatory-schedule?highlightAppointmentId=${notification.relatedId}`);
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Badge
        badgeContent={unreadCount}
        color="error"
        max={99}
        sx={{
          '& .MuiBadge-badge': {
            fontWeight: 600,
            fontSize: '10px',
            minWidth: '16px',
            height: '16px',
            px: '4px',
          },
        }}
      >
        <Box sx={iconStyle} onClick={handleNotificationOpen}>
          <NotificationsNone sx={{ fontSize: '18px', color: '#4a5568' }} />
        </Box>
      </Badge>

      <Box sx={iconStyle} onClick={handleSettingsOpen}>
        <Settings sx={{ fontSize: '18px', color: '#4a5568' }} />
      </Box>

      <Popover
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disableScrollLock
        PaperProps={{
          sx: {
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            mt: 1,
            width: 360,
            maxWidth: '90vw',
            borderRadius: '6px',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, color: '#09121f' }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllRead}
              sx={{ fontFamily: 'Inter', fontSize: '12px', textTransform: 'none' }}
            >
              Mark all as read
            </Button>
          )}
        </Box>
        <Divider />
        <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Typography
              sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#64748b', textAlign: 'center', py: 4 }}
            >
              No notifications yet
            </Typography>
          ) : (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 0.25,
                  py: 1.25,
                  px: 2,
                  whiteSpace: 'normal',
                  backgroundColor: notification.isRead ? 'transparent' : '#f0f7ff',
                  '&:hover': {
                    backgroundColor: notification.isRead ? '#f8fafc' : '#e6f1ff',
                  },
                }}
              >
                <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#09121f' }}>
                  {notification.title}
                </Typography>
                {notification.body && (
                  <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#475569' }}>
                    {notification.body}
                  </Typography>
                )}
                <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', color: '#94a3b8' }}>
                  {dayjs(notification.createdAt).fromNow()}
                </Typography>
              </MenuItem>
            ))
          )}
        </Box>
      </Popover>

      <Popover
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disableScrollLock
        sx={{ zIndex: 1500 }}
        PaperProps={{
          sx: {
            overflow: 'visible',
            border: '1px solid #e2e8f0',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            mt: 1,
            minWidth: 180,
            borderRadius: '6px',
          },
        }}
      >
        <Box sx={{ py: 1 }}>
          {[
            'Claim Management',
            'Batch Actions',
            'Reports',
            'Advanced Reporting',
            'KPI Dashboard',
            'Automations',
            'Admin',
          ].map((item) => (
            <MenuItem
              key={item}
              onClick={() => {
                if (item === 'Claim Management') navigate('/claims');
                if (item === 'Batch Actions') navigate('/batch-actions');
                if (item === 'Advanced Reporting') navigate('/admin/advanced-reporting');
                if (item === 'Admin') navigate('/admin/user-management');
                if (item === 'Reports') navigate('/admin/reports/financial');
                if (item === 'KPI Dashboard') navigate('/kpi');
                handleSettingsClose();
              }}
              sx={{
                fontFamily: 'Inter',
                fontSize: '13px',
                fontWeight: 500,
                color: '#09121f',
                py: 1,
                px: 2,
                '&:hover': {
                  backgroundColor: '#f8fafc',
                },
              }}
            >
              {item}
            </MenuItem>
          ))}
        </Box>
      </Popover>
    </Box>
  );
};

export default ActionIcons;
