/**
 * Team Module Access — group_admin / branch_admin turn modules on, off or to
 * read-only for individual people on their team (pages/admin/TeamAccessPage.jsx).
 *
 * The module list, each member's role default and how far the signed-in admin
 * may go all come from the backend (GET /users/:id/module-access, built from
 * Medflow-BE src/constants/team-modules.ts). This file only holds what the UI
 * needs on its own: which pages belong to a module, so a module set to 'none'
 * drops out of the menus and its pages answer "Access denied".
 */

export const ACCESS_LEVELS = {
  NONE: 'none',
  VIEW: 'view',
  FULL: 'full',
};

export const ACCESS_LEVEL_LABELS = {
  none: 'None',
  view: 'View',
  full: 'Full',
};

const LEVEL_RANK = { none: 0, view: 1, full: 2 };

export const isLevelWithin = (level, ceiling) => LEVEL_RANK[level] <= LEVEL_RANK[ceiling];

/**
 * Frontend page prefixes per module key (keys match the backend catalog).
 * `exclude` keeps pages that live under a prefix but belong elsewhere — Lab
 * Cases sits under /clinical but isn't part of the Clinical row.
 */
const MODULE_PAGES = {
  reports: { label: 'Reports and KPI dashboard', prefixes: ['/admin/reports', '/kpi', '/admin/advanced-reporting'] },
  note_templates: { label: 'Note templates', prefixes: ['/note-templates'] },
  patients: { label: 'Patients', prefixes: ['/patients', '/patient-reports'] },
  appointments: { label: 'Appointments and schedule', prefixes: ['/appointments', '/recurring-appointments', '/waitlist'] },
  clinical: { label: 'Clinical', prefixes: ['/clinical', '/clinical-notes', '/vital-signs'], exclude: ['/clinical/lab-case'] },
  finance: { label: 'Finance', prefixes: ['/finance', '/invoices', '/payments', '/claims', '/era', '/batch-actions'] },
  insurance: { label: 'Insurance', prefixes: ['/insurance', '/insurance-companies', '/authorizations'] },
  documents: { label: 'Documents and allergies', prefixes: ['/documents', '/allergies'] },
};

const underPrefix = (path, prefix) => path === prefix || path.startsWith(`${prefix}/`);

/** The module a page path belongs to, if any. */
export const moduleForPath = (path) => {
  if (!path) return null;
  for (const [key, page] of Object.entries(MODULE_PAGES)) {
    if ((page.exclude || []).some((p) => underPrefix(path, p))) continue;
    if (page.prefixes.some((p) => underPrefix(path, p))) return { key, label: page.label };
  }
  return null;
};

/**
 * The module behind `path` if the user's admin has turned it off for them —
 * nothing readable left after their module level and feature switches — else
 * null. `moduleStates` comes from /auth/profile (backend works it out).
 */
export const moduleTurnedOff = (user, path) => {
  const module = moduleForPath(path);
  if (!module) return null;
  return user?.moduleStates?.[module.key] === 'off' ? module : null;
};

/**
 * The module behind `path` if the user's admin granted it to them (any
 * override leaving something usable), else null. Lets menus and route guards
 * open a module the role alone wouldn't — e.g. Clinical for a Front Desk
 * member. The backend honours the same grant on its role-gated routes.
 */
export const moduleGranted = (user, path) => {
  const module = moduleForPath(path);
  if (!module) return null;
  return user?.moduleStates?.[module.key] === 'granted' ? module : null;
};

/** What a feature amounts to from the module level alone (or the role, without one). */
export const featureBase = (feature, moduleOverride) => {
  if (!moduleOverride) return feature.roleDefault;
  return moduleOverride === ACCESS_LEVELS.FULL || (moduleOverride === ACCESS_LEVELS.VIEW && feature.kind === 'read');
};

/**
 * Admin roles a team-access editor may never change (mirrors PROTECTED_ROLES
 * in Medflow-BE src/services/team-access.service.ts, which is the authority).
 */
const PATIENT_ROLES = ['Patient', 'patient'];
const PROTECTED_ROLES_FOR_GROUP_ADMIN = ['Super Admin', 'Admin', 'Group Admin', 'group_admin', ...PATIENT_ROLES];
const PROTECTED_ROLES_FOR_BRANCH_ADMIN = [...PROTECTED_ROLES_FOR_GROUP_ADMIN, 'Branch Admin', 'branch_admin'];

const roleNamesOf = (user) =>
  (user?.roles || []).map((r) => (typeof r === 'string' ? r : r?.name || '')).filter(Boolean);

export const isPatientAccount = (user) => roleNamesOf(user).some((name) => PATIENT_ROLES.includes(name));

export const canEditMember = ({ actorIsBranchAdminOnly, actorId, member }) => {
  const memberId = String(member?._id || member?.id || '');
  if (!memberId || memberId === String(actorId)) return false;
  const protectedRoles = actorIsBranchAdminOnly ? PROTECTED_ROLES_FOR_BRANCH_ADMIN : PROTECTED_ROLES_FOR_GROUP_ADMIN;
  return !roleNamesOf(member).some((name) => protectedRoles.includes(name));
};

export const memberRoleLabel = (member) => {
  const names = roleNamesOf(member);
  if (names.length === 0) return 'No role';
  return names
    .map((name) => name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(', ');
};
