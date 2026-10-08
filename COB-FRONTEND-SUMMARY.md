# Coordination of Benefits — frontend

Built on `feat/COB-provisioning-insurance-order`. Follows the existing MedFlow
conventions: MUI with the `COLORS`/`styles` tokens, `SectionCard`/`BaseDialog`
shells, service modules returning `response.data.data`, React Query hooks under
`hooks/queries`, `usePermissions`/`<Can>` for gating, `SnackbarContext` for
feedback, Jest + React Testing Library for tests.

**Core principle the UI enforces throughout: the system suggests, the insurer
decides.** Nothing in the UI can say the payer is wrong — only that we and the
payer disagree, which becomes a flag for a human.

---

## 1. What was built

### Domain layer

| File | Purpose |
|---|---|
| `src/constants/cobConstants.js` | Every enum, mirrored from `Medflow-BE/src/services/cob/types.ts`, plus the plain-English label for each value, flag copy, help text, permission keys, and the `MISSING_FIELD_META` map that turns a backend field path into a label + form section. |
| `src/utils/cobUtils.js` | Pure logic: conditional-question visibility, form validation, ranked/excluded split, claim blockers, badge set, estimate formatting, historical-order detection, mismatch comparison. No React, no API — so the rules are unit-testable directly. |
| `src/services/cob.service.js` | All HTTP calls, grouped into plan-master / coverage / order / verification / billing services. |
| `src/hooks/queries/useCob.js` | Query keys, queries and mutations. Every order-changing mutation invalidates the order, the coverages and the payer reports, because any of them can change the suggestion. |
| `src/config/featureFlags.js` | One place that reads feature flags. |

### 1 · Plan master data (admin)

- **`src/pages/admin/CobPlanMaster.jsx`** — Admin → Insurance Management →
  **Plan Coordination** (`/admin/insurance-management/plan-coordination`,
  wired into `adminRoutes.jsx` and `AdminPage.jsx`).
- `PlanMasterActionBar` — free-text search plus a payer filter (plan names
  repeat heavily across payers, so name-only search is unusable).
- `PlanMasterTable` — the "does not coordinate = No" value gets a red chip so a
  wrongly-set plan can be spotted without opening every row; the info source is
  shown beside it, because a "No" sourced from `DEFAULT` is a data-quality bug.
- `PlanMasterEditDialog` — benefit category, "Does this plan coordinate with
  other insurance?" (default yes) with the "answering no is rare" help text,
  secondary payment method (incl. Unknown, with per-option explanation), and
  information source. **Before saving a COB-field change it fetches and shows
  the number of patients with open claims that would be re-evaluated, and the
  save button stays disabled until that number arrives.** Warns when "No" is
  set while the source is still "Default".
- `PlanMasterHistoryDialog` — append-only version history with a field-level
  diff and the change note.
- Editing is gated on `insurance.plan_master.edit`; **hidden**, not disabled.
  Read access follows the surrounding admin area, so a billing coordinator can
  look things up without being able to change them.

### 2 · Add/edit coverage form (front desk)

**`src/components/cob/CoverageFormDialog.jsx`** plus
`coverage-form/PlanNotListedDialog.jsx` and `coverage-form/CardPhotoUpload.jsx`.

- Payer → plan picker (plans narrowed to the chosen payer), member ID, group
  number, start/end dates, how the coverage is held.
- **"The plan isn't in this list"** records a *request* and notifies a billing
  admin — it does not create a plan, because the plan master carries the
  coordination settings every patient inherits. The coverage can still be saved
  meanwhile, with the request id attached.
- Card photos: separate front/back slots (a re-shoot of one side must not
  replace the other), visually-hidden native file inputs.
- "Who is the policyholder?" (self / spouse / parent / other) → name and DOB
  become required when not self, with the DOB's helper text saying *why*
  ("used to work out which plan pays first").
- Conditional questions, shown only when relevant:
  - Medicare → reason; **ESRD** → start date
  - Medicare **+** employer coverage → "still actively working?"; employer size
    only while the answer is "still working"
  - Dependent child on **both** parents' policies → parents together? → if not,
    custody arrangement, responsible parent, court order
  - COBRA / retiree → employment status
