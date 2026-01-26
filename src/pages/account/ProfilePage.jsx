import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Alert,
  IconButton,
  CircularProgress,
  Avatar,
  Button,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { userService } from "../../services/user.service";
import { authService } from "../../services/auth.service";
import UserForm from "../../components/users/UserForm";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleBack = () => {
    window.history.back();
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setError("");
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setError("");
    // Reset form data to original user data
    if (user) {
      setProfileData(user);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");

      const {
        password,
        confirmPassword,
        roleId,
        isActive,
        email,
        ...userData
      } = data;

      await userService.updateProfile({
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || undefined,
        preferredLanguage: userData.preferredLanguage || "en",
      });

      // Refresh user profile in AuthContext
      if (updateUser) {
        await updateUser();
      }

      // Update local state
      const profile = await authService.getProfile();
      setProfileData(profile);

      setIsEditMode(false);
      showSnackbar("Profile updated successfully", "success");
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
      showSnackbar(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Failed to update profile. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const getUserInitials = () => {
    if (profileData?.firstName && profileData?.lastName) {
      return `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  const getRoleChips = (roles) => {
    if (!roles || roles.length === 0)
      return <Chip label="No roles" size="small" color="default" />;

    return roles.map((role, index) => {
      const roleName = typeof role === "string" ? role : role.name;
      const isAdmin = roleName === "Admin";

      return (
        <Chip
          key={index}
          label={roleName}
          size="small"
          color={isAdmin ? "error" : "primary"}
          sx={{ mr: 1, mb: 1 }}
        />
      );
    });
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

  if (!profileData) {
    return (
      <Box>
        <Alert severity="error">Failed to load profile</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Profile
          </Typography>
          {/* <Typography variant="body1" color="text.secondary">
            {isEditMode
              ? 'Update your personal information.'
              : 'View your profile information.'}
          </Typography> */}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {!isEditMode ? (
        // View Mode
        <>
          {/* Profile Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flex: 1,
                  minWidth: 300,
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.main",
                    fontSize: "2rem",
                  }}
                >
                  {getUserInitials()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold">
                      {profileData.firstName} {profileData.lastName}
                    </Typography>
                  </Box>
                  <Chip
                    label={profileData.isActive ? "Active" : "Inactive"}
                    size="small"
                    color={profileData.isActive ? "success" : "error"}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Personal Information */}
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                Personal Information
              </Typography>
              <Button
                variant="contained"
                size="small"
                disableElevation
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Update
              </Button>
            </Box>
            <Grid container spacing={3}>
              {/* <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  First Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {profileData.firstName || '-'}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Last Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {profileData.lastName || '-'}
                </Typography>
              </Grid> */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {profileData.email || "-"}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Phone
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {profileData.phone || "-"}
                </Typography>
              </Grid>
              {/* <Grid size={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                >
                  Preferred Language
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {profileData.preferredLanguage
                    ? profileData.preferredLanguage.toUpperCase()
                    : "EN"}
                </Typography>
              </Grid> */}
              {/* <Grid size={12}>
                <Box sx={{ mt: 0.5 }}>{getRoleChips(profileData.roles)}</Box>
              </Grid> */}
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                Roles
              </Typography>
            </Box>
            <Box sx={{ mt: 0.5 }}>{getRoleChips(profileData.roles)}</Box>
          </Paper>
        </>
      ) : (
        // Edit Mode
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <UserForm
            onSubmit={onSubmit}
            initialData={profileData}
            loading={saving}
            isEditMode={true}
            hidePassword={true}
            hideRoleSelection={true}
            disableEmail={true}
            hideButtons={true}
            formId="profile-form"
          />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
          >
            <Button variant="outlined" onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              form="profile-form"
              disabled={saving}
              startIcon={
                saving ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ProfilePage;
