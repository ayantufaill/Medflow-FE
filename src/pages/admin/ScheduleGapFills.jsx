import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Switch,
  TextField,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  EmailOutlined as EmailIcon,
  InfoOutlined as InfoIcon,
  Sync as SyncIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { communicationService } from '../../services/communication.service';

const ScheduleGapFills = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Global Settings State
  const [skipDays, setSkipDays] = useState('30');
  const [unscheduledNotificationEnabled, setUnscheduledNotificationEnabled] = useState(true);
  const [showBookNow, setShowBookNow] = useState(true);
  
  // Gap Fills Array State
  const [notifications, setNotifications] = useState([]);

  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsData, gapFillsData] = await Promise.all([
        communicationService.getGapFillSettings(),
        communicationService.getGapFills(),
      ]);

      const parsedSettings = {
        skipDays: settingsData?.skipDays?.toString() || '30',
        unscheduledNotificationEnabled: settingsData?.unscheduledNotificationEnabled ?? true,
        showBookNow: settingsData?.showBookNow ?? true,
      };

      setSkipDays(parsedSettings.skipDays);
      setUnscheduledNotificationEnabled(parsedSettings.unscheduledNotificationEnabled);
      setShowBookNow(parsedSettings.showBookNow);

      let parsedNotifications = [];
      if (gapFillsData && Array.isArray(gapFillsData)) {
        parsedNotifications = gapFillsData.map(item => ({
          id: item.id,
          type: item.triggerType || 'Email',
          days: item.scheduleOffsetDays || 7,
          isNew: false
        }));
        setNotifications(parsedNotifications);
      }

      setInitialData({
        ...parsedSettings,
        notifications: parsedNotifications
      });

    } catch (error) {
      console.error('Failed to fetch gap fills data', error);
    } finally {
      setLoading(false);
    }
  };

  const currentData = {
    skipDays,
    unscheduledNotificationEnabled,
    showBookNow,
    notifications
  };

  const isDirty = initialData && JSON.stringify(initialData) !== JSON.stringify(currentData);

  const handleSave = async () => {
    try {
      setLoading(true);
      // Save settings
      await communicationService.saveGapFillSettings({
        skipDays: parseInt(skipDays, 10) || 30,
        unscheduledNotificationEnabled,
        showBookNow,
      });

      // Save all notifications
      for (const notif of notifications) {
        await communicationService.saveGapFill({
          id: notif.isNew ? undefined : notif.id,
          triggerType: notif.type,
          scheduleOffsetDays: parseInt(notif.days, 10) || 7,
        });
      }

      // Re-fetch to get accurate backend IDs
      await fetchData();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save gap fills', error);
      setLoading(false);
    }
  };

  const handleAddNotification = () => {
    setNotifications([
      ...notifications,
      { id: Date.now().toString(), type: 'Email', days: 7, isNew: true }
    ]);
  };

  const handleDeleteNotification = async (id, isNew) => {
    if (!isNew) {
      try {
        await communicationService.deleteGapFill(id);
      } catch (error) {
        console.error('Failed to delete gap fill', error);
      }
    }
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const updateNotification = (id, field, value) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  if (loading && notifications.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#FBFCFE' }}>
        <CircularProgress size={40} sx={{ color: '#3B82F6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh', pb: 5 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, pt: 4, mb: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1E293B' }}>
            Schedule Gap Fills
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}>
            Manage notifications for unscheduled procedures.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {(isEditing || isDirty) && (
            <Button
              variant="outlined"
              onClick={() => {
                if (initialData) {
                  setSkipDays(initialData.skipDays);
                  setUnscheduledNotificationEnabled(initialData.unscheduledNotificationEnabled);
                  setShowBookNow(initialData.showBookNow);
                  setNotifications(initialData.notifications);
                }
                setIsEditing(false);
              }}
              sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, color: '#475569', borderColor: '#CBD5E1', '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' } }}
            >
              Cancel
            </Button>
          )}
          <Button 
            variant="contained" 
            onClick={() => {
              if (isEditing || isDirty) {
                if (isDirty) handleSave();
                else setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }} 
            disabled={loading || ((isEditing || isDirty) && !isDirty)}
            sx={{ 
              bgcolor: '#3B82F6', 
              textTransform: 'none', 
              borderRadius: '8px', 
              px: 3, 
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' } 
            }}
          >
            {(isEditing || isDirty) ? (loading ? 'Saving...' : 'Save Settings') : 'Edit Notifications'}
          </Button>
        </Box>
      </Box>

      {/* Main Content Container */}
      <Box sx={{ maxWidth: 900, mx: 'auto', px: 4 }}>
        
        {!isEditing && (
          <>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eaeaea' }}>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>
                  Unscheduled Procedure Notification
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Enable this setting to set up periodic reminders for users with unscheduled procedures. You can customize the reminder schedule based on user preferences.
                </Typography>
              </Box>
              <Switch 
                checked={unscheduledNotificationEnabled} 
                onChange={(e) => setUnscheduledNotificationEnabled(e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3B82F6' } }} 
              />
            </Box>

            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eaeaea' }}>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#1E293B', mb: 0.5 }}>
                  Show Book Now button
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Enable this setting to show or hide the 'Book Now' button in schedule gap fill notification.
                </Typography>
              </Box>
              <Switch 
                checked={showBookNow} 
                onChange={(e) => setShowBookNow(e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3B82F6' } }} 
              />
            </Box>
          </>
        )}

        {isEditing && (
          <>
            <Typography sx={{ fontSize: '0.9rem', color: '#64748b', mb: 3 }}>
              Set up automated <span style={{ textDecoration: 'underline' }}>unscheduled procedures</span> notifications based on your preferences. Choose how and when to send reminders—whether via text, email, or both—after procedure creation date.
            </Typography>
            
            <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 3, px: 2, py: 1.5, mb: 4 }}>
              <InfoIcon sx={{ color: '#D97706', fontSize: '1.2rem', mr: 1.5 }} />
              <Typography sx={{ fontSize: '0.85rem', color: '#92400E', fontWeight: 500 }}>
                Expect the reminder to be sent out 1 to 59 minutes after the scheduled time. This is due to the hourly system check up.
              </Typography>
              <IconButton size="small" sx={{ ml: 2, p: 0 }}><CloseIcon sx={{ fontSize: '1.1rem', color: '#B45309' }}/></IconButton>
            </Box>
          </>
        )}

        <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, mb: 5, display: 'flex', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eaeaea' }}>
          {isEditing ? (
            <Typography sx={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              Skip sending reminders if the patient had a treatment appointment in the last{' '}
              <TextField 
                size="small" 
                value={skipDays} 
                onChange={(e) => setSkipDays(e.target.value)}
                sx={{ width: 60, mx: 1.5, '& .MuiOutlinedInput-root': { height: 32, bgcolor: '#F1F5F9' }, '& input': { textAlign: 'center', p: 0, fontSize: '0.9rem' } }} 
              />
              {' '}days.
            </Typography>
          ) : (
            <Typography sx={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 500 }}>
              Skip sending reminders if the patient had a treatment appointment in the last <Box component="span" sx={{ fontWeight: 700 }}>{skipDays}</Box> days.
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B' }}>Notifications Schedule</Typography>
          {isEditing && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: '#64748b', '&:hover': { color: '#1E293B' } }} onClick={fetchData}>
                <SyncIcon sx={{ fontSize: '1.1rem' }} />
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Reset to Default</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: '#3B82F6', '&:hover': { color: '#2563EB' } }} onClick={handleAddNotification}>
                <AddIcon sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} />
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Add Notification</Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eaeaea' }}>
          {notifications.map((notif, idx) => (
            <Box key={notif.id} sx={{ bgcolor: '#FAFAF9', border: '1px solid #E5E7EB', borderRadius: 2, p: 2.5, mb: idx !== notifications.length - 1 ? 2 : 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B' }}>#{idx + 1} Notification</Typography>
                  <Box sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontSize: '0.65rem', fontWeight: 700, px: 1.5, py: 0.4, borderRadius: 1.5 }}>DEFAULT</Box>
                </Box>
                {isEditing && (
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#EF4444', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => handleDeleteNotification(notif.id, notif.isNew)}>Delete Notification</Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '0.9rem', color: '#64748b' }}>Send</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600 }}>@ Schedule Gap Fills</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#94A3B8', mx: 1 }}>→</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#64748b' }}>as an</Typography>
                
                {isEditing ? (
                  <Select 
                    size="small" 
                    value={notif.type} 
                    onChange={(e) => updateNotification(notif.id, 'type', e.target.value)}
                    sx={{ minWidth: 120, '& .MuiOutlinedInput-root': { height: 34, fontSize: '0.9rem', bgcolor: '#ffffff' } }}
                  >
                    <MenuItem value="Email" sx={{ fontSize: '0.9rem' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EmailIcon fontSize="small" sx={{ color: '#3B82F6' }}/> Email</Box></MenuItem>
                    <MenuItem value="Text" sx={{ fontSize: '0.9rem' }}>Text</MenuItem>
                  </Select>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon sx={{ fontSize: '1.2rem', color: '#3B82F6' }} />
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>{notif.type}</Typography>
                  </Box>
                )}
                
                <Typography sx={{ fontSize: '0.9rem', color: '#94A3B8', mx: 1 }}>→</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#64748b' }}>after</Typography>

                {isEditing ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField 
                      size="small" 
                      value={notif.days}
                      onChange={(e) => updateNotification(notif.id, 'days', e.target.value)}
                      sx={{ width: 65, '& .MuiOutlinedInput-root': { height: 34, bgcolor: '#ffffff' }, '& input': { textAlign: 'center', fontSize: '0.9rem', p: 0 } }} 
                    />
                    <Select size="small" defaultValue="Days" sx={{ minWidth: 100, '& .MuiOutlinedInput-root': { height: 34, fontSize: '0.9rem', bgcolor: '#ffffff' } }}>
                      <MenuItem value="Days" sx={{ fontSize: '0.9rem' }}>Days</MenuItem>
                      <MenuItem value="Hours" sx={{ fontSize: '0.9rem' }}>Hours</MenuItem>
                    </Select>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>{notif.days}</Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>Days</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
          {notifications.length === 0 && !loading && (
             <Typography sx={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', py: 2 }}>No notifications configured yet.</Typography>
          )}
        </Box>

      </Box>
    </Box>
  );
};

export default ScheduleGapFills;
