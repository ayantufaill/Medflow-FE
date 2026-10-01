# 00 · Shared Contracts (read first, both people)

One-day sprint. Two people, each running Claude Code. This file is the only thing you both must agree on. Put it in the repo root and point both Claude Code sessions at it.

- **Person A** → `PERSON-A-Access-Core-Plan.md` (branch `rbac-core`)
- **Person B** → `PERSON-B-Surface-Audit-Frontend-Plan.md` (branch `rbac-surface`)

Everything below was checked against the code (static read; nothing was run). Anything you must confirm at runtime is marked **(verify)**.

---

## 1. Decisions (final, do not re-open today)

| Question | Answer | Rule for the code |
|---|---|---|
| Share financial data between branches? | Yes | `FINANCIAL` category = `GROUP_READ` (read only) |
| Can a branch edit another branch's records? | No | Writes are **always** own-branch. **Do not build a `GROUP_READ_WRITE` mode.** |
| Can Group Admin see raw PHI by default? | No | Group Admin gets no clinical or imaging permissions unless `clinical.cross_branch.view` is granted |
| Are x-rays shared by default? | Yes | `IMAGING` category = `GROUP_READ` |

"Shared" means shared among staff of branches in the same practice group, not with the Group Admin role. Clinical, insurance and appointments stay `OWN_BRANCH` by default (not decided; safest default).

---

## 2. Facts from the code that shape the work

1. **`GET /roles` is unauthenticated, and the reason is worse than the plan said.** The public `RegisterPage.jsx` calls it to fill a role dropdown, and `POST /api/auth/register` (public, rate-limited only) accepts any `roleId` and `auth.service.ts initiateRegistration` attaches that role after only checking it exists. **Anyone with an email address can register as Super Admin** (after clicking the email link). This is a bigger hole than the open role list. Fix: the server ignores `roleId` and always assigns the `Patient` role; the dropdown is removed; `GET /roles` then requires auth and no public roles endpoint is needed. **(verify by calling it on staging before fixing)**
1b. **`/uploads` is served by `express.static` with no authentication and `Access-Control-Allow-Origin: *`** (`app.ts` L25–34). Patient images are saved at `uploads/patients/<PatNum>/<profile|xray|teeth-crop>.<ext>` (`multer.config.ts`), so the URL is predictable and `PatNum` is sequential. Anyone can fetch any patient's X-ray or photo with no login and no branch check. Files in `uploads/s3-local/` use random UUID names (lower risk, still unauthenticated). **(verify with curl)** Fix today: HMAC-signed, expiring URLs for `/uploads/patients/*` (A, task A2b). Documents in `s3-local` and the S3 path are next sprint.
2. **Group Admin, Branch Admin, Admin and Super Admin are all seeded with `{'*': true}`** (`seedRoles.ts`), **and `requireRoles` / `requireGroups` return `next()` for any ADMIN_GROUP member before checking anything** (`auth.middleware.ts`, 225 uses). So stripping Group Admin's permissions alone will NOT stop it reaching chart routes. "Group Admin has no PHI" needs a dedicated `requirePhiAccess` middleware (A writes it, B applies it to the PHI route files in section 2a). It is an app-layer block only; RLS still expands a Group Admin's clinic list to the whole group. RLS-level PHI hiding is deferred.
3. **17 permission keys used in routes exist in neither `constants/permissions.ts` nor `seedRoles.ts`:** `adjustments.{create,delete,read,update}`, `audiences.{read,write}`, `authorizations.write`, `billing.write`, `claims.write`, `deposits.{create,read}`, `payment-plans.{create,read,update}`, `reports.write`, `settings.{read,update}`. Only `*` holders can pass those routes today. **If `*` is removed from any role before these 17 are added to the catalog and the role lists, admins lose access to adjustments, deposits, payment plans, settings.**
4. `enterTenantContext` gives `'*'` when `clinicIds.length === 0`. The RLS SQL itself already denies an empty setting (`= ''` → false), so the hole is in the middleware, not the policy.
5. RLS is enabled on 6 tables in `02-policies.sql` and ~60 more in `03-policies-remaining.sql`. Nothing applies these files at deploy.
6. 34 route files lack `resolveBranchAccess`. 15 are real PHI/financial gaps, 15 are reference data, 4 are special (`auth`, `role`, `permission`, `practice-group`).
7. Existing test helper `tests/helpers/tenant.ts` has `createTenant()` which builds a group, a branch and a Group Admin. Reuse it for fixtures.
8. `docker-compose.yml` has a `db` service (postgres:16). `--accept-data-loss` is in the Dockerfile, `render.yaml` and the compose `seed` service.

### 2a. PHI route files (get `requirePhiAccess`)

`patient`, `patient-image`, `patient-report`, `patient-referral`, `patient-membership`, `patient-insurance`, `allergy`, `clinical-note`, `clinical-exam`, `clinical-management`, `vital-sign`, `rx`, `treatment-plan`, `progress-note`, `lab-case`, `document`, `adjunctive-therapy`.

