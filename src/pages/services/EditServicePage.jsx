import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import {
  fetchServiceById,
  updateService,
  selectServiceDetails,
  selectServicesLoading,
  selectServicesError
} from '../../store/slices/serviceSlice';
import ServiceForm from '../../components/services/ServiceForm';

const EditServicePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serviceId } = useParams();
  const { showSnackbar } = useSnackbar();
  
  const service = useSelector(selectServiceDetails);
  const reduxLoading = useSelector(selectServicesLoading);
  const reduxError = useSelector(selectServicesError);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        setLocalError('');
        await dispatch(fetchServiceById(serviceId)).unwrap();
      } catch (err) {
        if (err?.name === 'ConditionError') return;
        setLocalError(typeof err === 'string' ? err : err?.message || 'Failed to load service.');
      } finally {
        setLoading(false);
      }
    };
    if (serviceId) {
      loadService();
    }
  }, [dispatch, serviceId]);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setLocalError('');
      await dispatch(updateService({ id: serviceId, updates: data })).unwrap();
      showSnackbar('Service updated successfully', 'success');
      navigate('/services'); // Navigate to service catalog page
    } catch (err) {
      if (err?.name === 'ConditionError') return;
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to update service.';
      setLocalError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const isInitialLoading = loading || (reduxLoading && !service);
  const error = localError || reduxError;

  if (isInitialLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/services/${serviceId}`)}>
          Back
        </Button>
        <Typography variant="h5" fontWeight="bold">
          Edit Service
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setLocalError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <ServiceForm
          onSubmit={handleSubmit}
          initialData={service}
          loading={saving}
          isEditMode
        />
      </Paper>
    </Box>
  );
};

export default EditServicePage;
