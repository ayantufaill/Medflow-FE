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
import { roomService } from '../../services/room.service';
import RoomForm from '../../components/rooms/RoomForm';

const CreateRoomPage = () => {
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

      await roomService.createRoom(data);

      showSnackbar('Room created successfully', 'success');
      navigate('/rooms');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create room. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
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
            Create Room
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter room details to create a new room.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <RoomForm
          onSubmit={handleSubmit}
          loading={saving}
          isEditMode={false}
          hideButtons={true}
          formId="create-room-form"
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
            form="create-room-form"
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {saving ? 'Creating...' : 'Create Room'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateRoomPage;

