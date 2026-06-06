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
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Left Panel — fixed 472px wide, full height, hidden on mobile */}
      {/* Figma: content block is left: 52px + width: 420px = 472px minimum */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexShrink: 0,
          width: "580px",
          height: "100vh",
        }}
      >
        <AuthLeftPanel />
      </Box>

      {/* Right Panel — takes remaining width, centers the form */}
      <Box
        sx={{
          flex: 1,
          height: "100vh",
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
