import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { CircularProgress, Box, Alert } from "@mui/material";
import { hasRequiredRole, hasRequiredPermission } from "../../config/navMenuItems";

/**
 * ProtectedRoute Component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if access is granted
 * @param {string[]} [props.requiredRoles] - Array of role names required to access the route (e.g., ['Admin'])
 * @param {string[]} [props.requiredPermissions] - Array of permission strings required to access the route (e.g., ['users.read'])
 * @param {boolean} [props.requireAllRoles=false] - If true, user must have ALL required roles. If false, user needs ANY of the roles.
 * @param {boolean} [props.requireAllPermissions=false] - If true, user must have ALL required permissions. If false, user needs ANY of the permissions.
 * @param {boolean} [props.requireEitherRoleOrPermission=false] - When both requiredRoles and requiredPermissions
 *   are given, the default is to require BOTH checks to pass (e.g. "must be Admin AND have X"). Set this to
 *   true to instead pass if EITHER check passes on its own (e.g. "Admin OR anyone with the group:view_analytics
 *   permission" — lets a role like Group Admin, which will never hold the 'Admin' role name, in via permission
 *   alone instead of being blocked by the role check before permissions are even considered).
 * @param {string} [props.accessDeniedMessage] - Custom message to display when access is denied
 */
const ProtectedRoute = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  requireAllRoles = false,
  requireAllPermissions = false,
  requireEitherRoleOrPermission = false,
  accessDeniedMessage = "Access denied. You do not have the required privileges to access this page.",
}) => {
  const { isAuthenticated, loading, user } = useAuth();

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

  const roleCheckApplies = requiredRoles.length > 0;
  const permissionCheckApplies = requiredPermissions.length > 0;

  // hasRequiredRole (navMenuItems.jsx) is ANY-of by design — for ALL-of, check each individually.
  const passesRoles = !roleCheckApplies || (requireAllRoles
    ? requiredRoles.every((role) => hasRequiredRole(user, [role]))
    : hasRequiredRole(user, requiredRoles));
  const passesPermissions = !permissionCheckApplies
    || hasRequiredPermission(user, requiredPermissions, requireAllPermissions);

  const denied = requireEitherRoleOrPermission && roleCheckApplies && permissionCheckApplies
    ? !passesRoles && !passesPermissions // OR mode: only deny if NEITHER check passes
    : !passesRoles || !passesPermissions; // default AND mode: deny if either applicable check fails

  if (denied) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{accessDeniedMessage}</Alert>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
