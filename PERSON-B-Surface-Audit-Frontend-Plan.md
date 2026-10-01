# PERSON B · Routes, Audit, Lock Dates & Frontend

Branch: `rbac-surface` · Stack: Express routes/services + React 19 / Vite / MUI / Redux Toolkit · Read `00-SHARED-CONTRACTS.md` first.

You own every route file, the role and user services, the audit trail, lock dates and masking, and the entire frontend. Person A owns middleware, the database, RLS and the permission tables.

**Run two Claude Code sessions in parallel:** one in `medflow-BE` (backend track, "BE") and one in `Medflow-FE` (frontend track, "FE"). Hours are cumulative estimates.

| Block | Hours | Track | Theme | Priority |
|---|---|---|---|---|
| B0 | 0–0.75 | BE | Baseline, stubs, CI | Must |
| B1 | 0.75–2.75 | BE | Phase 0 fixes | Must |
| F1 | 0.75–2 | FE | Merge bug, register form, role editor check | Must |
| B2 | 2.75–5 | BE | Audit trail | Must |
| F2 | 2–4 | FE | Auth context, `usePermissions`, `<Can>` | Should |
| B3 | 5–7.5 | BE | Lock dates, SSN masking, catalog endpoint | Should |
| F3 | 4–7 | FE | Roles page rewrite | Should |
| B4 | 7.5–8.5 | BE | Sharing API, clinics route | Should |
| F4 | 7–8.5 | FE | Clinics tab, error-code handling | Should |
| B5 | 8–9.5 | BE | Tests, `secured()` migration | Must (tests) |
| F5 | 8.5–10 | FE | Audit viewer, Data Sharing page | Stretch |

---

## B0 · Baseline, stubs, CI (hours 0–0.75, BE)

