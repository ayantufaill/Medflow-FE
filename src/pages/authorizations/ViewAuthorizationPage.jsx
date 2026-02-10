import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { authorizationService } from '../../services/authorization.service';

const STATUS_COLORS = {
  requested: 'info',
  pending: 'warning',
  approved: 'success',
  denied: 'error',
  expired: 'error',
  cancelled: 'default',
};

const STATUS_ICONS = {
  requested: PendingIcon,
  pending: PendingIcon,
  approved: CheckCircleIcon,
  denied: CancelIcon,
  expired: WarningIcon,
  cancelled: CancelIcon,
};

const ViewAuthorizationPage = () => {
  const navigate = useNavigate();
  const { authorizationId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [authorization, setAuthorization] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    const fetchAuthorization = async () => {
      try {
        setLoading(true);
        const [authData, historyData] = await Promise.all([
          authorizationService.getAuthorizationById(authorizationId),
          authorizationService.getAuthorizationStatusHistory(authorizationId).catch(() => []),
        ]);
        setAuthorization(authData);
        setStatusHistory(historyData);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load authorization.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorization();
  }, [authorizationId]);

  const handlePrint = async () => {
    try {
      setPrinting(true);
      const blob = await authorizationService.printAuthorizationForm(authorizationId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `authorization-${authorization?.authorizationNumber || authorizationId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSnackbar('Authorization form downloaded successfully', 'success');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to print authorization form',
        'error'
      );
    } finally {
      setPrinting(false);
    }
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('MMM DD, YYYY') : '-';
  };

  const getStatusChip = (status) => {
    const StatusIcon = STATUS_ICONS[status] || PendingIcon;
    const color = STATUS_COLORS[status] || 'default';

    return (
      <Chip
        icon={<StatusIcon fontSize="small" />}
        label={status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
        color={color}
        size="medium"
      />
    );
  };

  const getStatusTimelineIcon = (status) => {
    const StatusIcon = STATUS_ICONS[status] || PendingIcon;
    return <StatusIcon />;
  };

  const getStatusTimelineColor = (status) => {
    return STATUS_COLORS[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/authorizations')} sx={{ mb: 2 }}>
          Back to Authorizations
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!authorization) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/authorizations')} sx={{ mb: 2 }}>
          Back to Authorizations
        </Button>
        <Alert severity="warning">Authorization not found</Alert>
      </Box>
    );
  }

  const isExpired = authorization.expirationDate && dayjs(authorization.expirationDate).isBefore(dayjs());

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/authorizations')}>
          Back to Authorizations
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            Authorization Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {authorization.authorizationNumber || authorization.authNumber || 'Authorization Information'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {getStatusChip(authorization.status)}
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            disabled={printing}
          >
            {printing ? 'Printing...' : 'Print Form'}
          </Button>
        </Box>
      </Box>

      {isExpired && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Authorization Expired
          </Typography>
          <Typography variant="body2">
            This authorization expired on {formatDate(authorization.expirationDate)}. A new authorization may be required.
          </Typography>
        </Alert>
      )}

      {authorization.status === 'denied' && authorization.denialReason && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Authorization Denied
          </Typography>
          <Typography variant="body2">Reason: {authorization.denialReason}</Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Authorization Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Authorization Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {authorization.authorizationNumber || authorization.authNumber || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                {getStatusChip(authorization.status)}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Requested Date
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDate(authorization.requestedDate || authorization.createdAt)}
                </Typography>
              </Grid>
              {authorization.approvedDate && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Approved Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(authorization.approvedDate)}
                  </Typography>
                </Grid>
              )}
              {authorization.expirationDate && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Expiration Date
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    color={isExpired ? 'error' : 'inherit'}
                  >
                    {formatDate(authorization.expirationDate)}
                    {isExpired && ' (Expired)'}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Patient Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Patient Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {authorization.patient?.firstName && authorization.patient?.lastName
                    ? `${authorization.patient.firstName} ${authorization.patient.lastName}`
                    : authorization.patientId?.firstName && authorization.patientId?.lastName
                    ? `${authorization.patientId.firstName} ${authorization.patientId.lastName}`
                    : '-'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Service Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Service
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {authorization.service?.name || authorization.serviceId?.name || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  CPT Code
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {authorization.service?.cptCode || authorization.serviceId?.cptCode || '-'}
                </Typography>
              </Grid>
              {(authorization.unitsAuthorized != null || authorization.units != null) && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Units Authorized
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {authorization.unitsAuthorized ?? authorization.units ?? '-'}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Insurance Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Insurance Company
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {authorization.insuranceCompany?.name ?? authorization.insuranceCompanyId?.name ?? '-'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {authorization.notes && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">{authorization.notes}</Typography>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Status History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {statusHistory.length > 0 ? (
              <Box>
                {statusHistory.map((historyItem, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 2, position: 'relative' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: `${getStatusTimelineColor(historyItem.status)}.main`,
                          width: 32,
                          height: 32,
                        }}
                      >
                        {getStatusTimelineIcon(historyItem.status)}
                      </Avatar>
                      {index < statusHistory.length - 1 && (
                        <Box
                          sx={{
                            width: 2,
                            height: '100%',
                            bgcolor: 'divider',
                            mt: 1,
                            minHeight: 40,
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ flex: 1, pb: index < statusHistory.length - 1 ? 2 : 0 }}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {historyItem.status
                          ? historyItem.status.charAt(0).toUpperCase() + historyItem.status.slice(1)
                          : 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {dayjs(historyItem.timestamp || historyItem.date).format('MMM DD, YYYY HH:mm')}
                      </Typography>
                      {historyItem.note && (
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {historyItem.note}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Current Status
                </Typography>
                {getStatusChip(authorization.status)}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {dayjs(authorization.updatedAt || authorization.createdAt).format('MMM DD, YYYY HH:mm')}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewAuthorizationPage;
