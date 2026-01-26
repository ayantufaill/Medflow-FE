import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { userService } from '../../services/user.service';
import ProviderForm from '../../components/providers/ProviderForm';

const EditProviderPage = () => {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [providerData, usersResult] = await Promise.all([
        providerService.getProviderById(providerId),
        userService.getUsersByRoleName('Doctor', 1, 1000, 'active', false),
      ]);

      setProvider(providerData);
      setUsers(usersResult.users || []);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) {
      fetchData();
    }
  }, [providerId]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');

      await providerService.updateProvider(providerId, data);

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

  if (loading) {
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

  if (error && !provider) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
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
          externalUsers={users}
        />
      </Paper>
    </Box>
  );
};

export default EditProviderPage;
