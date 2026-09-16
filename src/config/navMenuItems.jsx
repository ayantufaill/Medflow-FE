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
  if (groups.includes('ADMIN_GROUP') || userRoleNames.includes('Super Admin')) {
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
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Biller', 'Billing Staff', 'Front Desk', 'Receptionist', 'Lab', 'Lab Technician'],
  },
  {
    text: 'Patients',
    icon: <People />,
    path: '/patients',
    allowedGroups: ['ADMIN_GROUP', 'CLINICAL_GROUP', 'OPERATIONS_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Provider', 'Hygienist', 'Assistant', 'Front Desk', 'Receptionist', 'Biller', 'Lab'],
  },
  {
    text: 'Appointments',
    icon: <CalendarToday />,
    path: '/appointments/operatory-schedule',
    allowedGroups: ['ADMIN_GROUP', 'CLINICAL_GROUP', 'OPERATIONS_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Provider', 'Hygienist', 'Assistant', 'Front Desk', 'Receptionist', 'Biller', 'Lab', 'Clinical Staff'],
  },
  {
    text: 'Vital Signs',
    icon: <MonitorHeart />,
    path: '/vital-signs',
    allowedGroups: ['ADMIN_GROUP', 'CLINICAL_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Provider', 'Hygienist', 'Assistant'],
  },
  {
    text: 'Patient Reports',
    icon: <Description />,
    path: '/patient-reports',
    allowedGroups: ['ADMIN_GROUP', 'CLINICAL_GROUP', 'OPERATIONS_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Provider', 'Hygienist', 'Assistant', 'Front Desk', 'Receptionist', 'Biller', 'Lab'],
  },
  {
    text: 'Insurance',
    icon: <AccountBalance />,
    path: '/insurance',
    allowedGroups: ['ADMIN_GROUP', 'OPERATIONS_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Biller', 'Billing Staff', 'Front Desk', 'Receptionist', 'Lab'],
  },
  {
    text: 'Finance',
    icon: <AttachMoney />,
    path: '/finance',
    allowedGroups: ['ADMIN_GROUP', 'OPERATIONS_GROUP'],
    requiredRoles: ['Admin', 'Super Admin', 'Group Admin', 'Branch Admin', 'Biller', 'Billing Staff', 'Front Desk', 'Receptionist', 'Lab'],
  },
  {
    text: 'Clinical',
    icon: <Description />,
    path: '/clinical',
    allowedGroups: ['ADMIN_GROUP', 'CLINICAL_GROUP'],
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

// Bidirectional role aliases to bridge canonical roles with legacy names
export const ROLE_ALIASES = {
  'Admin': ['Super Admin', 'Group Admin', 'Branch Admin'],
  'Super Admin': ['Admin'],
  'Group Admin': ['Admin'],
  'Branch Admin': ['Admin'],
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
  if (groups.includes('ADMIN_GROUP') || userRoleNames.includes('Super Admin') || hasRequiredPermission(user, ['*'])) {
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
      return { ...acc, ...role.permissions };
    }
    return acc;
  }, {});

  if (consolidated['*'] === true) return true;

  return requireAll
    ? requiredPermissions.every((key) => consolidated[key] === true)
    : requiredPermissions.some((key) => consolidated[key] === true);
};
