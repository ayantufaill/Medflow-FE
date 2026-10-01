import {
  Dashboard,
  People,
  CalendarToday,
  Description,
  AccountBalance,
  MonitorHeart,
  AttachMoney,
  Business,
} from '@mui/icons-material';

// ─── PURE 4-GROUP DEFINITIONS ────────────────────────────────────────────────
export const USER_GROUPS = {
  ADMIN_GROUP: ['Super Admin', 'Group Admin', 'Branch Admin', 'Admin'],
  // Full operational admin roles. Group Admin remains group-scoped by backend
  // permission and branch-access checks.
  FULL_ADMIN_GROUP: ['Super Admin', 'Group Admin', 'Branch Admin', 'Admin'],
  CLINICAL_GROUP: ['Provider', 'Doctor', 'Hygienist', 'Assistant', 'Dental Assistant', 'Clinical Staff'],
  OPERATIONS_GROUP: ['Front Desk', 'Receptionist', 'Biller', 'Billing Staff', 'Lab', 'Lab Technician'],
  PATIENT_GROUP: ['Patient'],
};

export const getUserGroups = (user) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) return [];
  const userRoleNames = user.roles
    .map((role) => (typeof role === 'string' ? role : role?.name || ''))
    .filter(Boolean);

  const groups = new Set();
  for (const roleName of userRoleNames) {
    for (const [groupKey, roles] of Object.entries(USER_GROUPS)) {
      if (roles.includes(roleName)) {
        groups.add(groupKey);
      }
    }
  }
  return Array.from(groups);
};

export const hasRequiredGroup = (user, allowedGroups) => {
  if (!allowedGroups || allowedGroups.length === 0) return true;
  if (!user) return false;

  const userRoleNames = (user.roles || [])
    .map((role) => (typeof role === 'string' ? role : role?.name || ''))
    .filter(Boolean);

  const groups = getUserGroups(user);

  // Administrative Group has universal platform authority
  if (userRoleNames.includes('Super Admin')) {
    return true;
  }

  return allowedGroups.some((group) => groups.includes(group));
};

// ─── NAVIGATION MENU ITEMS WITH GROUP SPECIFICATION ──────────────────────────
export const navMenuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/admin/reports',
    allowedGroups: ['ADMIN_GROUP', 'OPERATIONS_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Biller', 'Billing Staff', 'Front Desk', 'Receptionist'],
    requiredPermissions: ['reports.read'],
  },
  {
    text: 'Patients',
    icon: <People />,
    path: '/patients',
    allowedGroups: ['FULL_ADMIN_GROUP', 'CLINICAL_GROUP', 'OPERATIONS_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Provider', 'Hygienist', 'Assistant', 'Front Desk', 'Receptionist', 'Biller', 'Lab'],
    requiredPermissions: ['patients.read', 'patients.read_basic'],
  },
  {
    text: 'Appointments',
    icon: <CalendarToday />,
    path: '/appointments/operatory-schedule',
    allowedGroups: ['FULL_ADMIN_GROUP', 'CLINICAL_GROUP', 'OPERATIONS_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Provider', 'Hygienist', 'Assistant', 'Front Desk', 'Receptionist', 'Biller', 'Lab', 'Clinical Staff'],
  },
  {
    text: 'Vital Signs',
    icon: <MonitorHeart />,
    path: '/vital-signs',
    allowedGroups: ['FULL_ADMIN_GROUP', 'CLINICAL_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Provider', 'Hygienist', 'Assistant'],
  },
  {
    text: 'Patient Reports',
    icon: <Description />,
    path: '/patient-reports',
    allowedGroups: ['FULL_ADMIN_GROUP', 'CLINICAL_GROUP', 'OPERATIONS_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Provider', 'Hygienist', 'Assistant', 'Front Desk', 'Receptionist', 'Biller'],
    requiredPermissions: ['patients.read'],
  },
  {
    text: 'Insurance',
    icon: <AccountBalance />,
    path: '/insurance',
    allowedGroups: ['FULL_ADMIN_GROUP', 'CLINICAL_GROUP', 'OPERATIONS_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Provider', 'Doctor', 'Hygienist', 'Biller', 'Billing Staff', 'Front Desk', 'Receptionist'],
    requiredPermissions: ['insurance.read'],
  },
  {
    text: 'Finance',
    icon: <AttachMoney />,
    path: '/finance',
    allowedGroups: ['FULL_ADMIN_GROUP', 'OPERATIONS_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Biller', 'Billing Staff', 'Front Desk', 'Receptionist'],
    requiredPermissions: ['invoices.read', 'payments.read'],
  },
  {
    text: 'Lab Cases',
    icon: <Description />,
    path: '/clinical/lab-case',
    allowedGroups: ['FULL_ADMIN_GROUP', 'CLINICAL_GROUP', 'OPERATIONS_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Provider', 'Doctor', 'Hygienist', 'Assistant', 'Lab', 'Lab Technician'],
    requiredPermissions: ['lab-orders.read'],
  },
  {
    text: 'Clinical',
    icon: <Description />,
    path: '/clinical',
    allowedGroups: ['FULL_ADMIN_GROUP', 'CLINICAL_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Provider', 'Hygienist', 'Assistant'],
  },
  {
    text: 'Practice Groups',
    icon: <Business />,
    path: '/admin/practice-groups',
    allowedGroups: ['ADMIN_GROUP'],
    requiredRoles: ['Admin', 'Super Admin'],
  },
  {
    text: 'My Group',
    icon: <Business />,
    path: '/admin/my-group',
    allowedGroups: ['ADMIN_GROUP'],
    requiredRoles: ['Admin', 'Group Admin', 'Branch Admin'],
  },
];

