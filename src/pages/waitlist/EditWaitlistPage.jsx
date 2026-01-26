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
import { waitlistService } from '../../services/waitlist.service';
import WaitlistForm from '../../components/waitlist/WaitlistForm';

const EditWaitlistPage = () => {
  const navigate = useNavigate();
  const { waitlistEntryId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [waitlistEntry, setWaitlistEntry] = useState(null);

  const fetchWaitlistEntry = async () => {
    try {
      setLoading(true);
      setError('');
      const entryData = await waitlistService.getWaitlistEntryById(
        waitlistEntryId
      );
      setWaitlistEntry(entryData);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load waitlist entry data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (waitlistEntryId) {
      fetchWaitlistEntry();
    }
  }, [waitlistEntryId]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');

      await waitlistService.updateWaitlistEntry(waitlistEntryId, data);

      showSnackbar('Waitlist entry updated successfully', 'success');
      navigate('/waitlist');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update waitlist entry. Please try again.';
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

  if (error && !waitlistEntry) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!waitlistEntry) {
    return (
      <Box>
        <Alert severity="error">Waitlist entry not found</Alert>
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
            Edit Waitlist Entry
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit waitlist entry details to update the record.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <WaitlistForm
          onSubmit={onSubmit}
          initialData={waitlistEntry}
          loading={saving}
          isEditMode={true}
        />
      </Paper>
    </Box>
  );
};

export default EditWaitlistPage;
