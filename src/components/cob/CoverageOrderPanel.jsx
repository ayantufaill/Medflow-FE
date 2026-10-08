import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import {
  AccountBalanceOutlined as OrderIcon,
  RefreshOutlined as RefreshIcon,
} from '@mui/icons-material';
import SectionCard from '../shared/SectionCard';
import CoverageOrderStatusBadge from './CoverageOrderStatusBadge';
import CoverageOrderRow from './CoverageOrderRow';
import ExcludedCoverageList from './ExcludedCoverageList';
import ClaimBlockedNotice from './ClaimBlockedNotice';
import NeedsInfoBanner from './flags/NeedsInfoBanner';
import NeitherPlanCoordinatesBanner from './flags/NeitherPlanCoordinatesBanner';
import RankingCycleBanner from './flags/RankingCycleBanner';
import PayerMismatchBanner from './flags/PayerMismatchBanner';
import CobDenialBanner from './flags/CobDenialBanner';
import CoverageChangedBanner from './flags/CoverageChangedBanner';
import ResolveFlagDialog from './flags/ResolveFlagDialog';
import CoverageOrderOverrideDialog from './CoverageOrderOverrideDialog';
import CoverageOrderHistoryDialog from './CoverageOrderHistoryDialog';
import RecordPayerStatementDialog from './RecordPayerStatementDialog';
import CoverageFormDialog from './CoverageFormDialog';
import AutomaticEligibilityCheckButton from './AutomaticEligibilityCheckButton';
import { usePermissions } from '../../hooks/usePermissions';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import {
  COB_PERMISSIONS,
  ORDER_STATUS,
  REVIEW_FLAGS,
} from '../../constants/cobConstants';
import {
  splitOrderPositions,
  unresolvedFlags,
  getClaimBlockers,
  orderBadges,
  buildMismatchComparison,
  payerReportedRanking,
  isHistoricalOrder,
  deriveCoverageFormContext,
} from '../../utils/cobUtils';
import { formatDate } from '../../utils/dateUtils';
import { getErrorMessage } from '../../utils/errorUtils';
import {
  useCoverageOrder,
  usePayerReports,
  useOverrideOrder,
  useResolveFlag,
  useAcceptPayerOrder,
  useRecordPayerReport,
  useEvaluateOrder,
  useSaveCoverageDetail,
  useRequestPlan,
} from '../../hooks/queries/useCob';

const buttonSx = {
  fontFamily: 'Inter',
  fontSize: fontSize.base,
  fontWeight: fontWeight.medium,
  textTransform: 'none',
  borderRadius: radius.md,
};

/**
 * A COB coverage, as the coverage form's initial values.
 *
 * Module-level rather than inline in a useMemo so the mapping has no early
 * returns the React compiler has to bail out of — and so it is readable.
 *
 * Note the one name change: the rule-engine facts call it `employmentStatus`
 * while the write endpoint calls the same thing `subscriberEmploymentStatus`.
 * The form holds the read name; CoverageFormDialog's submit maps it.
 */
const coverageToFormValues = (coverageId, coverage) => {
  if (!coverageId) return undefined;
  if (!coverage) return { coverageId };

  return {
    coverageId,
    carrierId: coverage.carrierId ?? '',
    planId: coverage.planId ?? '',
    memberId: coverage.memberId ?? coverage.subscriberId ?? '',
    groupNumber: coverage.groupNumber ?? '',
    relationship: coverage.relationship ?? '',
    subscriberName: coverage.subscriberName ?? '',
    coverageBasis: coverage.coverageBasis ?? '',
    employmentStatus: coverage.employmentStatus ?? '',
    employerSizeBand: coverage.employerSizeBand ?? '',
    medicareEntitlementReason: coverage.medicareEntitlementReason ?? '',
    custodyArrangement: coverage.custodyArrangement ?? '',
    custodyRole: coverage.custodyRole ?? '',
    courtOrderExists: !!coverage.courtOrderExists,
    courtOrderNamesThisCoverage: !!coverage.courtOrderNamesThisCoverage,
    isTricareSupplement: !!coverage.isTricareSupplement,
  };
};

