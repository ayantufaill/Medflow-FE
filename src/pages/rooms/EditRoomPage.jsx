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
import { roomService } from '../../services/room.service';
import RoomForm from '../../components/rooms/RoomForm';

const EditRoomPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [room, setRoom] = useState(null);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      setError('');
      const roomData = await roomService.getRoomById(roomId);
      setRoom(roomData);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to load room data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');

      await roomService.updateRoom(roomId, data);

      showSnackbar('Room updated successfully', 'success');
      navigate('/rooms');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update room. Please try again.';
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

  if (error && !room) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!room) {
    return (
      <Box>
        <Alert severity="error">Room not found</Alert>
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
            Edit Room
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit room details to update the room record.
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
          onSubmit={onSubmit}
          initialData={room}
          loading={saving}
          isEditMode={true}
        />
      </Paper>
    </Box>
  );
};

export default EditRoomPage;