Rule: block a user whose only admin-type role is `Group Admin` (no Super Admin, Admin, Branch Admin, clinical or operations role) unless they hold `clinical.cross_branch.view`. Branch Admin and legacy Admin are not blocked (they are branch-level).

Imaging note: images live in `patientImage` (keyed by `PatNum`, no `ClinicNum`) and `document` (`PatNum` only). Both need the patient-inheritance policy for sharing, not a `ClinicNum` policy.

---

## 3. File ownership (do not edit the other person's files)

| Owner | Files |
|---|---|
| **A** | `src/config/*`, `middleware/{tenantContext,branchAccess,permission,auth}.middleware.ts`, `middleware/secured.ts` (new), `services/permission.service.ts`, `utils/opendental-auth.util.ts`, `constants/permissions.ts`, `constants/permission-catalog.ts` (new), `types/access.types.ts` (new), `scripts/seedRoles.ts`, `services/practice-group.service.ts`, `sockets/socket.ts`, `prisma/schema.prisma`, `prisma/rls/*`, `Dockerfile`, `render.yaml`, `docker-compose.yml`, `tests/rls/*` |
| **B** | `src/routes/*`, `controllers/{role,user,auth}.controller.ts`, `services/{role,user}.service.ts`, `services/audit.service.ts` (new), `utils/activity-logger.util.ts`, `services/access-version.service.ts` (new), `scripts/check-route-scope.mjs` (new), `tests/*` except `tests/rls/*`, **all of `Medflow-FE/`** |

Schema changes B needs go to A as a message. A adds them to `schema.prisma`.

**Exceptions (single-site edits, so nobody is blocked):**
- A may edit only the listed fail-open lines in `patient.service.ts` (L122, L124), `patient.controller.ts` (L252, L297), `appointment.controller.ts` (L244), `branch.service.ts` (L103, L133, L142), `room.service.ts` (L30).
- B edits the fail-open lines in `user.service.ts` (L106, L113, L757) and the `initiateRegistration` role handling in `auth.service.ts`.
- A edits `app.ts` (the `/uploads` handler only) and the `toUrl()` function in `patient-image.service.ts`.
- A adds `middleware/phi.middleware.ts` (`requirePhiAccess`); B only imports it.

---

## 4. Interfaces (A writes the types at hour 0, B codes against them)

### 4.1 `src/types/access.types.ts`

```ts
export type ShareCategory = 'IDENTITY'|'CLINICAL'|'IMAGING'|'APPOINTMENTS'|'FINANCIAL'|'INSURANCE';
export type ShareMode = 'OWN_BRANCH'|'GROUP_READ';   // no GROUP_READ_WRITE, by decision

export interface AccessContext {
  userId: bigint;
  roles: string[];
  permissions: ReadonlySet<string>;   // already unioned; '*' only for platform admin
  isPlatformAdmin: boolean;
  accessAllClinics: boolean;          // explicit flag; empty list never means "all"
  clinicIds: bigint[];                // own writable scope
  groupClinicIds: bigint[];
  groupId: number | null;
  isGroupAdmin: boolean;
  sharing: Record<ShareCategory, ShareMode>;
  accessVersion: number;
}
// Express: req.access?: AccessContext
```

### 4.2 Shared functions

| Function | File | Owner | Signature |
|---|---|---|---|
| Permission catalog | `constants/permission-catalog.ts` | A | `export const PERMISSION_CATALOG: { key: string; module: string; description: string; isSensitive: boolean; lockDateAware: boolean }[]` |
| Version bump | `services/access-version.service.ts` | B writes first (hr 1, wraps `tokenVersion`), A repoints (hr ~5) | `bumpAccessVersion(userNum: bigint): Promise<void>` |
| Audit writer | `services/audit.service.ts` | B (stub by hr 1) | `writeAudit(p: { userNum: bigint; permType: number; patNum?: bigint; clinicNum?: bigint; text: string; source?: number; req?: Request }): Promise<void>` |
| PHI gate | `middleware/phi.middleware.ts` | A (ready ~hr 2) | `requirePhiAccess: RequestHandler` (uses `req.access`, falls back to `PermissionService` until `req.access` exists) |
| Route wrapper | `middleware/secured.ts` | A (ready ~hr 5.5) | `secured({ permission?: string; anyOf?: string[]; scope: 'branch'\|'reference'\|'none' }): RequestHandler[]` |
| Grant check | `services/role-grant.guard.ts` | B | `assertCanGrant(actor: AccessContext-like, roleId: bigint): Promise<void>` throws `AuthorizationError` |

`permType` numbers for MedFlow events start at **1000** to avoid colliding with Open Dental's own enum.

### 4.3 HTTP contracts (B builds the UI against mocks until these land)