- [ ] Record the **baseline** `npm test` result on a clean checkout before any change.
- [ ] `src/services/access-version.service.ts`: `bumpAccessVersion(userNum: bigint)`. Interim implementation: `getUserMeta` → `setUserMeta({ ...meta, tokenVersion: (meta.tokenVersion || 0) + 1 })` (same pattern as `user.service.ts` ~L741). Push it so A can see it.
- [ ] `src/services/audit.service.ts`: `writeAudit(...)` stub with the signature from the shared file; for now delegates to the existing `securitylog` insert. Real version in B2.
- [ ] `src/constants/audit-types.ts`: numeric `PermType` constants starting at 1000 (`ROLE_CREATED 1001`, `ROLE_UPDATED 1002`, `ROLE_DELETED 1003`, `ROLE_ASSIGNED 1004`, `ROLE_REMOVED 1005`, `PERMISSION_CHANGED 1006`, `CLINIC_ASSIGNED 1010`, `SHARING_CHANGED 1020`, `USER_ACTIVATED 1030`, `USER_DEACTIVATED 1031`, `LOCKDATE_CHANGED 1040`, `CROSS_BRANCH_READ 1050`).
- [ ] There is **no CI** in either repo. Add `.github/workflows/ci.yml` (or your platform's equivalent) running `npm ci`, `npx tsc --noEmit` and `npm run check:routes` (B1.6) for the backend. Full DB-backed tests can be added later.

---

## B1 · Phase 0 fixes (hours 0.75–2.75, BE)

### B1.1 Self-registration lets anyone pick a role (new P0, highest priority)
`POST /api/auth/register` is public. `auth.service.ts initiateRegistration` (L63–L80) attaches whatever `roleId` the client sends after only checking the role exists. The public `RegisterPage.jsx` populates a role dropdown from `GET /roles`.
- [ ] **Reproduce first** on your local DB: register with the Super Admin role id, complete verification, check the user's roles. Keep the failing test.
- [ ] `initiateRegistration`: ignore `data.roleId`; always attach the `Patient` role (the existing `else` branch). If staff genuinely self-register today, ask the product owner; the fallback is an env allow-list `SELF_REGISTER_ROLES` of non-admin, non-clinical role names.
- [ ] `validators/auth.validator.ts`: drop or ignore `roleId`.
- [ ] Also confirm inactive roles cannot be attached (the error text says "or inactive" but no check exists).

### B1.2 `GET /roles`
- [ ] `routes/role.routes.ts`: uncomment `router.use(authenticate)` and the `authenticate` on the list route (L11, L149); restore the same permission/role guard `GET /roles/:id` uses (L187–190).
- [ ] After F1 removes the dropdown, no unauthenticated page needs roles, so **no public roles endpoint is created**.

### B1.3 Scope sweep and PHI gate
`/patients` is mounted five times in `routes/index.ts`. `patient-insurance.routes.ts` is the **first** one and already runs `authenticate, resolveBranchAccess, enterTenantContext` via `router.use`, and the AsyncLocalStorage context continues through later routers. So `patient-membership` and `patient-report` are probably already scoped through mount order. Add explicit middleware anyway (the CI guard needs it, and mount order is fragile), but use **per-route** middleware on the shared `/patients` prefix, not another `router.use`.

| Action | Files |
|---|---|
| Add `authenticate, resolveBranchAccess, enterTenantContext` (no PHI gate) | `admin-finance`, `ai-conversation`, `notification`, `productivity`, `timeclock` |
| Add the same **plus `requirePhiAccess`** before `enterTenantContext` | `clinical-exam`, `clinical-management`, `document`, `lab-case`, `patient-image`, `patient-membership`, `patient-referral`, `patient-report`, `progress-note`, `treatment-plan` |
| Add `requirePhiAccess` only (already scoped) | `patient-insurance` (first `/patients` router, so it covers everything under `/patients`), `patient`, `allergy`, `clinical-note`, `vital-sign`, `rx`, `adjunctive-therapy` |
| Check and decide (may be PHI or per-clinic config) | `ocr` (insurance-card scans), `payment-terminal`, `audience` |
| Reference data, go on the allow-list with a reason | `appointment-type`, `coverage-group`, `coverage-template`, `form-template`, `insurance-company`, `insurance-plan`, `language`, `medication`, `membership-plan`, `note-template`, `procedure-code`, `shortlist` |
| Special, allow-list | `auth`, `role`, `permission`, `practice-group`, `public`, `seed` (empty router, not mounted) |

`requirePhiAccess` comes from A (`middleware/phi.middleware.ts`, ready ~hr 2.5). Until then, wire the scope middleware and add the PHI gate when it lands.

**For every newly scoped route, test with a user assigned to Branch A reading a Branch B record.** Once the app connects as `medflow_app`, rows tagged with another branch's `ClinicNum` disappear silently (for example `proctp` in treatment plans), and a 200 with an empty list looks like success.

### B1.4 Role-grant guard
- [ ] New file `src/services/role-grant.guard.ts` → `assertCanGrant(actor, targetRole)`:
  - If the target role contains `*`, or any `platform:*` key, or is `Super Admin` → only a `Super Admin` actor may grant it. (Branch Admin and Group Admin hold `*` today, which is why a plain "actor holds every permission" check would pass.)
  - Otherwise the actor must hold every permission in the target role.
  - Target user must be in the actor's clinic scope (existing `assertUserInScope`).
- [ ] Call it from `user.service.ts`: `assignRole`, `assignUserRoles` (the ~L741 path), and `createUser` when `roleIds` is present.
- [ ] `role.routes.ts`: `POST`, `PUT`, `DELETE` on roles → `Super Admin` only. Global roles are shared by every practice group, so a Group Admin editing one changes every group. System roles (`isSystemRole`) cannot be edited or deleted by anyone else.
- [ ] Ask the product owner if Group Admins need to manage custom roles; if yes, that needs roles scoped per group and is next sprint.

### B1.5 Stale sessions and fail-open lines in your files
- [ ] Call `bumpAccessVersion(userNum)` in `assignRole`, `removeRole`, and after any role permission update (for the latter, bump **every** user attached to that role via `usergroupattach`), and on activate/deactivate and clinic changes.
- [ ] `user.service.ts` L106, L113, L757: make an empty `clinicIds` mean deny, not unrestricted.

### B1.6 Route-scope CI guard
- [ ] `scripts/check-route-scope.mjs` + `scripts/route-scope-allowlist.json` (`{ "file.routes.ts": "reason" }`). For each file in `src/routes` except `index.ts`, fail unless it contains `authenticate`, `resolveBranchAccess` and `enterTenantContext`, or is on the allow-list with a non-empty reason. Also fail if a file on the PHI list (shared section 2a) lacks `requirePhiAccess`.
- [ ] `package.json`: `"check:routes": "node scripts/check-route-scope.mjs"`.
- [ ] It is a text check, not a real router walk. Note that limitation in the script header. A proper Express router-stack walker is next sprint.

**Acceptance for B1:**
- Registration with Super Admin's `roleId` yields a Patient-only user.
- `GET /api/roles` without a token → 401.
- Branch Admin cannot assign Super Admin or `*` roles; cannot `PUT /roles/:id`.
- Assigning a role forces that user to log in again.
- `npm run check:routes` passes.
- Group-Admin-only user → 403 `PHI_ACCESS_NOT_GRANTED` on `/api/patients/:id`, `/api/documents`, `/api/treatment-plans`.

<details><summary>Claude Code prompt B1 (backend)</summary>

> Read 00-SHARED-CONTRACTS.md, CLAUDE.md and PERSON-B plan section B1. Start with B1.1: write a failing vitest that registers via POST /api/auth/register with the Super Admin roleId and asserts the user ends up with only the Patient role, then fix initiateRegistration. Then B1.2 to B1.6 in order, one commit per task. For the route sweep, use per-route middleware on files mounted under /patients; do not add router.use there. For every route file you touch, add a test with a Branch A user reading a Branch B record. Tell me the exact tests that changed versus the baseline. Do not edit files outside my ownership list.
</details>

---

## F1 · Quick frontend fixes (hours 0.75–2, FE)

- [ ] **Merge bug** in `src/config/navMenuItems.jsx` `hasRequiredPermission`: replace `{ ...acc, ...role.permissions }` with a union of only the `true` values:
  ```js
  const granted = new Set();
  for (const role of user.roles) {
    if (role && typeof role === 'object' && role.permissions) {
      for (const [k, v] of Object.entries(role.permissions)) if (v === true) granted.add(k);
    }
  }
  if (granted.has('*')) return true;
  ```
  Add a jest test: role 1 grants `patients.read`, role 2 has `patients.read: false` → still allowed.
- [ ] **Register page:** remove the role dropdown in `src/pages/auth/RegisterPage.jsx` (the `fetchRoles` effect and the `roleId` `FormControl`, ~L70–80 and L246–280), the `roleId` rule in `registerValidations`, and stop sending `roleId`. This must ship together with B1.1.
- [ ] **Role editor shape check:** run the app, open a role, toggle one box in `RolePermissionsGrid.jsx`, and read the request body in the browser network tab. The backend stores flat keys like `"patients.read": true`; the grid reads and writes `{ resource: { create, read, ... } }`. Write down what you actually see (the plan marked this *(verify)*). F3 replaces the grid, so do not fix the old one.
- [ ] `ProtectedRoute.jsx` returns `children` immediately for any `ADMIN_GROUP` member. This is UX only (the backend decides), but it shows Group Admin pages they will get 403 on. Narrow that bypass to `Super Admin` or a `*` permission.

**Acceptance:** jest test passes; register page has no role field; you have a note on the grid payload.

---

## B2 · Audit trail (hours 2.75–5, BE)

Current state: `logActivity` (106 call sites) and `logSecurityEvent` write only `UserNum`, `LogDateTime` and a JSON blob into `securitylog.LogText`. The native columns `PermType`, `PatNum`, `CompName`, `FKey`, `LogSource` and the `securityloghash` table are unused. `role.service`, `role.controller` and `practice-group.service` write no audit at all. `notification.service` also uses `securitylog` as an inbox.

- [ ] **Real `writeAudit`.** One atomic raw SQL statement (CTE): take `pg_advisory_xact_lock(<constant>)`, read the newest `securityloghash.LogHash`, insert the `securitylog` row (fill `PermType`, `UserNum`, `PatNum`, `CompName` from IP/host, `LogSource`, `LogText` as JSON), compute `sha256(prevHash || canonical(row fields))` and insert into `securityloghash`. The lock stops two concurrent writes from forking the chain. Check how the extended Prisma client wraps raw queries before choosing `$queryRaw` versus the base client.
- [ ] **Route the old writers through it:** `writeSecurityLog` in `utils/activity-logger.util.ts` should call `writeAudit`, so all 106 existing call sites gain hashes without editing them.
- [ ] **Add audit calls** for: role create/update/delete, role assign/remove, permission edits (store old and new key lists), clinic assignment (A's `setUserClinics` calls you), user activate/deactivate, sharing policy changes (B4), lock date changes (B3). Files: `role.service.ts`, `role.controller.ts`, `user.service.ts`, `sharing.service.ts`, `practice-group.service.ts` (A owns that file; ask A to call `writeAudit` for group/clinic changes).
- [ ] **Verify endpoint:** `GET /api/security/audit/verify` recomputes the chain from the first hashed row and returns the first `SecurityLogNum` that does not match. Rows before the first hashed row are legacy and skipped. Test: tamper with one row in the DB and confirm it is flagged.
- [ ] **Query endpoint:** `GET /api/security/audit` with `from`, `to`, `user`, `patNum`, `permType`, `source`, `page`; needs `security.audit.view`. Non-platform admins only see rows whose `UserNum` belongs to users in their own group. Exclude notification-inbox rows (check how `notification.service` tags its rows first).
- [ ] Not today: moving the notification inbox out of `securitylog`, and logging PHI reads (`access_audit`).

**Acceptance:** creating a role, changing its permissions and assigning it each produce a `securitylog` row with `PermType` >= 1000 and a matching `securityloghash` row; the verify endpoint reports clean, then reports the tampered row.

<details><summary>Claude Code prompt B2</summary>

> Implement B2. First read utils/activity-logger.util.ts, notification.service.ts and the securitylog/securityloghash models in prisma/schema.prisma. Write writeAudit as a single atomic SQL statement with an advisory lock and a SHA-256 hash chain, route logActivity and logSecurityEvent through it, add audit calls to role and user services, and add the verify and query endpoints. Include a test that tampers with a row and expects verify to flag it. Do not change the notification inbox behaviour.
</details>

---

## F2 · Auth context and permission helpers (hours 2–4, FE)

- [ ] `AuthContext.jsx` / `authSlice.js`: keep current behaviour, and when `GET /auth/profile` returns the new fields (`permissions[]`, `clinics`, `groupId`, `sharing`, `accessVersion`) store them; until then derive `permissions` with the fixed union from F1. Build against a mocked profile first.
- [ ] `src/hooks/usePermissions.js`: returns `{ has(key), hasAny(keys), hasAll(keys), isPlatformAdmin, clinics, sharing }`.
- [ ] `src/components/shared/Can.jsx`: `<Can permission="patient.ssn.view" fallback={null}>...</Can>`.
- [ ] Use `<Can>` in **new** UI only. Do not rip out the existing role-based checks today (7 files use `hasRequiredRole`, 5 use `hasRequiredPermission`, 32 `ProtectedRoute` uses); migrating those is next sprint.
- [ ] `config/api.js` response interceptor: on 403 with `code: 'NO_BRANCH_ASSIGNED'` show a clear "No branch is assigned to your account, contact your administrator" screen; on `PHI_ACCESS_NOT_GRANTED` show a permission message instead of a generic error.

---

## B3 · Lock dates, SSN masking, catalog endpoint (hours 5–7.5, BE)

Needs A's tables (`security_lock`, `role_permission.lock_days/lock_date`), ready ~hr 5.

- [ ] `GET /api/permissions/catalog` in `permission.routes.ts`: returns `PERMISSION_CATALOG` grouped by module. Public shape in the shared file. This unblocks F3.
- [ ] `src/services/lock-date.service.ts`: `assertNotLocked(permissionKey, itemDate, access)`. Effective lock is the **stricter** of the group's `security_lock` and the role's per-permission lock (use the most permissive role the user holds for that permission); `includes_admins=false` exempts platform admins. Throws a 409/403 with `code: 'LOCKED_PERIOD'`.
- [ ] Apply to: payment create/update/delete (`payment.service`), adjustment create/update/delete (`adjustment.service`), claim edit after sent (`claim.service`). Completed procedures are next sprint if not reached.
- [ ] **SSN masking:** find every place patient SSN is returned (start at the patient mapper in `patient.service.ts` and patient search). Return only the last four digits unless the caller has `patient.ssn.view` (or is platform admin); remove SSN from search results entirely. **DOB masking is deferred:** clinical screens need age, so it needs a design decision first.
- [ ] Not today: per-report permissions (`reports.access`, all-providers variants).

**Acceptance:** a payment dated before the lock date is rejected with `LOCKED_PERIOD`; a user without `patient.ssn.view` gets a masked SSN on `GET /api/patients/:id` and none in search results.

---

## F3 · Roles page rewrite (hours 4–7, FE)

- [ ] Rewrite `RolesManagement.jsx` and `RolePermissionsGrid.jsx` (and check `AddRoleModal.jsx`, `EditRoleModal.jsx`, `hooks/mutations/useRoleMutations.js`) to be driven by `GET /api/permissions/catalog` (mock the response until B3 ships it).
- [ ] Permissions grouped by module in accordions, one checkbox per key, a search box, a badge on `isSensitive` keys.
- [ ] **Save sends a flat map** `{ "patients.read": true, ... }`, never nested objects.
- [ ] Roles containing `*` and system roles are read-only unless the viewer is a Super Admin, with a visible warning.
- [ ] Optional: lock-days field on `lockDateAware` keys (skip if behind).
- [ ] Test: toggle one key, inspect the request body, reload, confirm it persisted.

---

## B4 · Sharing API and clinic routes (hours 7.5–8.5, BE)

- [ ] `services/sharing.service.ts` + `routes/sharing.routes.ts` (mount at `/sharing`): `GET /policy`, `PUT /policy` gated by `sharing.manage`. Validate `category` against the six categories and `mode` against **`OWN_BRANCH | GROUP_READ` only** (reject `GROUP_READ_WRITE`, by decision). Writes go to A's `group_sharing_policy`. After each write: `writeAudit` (`SHARING_CHANGED`) and `bumpAccessVersion` for every user in that group.
- [ ] `PATCH /api/patients/:id/restriction` `{ crossBranchRestricted: boolean }` (sets A's `patient.cross_branch_restricted`), requires `sharing.manage`, audited.
- [ ] `PUT /api/users/:id/clinics` `{ defaultId, restrictedIds, accessAll }` calling A's `setUserClinics`. `accessAll` only for platform admin or `security.admin`. Also make `GET /api/users` return each user's clinic count so the UI can flag users with none.
- [ ] Default policies: `FINANCIAL` and `IMAGING` = `GROUP_READ`, all else `OWN_BRANCH`.

---

## F4 · Clinics tab and warnings (hours 7–8.5, FE)

- [ ] In `EditUserModal.jsx` and `AddUserDrawer.jsx`, add a **Clinics** tab: default clinic (select), restricted clinics (multi-select), "Access all clinics" switch (rendered only for platform admin / `security.admin`).
- [ ] In `UserManagementView.jsx`, flag users with no clinic assigned ("No branch, will be blocked"). This is the lockout warning for fail-closed.
- [ ] Wire `services/user.service.js` to `PUT /users/:id/clinics`.
- [ ] Optional, if time: send `X-Branch-Id` from the `api.js` request interceptor using the current branch in `branchSlice`. The backend does not validate it until A adds that; harmless to send, and it is already allowed by CORS.

---

## B5 · Tests and route migration (hours 8–9.5, BE)

- [ ] Extend `tests/helpers/tenant.ts` (`createTenant()` already builds a group, a branch and a Group Admin) with `createBranchUser(role, clinicIds)` for these shapes: single branch, two branches, no branch, access-all, Group-Admin-only.
- [ ] Tests: registration escalation; unauthenticated roles → 401; no-branch → 403; cross-branch read on `document`, `treatment-plan`, `lab-case`, `progress-note`; grant guard (Branch Admin cannot grant Super Admin, cannot edit roles); role change forces re-login; Group Admin blocked from PHI; audit row plus hash chain plus tamper detection; lock date; SSN masking.
- [ ] Update `rbac-matrix.test.ts` and `roles-permissions.test.ts` for the new behaviour rather than deleting cases.
- [ ] **Route migration to `secured()`:** only if A's `secured()` is merged and the suite is green. Convert the 15 swept files one at a time, one commit each. If not, defer; the scope sweep already gives the protection.

---

## F5 · Stretch: audit viewer and Data Sharing page (hours 8.5–10, FE)

- [ ] `pages/admin/AuditTrailPage.jsx` against `GET /security/audit` (filters: date, user, patient, permission type, source; a "verify integrity" button calling the verify endpoint). Route gated by `security.audit.view`.
- [ ] `pages/admin/DataSharingSettings.jsx`: category rows with an `OWN_BRANCH` / `GROUP_READ` toggle, gated by `sharing.manage`; a "restrict to home branch" switch in the patient form. Add both to the admin menu.
- [ ] Skipped by decision: origin badges beyond a simple branch label, break-glass modal.

---

## Handoffs

| From A | When | You can start |
|---|---|---|
| `access.types.ts` | Hr 0 | Code against `AccessContext` |
| Fail-closed merged | Hr ~2 | Trust B1.3 smoke tests |
| `requirePhiAccess` | Hr ~2.5 | Apply the PHI gate |
| Tables + catalog | Hr ~5 | B3, F3 with real data |
| `secured()` | Hr ~7 | Route migration in B5 |
| `setUserClinics` | Hr ~7.5 | B4 clinics route |

## Not done today (next sprint)

Migrating existing `hasRequiredRole` uses to permissions · DOB masking · per-report permissions · PHI-read logging (`access_audit`) · moving the notification inbox out of `securitylog` · Group-scoped custom roles · origin badges, `scope=this_branch|all_branches` toggle, break-glass modal · tokens out of `localStorage` · a real Express router-stack CI guard · removing the legacy schema-per-branch code.

## Your definition of done

- [ ] Registration cannot pick a role; register page has no role field
- [ ] `GET /roles` requires auth; Branch Admin cannot escalate
- [ ] All PHI/financial routes scoped, PHI gate applied, `check:routes` passes in CI
- [ ] Role and clinic changes are audited with a verifiable hash chain
- [ ] Frontend merge bug fixed; roles page saves flat keys from the catalog
- [ ] Clinics tab and no-branch warning shipped
- [ ] Tests above written and passing
