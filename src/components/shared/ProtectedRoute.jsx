import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { CircularProgress, Box, Alert } from "@mui/material";
import { hasRequiredRole, hasRequiredPermission, hasRequiredGroup, getUserGroups } from "../../config/navMenuItems";
import { moduleTurnedOff, moduleGranted } from "../../constants/teamModuleAccess";

/**
 * ProtectedRoute Component with Pure 4-Group support
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if access is granted
 * @param {string[]} [props.allowedGroups] - Array of group keys (e.g. ['ADMIN_GROUP', 'CLINICAL_GROUP'])
 * @param {string[]} [props.requiredRoles] - Array of role names required to access the route (e.g., ['Admin'])
 * @param {string[]} [props.requiredPermissions] - Array of permission strings required to access the route (e.g., ['users.read'])
 * @param {boolean} [props.requireAllRoles=false] - If true, user must have ALL required roles. If false, user needs ANY of the roles.
 * @param {boolean} [props.requireAllPermissions=false] - If true, user must have ALL required permissions. If false, user needs ANY of the permissions.
 * @param {boolean} [props.requireEitherRoleOrPermission=false] - When both requiredRoles and requiredPermissions are given
 * @param {string} [props.accessDeniedMessage] - Custom message to display when access is denied
 */
const ProtectedRoute = ({
  children,
  allowedGroups = [],
  requiredRoles = [],
  requiredPermissions = [],
  requireAllRoles = false,
  requireAllPermissions = false,
  requireEitherRoleOrPermission = false,
  // Optional extra grant, e.g. a feature flag: (user) => boolean. When it
  // returns true the role/group/permission checks below are skipped.
  allowIf,
  accessDeniedMessage = "Access denied. You do not have the required privileges to access this page.",
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    return <Navigate to="/login" replace />;
  }

  // Super Admin & ADMIN_GROUP have universal platform access across all modules
  const userRoleNames = (user?.roles || [])
    .map((role) => (typeof role === 'string' ? role : role?.name || ''))
    .filter(Boolean);

  const groups = getUserGroups(user);

  if (userRoleNames.includes('Super Admin') || hasRequiredPermission(user, ['*'])) {
    return children;
  }

  // Team Access: the user's admin turned this module off for them.
  const turnedOff = moduleTurnedOff(user, location.pathname);
  if (turnedOff) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Access denied. Your administrator has turned off your access to {turnedOff.label}.</Alert>
      </Box>
    );
  }

  // Team Access: the user's admin granted this module beyond their role. That
  // stands in for the role/group checks, not for the page's own permission
  // (e.g. /patients/new still needs patients.create, which a switched-off
  // "Add new patients" removes).
  if (moduleGranted(user, location.pathname)) {
    if (requiredPermissions.length === 0 || hasRequiredPermission(user, requiredPermissions, requireAllPermissions)) {
      return children;
    }
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{accessDeniedMessage}</Alert>
      </Box>
    );
  }

  if (typeof allowIf === 'function' && allowIf(user)) {
    return children;
  }

  // 1. Group-level check if specified
  if (allowedGroups.length > 0) {
    if (!hasRequiredGroup(user, allowedGroups)) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{accessDeniedMessage}</Alert>
        </Box>
      );
    }
  }

  // 2. Role and permission checks for fine-grained / legacy compatibility
  const roleCheckApplies = requiredRoles.length > 0;
  const permissionCheckApplies = requiredPermissions.length > 0;

  if (!roleCheckApplies && !permissionCheckApplies) {
    return children;
  }

  const passesRoles = !roleCheckApplies || (requireAllRoles
    ? requiredRoles.every((role) => hasRequiredRole(user, [role]))
    : hasRequiredRole(user, requiredRoles));
  const passesPermissions = !permissionCheckApplies
    || hasRequiredPermission(user, requiredPermissions, requireAllPermissions);

  const denied = requireEitherRoleOrPermission && roleCheckApplies && permissionCheckApplies
    ? !passesRoles && !passesPermissions
    : !passesRoles || !passesPermissions;

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