// Roles allowed to switch the active branch context (UserProfile.jsx)
export const BRANCH_SWITCH_ROLES = [
  'Admin', 'Super Admin', 'Group Admin', 'Branch Admin',
  'Provider', 'Doctor', 'Hygienist', 'Assistant', 'Clinical Staff',
  'Front Desk', 'Receptionist', 'Biller', 'Billing Staff', 'Lab', 'Lab Technician'
];

// Bidirectional role aliases to bridge canonical roles with legacy names.
// NOTE: 'Admin', 'Super Admin', 'Group Admin', and 'Branch Admin' are
// deliberately NOT aliased to each other here. Unlike the pairs below (which
// really are just two names for the same job — e.g. 'Doctor' and 'Provider'
// both get identical backend permissions), those four admin roles have
// genuinely different scopes on the backend (Group Admin in particular is
// intentionally denied patient/clinical data access — see
// Medflow-BE's phi.middleware.ts). Aliasing them together used to make any
// item that allowed 'Admin' silently also match a Group Admin, regardless of
// what was actually listed in requiredRoles. Admin/Branch Admin/Super Admin
// still get full access through their '*' permission (see
// hasRequiredPermission below) or the explicit Super Admin check in
// hasRequiredRole — removing this alias doesn't take anything away from them.
export const ROLE_ALIASES = {
  'Front Desk': ['Receptionist'],
  'Receptionist': ['Front Desk'],
  'Biller': ['Billing Staff'],
  'Billing Staff': ['Biller'],
  'Assistant': ['Clinical Staff', 'Dental Assistant'],
  'Dental Assistant': ['Assistant', 'Clinical Staff'],
  'Hygienist': ['Clinical Staff'],
  'Clinical Staff': ['Assistant', 'Hygienist', 'Dental Assistant'],
  'Provider': ['Doctor'],
  'Doctor': ['Provider'],
  'Lab': ['Lab Technician'],
  'Lab Technician': ['Lab'],
};

// Returns true if `user` holds at least one role in `requiredRoles` (or if the item
// has no role restriction at all), with full group support.
export const hasRequiredRole = (user, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!user || !user.roles || user.roles.length === 0) return false;

  const userRoleNames = user.roles
    .map((role) => (typeof role === 'string' ? role : role?.name || ''))
    .filter(Boolean);

  const groups = getUserGroups(user);

  // Administrative Group has universal platform access across all modules
  if (userRoleNames.includes('Super Admin') || hasRequiredPermission(user, ['*'])) {
    return true;
  }

  // Check if any required roles match group names
  const groupMatches = requiredRoles.filter((r) => r in USER_GROUPS);
  if (groupMatches.length > 0 && groupMatches.some((g) => groups.includes(g))) {
    return true;
  }

  const expandedUserRoles = new Set(userRoleNames);
  for (const r of userRoleNames) {
    const aliases = ROLE_ALIASES[r] || [];
    for (const a of aliases) {
      expandedUserRoles.add(a);
    }
  }

  return requiredRoles.some((role) => {
    if (expandedUserRoles.has(role)) return true;
    const reqAliases = ROLE_ALIASES[role] || [];
    return reqAliases.some((a) => expandedUserRoles.has(a));
  });
};

// Consolidates permissions off every role object the user holds
export const hasRequiredPermission = (user, requiredPermissions, requireAll = false) => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  if (!user || !Array.isArray(user.roles)) return false;

  const consolidated = user.roles.reduce((acc, role) => {
    if (role && typeof role === 'object' && role.permissions && typeof role.permissions === 'object') {
      for (const [key, val] of Object.entries(role.permissions)) {
        if (val === true) acc[key] = true;
      }
    }
    return acc;
  }, {});

  if (consolidated['*'] === true) return true;

  return requireAll
    ? requiredPermissions.every((key) => consolidated[key] === true)
    : requiredPermissions.some((key) => consolidated[key] === true);
};
