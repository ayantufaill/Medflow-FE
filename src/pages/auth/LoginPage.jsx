import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { loginValidations } from "../../validations/auth.validations";
import { getPostLoginRoute } from "../../utils/auth-routing";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check for success message from navigation state or URL params
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    } else if (location.search) {
      const params = new URLSearchParams(location.search);
      if (params.get('registered') === 'true') {
        const message = params.get('message') || 'Registration completed successfully! Please login.';
        setSuccessMessage(message);
        // Clean URL
        window.history.replaceState({}, document.title, '/login');
      }
    }
  }, [location]);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * Extract error message from various error formats
   */
  const extractErrorMessage = (err) => {
    // Check for rate limit errors (429)
    if (err.response?.status === 429) {
      return err.response?.data?.error?.message || 
             err.response?.data?.message || 
             'Too many login attempts. Please wait 15 minutes before trying again.';
    }
    
    // Check for response data with error object
    if (err.response?.data?.error) {
      const errorData = err.response.data.error;
      
      // Check for validation errors (field-specific)
      if (errorData.errors && typeof errorData.errors === 'object') {
        const errorMessages = Object.values(errorData.errors).flat();
        if (errorMessages.length > 0) {
          return errorMessages.join('. ');
        }
      }
      
      // Check for error message - prioritize account deactivation message
      if (errorData.message) {
        // Check if it's an account deactivation message
        if (errorData.message.toLowerCase().includes('deactivated') || 
            errorData.message.toLowerCase().includes('inactive')) {
          return errorData.message;
        }
        return errorData.message;
      }
    }
    
    // Check for response data with message at root level
    if (err.response?.data?.message) {
      // Check if it's an account deactivation message
      if (err.response.data.message.toLowerCase().includes('deactivated') || 
          err.response.data.message.toLowerCase().includes('inactive')) {
        return err.response.data.message;
      }
      return err.response.data.message;
    }
    
    // Check for network errors
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return 'Request timeout. Please check your internet connection and try again.';
    }
    
    if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    // Check for server errors (500, 502, 503, 504)
    if (err.response?.status >= 500) {
      return 'Server error. Please try again later. If the problem persists, contact support.';
    }
    
    // Check for axios error message
    if (err.message) {
      // Don't show technical axios error messages
      if (err.message.includes('Request failed with status code')) {
        const statusCode = err.response?.status;
        if (statusCode === 401) {
          return 'Invalid email or password. Please check your credentials and try again.';
        }
        if (statusCode === 403) {
          return 'Access denied. Please contact administrator.';
        }
        return 'Login failed. Please check your credentials and try again.';
      }
      // For other axios errors, return a user-friendly message
      if (err.message.includes('timeout') || err.message.includes('network')) {
        return 'Connection error. Please check your internet connection and try again.';
      }
    }
    
    // Default fallback
    return 'Login failed. Please check your credentials and try again.';
  };

  const onSubmit = async (data) => {
    setError("");
    setSuccessMessage(""); // Clear success message when new error occurs
    setLoading(true);

    try {
      const result = await login(data);
      if (result.success) {
        navigate(getPostLoginRoute(result.user), { replace: true });
      } else {
        // Use the error object if available, otherwise use the error message
        if (result.errorObj) {
          const errorMessage = extractErrorMessage(result.errorObj);
          setError(errorMessage);
          // Log the full error object for debugging if needed
          console.error('Login error:', result.errorObj);
        } else {
          setError(result.error || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      // This should rarely happen now, but keeping as fallback
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      setSuccessMessage(""); // Clear success message on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Welcome back! Please sign in to your account.
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              <Typography variant="body2">{error}</Typography>
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email", loginValidations.email)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password", loginValidations.password)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <MuiLink component={Link} to="/forgot-password" variant="body2">
                Forgot Password?
              </MuiLink>
            </Box>
            {/* <Box sx={{ textAlign: "center", mt: 2 }}>
              Don't have an account?&nbsp;
              <MuiLink component={Link} to="/register" variant="body2">
                Sign Up
              </MuiLink>
            </Box> */}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