- Fixed-benefit (indemnity) plan selected → an inline note that it pays the
  patient directly and won't be part of the claim order, shown *before* saving.
- Answers to questions that are no longer on screen are nulled on submit, so a
  stale ESRD date can't reach the rule engine after a payer switch.
- `focusSection` scrolls the form to the section a NEEDS_INFO "fix this" click
  came from.

### 3 · Coverage order panel

**`src/components/cob/CoverageOrderPanel.jsx`**, wired into
`PatientInsuranceTabContent.jsx` above the coverage list.

Reading order on screen: blocking notice → date-of-service note → flags →
ranked order → "Not part of claim order" → actions.

- `CoverageOrderRow` — `Primary: Aetna — Choice POS II` with the backend's
  one-line reason underneath. **Never shows a position without a reason**; a
  missing explanation renders "No reason was recorded for this position —
  re-check the order" in warning colour rather than a bare rank.
- `ExcludedCoverageList` — the fixed-benefit section, visibly recorded and
  visibly not ranked.
- `CoverageOrderStatusBadge` — Suggested / Needs information / Needs review /
  Confirmed / Staff override / Disputed, **plus** "Verified with payer" as a
  separate badge, because "a human agreed" and "the insurer agreed" are
  different facts.
- `ClaimBlockedNotice` — lists *every* blocking reason, not just the first.
- Flag banners, each with exactly one primary action:
  | Flag | Action |
  |---|---|
  | `NEEDS_INFO` | Each missing field is a button that opens the form at it |
  | `NEITHER_PLAN_COORDINATES` | "Both plans may pay in full…" + mark confirmed with the payers |
  | `RANKING_CYCLE` | Opens the override (disabled with an explanation when the user lacks the permission) |
  | `PAYER_MISMATCH` | Side-by-side ours vs theirs + three resolutions |
  | `COB_DENIAL` | Claim number, payer, date, group/reason code, the payer's words; re-verify (primary) and open the denied claim (secondary) |
  | `COVERAGE_CHANGED` | Review, which resolves it |
- `CoverageOrderHistoryDialog` — every stored version with its effective range,
  status, reasons, trigger and any override reason.

### 4 · Override flow

**`src/components/cob/CoverageOrderOverrideDialog.jsx`**

- Gated on `insurance.coverage_order.override` (hidden without it).
- dnd-kit drag-and-drop **and** explicit Up/Down buttons **and** dnd-kit's
  `KeyboardSensor` on the focused handle — three equivalent ways to move.
- Reason required; "Review the change" disabled until something has actually
  moved *and* a reason is typed, with a tooltip saying which is missing.
- Two-step: a confirmation screen showing **old order vs new order** plus the
  reason, before anything is sent.

### 5 · Verification

- **`RecordPayerStatementDialog`** — which payer, other coverage they reported,
  the order they reported (for themselves and for the other plan), source
  (phone / portal / eligibility response), reference number, date, notes.
  Records the insurer's claim as a separate fact; there is deliberately no
  "and set the order to this" option.
- **`AutomaticEligibilityCheckButton`** — placeholder behind
  `VITE_FEATURE_AUTO_ELIGIBILITY` (added to `.env.example`, default off).

### 6 · Claim and balance views

- **`balances/ResponsibilityBalanceTable.jsx`** — balance by primary /
  secondary / tertiary / patient. Contractual adjustments are their own lines
  labelled in full: *"Insurance agreed-price adjustment (not billed to
  patient)"*. Not-yet-remitted insurance payments carry an **Estimate** chip;
  when the plan's payment method is `UNKNOWN` the figure is a **range** with an
  info tooltip, never a midpoint.
- **`balances/SecondaryClaimButton.jsx`** — disabled until the primary
  remittance is posted, with the reason in a tooltip *and* in the accessible
  name, so it is not colour-only.
- **`balances/ClaimResponsibilityPanel.jsx`** — the two together.
- **`InjuryQuestions.jsx`** — "Is this visit because of an injury?" → work or
  auto. On the claim, never on the coverage.
