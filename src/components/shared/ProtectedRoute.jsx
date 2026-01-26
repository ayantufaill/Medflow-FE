import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { CircularProgress, Box, Alert } from "@mui/material";

/**
 * ProtectedRoute Component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if access is granted
 * @param {string[]} [props.requiredRoles] - Array of role names required to access the route (e.g., ['Admin'])
 * @param {string[]} [props.requiredPermissions] - Array of permission strings required to access the route (e.g., ['users.read'])
 * @param {boolean} [props.requireAllRoles=false] - If true, user must have ALL required roles. If false, user needs ANY of the roles.
 * @param {boolean} [props.requireAllPermissions=false] - If true, user must have ALL required permissions. If false, user needs ANY of the permissions.
 * @param {string} [props.accessDeniedMessage] - Custom message to display when access is denied
 */
const ProtectedRoute = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  requireAllRoles = false,
  requireAllPermissions = false,
  accessDeniedMessage = "Access denied. You do not have the required privileges to access this page.",
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  /**
   * Checks if a user has all specific required permissions.
   * @param {Object} user - The user profile object containing roles with permissions.
   * @param {string[]} requiredPermissions - Array of strings representing needed permissions.
   * @returns {boolean} - Returns true only if the user has ALL required permissions.
   */
  const hasRequiredPermissions = (user, requiredPermissions) => {
    if (!user || !Array.isArray(user.roles)) {
      console.warn("Invalid user object or roles array missing.");
      return false;
    }

    // Extract permissions from user roles (role objects with permissions)
    const userPermissions = user.roles.reduce((consolidated, roleObj) => {
      if (roleObj && roleObj.permissions && typeof roleObj.permissions === 'object') {
        return { ...consolidated, ...roleObj.permissions };
      }
      return consolidated;
    }, {});

    // Check if user has all required permissions
    const hasAll = requiredPermissions.every((permissionKey) => {
      return userPermissions[permissionKey] === true;
    });

    return hasAll;
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Clear any stale tokens before redirecting to prevent navigation issues
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    return <Navigate to="/login" replace />;
  }

  // Check roles if required
  if (requiredRoles.length > 0) {
    const userRoles = user?.roles || [];

    // Extract role names from user roles (handle both string and object formats)
    const userRoleNames = userRoles
      .map((role) => {
        if (typeof role === "string") {
          return role;
        }
        return role?.name || "";
      })
      .filter(Boolean);

    let hasRequiredRole;
    if (requireAllRoles) {
      // User must have ALL required roles
      hasRequiredRole = requiredRoles.every((requiredRole) =>
        userRoleNames.includes(requiredRole)
      );
    } else {
      // User needs ANY of the required roles
      hasRequiredRole = requiredRoles.some((requiredRole) =>
        userRoleNames.includes(requiredRole)
      );
    }

    if (!hasRequiredRole) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{accessDeniedMessage}</Alert>
        </Box>
      );
    }
  }

  // Check permissions if required
  if (requiredPermissions.length > 0) {
    const hasAllRequiredPermissions = hasRequiredPermissions(user, requiredPermissions);
    if (!hasAllRequiredPermissions) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{accessDeniedMessage}</Alert>
        </Box>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
