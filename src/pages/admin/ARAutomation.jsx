import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchARAutomationConfig,
  saveARAutomationConfig,
  selectARAutomationConfig,
  selectARAutomationLoading,
} from '../../store/slices/billingSlice';
import { Box, CircularProgress } from '@mui/material';

import ARAutomationHeader from './ar-automation/ARAutomationHeader';
import OutstandingBalanceToggle from './ar-automation/OutstandingBalanceToggle';
import NotificationAlert from './ar-automation/NotificationAlert';
import SkipInvoicesToggle from './ar-automation/SkipInvoicesToggle';
import NotificationsList from './ar-automation/NotificationsList';

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
    <Box sx={{ p: 4, backgroundColor: '#FBFCFE', borderRadius: '12px', border: '1px solid #E5E9F2', minHeight: '100vh' }}>
      <ARAutomationHeader />
      
      <OutstandingBalanceToggle 
        enabled={enabled} 
        onToggle={handleToggleEnabled} 
      />

      <NotificationAlert 
        showAlert={showAlert} 
        onClose={() => setShowAlert(false)} 
      />

      <SkipInvoicesToggle 
        skipOpenClaims={skipOpenClaims} 
        onToggle={handleToggleSkipOpenClaims} 
      />

      <NotificationsList 
        notifications={notifications} 
        enabled={enabled} 
      />
    </Box>
  );
};

export default ARAutomation;