- **`ClaimCobSection.jsx`** — injury question + order panel scoped to the
  claim's date of service + balance panel; wired into
  `pages/claims/ViewClaimPage.jsx`.

### UX rules

- No order without reasons (enforced in the component, see above).
- Claim screens pass `dateOfService` to the order panel, which shows the
  version in force then and an info banner when that differs from today's.
- Loading / error (with retry) / empty states on every panel and table; all six
  flags plus `NEEDS_INFO` have a rendered banner and a test.
- Keyboard: reorder works entirely from the keyboard; reorder controls have
  spoken labels naming the plan and the destination position ("Move Aetna —
  Choice POS II up to position 1"); the reorder list is named
  ("Insurance order"); status pills use `role="status"`; wide tables scroll in
  their own container.
- Plain language: "COB" appears in no front-desk string. A test asserts this
  across every user-facing option list.

---

## 2. Tests

`npm test` → **13 suites, 264 tests, all passing** (the 4 pre-existing suites
included).

| Suite | Covers |
|---|---|
| `utils/__tests__/cobUtils.test.js` (46) | Conditional-question matrix, validation, ranked/excluded split, server-driven blockers plus the fallback, badges, estimate formatting, historical detection, mismatch comparison, `payerReportedRanking` refusing to guess, and `deriveCoverageFormContext` |
| `constants/__tests__/cobConstants.test.js` (36) | Every status has a badge, every flag has title/body/action, the blocking flag AND status sets match the backend's, the permission map matches the routes', the validator minimums match, no "COB" in front-desk labels, **and a drift guard that parses the backend's `types.ts` and asserts every enum matches** (auto-skips when the backend checkout isn't alongside) |
| `cob/__tests__/CoverageFormDialog.test.jsx` (15) | Each conditional scenario shows/hides correctly; subscriber DOB required when not self and not required for self; hidden answers nulled on submit; **the two-payload split and the `subscriberEmploymentStatus` rename**; custody answers sent only when on screen; fixed-benefit note; plan-not-listed flow |
| `cob/__tests__/CoverageOrderPanel.test.jsx` (25) | Loading/error/empty/not-yet-evaluated; no query at all without `coverage_order.read`; reasons always shown; fixed-benefit in its own section and *not* in the order; badges incl. nested verification; date-of-service note; **the server's blocking sentence rendered verbatim**; each flag's banner, action and resolution note; override and record-payer gated on their real keys; **no "confirm" button** |
| `cob/__tests__/PayerMismatch.test.jsx` (13) | Side-by-side view, provenance, note; "use the insurer's order" calling override **then** resolve-flag on the new version; the 10-char reason floor; keep-ours and re-checked calling resolve-flag only; and the partial-report path refusing to apply, offering the manual override, or naming who to ask |
| `cob/__tests__/CoverageOrderOverrideDialog.test.jsx` (9) | Reason required and ≥ 10 chars; no-op blocked; confirmation shows old vs new; `orderedCoverageIds` payload; full keyboard reordering; spoken labels; end-of-list buttons disabled |
| `cob/__tests__/ClaimResponsibility.test.jsx` (14) | Balance split by party in billing order; adjustments per party and as a labelled total, kept out of the paid column; estimates labelled; range when method unknown; empty/unlinked/error; secondary claim disabled before the remittance, enabled after, **a $0 denial counting as posted**, and the adjudication summary |
| `cob/__tests__/InjuryQuestions.test.jsx` (9) | Injury type conditional, cleared on "no"; eligibility button hidden behind the flag; incomplete injury answer not sent; injury answered as claim context on `evaluate`; the panel asked about the claim's own date of service |
| `pages/admin/__tests__/CobPlanMaster.test.jsx` (14) | Nothing shown without `plan_master.read`; edit hidden without `plan_master.edit`; "does not coordinate" chip; "not recorded" marker; `carrierId` filter; unconfirmed-only filter; **affected-patient count from the dry-run endpoint, shown before saving, save blocked until it arrives, and NOT claimed for a change that re-ranks nobody**; unconfirmed-"No" warning; PATCH sending only changed fields |
| `cob/__tests__/cob.e2e.test.jsx` (5) | The three end-to-end scenarios |

