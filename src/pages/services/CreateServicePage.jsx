import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { serviceCatalogService } from '../../services/service-catalog.service';
import ServiceForm from '../../components/services/ServiceForm';

const CreateServicePage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      await serviceCatalogService.createService(data);
      showSnackbar('Service created successfully', 'success');
      navigate('/services');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create service. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/services')}>
          Back
        </Button>
        <Typography variant="h5" fontWeight="bold">
          Add New Service
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <ServiceForm onSubmit={handleSubmit} loading={saving} />
      </Paper>
    </Box>
  );
};

export default CreateServicePage;
