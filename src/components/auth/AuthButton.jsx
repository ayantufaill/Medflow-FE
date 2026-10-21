import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * AuthButton — Primary CTA button for auth pages.
 *
 * Figma specs:
 *   - Width:  100% (380px constrained by form parent)
 *   - Height: 44px
 *   - Border-radius: 10px
 *   - Background: #2D6CDF
 *   - Hover: #1D55B8
 *   - Active: scale(0.98)
 *   - Font: Manrope 600, 15px, white, no text-transform
 *   - Disabled / loading: opacity 0.65
 *
 * Props:
 *   type, loading, disabled, onClick, variant ("primary" | "outlined"),
 *   loadingText, children
 */
const AuthButton = ({
  type = "button",
  loading = false,
  disabled = false,
  onClick,
  variant = "primary",
  loadingText = "Signing in...",
  children,
}) => {
  const isDisabled = disabled || loading;
  const isOutlined = variant === "outlined";

  return (
    <Box
      component="button"
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      sx={{
        width: "100%",
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        backgroundColor: isOutlined ? "transparent" : "#2D6CDF",
        border: isOutlined ? "1px solid #2D6CDF" : "none",
        borderRadius: "10px",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.65 : 1,
        transition: "background-color 0.2s ease, transform 0.1s ease, opacity 0.2s ease",
        "&:hover:not(:disabled)": {
          backgroundColor: isOutlined ? "rgba(45, 108, 223, 0.06)" : "#1D55B8",
        },
        "&:active:not(:disabled)": {
          transform: "scale(0.98)",
        },
        "&:focus-visible": {
          outline: "2px solid #2D6CDF",
          outlineOffset: "2px",
        },
      }}
    >
      {loading && (
        <CircularProgress
          size={16}
          thickness={4}
          sx={{ color: isOutlined ? "#2D6CDF" : "#ffffff" }}
        />
      )}
      <Typography
        component="span"
        sx={{
          fontFamily: "Manrope, sans-serif",
          fontWeight: 600,
          fontSize: "15px",
          color: isOutlined ? "#2D6CDF" : "#ffffff",
          textTransform: "none",
          letterSpacing: "0",
          lineHeight: 1,
        }}
      >
        {loading ? loadingText : children}
      </Typography>
    </Box>
  );
};

export default AuthButton;