The end-to-end scenarios run the real components and hooks against a stateful
fake backend that versions its history between calls **and recomputes
`submittable` using the backend's own blocking logic and wording** — so a test
fails if the UI doesn't actually refetch after a mutation. The fake also models
the real distinction between calls that create a version (`override`) and calls
that update in place (`resolve-flag`); getting that wrong initially surfaced a
duplicate-version bug in the history view, which is exactly what it is for.

1. Own plan + spouse's plan marked "no COB provision" → spouse's plan suggested
   primary **with the reason**, nothing blocked, and no confirm button to press
   (the backend has no such endpoint). Plus the re-check path.
2. Child with married parents → birthday-rule suggestion → staff record what
   Aetna said on the phone → `PAYER_MISMATCH` raised, side-by-side shown, claims
   blocked → staff adopt the insurer's order, which **overrides then resolves** →
   order re-ranked with the payer's reason, block cleared, "Verified with payer"
   badge → **history shows all three versions, the override's reason and the
   flag resolution**.
3. Secondary claim denied with a COB reason → `COB_DENIAL` banner with claim
   number / `CO 22` / the payer's words → open the denied claim → re-verify via
   the payer-statement form → **then clear the flag with what the payer said** →
   denial clears, billing unblocks, order reads verified. Plus: the secondary
   claim stays locked while the primary remittance is unposted, with the primary
   shown as a range estimate.

### Test infrastructure

Jest was configured in this repo (`jest.config.cjs`, `jest.setup.cjs`,
`__mocks__/fileMock.cjs`, jest-style suites) but **not installed**, and there
was no `test` script, so no suite could run. Changes:

- Installed `jest@30`, `jest-environment-jsdom`, `babel-jest`,
  `@testing-library/{react,jest-dom,user-event}`, `identity-obj-proxy`, and
  pinned `@babel/{core,preset-env,preset-react}` to v7 (Babel 8 is ESM-only and
  `babel-jest` cannot `require()` it; v7 is also what `@vitejs/plugin-react`
  asks for).
- `npm test` → jest, `npm run test:watch`, `npm run test:vitest`.
- `jest.config.cjs`: `testMatch` limited to `*.test.*` (so shared helpers in
  `__tests__/` aren't treated as suites), `.claude/worktrees` ignored (it holds
  a full repo copy that collided in `jest-haste-map`),
  `src/config/navMenuItems.test.jsx` ignored (it is authored against vitest —
  run it with `npm run test:vitest`), and `testTimeout: 30000` because the
  integration suites drive full MUI dialogs through `userEvent` and exceed the
  5s default when 13 suites run in parallel.
- `eslint.config.js`: Jest globals for test files. This fixed the pre-existing
  test files too — repo-wide lint went from **1555 problems to 1249**.

---

## 3. Backend integration — reconciled against the real API

**The backend landed while this frontend was being built.** `Medflow-BE` now
has `src/routes/cob.routes.ts`, `src/controllers/cob.controller.ts`,
`src/services/cob/*` (10 modules), `src/validators/cob.validator.ts`, RLS
policies and its own test suites. Every service call, field name, permission
key and validation threshold in this frontend has been checked against those
files; the earlier inferred contract is gone.

### What the frontend talks to

```
GET    /cob/enums                                    enum lists (drift check)
GET    /cob/eligibility/providers                    { providers[], active }

GET    /cob/plans?search&carrierId&benefitCategory&cobPaymentMethod&unconfirmedOnly&page&limit
GET    /cob/plans/:planId                            plan + its `history`
GET    /cob/plans/:planId/cob-impact                 dry run (ADDED — see below)
PATCH  /cob/plans/:planId/cob                        -> { plan, changed, version, reEvaluated[] }
PATCH  /cob/carriers/:carrierId/payer-type

GET    /cob/coverages/:coverageId/detail
PATCH  /cob/coverages/:coverageId/detail             COB facts only
POST   /cob/coverages/:coverageId/secondary-estimate -> range when method UNKNOWN

GET    /cob/patients/:patientId/coverage-order?dateOfService=
                                     -> { order, coverages, submittable }
GET    /cob/patients/:patientId/coverage-order/on-date?date=
GET    /cob/patients/:patientId/coverage-order/history   -> { orders[] }
POST   /cob/patients/:patientId/coverage-order/evaluate   injury context goes here
POST   /cob/patients/:patientId/coverage-order/override   { orderedCoverageIds, reason }
POST   /cob/coverage-orders/:orderId/resolve-flag         { flag, resolutionNote }

GET    /cob/patients/:patientId/payer-reported-coverage
POST   /cob/patients/:patientId/payer-reported-coverage

GET    /cob/claims/:claimId/secondary-readiness      -> { posted, reason, ... }
GET    /cob/claims/:claimId/primary-payment
GET    /cob/invoices/:invoiceId/responsibility       -> { byParty[], ... }
POST   /claims/:primaryClaimId/generate-secondary    (claims API, not COB)
```

