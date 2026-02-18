import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
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
  FileCopy as FileCopyIcon,
  FilterAltOff,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { noteTemplateService } from '../../services/note-template.service';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';

const NoteTemplatesListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [noteTemplates, setNoteTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    templateId: null,
    templateName: '',
  });
  const [duplicateDialog, setDuplicateDialog] = useState({
    open: false,
    templateId: null,
    templateName: '',
    newName: '',
  });
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    templateId: null,
    templateName: '',
    isActive: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [duplicateLoading, setDuplicateLoading] = useState(false);
  const [statusToggleLoading, setStatusToggleLoading] = useState(false);

  const fetchNoteTemplates = useCallback(async (searchValue) => {
    try {
      setLoading(true);
      setError('');

      let isActive = undefined;
      if (statusFilter === 'active') {
        isActive = true;
      } else if (statusFilter === 'inactive') {
        isActive = false;
      }

      const result = await noteTemplateService.getAllNoteTemplates(
        page + 1,
        rowsPerPage,
        searchValue?.trim(),
        '',
        isActive
      );
      setNoteTemplates(result.noteTemplates || []);
      setTotalTemplates(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch note templates. Please try again.'
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to fetch note templates',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, showSnackbar]);

  const debouncedFetch = useDebouncedCallback((searchValue) => {
    if (page === 0) {
      fetchNoteTemplates(searchValue);
    } else {
      setPage(0);
    }
  }, 500);

  useEffect(() => {
    fetchNoteTemplates(search);
  }, [page, rowsPerPage, statusFilter]);

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (templateId, templateName) => {
    setDeleteDialog({
      open: true,
      templateId,
      templateName,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await noteTemplateService.deleteNoteTemplate(deleteDialog.templateId);
      showSnackbar('Note template deleted successfully', 'success');
      setDeleteDialog({ open: false, templateId: null, templateName: '' });
      await fetchNoteTemplates();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete note template. Please try again.'
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to delete note template',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, templateId: null, templateName: '' });
  };

  const handleDuplicateClick = (templateId, templateName) => {
    setDuplicateDialog({
      open: true,
      templateId,
      templateName,
      newName: `${templateName} (Copy)`,
    });
  };

  const handleDuplicateConfirm = async () => {
    try {
      setDuplicateLoading(true);
      await noteTemplateService.duplicateNoteTemplate(
        duplicateDialog.templateId,
        duplicateDialog.newName
      );
      showSnackbar('Note template duplicated successfully', 'success');
      setDuplicateDialog({
        open: false,
        templateId: null,
        templateName: '',
        newName: '',
      });
      await fetchNoteTemplates();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to duplicate note template',
        'error'
      );
    } finally {
      setDuplicateLoading(false);
    }
  };

  const handleDuplicateCancel = () => {
    setDuplicateDialog({
      open: false,
      templateId: null,
      templateName: '',
      newName: '',
    });
  };

  const handleActionMenuOpen = (event, templateId, templateName, isActive) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      templateId,
      templateName,
      isActive,
    });
  };

const handleActionMenuClose = () => {
  setActionMenu((prevState) => ({
    ...prevState,
    anchorEl: null,
    templateId: null,
    templateName: '',
    isActive: prevState.isActive,
  }));
};

  const handleViewDetails = (templateId) => {
    handleActionMenuClose();
    navigate(`/note-templates/${templateId}`);
  };

  const handleEdit = (templateId) => {
    handleActionMenuClose();
    navigate(`/note-templates/${templateId}/edit`);
  };

  const handleDelete = (templateId, templateName) => {
    handleActionMenuClose();
    handleDeleteClick(templateId, templateName);
  };

  const handleDuplicate = (templateId, templateName) => {
    handleActionMenuClose();
    handleDuplicateClick(templateId, templateName);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  const handleClearFilters = () => {
    setStatusFilter('');
  };

  const handleRefresh = () => {
    fetchNoteTemplates(search);
  };

  const handleToggleStatus = async (templateId) => {
    try {
      setStatusToggleLoading(true);
      handleActionMenuClose();
      await noteTemplateService.toggleNoteTemplateStatus(templateId);
      showSnackbar('Template status updated successfully', 'success');
      await fetchNoteTemplates(search);
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to update template status',
        'error'
      );
    } finally {
      setStatusToggleLoading(false);
    }
  };

  const formatCreatedDate = (value) => {
    if (!value) return '-';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '-' : parsed.toLocaleDateString();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "start", gap: 2, mb: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            SOAP Note Templates
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage clinical documentation templates for efficient note-taking
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/note-templates/create')}
        >
          Create Template
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search templates by name, description, or specialty..."
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
                    <IconButton size="small" onClick={handleClearSearch}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={2}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Tooltip title="Clear Filters">
                <IconButton 
                  onClick={handleClearFilters} 
                  color='primary' 
                  disabled={loading || !statusFilter}
                >
                  <FilterAltOff />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} color='primary' disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Template Name</TableCell>
              <TableCell>Specialty</TableCell>
              <TableCell>Fields</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : noteTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {search || statusFilter
                      ? 'No templates found matching your criteria'
                      : 'No note templates yet. Create your first template to get started.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              noteTemplates.map((template) => (
                <TableRow
                  key={template._id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleViewDetails(template._id)}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {template.name}
                    </Typography>
                    {template.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 300,
                        }}
                      >
                        {template.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {template.specialty ? (
                      <Chip label={template.specialty} size="small" />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {template.templateStructure?.fields?.length || 0} fields
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {template.isActive ? (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Active"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<CancelIcon />}
                        label="Inactive"
                        color="default"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatCreatedDate(template.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      onClick={(e) =>
                        handleActionMenuOpen(
                          e,
                          template._id,
                          template.name,
                          template.isActive
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
        <TablePagination
          component="div"
          count={totalTemplates}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      <Menu
        anchorEl={actionMenu.anchorEl}
        open={Boolean(actionMenu.anchorEl)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => handleViewDetails(actionMenu.templateId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEdit(actionMenu.templateId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleDuplicate(actionMenu.templateId, actionMenu.templateName)
          }
        >
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleToggleStatus(actionMenu.templateId)}
          disabled={statusToggleLoading}
        >
          <ListItemIcon>
            {actionMenu.isActive ? (
              <CancelIcon fontSize="small" />
            ) : (
              <CheckCircleIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {actionMenu.isActive ? 'Mark as Inactive' : 'Mark as Active'}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleDelete(actionMenu.templateId, actionMenu.templateName)
          }
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmationDialog
        open={deleteDialog.open}
        title="Delete Note Template"
        message={`Are you sure you want to delete "${deleteDialog.templateName}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        severity="error"
      />

      <ConfirmationDialog
        open={duplicateDialog.open}
        title="Duplicate Note Template"
        message={
          <Box>
            <Typography gutterBottom>
              Enter a name for the duplicated template:
            </Typography>
            <TextField
              fullWidth
              value={duplicateDialog.newName}
              onChange={(e) =>
                setDuplicateDialog({
                  ...duplicateDialog,
                  newName: e.target.value,
                })
              }
              placeholder="Template name"
              autoFocus
            />
          </Box>
        }
        onConfirm={handleDuplicateConfirm}
        onCancel={handleDuplicateCancel}
        confirmText="Duplicate"
        cancelText="Cancel"
        confirmColor="primary"
        loading={duplicateLoading}
      />
    </Box>
  );
};

export default NoteTemplatesListPage;
