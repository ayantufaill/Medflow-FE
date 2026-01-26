import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { userService } from "../../services/user.service";
import { roleService } from "../../services/role.service";

const AssignRolesPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [userData, rolesData] = await Promise.all([
        userService.getUserById(userId),
        roleService.getAllRoles(),
      ]);

      setUser(userData);
      setAllRoles(rolesData || []);
      setUserRoles(userData?.roles || []);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to load data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const isRoleAssigned = (roleId) => {
    return userRoles.some((role) => role._id === roleId || role.id === roleId);
  };

  const handleRoleToggle = async (role) => {
    const roleId = role._id || role.id;
    const isAssigned = isRoleAssigned(roleId);

    try {
      setUpdating(true);
      setError("");

      if (isAssigned) {
        await userService.removeRole(userId, roleId);
        setUserRoles((prev) => prev.filter((r) => (r._id || r.id) !== roleId));
        showSnackbar(`Role "${role.name}" removed successfully`, "success");
      } else {
        await userService.assignRole(userId, roleId);
        setUserRoles((prev) => [...prev, role]);
        showSnackbar(`Role "${role.name}" assigned successfully`, "success");
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          `Failed to ${
            isAssigned ? "remove" : "assign"
          } role. Please try again.`
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          `Failed to ${
            isAssigned ? "remove" : "assign"
          } role. Please try again.`,
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };

  const getUserInitials = (firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  const handleBack = () => {
    window.history.back();
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

  if (!user) {
    return (
      <Box>
        <Alert severity="error">User not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Assign Roles
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage roles for {user.firstName} {user.lastName}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, position: "relative" }}>
        {updating && (
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 3,
            pb: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          {/* User's Details - Clickable */}
          <Box
            onClick={() => navigate(`/users/${userId}`)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              p: 1,
              borderRadius: 1,
              transition: "background-color 0.2s",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "primary.main",
                fontSize: "1.5rem",
              }}
            >
              {getUserInitials(user.firstName, user.lastName)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Roles
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Click on a role to assign or remove it. Selected roles are
          highlighted.
        </Typography>

        {allRoles.length === 0 ? (
          <Alert severity="info">No roles available</Alert>
        ) : (
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {allRoles.map((role) => {
              const isAssigned = isRoleAssigned(role._id || role.id);
              return (
                <Chip
                  key={role._id || role.id}
                  label={role.name}
                  onClick={() => handleRoleToggle(role)}
                  color={isAssigned ? "primary" : "default"}
                  variant={isAssigned ? "filled" : "outlined"}
                  icon={
                    isAssigned ? (
                      <CheckCircleIcon fontSize="small" />
                    ) : undefined
                  }
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: isAssigned
                        ? "primary.dark"
                        : "action.hover",
                    },
                    minWidth: 100,
                  }}
                  disabled={updating}
                />
              );
            })}
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default AssignRolesPage;