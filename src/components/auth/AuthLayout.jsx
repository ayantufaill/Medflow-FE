import { Box } from "@mui/material";
import AuthLeftPanel from "./AuthLeftPanel";

/**
 * AuthLayout — Full-screen two-column split shell.
 * Left: dark navy branding panel (AuthLeftPanel)
 * Right: white area that centers the passed children (form)
 *
 * Used by: LoginPage, ForgotPasswordPage, RegisterPage
 */
const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Left Panel — hidden on mobile */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexShrink: 0,
          width: { md: "40%", lg: "45%" },
          minWidth: 360,
        }}
      >
        <AuthLeftPanel />
      </Box>

      {/* Right Panel — centered form area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          px: { xs: 2, sm: 4 },
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;
