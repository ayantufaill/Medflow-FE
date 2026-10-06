import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert, Snackbar } from '@mui/material';

import MessagingStatusCard from '../../components/admin/patient-communication/messaging-services/MessagingStatusCard';
import { messagingApi } from '../../components/admin/patient-communication/emailMessagingApi';
import { formatPhoneNumber } from '../../components/shared/PhoneNumberInput';
import { EMAIL_MESSAGING_PATHS } from '../../components/admin/patient-communication/emailMessagingPaths';

const NUMBER_SELECTION_PATH = EMAIL_MESSAGING_PATHS.numberSelection;

const getErrorMessage = (err, fallback) =>
  err.response?.data?.error?.message || err.response?.data?.message || err?.message || fallback;

const MessagingServices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messaging, setMessaging] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  // Set when returning from Number Selection with a newly claimed number.
  const selectedNumber = location.state?.numberSelected;
  const [toast, setToast] = useState(() =>
    selectedNumber
      ? {
          open: true,
          message: `${formatPhoneNumber(selectedNumber)} selected. It will be active once carrier registration completes.`,
          severity: 'success',
        }
      : { open: false, message: '', severity: 'success' }
  );

  useEffect(() => {
    // Drop the router state so a refresh doesn't replay the toast.
    if (selectedNumber) navigate(location.pathname, { replace: true, state: null });
  }, [selectedNumber, navigate, location.pathname]);

  const fetchMessaging = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');
      setMessaging(await messagingApi.getMessagingService());
    } catch (err) {
      setLoadError(getErrorMessage(err, 'Failed to load messaging service.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessaging();
  }, [fetchMessaging]);

  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const renderBody = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      );
    }
    if (loadError) {
      return (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={fetchMessaging}>Retry</Button>}>
          {loadError}
        </Alert>
      );
    }
    return (
      <MessagingStatusCard
        status={messaging.status}
        phoneNumber={messaging.phoneNumber}
        onEdit={() => navigate(NUMBER_SELECTION_PATH)}
      />
    );
  };

  return (
    <Box>
      <Box sx={{ maxWidth: 760 }}>{renderBody()}</Box>

      <Snackbar open={toast.open} autoHideDuration={5000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MessagingServices;
