import { useState, useEffect, useRef } from 'react';
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
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { practiceInfoService } from '../../services/practice-info.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const PracticeInfoListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [practiceInfoList, setPracticeInfoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    practiceInfoId: null,
    practiceName: '',
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    practiceInfoId: null,
    practiceName: '',
  });
  const previousSearchRef = useRef('');

  const fetchPracticeInfo = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await practiceInfoService.getAllPracticeInfo(
        page + 1,
        rowsPerPage,
        search
      );
      setPracticeInfoList(result.practiceInfo || []);
      setTotal(result.pagination.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch practice info. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPracticeInfo();
  }, [page, rowsPerPage]);

  useEffect(() => {
    // Skip if search hasn't actually changed (prevents initial mount double fetch)
    if (search === previousSearchRef.current) {
      return;
    }
    previousSearchRef.current = search;

    const debounceTimer = setTimeout(() => {
      if (page === 0) {
        fetchPracticeInfo();
      } else {
        setPage(0);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (practiceInfoId, practiceName) => {
    setDeleteDialog({
      open: true,
      practiceInfoId,
      practiceName,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await practiceInfoService.deletePracticeInfo(deleteDialog.practiceInfoId);
      showSnackbar('Practice info deleted successfully', 'success');
      setDeleteDialog({ open: false, practiceInfoId: null, practiceName: '' });
      await fetchPracticeInfo();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to delete practice info. Please try again.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, practiceInfoId: null, practiceName: '' });
  };

  const handleActionMenuOpen = (event, practiceInfoId, practiceName) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      practiceInfoId,
      practiceName,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu({ anchorEl: null, practiceInfoId: null, practiceName: '' });
  };

  const handleViewDetails = (practiceInfoId) => {
    handleActionMenuClose();
    navigate(`/practice-info/${practiceInfoId}`);
  };

  const handleEdit = (practiceInfoId) => {
    handleActionMenuClose();
    navigate(`/practice-info/${practiceInfoId}/edit`);
  };

  const handleDelete = (practiceInfoId, practiceName) => {
    handleActionMenuClose();
    handleDeleteClick(practiceInfoId, practiceName);
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
          Practice Information
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/practice-info/new')}
        >
          Add Practice Info
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Grid item size={{ xs: 11, md: 11 }}>
            <TextField
              fullWidth
              placeholder="Search all fields..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Tooltip title="Refresh">
                <IconButton
                  onClick={fetchPracticeInfo}
                  disabled={loading}
                  color="primary"
                  sx={{ flexShrink: 0 }}
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
                    <TableCell>Practice Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {practiceInfoList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No practice info found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    practiceInfoList.map((practiceInfo) => (
                      <TableRow key={practiceInfo._id || practiceInfo.id} hover>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'primary.main',
                                fontSize: '1rem',
                              }}
                            >
                              {practiceInfo.logoPath ? (
                                <img
                                  src={practiceInfo.logoPath}
                                  alt={practiceInfo.practiceName}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                              ) : (
                                <BusinessIcon />
                              )}
                            </Avatar>
                            <Typography variant="body2">
                              {practiceInfo.practiceName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{practiceInfo.email || '-'}</TableCell>
                        <TableCell>{practiceInfo.phone || '-'}</TableCell>
                        <TableCell>
                          {practiceInfo.address?.city &&
                          practiceInfo.address?.state
                            ? `${practiceInfo.address.city}, ${practiceInfo.address.state}`
                            : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleActionMenuOpen(
                                e,
                                practiceInfo._id || practiceInfo.id,
                                practiceInfo.practiceName
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
              count={total}
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
        <MenuItem onClick={() => handleViewDetails(actionMenu.practiceInfoId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEdit(actionMenu.practiceInfoId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleDelete(actionMenu.practiceInfoId, actionMenu.practiceName)
          }
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
        title="Delete Practice Info"
        message={`Are you sure you want to delete practice info "${deleteDialog.practiceName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </Box>
  );
};

export default PracticeInfoListPage;