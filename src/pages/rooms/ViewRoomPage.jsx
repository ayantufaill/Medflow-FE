import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Alert,
  CircularProgress,
  Button,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { roomService } from '../../services/room.service';

const ViewRoomPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await roomService.getRoomById(roomId);
        setRoom(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            'Failed to load room. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchData();
    }
  }, [roomId]);

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
      {/* Navigation Header */}
      <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 1 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            Room Details
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Details Section */}
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Room Details
          </Typography>
          <Button
            variant="contained"
            size="small"
            disableElevation
            startIcon={<EditIcon />}
            onClick={() => navigate(`/rooms/${roomId}/edit`)}
          >
            Edit
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid size={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Room Name
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {room.name || '-'}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <Chip
              label={room.isActive ? 'Active' : 'Inactive'}
              color={room.isActive ? 'success' : 'default'}
              size="small"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewRoomPage;