### The design decisions this forced

1. **One query, three answers.** `GET …/coverage-order` returns the order, the
   coverage list AND a `submittable` block. So the panel makes one request, and
   **the client no longer decides whether a claim is blocked** — it renders
   `submittable.reason`, which is the same sentence `assertSubmittable` throws
   when a submission is actually refused. The two cannot drift.
2. **No "Confirm this order" button.** `CONFIRMED` is in the status enum but no
   backend service sets it. The button was removed rather than left pointing at
   nothing — staff agreement is expressed by resolving a flag or by overriding,
   both recorded and attributable. A test pins its absence.
3. **PAYER_MISMATCH's three resolutions are built from two primitives.** There
   is no accept-payer endpoint. "Use the insurer's order" = `override` (new
   version, re-ranked) **then** `resolve-flag` on the version the override
   created; "Keep our order" and "Mark as re-checked" = `resolve-flag` with
   their own notes. Each is pinned by a test asserting which calls happen and
   which do not.
4. **"Use the insurer's order" is offered only when it can be applied.** The
   override endpoint replaces the *whole* order, but a payer usually names a
   position only for itself. `payerReportedRanking` returns null in that case,
   the button is replaced by an explanation, and the user is pointed at the
   manual override. Applying a partial ranking would silently drop a coverage.
5. **Every flag resolution needs a note** (`resolutionNote`, min 5 chars), so a
   shared `ResolveFlagDialog` asks for one with flag-specific wording. Never
   prefilled — a default note would read as a finding nobody made.
6. **Blocking is wider than it looks.** The backend blocks on statuses
   `NEEDS_INFO`, `NEEDS_REVIEW` **and `DISPUTED`**, and on flags
   `RANKING_CYCLE`, `PAYER_MISMATCH` **and `COB_DENIAL`**. The constants were
   corrected to match, and tests assert both sets.
7. **The coverage form saves in two halves.** `PATCH /coverages/:id/detail`
   owns only the coordination facts; payer, plan, member ID, group number and
   dates stay on `patplan`/`inssub`/`insplan`. `onSubmit` hands back
   `{ coverage, cobDetail }` separately rather than guessing an order. Note the
   one renamed field: `subscriberEmploymentStatus`, not `employmentStatus`.
8. **Injury relatedness has no storage endpoint — by design.** It is claim
   context on the `evaluate` call, which is the same modelling decision from the
   other side: an input to the ranking for this date of service, not a stored
   property of a coverage. Answering the question re-runs the rules.
9. **Balances are keyed by invoice, not claim.** One invoice is what a patient
   receives and what `cob_responsibility_ledger` is written against. The
   per-party rows carry `contractualAdjustments` as their own column, and the
   endpoint's explicit `contractualAdjustmentsAreBillableToPatient: false` is
   rendered rather than assumed.
10. **`posted`, not `canCreate`.** A $0 denial counts as posted — a denial is an
    adjudication the secondary is entitled to carry. Gating on "was there
    money" would strand exactly the patients who most need the secondary
    billed. A test pins this.
11. **Validation floors are mirrored client-side.** Override reason ≥ 10 chars,
    resolution note ≥ 5 chars, from `cob.validator.ts`. Users find out before
    they submit rather than through a 400.
