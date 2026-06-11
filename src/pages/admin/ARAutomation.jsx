import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchARAutomationConfig,
  saveARAutomationConfig,
  selectARAutomationConfig,
  selectARAutomationLoading,
} from '../../store/slices/billingSlice';
import {
  Box,
  Typography,
  Switch,
  IconButton,
  Paper,
  Chip,
  Breadcrumbs,
  Link,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Close as CloseIcon,
  NotificationsActive as BellIcon,
  Email as EmailIcon,
  CalendarMonth as CalendarIcon,
  Description as TemplateIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

const ARAutomation = () => {
  const dispatch = useDispatch();
  const savedConfig = useSelector(selectARAutomationConfig);
  const loading = useSelector(selectARAutomationLoading);

  const [enabled, setEnabled] = useState(false);
  const [skipOpenClaims, setSkipOpenClaims] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, title: '#1 Notification', template: 'AR Automation 15 Days', method: 'Email', after: '15 Days' },
    { id: 2, title: '#2 Notification', template: 'AR Automation 30 Days', method: 'Email', after: '30 Days' },
    { id: 3, title: '#3 Notification', template: 'AR Automation 45 Days', method: 'Email', after: '45 Days' },
  ]);

  useEffect(() => {
    const promise = dispatch(fetchARAutomationConfig());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    if (savedConfig) {
      setEnabled(savedConfig.enabled ?? false);
      setSkipOpenClaims(savedConfig.skipOpenClaims ?? false);
      if (savedConfig.notifications) {
        setNotifications(savedConfig.notifications);
      }
    }
  }, [savedConfig]);

  const handleToggleEnabled = async (checked) => {
    setEnabled(checked);
    try {
      await dispatch(saveARAutomationConfig({
        enabled: checked,
        skipOpenClaims,
        notifications
      })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSkipOpenClaims = async (checked) => {
    setSkipOpenClaims(checked);
    try {
      await dispatch(saveARAutomationConfig({
        enabled,
        skipOpenClaims: checked,
        notifications
      })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !savedConfig) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4, '& .MuiBreadcrumbs-separator': { color: '#003366' } }}>
        <Link underline="hover" color="#7a96b5" component={RouterLink} to="/admin/finance-management" sx={{ fontSize: '0.85rem' }}>
          Finance Management
        </Link>
        <Typography color="#003366" sx={{ fontSize: '0.85rem' }}>
          AR Automation
        </Typography>
      </Breadcrumbs>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, color: '#1a3a6b', fontSize: '0.9rem' }}>
        AR AUTOMATION
      </Typography>

      {/* Outstanding Balance Notification Enable */}
      <Paper sx={{ p: 2.5, mb: 4, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#334155', mb: 1, fontSize: '0.9rem' }}>
              Outstanding Balance Notification
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
              Enable this setting to set up periodic reminders for users with outstanding balances. You can customize the reminder schedule based on user preferences.
            </Typography>
          </Box>
          <Switch 
            checked={enabled} 
            onChange={(e) => handleToggleEnabled(e.target.checked)}
            sx={{ 
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4a89dc', opacity: 1 }
            }}
          />
        </Box>
      </Paper>

      <Typography sx={{ fontWeight: 700, color: '#334155', mb: 1.5, fontSize: '0.9rem' }}>
        Outstanding Balance Notifications Settings
      </Typography>
      
      {!enabled && (
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mb: 2 }}>
          Notifications are disabled. To modify notification settings, please enable this feature first.
        </Typography>
      )}

      {showAlert && (
        <Box 
          sx={{ 
            mb: 4, 
            p: 1.5,
            pl: 2,
            borderRadius: 1, 
            bgcolor: '#eff6ff', 
            color: '#1e40af',
            border: '1.5px solid #4a89dc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ backgroundColor: '#4a89dc', borderRadius: '50%', p: 0.5, display: 'flex' }}>
              <BellIcon sx={{ fontSize: '1rem', color: 'white' }} />
            </Box>
            <Typography sx={{ fontSize: '0.85rem' }}>
              The notification reminders will check open invoices created starting from 01/25/2025.
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setShowAlert(false)} sx={{ color: '#1a3a6b' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Skip Invoices Section */}
      <Paper sx={{ p: 2.5, mb: 4, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>
            Skip Invoices with open claims
          </Typography>
          <Switch 
            checked={skipOpenClaims} 
            onChange={(e) => handleToggleSkipOpenClaims(e.target.checked)}
            sx={{ 
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4a89dc', opacity: 1 }
            }}
          />
        </Box>
      </Paper>

      {/* Notifications List */}
      <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 700, color: '#334155', mb: 3, fontSize: '0.9rem' }}>
          Notifications
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {notifications.map((notif) => (
            <Paper 
              key={notif.id} 
              sx={{ 
                p: 2.5, 
                borderRadius: 2, 
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#1e40af', fontSize: '0.85rem' }}>
                  {notif.title}
                </Typography>
                <Chip 
                  label="DEFAULT" 
                  size="small" 
                  sx={{ 
                    height: 18, 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    bgcolor: '#e0f2fe', 
                    color: '#0369a1',
                    borderRadius: '4px'
                  }} 
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Send</Typography>
                  <TemplateIcon sx={{ fontSize: '1.1rem', color: '#4a89dc' }} />
                  <Typography sx={{ color: '#1e40af', fontWeight: 600, fontSize: '0.85rem' }}>
                    {notif.template}
                  </Typography>
                </Box>

                <ArrowIcon sx={{ fontSize: '1.1rem', color: '#94a3b8' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>as an</Typography>
                  <EmailIcon sx={{ fontSize: '1.1rem', color: '#4a89dc' }} />
                  <Typography sx={{ color: '#1e40af', fontWeight: 600, fontSize: '0.85rem' }}>
                    {notif.method}
                  </Typography>
                </Box>

                <ArrowIcon sx={{ fontSize: '1.1rem', color: '#94a3b8' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>after</Typography>
                  <CalendarIcon sx={{ fontSize: '1.1rem', color: '#4a89dc' }} />
                  <Typography sx={{ color: '#1e40af', fontWeight: 600, fontSize: '0.85rem' }}>
                    {notif.after}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ARAutomation;
