import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Alert,
  IconButton,
  Button,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { userService } from "../../services/user.service";
import { roleService } from "../../services/role.service";
import UserForm from "../../components/users/UserForm";

const CreateUserPage = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [allRoles, setAllRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const roles = await roleService.getAllRoles();
        setAllRoles(roles || []);
        // Set default Patient role if available
        const patientRole = roles.find(
          (role) => role.name.toLowerCase() === "patient"
        );
        if (patientRole) {
          setSelectedRoleIds([patientRole._id || patientRole.id]);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to load roles. Please refresh the page.");
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");

      // Validate that at least one role is selected
      if (selectedRoleIds.length === 0) {
        setError("Please select at least one role for the user.");
        setSaving(false);
        return;
      }

      // Extract only the fields we need, excluding roleId and password fields
      const { password, confirmPassword, roleId, isActive, ...userData } = data;

      const createUserData = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || undefined,
        preferredLanguage: userData.preferredLanguage || "en",
        roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
      };

      await userService.createUser(createUserData);

      showSnackbar("User created successfully", "success");
      navigate("/users");
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to create user. Please try again."
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to create user. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const isRoleSelected = (roleId) => {
    return selectedRoleIds.includes(roleId);
  };

  const handleRoleToggle = (role) => {
    const roleId = role._id || role.id;
    const isSelected = isRoleSelected(roleId);

    if (isSelected) {
      setSelectedRoleIds((prev) => prev.filter((id) => id !== roleId));
    } else {
      setSelectedRoleIds((prev) => [...prev, roleId]);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Create User
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter user details and assign roles.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loadingRoles ? (
        <Box sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <UserForm
            onSubmit={handleSubmit}
            loading={saving}
            isEditMode={false}
            hidePassword={true}
            hideRoleSelection={true}
            hideButtons={true}
            formId="create-user-form"
          />

          <Box sx={{ mt: 4, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Assign Roles
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Click on a role to select or deselect it. Selected roles are
              highlighted.
            </Typography>

            {allRoles.length === 0 ? (
              <Alert severity="info">No roles available</Alert>
            ) : (
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {allRoles.map((role) => {
                  const roleId = role._id || role.id;
                  const isSelected = isRoleSelected(roleId);
                  return (
                    <Chip
                      key={roleId}
                      label={role.name}
                      onClick={() => handleRoleToggle(role)}
                      color={isSelected ? "primary" : "default"}
                      variant={isSelected ? "filled" : "outlined"}
                      icon={
                        isSelected ? (
                          <CheckCircleIcon fontSize="small" />
                        ) : undefined
                      }
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: isSelected
                            ? "primary.dark"
                            : "action.hover",
                        },
                        minWidth: 100,
                      }}
                      disabled={saving}
                    />
                  );
                })}
              </Stack>
            )}
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
          >
            <Button variant="outlined" onClick={handleBack} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              form="create-user-form"
              disabled={saving || selectedRoleIds.length === 0}
              startIcon={
                saving ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {saving ? "Creating..." : "Create User"}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default CreateUserPage;