12. **Plan history comes with the plan, as snapshots.** There is no separate
    history endpoint, and `cob_plan_profile_version` stores the full field
    snapshot after each change rather than a diff — so the history dialog
    computes each diff against the version below it, and labels the oldest as
    the starting point instead of rendering it as a change from nothing.

### One backend addition

The spec requires the affected-patient count **before** saving, and
`updateCobFields` only reports the fan-out **after** it (`reEvaluated`). So a
read-only dry run was added:

- `planMasterService.previewCobChangeImpact(planId)` →
  `{ planId, affectedPatients, openClaims, patientsOnPlan }`
- `CobController.getPlanCobImpact`
- `GET /cob/plans/:planId/cob-impact`, gated on `insurance.plan_master.edit`

Its `where` clause is a deliberate copy of `reEvaluatePatientsOnPlan`'s, with a
comment on both saying so: the number shown before the save has to be the same
number that happens, and "open claim" is defined by Open Dental status codes the
client should not model. The frontend still reports the *actual* `reEvaluated`
count in the success message, so prediction and outcome are both visible.

BE `tsc --noEmit` is clean, `tests/rbac/catalog-drift.test.ts` passes with the
new route, and `tests/cob-pipeline` + `tests/cob-estimate` (53 tests) still pass.

### Permissions — the flagged item, resolved

All keys now exist in `PERMISSIONS.INSURANCE_COB` and are seeded in
`seedRoles.ts` (front desk gets `coverage_order.read`; the billing role gets the
full set). `permission-catalog.ts` derives from `PERMISSIONS`, so they are in the
catalog automatically. **The frontend adopted the real key names**, which
differ from the three I had guessed:

| Used for | Real key |
|---|---|
| See the order at all | `insurance.coverage_order.read` |
| Reorder by hand | `insurance.coverage_order.override` |
| Clear a review flag | `insurance.coverage_order.resolve_flag` |
| Edit a coverage's COB facts | `insurance.coverage_detail.edit` |
| Record what a payer said | `insurance.payer_reported.write` |
| View plan master data | `insurance.plan_master.read` |
| Edit plan master data | `insurance.plan_master.edit` |

My invented `insurance.coverage.verify` is gone — `insurance.payer_reported.write`
is the real key. The panel now returns a permission notice instead of querying
at all without `coverage_order.read`, and a test asserts the exact key map.

### Custody / dependent-child context — the other flagged item, resolved

`deriveCoverageFormContext({ patient, coverages, editingCoverageId })` in
`cobUtils.js` now builds the form's context, and `CoverageOrderPanel` owns the
COB coverage form so it can supply it.

`otherCoverages` comes from the **COB** coverage list (the `coverages` array
returned with the order), not the legacy insurance list: it is already
normalised to the rule engine's own vocabulary — `relationship` as
SELF/SPOUSE/PARENT/OTHER, `coverageBasis` as EMPLOYER_GROUP/MEDICARE/… — which
is exactly what the visibility rule reads. Deriving it from the legacy list
would mean re-implementing that mapping and getting a different answer from the
server's.

`patientIsDependentChild` is two conditions, not one: under 26 (the ACA
dependent limit, above which these rules have nothing to decide) **and** on at
least one parent's policy. Age alone would ask a 20-year-old with their own
employer plan about custody; the parent relationship alone would ask a
45-year-old still listed on a parent's policy. The patient tab passes `patient`
through for the age. Nine tests cover the helper, including one asserting it
actually switches the form's custody branch on.

### Remaining gaps

- **"The plan isn't listed" raises a TASK, not a plan request.** There is no COB
  endpoint for it and there should not be — letting the front desk mint plans is
  how duplicate rows with unconfirmed defaults appear. It posts to the existing
  `/tasks` API with a description telling a billing admin what to add and where.
  If a dedicated endpoint is wanted later, only `cobPlanRequestService` changes.
- **Card photo upload has no backend.** The UI collects front/back and hands the
  files to the caller in `onSubmit`; nothing uploads them yet. The existing
  patient-document endpoints are the obvious home, but wiring them is a
  decision about where insurance card images should live.
