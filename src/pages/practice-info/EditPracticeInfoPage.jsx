import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { practiceInfoService } from '../../services/practice-info.service';
import PracticeInfoForm from '../../components/practice-info/PracticeInfoForm';

const EditPracticeInfoPage = () => {
  const navigate = useNavigate();
  const { practiceInfoId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [practiceInfo, setPracticeInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await practiceInfoService.getPracticeInfoById(practiceInfoId);
        setPracticeInfo(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load practice info. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (practiceInfoId) {
      fetchData();
    }
  }, [practiceInfoId]);

  const onSubmit = async (data, formMethods) => {
    try {
      setSaving(true);
      setError('');

      await practiceInfoService.updatePracticeInfo(practiceInfoId, data);
      showSnackbar('Practice info updated successfully', 'success');
      navigate('/practice-info');
    } catch (err) {
      // Handle validation errors
      if (err.response?.data?.error?.errors) {
        const fieldErrors = err.response.data.error.errors;
        
        // Set field-specific errors in the form
        Object.keys(fieldErrors).forEach((field) => {
          const errorMessage = Array.isArray(fieldErrors[field]) 
            ? fieldErrors[field][0] 
            : fieldErrors[field];
          
          // Handle nested fields like address.line1
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            formMethods.setError(`${parent}.${child}`, {
              type: 'server',
              message: errorMessage,
            });
          } else {
            formMethods.setError(field, {
              type: 'server',
              message: errorMessage,
            });
          }
        });
        
        // Show general error message
        const generalMessage = err.response?.data?.error?.message || 'Please fix the errors below';
        setError(generalMessage);
      } else {
        setError(
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to update practice info. Please try again.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!practiceInfo) {
    return (
      <Box>
        <Alert severity="error">Practice info not found</Alert>
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
            Edit Practice Info
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit practice information details to update the practice info.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <PracticeInfoForm
              onSubmit={onSubmit}
              initialData={practiceInfo}
              loading={saving}
              isEditMode={true}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditPracticeInfoPage;

