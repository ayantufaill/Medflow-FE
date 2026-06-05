import { useState } from "react";
import { Box, Typography } from "@mui/material";

/**
 * AuthInput — Reusable Figma-styled form field.
 *
 * Figma specs:
 *   - Label: Manrope 500, 11px, uppercase, ls 0.08em, #6B7280
 *   - Input: Manrope 400, 14px, #082545, border: 1px solid #E5E7EB, radius: 4px, height: 40px
 *   - Focus: border #2D6CDF, box-shadow: 0 0 0 3px rgba(45,108,223,0.12)
 *   - Error: border #EF4444
 *
 * Props:
 *   id, label, type, placeholder, error, endAdornment,
 *   autoFocus, autoComplete, disabled + all register() spread props
 */
const AuthInput = ({
  id,
  label,
  type = "text",
  placeholder,
  error,
  endAdornment,
  autoFocus = false,
  autoComplete,
  disabled = false,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <Box sx={{ mb: "20px" }}>
      {/* Label — only shown when label prop is provided (email field) */}
      {label && (
        <Typography
          component="label"
          htmlFor={id}
          sx={{
            display: "block",
            fontFamily: "Manrope, sans-serif",
            fontWeight: 500,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#6B7280",
            mb: "6px",
          }}
        >
          {label}
        </Typography>
      )}

      {/* Input wrapper */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          border: `1px solid ${error ? "#EF4444" : focused ? "#2D6CDF" : "#E5E7EB"}`,
          borderRadius: "4px",
          boxShadow: focused
            ? "0 0 0 3px rgba(45, 108, 223, 0.12)"
            : error
            ? "0 0 0 3px rgba(239, 68, 68, 0.10)"
            : "none",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          backgroundColor: disabled ? "#F9FAFB" : "#ffffff",
        }}
      >
        <Box
          component="input"
          id={id}
          type={type}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          sx={{
            flex: 1,
            height: "44px",
            padding: "0 12px",
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "Manrope, sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            color: "#082545",
            "&::placeholder": {
              color: "#9CA3AF",
            },
            "&:disabled": {
              cursor: "not-allowed",
              color: "#9CA3AF",
            },
          }}
          {...rest}
        />

        {/* End adornment slot (SHOW button, icons, etc.) */}
        {endAdornment && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              pr: "10px",
              flexShrink: 0,
            }}
          >
            {endAdornment}
          </Box>
        )}
      </Box>

      {/* Error message */}
      {error && (
        <Typography
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "11px",
            color: "#EF4444",
            mt: "4px",
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default AuthInput;