- **Secondary estimates are not yet fetched per party.** The balance table
  accepts `estimatesByParty` and renders ranges correctly (tested), but the
  claim panel does not yet call `POST /coverages/:id/secondary-estimate` to fill
  it — that needs the billed/allowed/primary-paid figures from the claim, which
  the claim screen has in a shape I did not want to guess at.

## 4. Testing steps

```bash
npm install          # jest + RTL were added
npm test             # 13 suites / 217 tests
npm run lint         # ~1249 problems repo-wide (was 1555); 7 are in new code,
                     # all one rule (react-hooks/set-state-in-effect) on the
                     # reset-form-state-when-the-dialog-opens / sync-with-loaded-
                     # prop pattern this repo's other dialogs already use
npm run build        # clean
npm run dev
```

Routes to click through once the backend endpoints exist:

| Route | What to verify |
|---|---|
| `/admin/insurance-management/plan-coordination` | List loads; payer filter and "Only unconfirmed" narrow it; a plan with "coordinates = No" shows the red chip; a plan with no profile shows "Not recorded". **Without `insurance.plan_master.read`**: a permission notice and no request made. **Without `insurance.plan_master.edit`**: no Edit buttons, read-only banner, History still works. **With it**: open Edit, flip "Does this plan coordinate…" to No → the affected-patient count appears and Save is disabled until it arrives; change only the source → no count is claimed; set source to Default while saying No → the unconfirmed warning appears; save → the snackbar reports how many patients were actually re-evaluated, and History shows the diff and the note. |
| `/patients/:id` → Insurance tab | Order panel above the coverage list: Primary/Secondary each with a reason; a fixed-benefit policy sits under "Not part of claim order"; status badges. **Without `insurance.coverage_order.read`**: a permission notice and no request made. **With `insurance.coverage_order.override`**: "Change the order" → drag or use the up/down buttons, Tab through them to check they are reachable, type a reason of 10+ characters, Review the change → old vs new → Save. **Without it**: no "Change the order" button. |
| same, with a NEEDS_INFO order | Blocking notice shows the server's sentence; each missing field is a button that opens the COB answers form scrolled to it (with `insurance.coverage_detail.edit`); saving the answers re-runs the rules. **For a patient under 26 on two parents' policies**, the custody questions appear — that is the `deriveCoverageFormContext` path. |
| same, with a PAYER_MISMATCH order | Side-by-side ours vs theirs with the source/date/note under the insurer's column; claims blocked until resolved. When the payer named every plan: "Use the insurer's order" → a reason of 10+ characters → the order re-ranks and the flag clears. When the payer named only itself: that button is replaced by an explanation plus "Set the order". "Keep our order" and "Mark as re-checked" each need their own note. |
| same, with a COB_DENIAL order | Claim number, payer, denial date, group/reason code and the payer's words; "Open the denied claim"; "Re-verify with payer" opens the payer-statement form. |
| `/patients/:id/insurance/new` | Policyholder = spouse → name and DOB appear and DOB is required. Payer = Medicare → reason appears; choose ESRD → start date appears; choose Age → it disappears. Coverage held = COBRA → employment status appears. Select a fixed-benefit plan → the "pays the patient directly" note appears. "The plan isn't in this list" → fill the plan name → the pending-request line appears. |
| `/claims/:claimId` | Injury question (choose Yes → the type question appears; nothing is sent until the type is chosen, then the order is worked out again for this visit). Order panel shows the order effective on the **date of service**, with the "not the order in force today" banner when it is a past version, and the server's blocking sentence when a claim for that date can't go out. Balance table splits by party in billing order, adjustments on their own labelled total, estimates chipped, an unknown-method figure as a range. "Create secondary claim" disabled with a tooltip until the primary remittance is posted — including a $0 denial, which counts. |
| feature flag | Set `VITE_FEATURE_AUTO_ELIGIBILITY=true` in `.env.local` and restart: "Check eligibility automatically" appears next to "Record what the insurer said". Unset: it is absent. |

Keyboard/screen-reader pass: in the override dialog, Tab to a drag handle and
press Space then the arrow keys; Tab to the Up/Down buttons and press Enter;
confirm a screen reader announces "Move Aetna — Choice POS II up to position 1"
and the list as "Insurance order".
