import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { serviceCatalogService } from '../../services/service-catalog.service';
import ServiceForm from '../../components/services/ServiceForm';

const EditServicePage = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError('');
        const serviceData = await serviceCatalogService.getServiceById(serviceId);
        setService(serviceData);
      } catch (err) {
        const errorMessage =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load service.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      await serviceCatalogService.updateService(serviceId, data);
      showSnackbar('Service updated successfully', 'success');
      navigate('/services'); // Navigate to service catalog page
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update service.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
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
