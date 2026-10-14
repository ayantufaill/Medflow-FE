import { hasRequiredPermission } from '../config/navMenuItems';

export const getRoleNames = (userOrRoles) => {
  if (!userOrRoles) return [];

  if (Array.isArray(userOrRoles)) {
    return userOrRoles
      .map((role) => (typeof role === 'string' ? role : role?.name))
      .filter(Boolean);
  }

  const roles = userOrRoles.roles || [];
  return roles
    .map((role) => (typeof role === 'string' ? role : role?.name))
    .filter(Boolean);
};

export const isPatientOnlyUser = (userOrRoles) => {
  const roleNames = getRoleNames(userOrRoles);
  return roleNames.includes('Patient') && roleNames.every((role) => role === 'Patient');
};

/**
 * Where a staff user lands. The dashboard needs reports access, which most
 * roles don't have (screen access matrix: dentist, hygienist, dental
 * assistant and lab have Reports "None"), so they'd land on "Unable to load
 * dashboard metrics". Send them to the first page their role can use.
 * Uses the profile's effective permissions, so Team Access overrides count.
 */
export const getStaffLandingRoute = (user) => {
  if (hasRequiredPermission(user, ['reports.read', 'reports.access'])) return '/dashboard';
  if (hasRequiredPermission(user, ['appointments.read'])) return '/appointments/operatory-schedule';
  if (hasRequiredPermission(user, ['patients.read', 'patients.read_basic'])) return '/patients';
  return '/profile';
};

export const getPostLoginRoute = (userOrRoles) => {
  if (isPatientOnlyUser(userOrRoles)) return '/portal';
  // A bare roles array (registration flow) carries no permissions to decide by.
  if (Array.isArray(userOrRoles)) return '/dashboard';
  return getStaffLandingRoute(userOrRoles);
};
