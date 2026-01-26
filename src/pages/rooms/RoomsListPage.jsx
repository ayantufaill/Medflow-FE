import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Chip,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { roomService } from '../../services/room.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const RoomsListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRooms, setTotalRooms] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    roomId: null,
    roomName: '',
  });
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    roomId: null,
    roomName: '',
    isActive: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const previousSearchRef = useRef('');
  const searchDebounceTimerRef = useRef(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      let isActive = undefined;
      if (statusFilter === 'active') {
        isActive = true;
      } else if (statusFilter === 'inactive') {
        isActive = false;
      }

      const result = await roomService.getAllRooms(
        page + 1,
        rowsPerPage,
        search,
        isActive
      );
      setRooms(result.rooms || []);
      setTotalRooms(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch rooms. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, statusFilter]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (search === previousSearchRef.current) {
      return;
    }
    previousSearchRef.current = search;

    if (searchDebounceTimerRef.current) {
      clearTimeout(searchDebounceTimerRef.current);
    }

    searchDebounceTimerRef.current = setTimeout(() => {
      if (page === 0) {
        fetchRooms();
      } else {
        setPage(0);
      }
    }, 500);

    return () => {
      if (searchDebounceTimerRef.current) {
        clearTimeout(searchDebounceTimerRef.current);
      }
    };
  }, [search, fetchRooms, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (roomId, roomName) => {
    setDeleteDialog({
      open: true,
      roomId,
      roomName,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await roomService.deleteRoom(deleteDialog.roomId);
      showSnackbar('Room deleted successfully', 'success');
      setDeleteDialog({ open: false, roomId: null, roomName: '' });
      await fetchRooms();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete room. Please try again.'
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete room. Please try again.',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, roomId: null, roomName: '' });
  };

  const handleActionMenuOpen = (event, roomId, roomName, isActive) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      roomId,
      roomName,
      isActive,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu({
      anchorEl: null,
      roomId: null,
      roomName: '',
      isActive: null,
    });
  };

  const handleViewDetails = (roomId) => {
    handleActionMenuClose();
    navigate(`/rooms/${roomId}`);
  };

  const handleEdit = (roomId) => {
    handleActionMenuClose();
    navigate(`/rooms/${roomId}/edit`);
  };

  const handleDelete = (roomId, roomName) => {
    handleActionMenuClose();
    handleDeleteClick(roomId, roomName);
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(0);
  };

  const handleToggleActive = async (roomId, currentStatus) => {
    try {
      setToggleLoading(true);
      const newStatus = !currentStatus;
      await roomService.updateRoom(roomId, {
        isActive: newStatus,
      });
      showSnackbar(
        `Room ${newStatus ? 'activated' : 'deactivated'} successfully`,
        'success'
      );
      handleActionMenuClose();
      await fetchRooms();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update room status. Please try again.';
      showSnackbar(errorMessage, 'error');
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Rooms
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/rooms/new')}
        >
          Add Room
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="Search by room name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Grid>
          <Grid item size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Filter by Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="">
                  <em>All Status</em>
                </MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item size={{ xs: 12, md: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {(search || statusFilter) && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}
              <Tooltip title="Refresh">
                <IconButton
                  onClick={fetchRooms}
                  disabled={loading}
                  color="primary"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Room Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No rooms found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rooms.map((room) => (
                      <TableRow key={room._id || room.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {room.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={room.isActive ? 'Active' : 'Inactive'}
                            color={room.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleActionMenuOpen(
                                e,
                                room._id || room.id,
                                room.name,
                                room.isActive
                              )
                            }
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalRooms}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      <Menu
        anchorEl={actionMenu.anchorEl}
        open={Boolean(actionMenu.anchorEl)}
        onClose={handleActionMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleViewDetails(actionMenu.roomId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEdit(actionMenu.roomId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleToggleActive(actionMenu.roomId, actionMenu.isActive)
          }
          disabled={toggleLoading}
        >
          <ListItemIcon>
            {actionMenu.isActive ? (
              <CancelIcon fontSize="small" />
            ) : (
              <CheckCircleIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {actionMenu.isActive ? 'Deactivate' : 'Activate'}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleDelete(actionMenu.roomId, actionMenu.roomName)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Room"
        message={`Are you sure you want to delete room "${deleteDialog.roomName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </Box>
  );
};

export default RoomsListPage;

