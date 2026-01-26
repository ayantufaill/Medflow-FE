import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Alert,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { practiceInfoService } from '../../services/practice-info.service';
import PracticeInfoForm from '../../components/practice-info/PracticeInfoForm';

const CreatePracticeInfoPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');

      await practiceInfoService.createPracticeInfo(data);

      showSnackbar('Practice info created successfully', 'success');
      navigate('/practice-info');
    } catch (err) {
      // Handle validation errors
      if (err.response?.data?.error?.errors) {
        const fieldErrors = err.response.data.error.errors;
        const generalMessage =
          err.response?.data?.error?.message || 'Please fix the errors below';
        setError(generalMessage);
      } else {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to create practice info. Please try again.'
        );
      }
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to create practice info. Please try again.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Create Practice Info
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter practice information details.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <PracticeInfoForm
          onSubmit={handleSubmit}
          loading={saving}
          isEditMode={false}
          hideButtons={true}
          formId="create-practice-info-form"
        />

        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}
        >
          <Button variant="outlined" onClick={handleBack} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            form="create-practice-info-form"
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {saving ? 'Creating...' : 'Create Practice Info'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreatePracticeInfoPage;
