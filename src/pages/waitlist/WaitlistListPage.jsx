import { useState, useEffect, useCallback } from "react";
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
  IconButton,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Edit as EditIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterAltOff as FilterAltOffIcon,
  EventAvailable as RescheduleIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { waitlistService } from "../../services/waitlist.service";
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";
import dayjs from "dayjs";

const WaitlistListPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [waitlistEntries, setWaitlistEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    entryId: null,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [entryToReschedule, setEntryToReschedule] = useState(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    appointmentDate: null,
    startTime: null,
    endTime: null,
  });

  const debouncedSetSearch = useDebouncedCallback((value) => {
    setDebouncedSearch(value);
    setPage(0);
  }, 400);

  const fetchWaitlistEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await waitlistService.getAllWaitlistEntries(
        page + 1,
        rowsPerPage,
        "",
        "",
        statusFilter || "",
        priorityFilter || "",
        debouncedSearch || "",
        dateFrom ? dateFrom.format("YYYY-MM-DD") : "",
        dateTo ? dateTo.format("YYYY-MM-DD") : ""
      );
      setWaitlistEntries(result.waitlistEntries || []);
      setTotalEntries(result.pagination?.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to fetch waitlist entries. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [
    page,
    rowsPerPage,
    statusFilter,
    priorityFilter,
    debouncedSearch,
    dateFrom,
    dateTo,
  ]);

  useEffect(() => {
    fetchWaitlistEntries();
  }, [fetchWaitlistEntries]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionMenuOpen = (event, entryId) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      entryId,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu({
      anchorEl: null,
      entryId: null,
    });
  };

  const handleViewDetails = (entryId) => {
    handleActionMenuClose();
    navigate(`/waitlist/${entryId}`);
  };

  const handleEdit = (entryId) => {
    handleActionMenuClose();
    navigate(`/waitlist/${entryId}/edit`);
  };

  const handleDeleteClick = (entryId) => {
    handleActionMenuClose();
    setEntryToDelete(entryId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!entryToDelete) return;

    try {
      setDeleting(true);
      await waitlistService.deleteWaitlistEntry(entryToDelete);
      showSnackbar("Waitlist entry deleted successfully", "success");
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
      fetchWaitlistEntries();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to delete waitlist entry",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
  };

  const handleRescheduleClick = (entryId) => {
    handleActionMenuClose();
    const entry = waitlistEntries.find((e) => (e._id || e.id) === entryId);
    setEntryToReschedule(entry);
    setRescheduleData({
      appointmentDate: entry?.preferredDate ? dayjs(entry.preferredDate) : null,
      startTime: entry?.preferredTimeStart ? dayjs(`2000-01-01 ${entry.preferredTimeStart}`) : null,
      endTime: entry?.preferredTimeEnd ? dayjs(`2000-01-01 ${entry.preferredTimeEnd}`) : null,
    });
    setRescheduleDialogOpen(true);
  };

  const handleRescheduleConfirm = async () => {
    if (!entryToReschedule) return;

    if (!rescheduleData.appointmentDate || !rescheduleData.startTime || !rescheduleData.endTime) {
      showSnackbar("Please fill in all required fields", "warning");
      return;
    }

    try {
      setRescheduling(true);
      await waitlistService.convertToAppointment(entryToReschedule._id || entryToReschedule.id, {
        appointmentDate: rescheduleData.appointmentDate.format("YYYY-MM-DD"),
        startTime: rescheduleData.startTime.format("HH:mm"),
        endTime: rescheduleData.endTime.format("HH:mm"),
      });
      showSnackbar("Waitlist entry converted to appointment successfully", "success");
      setRescheduleDialogOpen(false);
      setEntryToReschedule(null);
      setRescheduleData({ appointmentDate: null, startTime: null, endTime: null });
      fetchWaitlistEntries();
    } catch (err) {
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to convert to appointment",
        "error"
      );
    } finally {
      setRescheduling(false);
    }
  };

  const handleRescheduleCancel = () => {
    setRescheduleDialogOpen(false);
    setEntryToReschedule(null);
    setRescheduleData({ appointmentDate: null, startTime: null, endTime: null });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setDateFrom(null);
    setDateTo(null);
    setPage(0);
  };

  const hasActiveFilters =
    searchTerm || statusFilter || priorityFilter || dateFrom || dateTo;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return dayjs(dateString).format("MMM DD, YYYY");
    } catch {
      return "-";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      active: "info",
      called: "warning",
      scheduled: "success",
      expired: "error",
    };
    return statusColors[status] || "default";
  };

  const getPriorityColor = (priority) => {
    const priorityColors = {
      urgent: "error",
      normal: "default",
      flexible: "success",
    };
    return priorityColors[priority] || "default";
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Waitlist
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/waitlist/new")}
        >
          Add to Waitlist
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} sx={{ mb: 3, alignItems: "flex-end" }}>
            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  debouncedSetSearch(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="called">Called</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel id="priority-filter-label">Priority</InputLabel>
                <Select
                  labelId="priority-filter-label"
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => {
                    setPriorityFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="">All Priorities</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="flexible">Flexible</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={3}>
              <DatePicker
                label="From Date"
                value={dateFrom}
                onChange={(newValue) => {
                  setDateFrom(newValue);
                  setPage(0);
                }}
                slotProps={{
                  textField: { size: "small", fullWidth: true },
                }}
              />
            </Grid>
            <Grid size={3}>
              <DatePicker
                label="To Date"
                value={dateTo}
                onChange={(newValue) => {
                  setDateTo(newValue);
                  setPage(0);
                }}
                minDate={dateFrom || undefined}
                slotProps={{
                  textField: { size: "small", fullWidth: true },
                }}
              />
            </Grid>
            <Grid size={1}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Tooltip title="Refresh">
                  <IconButton
                    onClick={fetchWaitlistEntries}
                    disabled={loading}
                    color="primary"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reset Filters">
                  <IconButton
                    onClick={handleResetFilters}
                    color="primary"
                    disabled={loading || !hasActiveFilters}
                  >
                    <FilterAltOffIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>

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
                    <TableCell>Patient</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Preferred Date & Time</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {waitlistEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No waitlist entries found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    waitlistEntries.map((entry) => (
                      <TableRow key={entry._id || entry.id} hover>
                        <TableCell>
                          {entry.patientId?.firstName}{" "}
                          {entry.patientId?.lastName}
                        </TableCell>
                        <TableCell>
                          {entry.providerId?.userId?.firstName}{" "}
                          {entry.providerId?.userId?.lastName}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {formatDate(entry.preferredDate)}
                            </Typography>
                            {entry.preferredTimeStart && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatTime(entry.preferredTimeStart)}
                                {entry.preferredTimeEnd &&
                                  ` - ${formatTime(entry.preferredTimeEnd)}`}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={entry.priority || "normal"}
                            color={getPriorityColor(entry.priority)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={entry.status || "active"}
                            color={getStatusColor(entry.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleActionMenuOpen(e, entry._id || entry.id)
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
              count={totalEntries}
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
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleViewDetails(actionMenu.entryId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEdit(actionMenu.entryId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleRescheduleClick(actionMenu.entryId)}
          sx={{ color: "success.main" }}
        >
          <ListItemIcon>
            <RescheduleIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Schedule Appointment</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteClick(actionMenu.entryId)}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="Delete Waitlist Entry"
        message="Are you sure you want to delete this waitlist entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleting}
      />

      <Dialog
        open={rescheduleDialogOpen}
        onClose={handleRescheduleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Schedule Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Convert this waitlist entry to an active appointment by selecting a date and time.
          </Typography>
          {entryToReschedule && (
            <Box sx={{ mb: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
              <Typography variant="subtitle2">
                Patient: {entryToReschedule.patientId?.firstName} {entryToReschedule.patientId?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Provider: {entryToReschedule.providerId?.userId?.firstName} {entryToReschedule.providerId?.userId?.lastName}
              </Typography>
            </Box>
          )}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <DatePicker
                label="Appointment Date *"
                value={rescheduleData.appointmentDate}
                onChange={(newValue) => setRescheduleData((prev) => ({ ...prev, appointmentDate: newValue }))}
                minDate={dayjs()}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <TimePicker
                label="Start Time *"
                value={rescheduleData.startTime}
                onChange={(newValue) => setRescheduleData((prev) => ({ ...prev, startTime: newValue }))}
                ampm={true}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <TimePicker
                label="End Time *"
                value={rescheduleData.endTime}
                onChange={(newValue) => setRescheduleData((prev) => ({ ...prev, endTime: newValue }))}
                ampm={true}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRescheduleCancel} disabled={rescheduling}>
            Cancel
          </Button>
          <Button
            onClick={handleRescheduleConfirm}
            variant="contained"
            color="success"
            disabled={rescheduling}
            startIcon={rescheduling ? <CircularProgress size={16} color="inherit" /> : <RescheduleIcon />}
          >
            Create Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WaitlistListPage;
