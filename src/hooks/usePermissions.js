import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SUPER_ADMIN = 'Super Admin';

const getRoleName = (role) => {
  if (typeof role === 'string') return role;
  return role?.name || role?.roleName || role?.Description || role?.description || '';
};

const collectPermissions = (user) => {
  const granted = new Set();

  if (Array.isArray(user?.permissions)) {
    user.permissions.forEach((permission) => {
      if (permission) granted.add(permission);
    });
  }

  for (const role of user?.roles || []) {
    const permissions = role && typeof role === 'object' ? role.permissions : null;
    if (!permissions || typeof permissions !== 'object') continue;

    for (const [key, value] of Object.entries(permissions)) {
      if (value === true) granted.add(key);
      if (value && typeof value === 'object' && value.allowed === true) granted.add(key);
    }
  }

  return granted;
};

export const usePermissions = () => {
  const { user } = useAuth();

  return useMemo(() => {
    const permissions = collectPermissions(user);
    const roles = (user?.roles || []).map(getRoleName).filter(Boolean);
    const isPlatformAdmin =
      user?.isPlatformAdmin === true ||
      roles.includes(SUPER_ADMIN) ||
      permissions.has('*');

    const has = (permission) => {
      if (!permission) return true;
      return isPlatformAdmin || permissions.has(permission);
    };

    const hasAny = (required = []) => {
      const keys = Array.isArray(required) ? required : [required];
      return keys.length === 0 || keys.some(has);
    };

    const hasAll = (required = []) => {
      const keys = Array.isArray(required) ? required : [required];
      return keys.every(has);
    };

    return {
      permissions,
      roles,
      has,
      hasAny,
      hasAll,
      isPlatformAdmin,
      clinics: user?.clinics || {
        defaultId: user?.defaultClinicId || '',
        restrictedIds: user?.branchIds || [],
        accessAll: user?.accessAllBranches || false,
      },
      sharing: user?.sharing || {},
      accessVersion: user?.accessVersion,
    };
  }, [user]);
};

export default usePermissions;
