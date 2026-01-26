import { useState, useEffect } from "react";
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
  Avatar,
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
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  Cancel as CancelIcon,
  Clear,
  FilterAltOff,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { userService } from "../../services/user.service";
import { roleService } from "../../services/role.service";
import ConfirmationDialog from "../../components/shared/ConfirmationDialog";

const UsersListPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roles, setRoles] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null,
    userName: "",
  });
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    userId: null,
    userName: "",
    isActive: null,
  });
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleResetFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
    setPage(0);
  };

  const hasActiveFilters = search || roleFilter || statusFilter;

  // Fetch roles for filter dropdown
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await roleService.getAllRoles();
        setRoles(rolesData || []);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await userService.getAllUsers(
        page + 1,
        rowsPerPage,
        search,
        roleFilter,
        statusFilter
      );
      setUsers(result.users || []);
      setTotalUsers(result.pagination.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to fetch users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, roleFilter, statusFilter]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (page === 0) {
        fetchUsers();
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

  const handleDeleteClick = (userId, userName) => {
    setDeleteDialog({
      open: true,
      userId,
      userName,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await userService.deleteUser(deleteDialog.userId);
      showSnackbar("User deleted successfully", "success");
      setDeleteDialog({ open: false, userId: null, userName: "" });
      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to delete user. Please try again."
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to delete user. Please try again.",
        "error"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, userId: null, userName: "" });
  };

  const handleActionMenuOpen = (event, userId, userName, isActive) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      userId,
      userName,
      isActive,
    });
  };

  const handleActionMenuClose = () => {
    setActionMenu((prev) => ({ ...prev, anchorEl: null }));
  };

  const handleActionMenuExited = () => {
    setActionMenu({
      anchorEl: null,
      userId: null,
      userName: "",
      isActive: null,
    });
  };

  const handleViewDetails = (userId) => {
    handleActionMenuClose();
    navigate(`/users/${userId}`);
  };

  const handleEdit = (userId) => {
    handleActionMenuClose();
    navigate(`/users/${userId}/edit`);
  };

  const handleAssignRoles = (userId) => {
    handleActionMenuClose();
    navigate(`/users/${userId}/roles`);
  };

  const handleDelete = (userId, userName) => {
    handleActionMenuClose();
    handleDeleteClick(userId, userName);
  };

  const handleActivate = async (userId, userName) => {
    handleActionMenuClose();
    try {
      setStatusLoading(true);
      setError("");
      await userService.activateUser(userId);
      showSnackbar(`User "${userName}" activated successfully`, "success");
      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to activate user. Please try again."
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to activate user. Please try again.",
        "error"
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDeactivate = async (userId, userName) => {
    handleActionMenuClose();
    try {
      setStatusLoading(true);
      setError("");
      await userService.deactivateUser(userId);
      showSnackbar(`User "${userName}" deactivated successfully`, "success");
      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to deactivate user. Please try again."
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to deactivate user. Please try again.",
        "error"
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const getUserInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  const getRoleChips = (roles) => {
    if (!roles || roles.length === 0)
      return <Chip label="No roles" size="small" color="default" />;

    return roles.map((role, index) => (
      <Chip
        key={index}
        label={typeof role === "string" ? role : role.name}
        size="small"
        color={role === "Admin" || role?.name === "Admin" ? "error" : "primary"}
        sx={{ mr: 0.5, mb: 0.5 }}
      />
    ));
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
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/users/new")}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
          <Grid item size={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search a user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  search.length > 0 && <IconButton size="small" onClick={() => setSearch("")}>
                    <Clear />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item size={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="role-filter-label">Filter by Role</InputLabel>
              <Select
                labelId="role-filter-label"
                id="role-filter"
                value={roleFilter}
                label="Filter by Role"
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="">
                  <em>All Roles</em>
                </MenuItem>
                {roles.map((role) => (
                  <MenuItem
                    key={role._id || role.id}
                    value={role._id || role.id}
                  >
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item size={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">
                  Filter by Status
                </InputLabel>
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
          <Grid size={2} sx={{ display: "flex", alignItems: "center", justifyContent: "end", gap: 1 }}>
            <Tooltip title="Clear Filters">
              <span>
                <IconButton
                  onClick={handleResetFilters}
                  disabled={loading || !hasActiveFilters}
                  color="primary"
                >
                  <FilterAltOff />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Refresh">
              <span>
                <IconButton
                  onClick={fetchUsers}
                  disabled={loading}
                  color="primary"
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ position: "relative" }}>
              {statusLoading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Roles</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No users found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user._id || user.id} hover>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: "primary.main",
                                  fontSize: "1rem",
                                }}
                              >
                                {getUserInitials(user.firstName, user.lastName)}
                              </Avatar>
                              <Typography variant="body2">
                                {user.firstName} {user.lastName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || "-"}</TableCell>
                          <TableCell>{getRoleChips(user.roles)}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.isActive ? "Active" : "Inactive"}
                              color={user.isActive ? "success" : "default"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) =>
                                handleActionMenuOpen(
                                  e,
                                  user._id || user.id,
                                  `${user.firstName} ${user.lastName}`,
                                  user.isActive
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
              count={totalUsers}
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
        TransitionProps={{ onExited: handleActionMenuExited }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleViewDetails(actionMenu.userId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleEdit(actionMenu.userId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {/* {currentUser?._id !== actionMenu.userId && (
          <>
            {actionMenu.isActive ? (
              <MenuItem
                onClick={() =>
                  handleDeactivate(actionMenu.userId, actionMenu.userName)
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
                  handleActivate(actionMenu.userId, actionMenu.userName)
                }
                sx={{ color: 'success.main' }}
              >
                <ListItemIcon>
                  <CheckCircleIcon fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText>Activate</ListItemText>
              </MenuItem>
            )} */}
        <MenuItem onClick={() => handleAssignRoles(actionMenu.userId)}>
          <ListItemIcon>
            <SecurityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Assign Roles</ListItemText>
        </MenuItem>
        {currentUser?._id !== actionMenu.userId &&
          (actionMenu.isActive ? (
            <MenuItem
              key="deactivate"
              onClick={() =>
                handleDeactivate(actionMenu.userId, actionMenu.userName)
              }
              sx={{ color: "warning.main" }}
            >
              <ListItemIcon>
                <CancelIcon fontSize="small" color="warning" />
              </ListItemIcon>
              <ListItemText>Deactivate</ListItemText>
            </MenuItem>
          ) : (
            <MenuItem
              key="activate"
              onClick={() =>
                handleActivate(actionMenu.userId, actionMenu.userName)
              }
              sx={{ color: "success.main" }}
            >
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Activate</ListItemText>
            </MenuItem>
          ))}
        <MenuItem
          key="delete"
          onClick={() => handleDelete(actionMenu.userId, actionMenu.userName)}
          sx={{ color: "error.main" }}
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
        title="Delete User"
        message={`Are you sure you want to delete user "${deleteDialog.userName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        loading={deleteLoading}
      />
    </Box>
  );
};

export default UsersListPage;
