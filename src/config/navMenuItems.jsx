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
// Each group lists both the legacy display names ('Group Admin') and the
// new-model role keys ('group_admin') the backend returns for accounts created
// with the 8-role model — mirrors USER_GROUPS in Medflow-BE
// src/types/user-group.types.ts. Without the keys those accounts resolve to no
// group and every protected page shows "Access denied".
export const USER_GROUPS = {
  ADMIN_GROUP: ['Super Admin', 'Group Admin', 'Branch Admin', 'Admin', 'group_admin', 'branch_admin'],
  // Full operational admin roles. Group Admin remains group-scoped by backend
  // permission and branch-access checks.
  FULL_ADMIN_GROUP: ['Super Admin', 'Group Admin', 'Branch Admin', 'Admin', 'group_admin', 'branch_admin'],
  CLINICAL_GROUP: [
    'Provider', 'Doctor', 'Hygienist', 'Assistant', 'Dental Assistant', 'Clinical Staff',
    'dentist', 'hygienist', 'dental_assistant',
  ],
  OPERATIONS_GROUP: [
    'Front Desk', 'Receptionist', 'Biller', 'Billing Staff', 'Lab', 'Lab Technician',
    'front_desk', 'billing', 'lab',
  ],
  PATIENT_GROUP: ['Patient', 'patient'],
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
  // New-model role keys → the legacy names they correspond to, so items whose
  // requiredRoles list legacy names also match 8-role-model accounts. Mirrors
  // NEW_MODEL_ROLE_EQUIVALENTS in Medflow-BE src/types/user-group.types.ts.
  'group_admin': ['Group Admin'],
  'branch_admin': ['Branch Admin'],
  'dentist': ['Provider', 'Doctor'],
  'hygienist': ['Hygienist', 'Clinical Staff'],
  'dental_assistant': ['Dental Assistant', 'Assistant', 'Clinical Staff'],
  'front_desk': ['Front Desk', 'Receptionist'],
  'billing': ['Biller', 'Billing Staff'],
  'lab': ['Lab', 'Lab Technician'],
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
  // The profile's effective permission list includes what a role inherits on the
  // backend (a group_admin gets branch_admin's set live), which the role objects
  // above don't carry on their own.
  if (Array.isArray(user.permissions)) {
    for (const key of user.permissions) consolidated[key] = true;
  }

  if (consolidated['*'] === true) return true;

  return requireAll
    ? requiredPermissions.every((key) => consolidated[key] === true)
    : requiredPermissions.some((key) => consolidated[key] === true);
};
