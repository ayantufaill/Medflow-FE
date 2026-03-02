import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { providerService } from '../../services/provider.service';
import ProviderForm from '../../components/providers/ProviderForm';
import {
  fetchProviderById,
  selectCachedProviderById,
  selectProviderDetailLoading,
  selectProviderListError,
} from '../../store/slices/providerSlice';

const EditProviderPage = () => {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const provider = useSelector((state) => selectCachedProviderById(state, providerId));
  const detailLoading = useSelector(selectProviderDetailLoading);
  const detailError = useSelector(selectProviderListError);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!providerId) return;
    dispatch(fetchProviderById(providerId));
  }, [providerId, dispatch]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');

      const updated = await providerService.updateProvider(providerId, data);
      dispatch(updateProviderInList(updated));
      dispatch(invalidateProviderDetail(providerId));

      showSnackbar('Provider updated successfully', 'success');
      navigate('/providers');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update provider. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const loading = detailLoading && !provider;
  if (detailLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (detailError && !provider) {
    return (
      <Box>
        <Alert severity="error">{detailError}</Alert>
      </Box>
    );
  }

  if (!provider) {
    return (
      <Box>
        <Alert severity="error">Provider not found</Alert>
      </Box>
    );
  }

  const handleBack = () => {
    window.history.back();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Provider
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit provider details to update the provider record.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <ProviderForm
          onSubmit={onSubmit}
          initialData={provider}
          loading={saving}
          isEditMode={true}
        />
      </Paper>
    </Box>
  );
};

export default EditProviderPage;
