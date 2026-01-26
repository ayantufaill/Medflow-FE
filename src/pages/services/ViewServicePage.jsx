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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { serviceCatalogService } from '../../services/service-catalog.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const ViewServicePage = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId || serviceId === 'undefined') {
        setError('Invalid service ID');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await serviceCatalogService.getServiceById(serviceId);
        setService(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load service details.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await serviceCatalogService.deleteService(serviceId);
      showSnackbar('Service deleted successfully', 'success');
      navigate('/services');
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message || 'Failed to delete service',
        'error'
      );
    } finally {
      setDeleteLoading(false);
      setDeleteDialog(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0);
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
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/services')} sx={{ mb: 2 }}>
          Back to Services
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/services')}>
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Service Details
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/services/${serviceId}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialog(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              CPT Code
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {service?.cptCode || '-'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Service Name
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {service?.name || '-'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Category
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip label={service?.category || '-'} size="small" variant="outlined" />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={service?.isActive ? 'Active' : 'Inactive'}
                color={service?.isActive ? 'success' : 'default'}
                size="small"
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Price
            </Typography>
            <Typography variant="h6" color="primary.main">
              {formatPrice(service?.price)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">
              Duration
            </Typography>
            <Typography variant="body1">
              {service?.duration ? `${service.duration} minutes` : 'Not specified'}
            </Typography>
          </Grid>
          {service?.description && (
            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {service.description}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <ConfirmationDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${service?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </Box>
  );
};

export default ViewServicePage;
