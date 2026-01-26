import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
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
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  FilterAltOff,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { insuranceCompanyService } from '../../services/insurance.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const InsuranceCompaniesListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    companyId: null,
    companyName: '',
  });
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    companyId: null,
    companyName: '',
    isActive: null,
  });
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const result = await insuranceCompanyService.getAllInsuranceCompanies(
        page + 1,
        rowsPerPage,
        debouncedSearch,
        statusFilter
      );

      setCompanies(result.companies || []);
      setTotalCompanies(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch insurance companies. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (companyId, companyName) => {
    setDeleteDialog({
      open: true,
      companyId,
      companyName,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await insuranceCompanyService.deleteInsuranceCompany(
        deleteDialog.companyId
      );
      showSnackbar('Insurance company deleted successfully', 'success');
      setDeleteDialog({ open: false, companyId: null, companyName: '' });
      await fetchCompanies();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete insurance company. Please try again.'
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete insurance company. Please try again.',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, companyId: null, companyName: '' });
  };

  const handleActionMenuOpen = (event, companyId, companyName, isActive) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      companyId,
      companyName,
      isActive,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu({
      anchorEl: null,
      companyId: null,
      companyName: '',
      isActive: null,
    });
  };

  const handleEdit = (companyId) => {
    handleActionMenuClose();
    navigate(`/insurance-companies/${companyId}/edit`);
  };

  const handleDelete = (companyId, companyName) => {
    handleActionMenuClose();
    handleDeleteClick(companyId, companyName);
  };

  const handleActivate = async (companyId, companyName) => {
    handleActionMenuClose();
    try {
      setStatusLoading(true);
      setError('');
      await insuranceCompanyService.updateInsuranceCompany(companyId, {
        isActive: true,
      });
      showSnackbar(
        `Insurance company "${companyName}" activated successfully`,
        'success'
      );
      await fetchCompanies();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to activate insurance company. Please try again.'
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to activate insurance company. Please try again.',
        'error'
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDeactivate = async (companyId, companyName) => {
    handleActionMenuClose();
    try {
      setStatusLoading(true);
      setError('');
      await insuranceCompanyService.updateInsuranceCompany(companyId, {
        isActive: false,
      });
      showSnackbar(
        `Insurance company "${companyName}" deactivated successfully`,
        'success'
      );
      await fetchCompanies();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to deactivate insurance company. Please try again.'
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to deactivate insurance company. Please try again.',
        'error'
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(0);
  };

  const hasActiveFilters = search || statusFilter;

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
          Insurance Companies
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/insurance-companies/new')}
        >
          Add Insurance Company
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Grid size={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, payer ID, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearch('')}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={3}>
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
          <Grid size={2}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Tooltip title="Clear filters">
                <span>
                <IconButton
                  onClick={handleResetFilters}
                  disabled={loading || !hasActiveFilters}
                  color="primary"
                  sx={{ flexShrink: 0 }}
                >
                  <FilterAltOff />
                </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Refresh">
                <span>
                <IconButton
                  onClick={fetchCompanies}
                  disabled={loading}
                  color="primary"
                  sx={{ flexShrink: 0 }}
                >
                  <RefreshIcon />
                </IconButton>
                </span>
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
            <Box sx={{ position: 'relative' }}>
              {statusLoading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    borderRadius: 1,
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Payer ID</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No insurance companies found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      companies.map((company) => (
                        <TableRow key={company._id || company.id} hover>
                          <TableCell>
                            <Typography variant="body2">
                              {company.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{company.payerId || '-'}</TableCell>
                          <TableCell>{company.phone || '-'}</TableCell>
                          <TableCell>{company.email || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={company.isActive ? 'Active' : 'Inactive'}
                              color={company.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) =>
                                handleActionMenuOpen(
                                  e,
                                  company._id || company.id,
                                  company.name,
                                  company.isActive
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
            </Box>
            <TablePagination
              component="div"
              count={totalCompanies}
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
        <MenuItem onClick={() => handleEdit(actionMenu.companyId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {/* {actionMenu.isActive ? (
          <MenuItem
            onClick={() =>
              handleDeactivate(actionMenu.companyId, actionMenu.companyName)
            }
            sx={{ color: 'warning.main' }}
          >
            <ListItemIcon>
              <CancelIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Deactivate</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() =>
              handleActivate(actionMenu.companyId, actionMenu.companyName)
            }
            sx={{ color: 'success.main' }}
          >
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Activate</ListItemText>
          </MenuItem>
        )} */}
        <MenuItem
          onClick={() =>
            handleDelete(actionMenu.companyId, actionMenu.companyName)
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
        title="Delete Insurance Company"
        message={`Are you sure you want to delete insurance company "${deleteDialog.companyName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </Box>
  );
};

export default InsuranceCompaniesListPage;
