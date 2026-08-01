import {
  Dashboard,
  People,
  CalendarToday,
  Description,
  AccountBalance,
  MonitorHeart,
  AttachMoney,
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
];

// Roles allowed to switch the active branch context (UserProfile.jsx) — this only
// gates whether the switcher UI shows up at all. WHICH branches show up inside it is
// decided server-side by GET /branches (branchAccess middleware), not by this list.
export const BRANCH_SWITCH_ROLES = ['Admin', 'Doctor', 'Provider', 'Receptionist', 'Billing'];

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
