import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserById,
  updateUser,
  selectCurrentUser,
  selectCurrentUserLoading,
} from "../../store/slices/userSlice";
import { useSnackbar } from "../../contexts/SnackbarContext";
import UserForm from "../../components/users/UserForm";

const EditUserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectCurrentUserLoading);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (!userId || fetchingRef.current) return;
    fetchingRef.current = true;
    const load = async () => {
      try {
        await dispatch(fetchUserById(userId)).unwrap();
      } catch (err) {
        if (err?.name === 'ConditionError') return;
        const errorMsg = typeof err === 'string' ? err : 
          (err?.message || "Failed to load user data. Please try again.");
        setError(errorMsg);
      } finally {
        fetchingRef.current = false;
      }
    };
    load();
  }, [userId, dispatch]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");

      const userData = { ...data };
      delete userData.password;
      delete userData.confirmPassword;
      await dispatch(updateUser({ userId, updates: userData })).unwrap();

      showSnackbar("User updated successfully", "success");
      navigate("/admin/user-management");
    } catch (err) {
      setError(err || "Failed to update user. Please try again.");
    } finally {
      setSaving(false);
    }
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

  const handleBack = () => {
    window.history.back();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit User
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Edit user details to update the user.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <UserForm
              onSubmit={onSubmit}
              initialData={user}
              loading={saving}
              isEditMode={true}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditUserPage;
