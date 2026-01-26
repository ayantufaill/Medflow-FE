import { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
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
  Schedule as ScheduleIcon,
  FilterAltOff,
  Draw as SignIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { clinicalNoteService } from "../../services/clinical-note.service";
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";
import { NOTE_TYPES } from "../../validations/clinicalNoteValidations";

const ClinicalNotesListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalNotes, setTotalNotes] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [signedFilter, setSignedFilter] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    noteId: null,
    patientName: "",
  });
  const [signDialog, setSignDialog] = useState({
    open: false,
    noteId: null,
  });
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    noteId: null,
    isSigned: false,
    patientName: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [signLoading, setSignLoading] = useState(false);

  const fetchClinicalNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {};
      if (searchQuery) filters.search = searchQuery;
      if (signedFilter === "signed") filters.isSigned = true;
      else if (signedFilter === "unsigned") filters.isSigned = false;
      if (startDateFilter) filters.startDate = startDateFilter.format('YYYY-MM-DD');
      if (endDateFilter) filters.endDate = endDateFilter.format('YYYY-MM-DD');

      const result = await clinicalNoteService.getAllClinicalNotes(
        page + 1,
        rowsPerPage,
        filters
      );
      setClinicalNotes(result.clinicalNotes || []);
      setTotalNotes(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to fetch clinical notes. Please try again."
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to fetch clinical notes",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, startDateFilter, endDateFilter, signedFilter, showSnackbar]);

  const debouncedSearch = useDebouncedCallback((value) => {
    setSearchQuery(value);
    setPage(0);
  }, 300);

  useEffect(() => {
    fetchClinicalNotes();
  }, [fetchClinicalNotes]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (noteId, patientName) => {
    setDeleteDialog({
      open: true,
      noteId,
      patientName,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await clinicalNoteService.deleteClinicalNote(deleteDialog.noteId);
      showSnackbar("Clinical note deleted successfully", "success");
      setDeleteDialog({ open: false, noteId: null, patientName: "" });
      await fetchClinicalNotes();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to delete clinical note",
        "error"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, noteId: null, patientName: "" });
  };

  const handleSignClick = (noteId) => {
    setSignDialog({
      open: true,
      noteId,
    });
  };

  const handleSignConfirm = async () => {
    try {
      setSignLoading(true);
      await clinicalNoteService.signClinicalNote(signDialog.noteId);
      showSnackbar("Clinical note signed successfully", "success");
      setSignDialog({ open: false, noteId: null });
      await fetchClinicalNotes();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to sign clinical note",
        "error"
      );
    } finally {
      setSignLoading(false);
    }
  };

  const handleSignCancel = () => {
    setSignDialog({ open: false, noteId: null });
  };

  const handleActionMenuOpen = (event, noteId, isSigned, patientName) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      noteId,
      isSigned,
      patientName,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu({
      anchorEl: null,
      noteId: null,
      isSigned: false,
      patientName: "",
    });
  };

  const handleViewDetails = (noteId) => {
    handleActionMenuClose();
    navigate(`/clinical-notes/${noteId}`);
  };

  const handleEdit = (noteId) => {
    handleActionMenuClose();
    navigate(`/clinical-notes/${noteId}/edit`);
  };

  const handleDelete = (noteId, patientName) => {
    handleActionMenuClose();
    handleDeleteClick(noteId, patientName);
  };

  const handleSign = (noteId) => {
    handleActionMenuClose();
    handleSignClick(noteId);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSearchInputValue("");
    setStartDateFilter(null);
    setEndDateFilter(null);
    setSignedFilter("");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchInputValue("");
    setPage(0);
  };

  const handleRefresh = () => {
    fetchClinicalNotes();
  };

  const getPatientName = (note) => {
    if (note.patientId?.firstName && note.patientId?.lastName) {
      return `${note.patientId.firstName} ${note.patientId.lastName}`;
    }
    return "Unknown Patient";
  };

  const getProviderName = (note) => {
    if (note.providerId?.firstName && note.providerId?.lastName) {
      return `${note.providerId.firstName} ${note.providerId.lastName}`;
    }
    return "Unknown Provider";
  };

  const getNoteTypeLabel = (noteType) => {
    const type = NOTE_TYPES.find((t) => t.value === noteType);
    return type ? type.label : noteType;
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "start", gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} size="large" sx={{ mt: 0.5 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Clinical Notes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage SOAP notes and clinical documentation
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/clinical-notes/create")}
        >
          Create Note
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by patient, provider, note type..."
              value={searchInputValue}
              onChange={(e) => {
                setSearchInputValue(e.target.value);
                debouncedSearch(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchInputValue && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <DatePicker
              label="Start Date"
              value={startDateFilter}
              onChange={(newValue) => {
                setStartDateFilter(newValue);
                setPage(0);
              }}
              slotProps={{
                textField: { size: "small", fullWidth: true },
              }}
              maxDate={endDateFilter || dayjs()}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <DatePicker
              label="End Date"
              value={endDateFilter}
              onChange={(newValue) => {
                setEndDateFilter(newValue);
                setPage(0);
              }}
              slotProps={{
                textField: { size: "small", fullWidth: true },
              }}
              minDate={startDateFilter}
              maxDate={dayjs()}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={signedFilter}
                label="Status"
                onChange={(e) => setSignedFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="signed">Signed</MenuItem>
                <MenuItem value="unsigned">Unsigned (Draft)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Tooltip title="Clear Filters">
                <IconButton
                  onClick={handleClearFilters}
                  color="primary"
                  disabled={searchQuery === "" && !startDateFilter && !endDateFilter && signedFilter === ""}
                >
                  <FilterAltOff />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton
                  onClick={handleRefresh}
                  color="primary"
                  disabled={loading}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      </LocalizationProvider>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              {/* <TableCell>Provider</TableCell> */}
              <TableCell>Note Type</TableCell>
              <TableCell>Chief Complaint</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : clinicalNotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {searchQuery || noteTypeFilter || signedFilter
                      ? "No clinical notes found matching your criteria"
                      : "No clinical notes yet. Create your first note to get started."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              clinicalNotes.map((note) => (
                <TableRow
                  key={note._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleViewDetails(note._id)}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {getPatientName(note)}
                    </Typography>
                  </TableCell>
                  {/* <TableCell>
                    <Typography variant="body2">
                      {getProviderName(note)}
                    </Typography>
                  </TableCell> */}
                  <TableCell>
                    <Chip
                      label={getNoteTypeLabel(note.noteType)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 200,
                      }}
                    >
                      {note.chiefComplaint || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {note.isSigned ? (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Signed"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        icon={<ScheduleIcon />}
                        label="Draft"
                        color="warning"
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      onClick={(e) =>
                        handleActionMenuOpen(
                          e,
                          note._id,
                          note.isSigned,
                          getPatientName(note)
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
          count={totalNotes}
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
        <MenuItem onClick={() => handleViewDetails(actionMenu.noteId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        {!actionMenu.isSigned && (
          <MenuItem onClick={() => handleEdit(actionMenu.noteId)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {!actionMenu.isSigned && (
          <MenuItem onClick={() => handleSign(actionMenu.noteId)}>
            <ListItemIcon>
              <SignIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText sx={{ color: "primary.main" }}>
              Sign Note
            </ListItemText>
          </MenuItem>
        )}
        {!actionMenu.isSigned && (
          <MenuItem
            onClick={() =>
              handleDelete(actionMenu.noteId, actionMenu.patientName)
            }
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: "error.main" }}>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>

      <ConfirmationDialog
        open={deleteDialog.open}
        title="Delete Clinical Note"
        message={`Are you sure you want to delete this clinical note for "${deleteDialog.patientName}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        severity="error"
      />

      <ConfirmationDialog
        open={signDialog.open}
        title="Sign Clinical Note"
        message="Are you sure you want to sign this clinical note? Once signed, the note cannot be edited or deleted."
        onConfirm={handleSignConfirm}
        onCancel={handleSignCancel}
        confirmText="Sign"
        cancelText="Cancel"
        loading={signLoading}
        severity="warning"
      />
    </Box>
  );
};

export default ClinicalNotesListPage;
