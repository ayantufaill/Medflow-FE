import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";
import { loginValidations } from "../../validations/auth.validations";
import { getPostLoginRoute } from "../../utils/auth-routing";
import { AuthLayout, AuthInput, AuthButton } from "../../components/auth";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  // Check for success message from navigation state or URL params
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    } else if (location.search) {
      const params = new URLSearchParams(location.search);
      if (params.get("registered") === "true") {
        const message =
          params.get("message") ||
          "Registration completed successfully! Please login.";
        setSuccessMessage(message);
        // Clean URL
        window.history.replaceState({}, document.title, "/login");
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
      return (
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Too many login attempts. Please wait 15 minutes before trying again."
      );
    }

    // Check for response data with error object
    if (err.response?.data?.error) {
      const errorData = err.response.data.error;

      // Check for validation errors (field-specific)
      if (errorData.errors && typeof errorData.errors === "object") {
        const errorMessages = Object.values(errorData.errors).flat();
        if (errorMessages.length > 0) {
          return errorMessages.join(". ");
        }
      }

      // Check for error message - prioritize account deactivation message
      if (errorData.message) {
        if (
          errorData.message.toLowerCase().includes("deactivated") ||
          errorData.message.toLowerCase().includes("inactive")
        ) {
          return errorData.message;
        }
        return errorData.message;
      }
    }

    // Check for response data with message at root level
    if (err.response?.data?.message) {
      if (
        err.response.data.message.toLowerCase().includes("deactivated") ||
        err.response.data.message.toLowerCase().includes("inactive")
      ) {
        return err.response.data.message;
      }
      return err.response.data.message;
    }

    // Check for network errors
    if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
      return "Request timeout. Please check your internet connection and try again.";
    }

    if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
      return "Network error. Please check your internet connection and try again.";
    }

    // Check for server errors (500, 502, 503, 504)
    if (err.response?.status >= 500) {
      return "Server error. Please try again later. If the problem persists, contact support.";
    }

    // Check for axios error message
    if (err.message) {
      if (err.message.includes("Request failed with status code")) {
        const statusCode = err.response?.status;
        if (statusCode === 401) {
          return "Invalid email or password. Please check your credentials and try again.";
        }
        if (statusCode === 403) {
          return "Access denied. Please contact administrator.";
        }
        return "Login failed. Please check your credentials and try again.";
      }
      if (
        err.message.includes("timeout") ||
        err.message.includes("network")
      ) {
        return "Connection error. Please check your internet connection and try again.";
      }
    }

    // Default fallback
    return "Login failed. Please check your credentials and try again.";
  };

  const onSubmit = async (data) => {
    setError("");
    setSuccessMessage(""); // Clear success message when new error occurs

    try {
      const resultAction = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate(getPostLoginRoute(resultAction.payload), { replace: true });
      } else {
        // rejected
        setError(resultAction.payload || "Login failed. Please try again.");
      }
    } catch (err) {
      // Catch any unexpected errors during dispatch
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      setSuccessMessage("");
    }
  };

  return (
    <AuthLayout>
      {/* ── Right Panel Form Box ── */}
      {/* Figma: 380px wide, centered vertically */}
      <Box sx={{ width: "100%", maxWidth: 380 }}>

        {/* Heading */}
        <Typography
          component="h1"
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 800,
            fontSize: "24px",
            lineHeight: 1,
            letterSpacing: "-0.24px",
            color: "#082545",
            mb: "6px",
          }}
        >
          Welcome back
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            color: "#6B7280",
            mb: "28px",
          }}
        >
          Sign in to your clinical workspace.
        </Typography>

        {/* Success Alert */}
        {successMessage && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              fontFamily: "Manrope, sans-serif",
              fontSize: "13px",
              borderRadius: "8px",
            }}
          >
            {successMessage}
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              fontFamily: "Manrope, sans-serif",
              fontSize: "13px",
              borderRadius: "8px",
            }}
          >
            {error}
          </Alert>
        )}

        {/* ── Form ── */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* Clinic Email */}
          <AuthInput
            id="email"
            label="CLINIC EMAIL"
            type="email"
            placeholder="dr.wells@medflow.io"
            autoFocus
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", loginValidations.email)}
          />

          {/* Password label row with inline Forgot password? */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: "6px",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 500,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#6B7280",
              }}
            >
              Password
            </Typography>
            <Link
              to="/forgot-password"
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "#2D6CDF",
                textDecoration: "none",
              }}
            >
              Forgot password?
            </Link>
          </Box>

          {/* Password Input */}
          <AuthInput
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="password123"
            autoComplete="current-password"
            error={errors.password?.message}
            endAdornment={
              <Box
                component="button"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                sx={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  color: "#6B7280",
                  "&:hover": { color: "#082545" },
                  transition: "color 0.15s ease",
                }}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </Box>
            }
            {...register("password", loginValidations.password)}
          />

          {/* Remember Me Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                id="remember-me"
                size="small"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                sx={{
                  color: "#D1D5DB",
                  padding: "2px 6px 2px 0",
                  "&.Mui-checked": { color: "#2D6CDF" },
                  "& .MuiSvgIcon-root": { fontSize: 18 },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 400,
                  fontSize: "13px",
                  color: "#6B7280",
                }}
              >
                Keep me signed in on this device
              </Typography>
            }
            sx={{ ml: 0, mt: "4px", mb: "20px" }}
          />

          {/* CTA Button */}
          <AuthButton type="submit" loading={loading}>
            Sign in to MedFlow
          </AuthButton>
        </Box>

        {/* Footer link */}
        <Typography
          sx={{
            textAlign: "center",
            mt: "28px",
            fontFamily: "Manrope, sans-serif",
            fontSize: "13px",
            color: "#6B7280",
          }}
        >
          New to MedFlow?{" "}
          <Link
            to="/register"
            style={{
              color: "#2D6CDF",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Request access
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
