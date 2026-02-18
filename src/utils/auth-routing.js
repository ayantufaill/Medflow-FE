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

export const getPostLoginRoute = (userOrRoles) => {
  return isPatientOnlyUser(userOrRoles) ? '/portal' : '/dashboard';
};