/**
 * The coverage order panel on the patient's insurance / billing tab.
 *
 * Reading order on screen, which is also the order of importance:
 *   1. Whether claims are blocked, and why — in the server's own words.
 *   2. Each flag, with its own action.
 *   3. The ranked order — never without the reason for each position.
 *   4. Fixed-benefit policies, visibly recorded and visibly not ranked.
 *
 * ONE QUERY, THREE ANSWERS. `GET /cob/patients/:id/coverage-order` returns the
 * order, the patient's coverages and the `submittable` decision together, so
 * the panel never has to stitch three requests or decide for itself whether a
 * claim may go out. `submittable.reason` is the same sentence the backend
 * throws on an actual refused submission.
 *
 * NO "CONFIRM" BUTTON. `CONFIRMED` is in the status enum but no backend
 * service sets it, so offering the action would be a button that lies. Staff
 * agreement is expressed by resolving a flag or by overriding — both recorded,
 * both attributable.
 *
 * `dateOfService` is how a claim screen asks whether a claim for THAT date may
 * be submitted. When the resolved order is not today's, a note says so.
 */
const CoverageOrderPanel = ({
  patientId,
  patient,
  dateOfService,
  carriers = [],
  plans = [],
  onEditCoverage,
  onOpenClaim,
}) => {
  const { has } = usePermissions();
  const { showSnackbar } = useSnackbar();

  const canRead = has(COB_PERMISSIONS.ORDER_READ);
  const canOverride = has(COB_PERMISSIONS.ORDER_OVERRIDE);
  const canResolveFlag = has(COB_PERMISSIONS.FLAG_RESOLVE);
  const canRecordPayer = has(COB_PERMISSIONS.PAYER_REPORTED_WRITE);
  const canEditDetail = has(COB_PERMISSIONS.COVERAGE_DETAIL_EDIT);

  const [overrideOpen, setOverrideOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [resolving, setResolving] = useState(null);
  /** `{ coverageId, focusSection }` while the COB answers form is open. */
  const [editing, setEditing] = useState(null);

  const orderQuery = useCoverageOrder(patientId, { dateOfService }, { enabled: !!patientId && canRead });
  const reportsQuery = usePayerReports(patientId, { enabled: !!patientId && canRead });

  const overrideOrder = useOverrideOrder(patientId);
  const resolveFlag = useResolveFlag(patientId);
  const acceptPayerOrder = useAcceptPayerOrder(patientId);
  const recordPayerReport = useRecordPayerReport(patientId);
  const evaluateOrder = useEvaluateOrder(patientId);
  const saveCoverageDetail = useSaveCoverageDetail(patientId);
  const requestPlan = useRequestPlan();

  const payload = orderQuery.data;
  const order = payload?.order;

  /* Coverage lookup so a position carrying only an id can still be named. */
  const coveragesById = useMemo(
    () =>
      (payload?.coverages || []).reduce((acc, coverage) => {
        acc[coverage.id] = {
          ...coverage,
          displayName: [coverage.carrierName, coverage.planName].filter(Boolean).join(' — '),
        };
        return acc;
      }, {}),
    [payload?.coverages]
  );

  const { ranked, excluded } = useMemo(() => splitOrderPositions(order), [order]);
  const flags = useMemo(() => unresolvedFlags(order), [order]);
  const blockers = useMemo(() => getClaimBlockers(payload), [payload]);
  const badges = useMemo(() => orderBadges(order), [order]);

  /* Newest payer report is the one a mismatch is about. */
  const latestReport = useMemo(() => (reportsQuery.data?.reports || [])[0] || null, [reportsQuery.data]);

  const mismatchFlag = flags.find((f) => f.flag === REVIEW_FLAGS.PAYER_MISMATCH);

  // The flag's own detail is authoritative when present — it is the snapshot
  // taken when the mismatch was raised, so it cannot drift as reports arrive.
  const mismatchReport = mismatchFlag?.detail?.report || latestReport;

  const mismatchComparison = useMemo(
    () => (mismatchFlag ? buildMismatchComparison(order, mismatchReport, coveragesById) : null),
    [mismatchFlag, mismatchReport, order, coveragesById]
  );

  const reportedRanking = useMemo(
    () => (mismatchFlag ? payerReportedRanking(order, mismatchReport) : null),
    [mismatchFlag, mismatchReport, order]
  );

  const named = useCallback(
    (position) => {
      const coverage = coveragesById[position.coverageId] || {};
      return {
        carrierName: position.carrierName || coverage.carrierName,
        planName: position.planName || coverage.planName,
        memberId: coverage.memberId || coverage.subscriberId,
      };
    },
    [coveragesById]
  );

  /* Rows handed to the override dialog: current order, reason attached. */
  const overrideRows = useMemo(
    () =>
      ranked.map((position) => {
        const info = named(position);
        return {
          coverageId: position.coverageId,
          label: [info.carrierName, info.planName].filter(Boolean).join(' — ') || position.coverageId,
          explanation: position.explanation,
        };
      }),
    [ranked, named]
  );

  /**
   * A NEEDS_INFO "fix this" click.
   *
   * Every field the pipeline can report missing is a COB fact, so this opens
   * the COB answers form at the right section rather than routing to the
   * legacy coverage editor — which cannot edit any of them. Users without
   * `insurance.coverage_detail.edit` are handed to the caller instead, so the
   * host screen can route them somewhere they do have rights.
   */
  const handleFixField = (target = {}) => {
    if (canEditDetail && target.coverageId) {
      setEditing({ coverageId: target.coverageId, focusSection: target.section });
      return;
    }
    onEditCoverage?.(target);
  };

  /** Decides which conditional questions the form shows — see cobUtils. */
  const formContext = useMemo(
    () =>
      deriveCoverageFormContext({
        patient,
        coverages: payload?.coverages || [],
        editingCoverageId: editing?.coverageId,
      }),
    [patient, payload?.coverages, editing?.coverageId]
  );

  /** The COB facts already recorded on the coverage being edited. */
  const editingInitialValues = useMemo(
    () => coverageToFormValues(editing?.coverageId, coveragesById[editing?.coverageId]),
    [editing?.coverageId, coveragesById]
  );

  const run = async (mutation, variables, successMessage) => {
    try {
      await mutation.mutateAsync(variables);
      showSnackbar(successMessage, 'success');
      return true;
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error');
      return false;
    }
  };

  /** Every flag clears through the same endpoint, so through the same prompt. */
  const resolveWithNote = async (flagCode, note) => {
    const ok = await run(
      resolveFlag,
      { orderId: order.id, flag: flagCode, resolutionNote: note },
      'Flag cleared.'
    );
    if (ok) setResolving(null);
  };

  /* ── States ───────────────────────────────────────────────────────────── */

  if (!canRead) {
    return (
      <SectionCard icon={OrderIcon} title="Insurance order">
        <Alert severity="info" data-testid="cob-order-no-permission" sx={{ fontFamily: 'Inter', fontSize: fontSize.base }}>
          You don&apos;t have permission to see the insurance order for this patient.
        </Alert>
      </SectionCard>
    );
  }

  if (orderQuery.isLoading) {
    return (
      <SectionCard icon={OrderIcon} title="Insurance order">
        <Stack alignItems="center" sx={{ py: 3 }} data-testid="cob-order-loading">
          <CircularProgress size={24} />
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_MUTED, mt: 1 }}>
            Working out who pays first…
          </Typography>
        </Stack>
      </SectionCard>
    );
  }

  if (orderQuery.isError) {
    return (
      <SectionCard icon={OrderIcon} title="Insurance order">
        <Alert
          severity="error"
          data-testid="cob-order-error"
          action={
            <Button size="small" onClick={() => orderQuery.refetch()} sx={buttonSx}>
              Try again
            </Button>
          }
        >
          We couldn&apos;t load the insurance order. {getErrorMessage(orderQuery.error)}
        </Alert>
      </SectionCard>
    );
  }

  const hasCoverages = (payload?.coverages || []).length > 0;
  const nothingRanked = ranked.length === 0 && excluded.length === 0;

  return (
    <>
      <SectionCard
        icon={OrderIcon}
        title="Insurance order"
        subtitle="Who we bill first, and why"
        action={
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <CoverageOrderStatusBadge codes={badges} />
          </Stack>
        }
      >
        {/* Blocking comes first: it is the consequence, and a user who reads
            nothing else must still see it. */}
        <ClaimBlockedNotice blockers={blockers} />

        {/* A claim screen shows the order effective on the date of service. */}
        {isHistoricalOrder(order) && (
          <Alert
            severity="info"
            data-testid="cob-historical-order"
            sx={{ mb: 2, fontFamily: 'Inter', fontSize: fontSize.base }}
          >
            This is the order that applied on {formatDate(dateOfService || order?.effectiveFrom)},
            which is not the order in force today. Claims for this visit use the order shown here.
          </Alert>
        )}

        {/* ── Flags ──────────────────────────────────────────────────────── */}

        {order?.status === ORDER_STATUS.NEEDS_INFO && (
          <NeedsInfoBanner
            missingFields={order.missingFields || []}
            onFixField={handleFixField}
          />
        )}

        {flags.map((flag) => {
          switch (flag.flag) {
            case REVIEW_FLAGS.NEITHER_PLAN_COORDINATES:
              return (
                <NeitherPlanCoordinatesBanner
                  key={flag.id}
                  flag={flag}
                  canResolve={canResolveFlag}
                  onResolve={() => setResolving(flag.flag)}
                />
              );

            case REVIEW_FLAGS.RANKING_CYCLE:
              return (
                <RankingCycleBanner
                  key={flag.id}
                  canOverride={canOverride}
                  onOpenOverride={() => setOverrideOpen(true)}
                />
              );

            case REVIEW_FLAGS.PAYER_MISMATCH:
              return (
                <PayerMismatchBanner
                  key={flag.id}
                  flag={flag}
                  comparison={mismatchComparison}
                  report={mismatchReport}
                  reportedRanking={canResolveFlag && canOverride ? reportedRanking : null}
                  canOverride={canOverride}
                  onOpenOverride={() => setOverrideOpen(true)}
                  busy={acceptPayerOrder.isPending || resolveFlag.isPending}
                  onAcceptPayer={(_f, reason) =>
                    run(
                      acceptPayerOrder,
                      {
                        orderId: order.id,
                        orderedCoverageIds: reportedRanking,
                        reason,
                        resolutionNote: `Adopted the insurer's reported order. ${reason}`,
                      },
                      "Saved the insurer's order."
                    )
                  }
                  onKeepOurs={(_f, reason) =>
                    run(
                      resolveFlag,
                      {
                        orderId: order.id,
                        flag: REVIEW_FLAGS.PAYER_MISMATCH,
                        resolutionNote: `Kept our order. ${reason}`,
                      },
                      'Kept our order, with your reason on the record.'
                    )
                  }
                  onMarkReChecked={(_f, note) =>
                    run(
                      resolveFlag,
                      {
                        orderId: order.id,
                        flag: REVIEW_FLAGS.PAYER_MISMATCH,
                        resolutionNote: `Re-checked with the payer. ${note}`,
                      },
                      'Marked as re-checked.'
                    )
                  }
                />
              );

            case REVIEW_FLAGS.COB_DENIAL:
              return (
                <CobDenialBanner
                  key={flag.id}
                  flag={flag}
                  onOpenClaim={onOpenClaim}
                  // The fix for a coordination denial is always to go back to
                  // the payer, never to re-send the same claim.
                  onReVerify={() => setRecordOpen(true)}
                  canResolve={canResolveFlag}
                  onResolve={() => setResolving(flag.flag)}
                />
              );

            case REVIEW_FLAGS.COVERAGE_CHANGED:
              return (
                <CoverageChangedBanner
                  key={flag.id}
                  flag={flag}
                  canResolve={canResolveFlag}
                  onReview={() => setResolving(flag.flag)}
                />
              );

            default:
              return null;
          }
        })}

        {/* ── The order ──────────────────────────────────────────────────── */}

        {!hasCoverages ? (
          <Box sx={{ py: 3, textAlign: 'center' }} data-testid="cob-order-empty">
            <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
              No insurance recorded for this patient yet.
            </Typography>
            <Button
              variant="contained"
              disableElevation
              onClick={() => onEditCoverage?.({ mode: 'create' })}
              sx={{ ...buttonSx, mt: 1.5, backgroundColor: COLORS.ACCENT, '&:hover': { backgroundColor: COLORS.ACCENT_HOVER } }}
            >
              Add insurance
            </Button>
          </Box>
        ) : nothingRanked ? (
          // Coverages exist but no order has been worked out — a patient added
          // before COB existed, or one nobody has evaluated yet.
          <Box sx={{ py: 3, textAlign: 'center' }} data-testid="cob-order-not-evaluated">
            <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, color: COLORS.TEXT_SECONDARY }}>
              We haven&apos;t worked out who pays first for this patient yet.
            </Typography>
            <Button
              variant="contained"
              disableElevation
              onClick={() => run(evaluateOrder, { triggerReason: 'MANUAL_EVALUATION' }, 'Insurance order worked out.')}
              disabled={evaluateOrder.isPending}
              data-testid="cob-evaluate-now"
              sx={{ ...buttonSx, mt: 1.5, backgroundColor: COLORS.ACCENT, '&:hover': { backgroundColor: COLORS.ACCENT_HOVER } }}
            >
              Work out the order
            </Button>
          </Box>
        ) : (
          <>
            {ranked.length > 0 && (
              <Box
                component="ol"
                aria-label="Insurance order, primary first"
                data-testid="cob-order-list"
                sx={{
                  m: 0,
                  p: 0,
                  border: `1px solid ${COLORS.BORDER}`,
                  borderRadius: radius.lg,
                  overflow: 'hidden',
                }}
              >
                {ranked.map((position) => {
                  const info = named(position);
                  return (
                    <CoverageOrderRow
                      key={position.coverageId}
                      position={position.position}
                      carrierName={info.carrierName}
                      planName={info.planName}
                      memberId={info.memberId}
                      explanation={position.explanation}
                    />
                  );
                })}
              </Box>
            )}

            <ExcludedCoverageList items={excluded.map((item) => ({ ...item, ...named(item) }))} />
          </>
        )}

        {/* ── Actions ────────────────────────────────────────────────────── */}

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
          {/* Override is hidden, not disabled, without the permission: it is a
              privileged action, and an always-greyed button invites tickets. */}
          {canOverride && ranked.length > 1 && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setOverrideOpen(true)}
              data-testid="cob-open-override"
              sx={{ ...buttonSx, borderColor: COLORS.BORDER, color: COLORS.TEXT_BODY }}
            >
              Change the order
            </Button>
          )}

          {canRecordPayer && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setRecordOpen(true)}
              data-testid="cob-open-record-payer"
              sx={{ ...buttonSx, borderColor: COLORS.BORDER, color: COLORS.TEXT_BODY }}
            >
              Record what the insurer said
            </Button>
          )}

          {canRecordPayer && <AutomaticEligibilityCheckButton />}

          <Button
            variant="text"
            size="small"
            onClick={() => setHistoryOpen(true)}
            data-testid="cob-open-history"
            sx={{ ...buttonSx, color: COLORS.TEXT_SECONDARY }}
          >
            Order history
          </Button>

          <Button
            variant="text"
            size="small"
            startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
            onClick={() =>
              run(evaluateOrder, { dateOfService, triggerReason: 'MANUAL_EVALUATION' }, 'Insurance order re-checked.')
            }
            disabled={evaluateOrder.isPending}
            data-testid="cob-reevaluate"
            sx={{ ...buttonSx, color: COLORS.TEXT_SECONDARY }}
          >
            Re-check
          </Button>
        </Stack>
      </SectionCard>

      <ResolveFlagDialog
        open={!!resolving}
        flag={resolving}
        saving={resolveFlag.isPending}
        onClose={() => setResolving(null)}
        onSubmit={(note) => resolveWithNote(resolving, note)}
      />

      <CoverageOrderOverrideDialog
        open={overrideOpen}
        onClose={() => setOverrideOpen(false)}
        coverages={overrideRows}
        saving={overrideOrder.isPending}
        onSubmit={async ({ orderedCoverageIds, reason }) => {
          const ok = await run(
            overrideOrder,
            { orderedCoverageIds, reason },
            'Insurance order updated.'
          );
          if (ok) setOverrideOpen(false);
        }}
      />

      <CoverageOrderHistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        patientId={patientId}
        coveragesById={coveragesById}
      />

      {/* Only the COB half is saved here — the payer, plan, member ID and
          dates belong to the patient-insurance endpoints, so those fields are
          read-only context in this dialog and `coverage` is handed to the
          caller untouched. */}
      <CoverageFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        carriers={carriers}
        plans={plans}
        initialValues={editingInitialValues}
        context={formContext}
        focusSection={editing?.focusSection}
        saving={saveCoverageDetail.isPending}
        onRequestPlan={(request) =>
          requestPlan.mutateAsync({ ...request, patientId }).catch((error) => {
            showSnackbar(getErrorMessage(error), 'error');
            return null;
          })
        }
        onSubmit={async ({ cobDetail }) => {
          const ok = await run(
            saveCoverageDetail,
            { coverageId: editing.coverageId, payload: cobDetail },
            'Coordination answers saved.'
          );
          if (ok) {
            setEditing(null);
            // The answers are what the rules were missing, so re-rank now
            // rather than leaving the order stale behind a NEEDS_INFO banner.
            await run(
              evaluateOrder,
              { dateOfService, triggerReason: 'COVERAGE_DETAIL_UPDATED' },
              'Insurance order worked out again.'
            );
          }
        }}
      />

      <RecordPayerStatementDialog
        open={recordOpen}
        onClose={() => setRecordOpen(false)}
        carriers={carriers}
        coverages={payload?.coverages || []}
        saving={recordPayerReport.isPending}
        onSubmit={async (body) => {
          const ok = await run(recordPayerReport, body, 'Saved what the insurer said.');
          if (ok) setRecordOpen(false);
        }}
      />
    </>
  );
};

export default CoverageOrderPanel;