```
GET  /api/auth/profile          adds: permissions: string[], clinics: { defaultId, restrictedIds, accessAll },
                                      groupId, sharing: Record<ShareCategory, ShareMode>, accessVersion
GET  /api/permissions/catalog   -> { modules: [{ module, permissions: [{ key, description, isSensitive, lockDateAware }] }] }
GET  /api/security/audit        ?from&to&user&patNum&permType&source&page  (needs security.audit.view)
GET  /api/sharing/policy        -> current per-category modes for caller's group (needs sharing.manage)
PUT  /api/sharing/policy        body: { category, mode, clinicId? }
POST /api/patients/:id/break-glass   body: { reason }  -> { expiresAt }     (STRETCH)
403 body for restricted patient: { success:false, code:'restricted_patient', patNum }
Request header: X-Branch-Id (validated against caller's clinics; optional)   (STRETCH)
```

---

## 5. Ordering rules (these prevent the expensive mistakes)

1. **Fail-closed lands before B tests the sweep** (A, hour 1.5). Otherwise B's smoke tests pass for the wrong reason.
2. **No `*` is removed from any role until** the 17 missing keys are in the catalog and every role has an explicit list, **and** dual-read is in place (A).
3. **RLS tests connect as `medflow_app`**, never as the table owner. A test that connects as owner proves nothing.
4. **Staff with no clinic get one assigned before fail-closed is turned on** in any shared environment (query in A's plan).
5. **Remove `--accept-data-loss`** from start commands before new tables are added (A, hour 0).

---

## 6. Local environment (both, first 30 minutes)

```bash
# scratch Postgres 16 from the repo's compose file
docker compose up -d db
# schema + seed (owner connection)
npx prisma db push --schema prisma/schema.prisma && npm run seed:all
# restricted app role + RLS (A automates this in task A0.2; do it by hand once now)
psql "$DIRECT_DATABASE_URL" -f prisma/rls/01-app-role.sql -f prisma/rls/02-policies.sql \
     -f prisma/rls/03-policies-remaining.sql -f prisma/rls/04-patient-group-visibility.sql
# app connects as medflow_app; migrations/seed keep using the owner via DIRECT_DATABASE_URL
export DATABASE_URL=postgresql://medflow_app:<pw>@localhost:5432/medflow
npm test        # baseline: record how many tests already fail before you change anything
```

Record the **baseline test result** before touching code. Otherwise you can't tell which failures you caused.

---

## 7. Sync points

| Hour | What happens |
|---|---|
| 0 | Both read this file. A commits `access.types.ts`. B commits the stubs for `writeAudit` and `bumpAccessVersion`. |
| 1.5 | A merges fail-closed context to a shared `integration` branch. B rebases. |
| 3.5 | A merges tables + catalog. B unblocks lock dates and the catalog endpoint UI. |
| 5.5 | A merges `AccessContext` + `secured()`. B starts moving routes onto it. |
| 8 | Both merge to `integration`, run the full suite, deploy to staging. |
| 9–10 | Cross-review: A reviews B's diff, B reviews A's diff. Read RLS and grant-guard code line by line. |

---

## 8. What to cut if you fall behind (in this order)

1. Data Sharing page, origin badges, break-glass modal (B, frontend)
2. Break-glass endpoint and clinic stamping (A)
3. Lock dates (B). Keep SSN/DOB masking.
4. Read-audit logging (`access_audit`). Keep write-side audit.

**Never cut:** fail-closed scope, RLS deployed and enforced, scope sweep, role-grant guard, RLS test harness.

---

## 9. Definition of done for today

- [ ] Unauthenticated `GET /api/roles` → 401
- [ ] `POST /api/auth/register` with any `roleId` creates a Patient-role user only; register page has no role dropdown
- [ ] `/uploads/patients/*` returns 403 without a valid signature; images still display in the app
- [ ] User with no branch → 403 or zero rows, never all rows
- [ ] App runs as `medflow_app` in every environment; prod refuses to boot as superuser
- [ ] All 15 PHI/financial route files scoped; CI guard script passes
- [ ] Branch Admin cannot grant Super Admin or edit global roles
- [ ] Role changes force re-login
- [ ] Group Admin gets 403 on chart routes
- [ ] Permissions read from tables (JSON fallback still on)
- [ ] Every role/permission/clinic change writes a hashed audit row
- [ ] RLS harness passes as `medflow_app`
- [ ] Frontend merge bug fixed; roles page saves flat keys
- [ ] Deployed to staging, shadow mode ready. Production enforcement after a soak.

---

## 10. Paste into `CLAUDE.md` at the repo root

```md
# MedFlow RBAC sprint rules
- Read 00-SHARED-CONTRACTS.md and your PERSON-*.md plan before editing.
- Only edit files your plan owns. Ask before touching the other person's files.
- Default deny: an empty clinic list means NO rows. '*' only for platform admin or accessAllClinics.
- Writes are own-branch only. Never add a GROUP_READ_WRITE mode.
- Never remove '*' from a role until the permission catalog covers every key used in routes.
- RLS tests must connect as medflow_app, not the table owner.
- After each task: run the acceptance test in the plan, then `npm test`, then commit with the task id (e.g. "A1.2: ...").
- Do not guess. If a check needs a runtime (DB, HTTP), run it; if you cannot, say so.
```
