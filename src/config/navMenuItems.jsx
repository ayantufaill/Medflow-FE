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

// Shared with Sidebar.jsx and UserProfile.jsx so the "sections this user can reach"
// list can't drift between the two surfaces. Only the currently-active (non-commented)
// items from Sidebar's original menuItems are included here.
export const navMenuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin/reports', requiredRoles: ['Admin'] },
  { text: 'Patients', icon: <People />, path: '/patients', requiredRoles: ['Admin', 'Receptionist', 'Doctor'] },
  { text: 'Appointments', icon: <CalendarToday />, path: '/appointments/operatory-schedule', requiredRoles: ['Admin', 'Receptionist', 'Provider', 'Doctor'] },
  { text: 'Vital Signs', icon: <MonitorHeart />, path: '/vital-signs', requiredRoles: ['Admin', 'Doctor', 'Receptionist'] },
  { text: 'Patient Reports', icon: <Description />, path: '/patient-reports', requiredRoles: ['Admin', 'Doctor', 'Receptionist'] },
  { text: 'Insurance', icon: <AccountBalance />, path: '/insurance', requiredRoles: ['Admin', 'Billing', 'Receptionist'] },
  { text: 'Finance', icon: <AttachMoney />, path: '/finance', requiredRoles: ['Admin', 'Billing', 'Receptionist'] },
  { text: 'Clinical', icon: <Description />, path: '/clinical', requiredRoles: ['Admin', 'Doctor'] },
  // 'Admin' covers today's single-tenant Admin; 'Super Admin' covers the cross-group
  // platform tier — route itself also admits anyone holding platform:manage_practice_groups
  // (adminRoutes.jsx's adminOrPermission), but this list only supports role checks, so
  // both concrete role names are listed rather than the permission key.
  { text: 'Practice Groups', icon: <Business />, path: '/admin/practice-groups', requiredRoles: ['Admin', 'Super Admin'] },
  { text: 'My Group', icon: <Business />, path: '/admin/my-group', requiredRoles: ['Group Admin'] },
];

// Roles allowed to switch the active branch context (UserProfile.jsx) — this only
// gates whether the switcher UI shows up at all. WHICH branches show up inside it is
// decided server-side by GET /branches (branchAccess middleware), not by this list.
// Includes the three tenant-admin tiers since branch context is core to all of them.
export const BRANCH_SWITCH_ROLES = ['Admin', 'Doctor', 'Provider', 'Receptionist', 'Billing', 'Super Admin', 'Group Admin', 'Branch Admin'];

// Returns true if `user` holds at least one role in `requiredRoles` (or if the item
// has no role restriction at all).
export const hasRequiredRole = (user, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!user || !user.roles || user.roles.length === 0) return false;

  const userRoleNames = user.roles
    .map((role) => (typeof role === 'string' ? role : role?.name || ''))
    .filter(Boolean);

  return requiredRoles.some((role) => userRoleNames.includes(role));
};

// Consolidates permissions off every role object the user holds (roles carry a
// `permissions: { [key]: true }` map — e.g. Group Admin's `group:view_analytics`)
// and checks the given key(s). Mirrors the logic ProtectedRoute.jsx uses for routes,
// but exported so non-route UI (popover cards, buttons) can ask the same question.
//
// Handles the '*' wildcard: the real Admin role's permissions object is `{"*": true}`
// (confirmed live via GET /auth/profile), not an explicit list of every key — without
// this, Admin would fail every specific permission check (e.g. 'platform:manage_practice_groups')
// despite genuinely having full access, since '*' would never string-match a real key.
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
