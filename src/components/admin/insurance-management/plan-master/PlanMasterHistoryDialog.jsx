import { useMemo } from 'react';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import BaseDialog from '../../../shared/BaseDialog';
import { COLORS } from '../../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../../constants/styles';
import {
  BENEFIT_CATEGORIES,
  COB_PAYMENT_METHODS,
  COB_INFO_SOURCES,
} from '../../../../constants/cobConstants';
import { useCobPlan } from '../../../../hooks/queries/useCob';
import { formatDate } from '../../../../utils/dateUtils';

const FIELD_LABELS = {
  benefitCategory: 'Benefit category',
  coordinatesBenefits: 'Coordinates with other insurance',
  cobPaymentMethod: 'Secondary payment method',
  cobInfoSource: 'Source',
};

/** The snapshot keys are the Prisma column names, not the API's camelCase. */
const SNAPSHOT_KEY = {
  benefitCategory: 'benefit_category',
  coordinatesBenefits: 'coordinates_benefits',
  cobPaymentMethod: 'cob_payment_method',
  cobInfoSource: 'cob_info_source',
};

const describe = (field, value) => {
  if (value === undefined || value === null) return '—';
  if (field === 'coordinatesBenefits') return value === false ? 'No' : 'Yes';
  if (field === 'benefitCategory') return BENEFIT_CATEGORIES.find((c) => c.value === value)?.label || value;
  if (field === 'cobPaymentMethod') return COB_PAYMENT_METHODS.find((m) => m.value === value)?.label || value;
  if (field === 'cobInfoSource') return COB_INFO_SOURCES.find((s) => s.value === value)?.label || value;
  return String(value);
};

/** Reads a field out of a stored snapshot, tolerating either key style. */
const fromSnapshot = (snapshot, field) => {
  if (!snapshot) return undefined;
  const snake = SNAPSHOT_KEY[field];
  return snapshot[field] !== undefined ? snapshot[field] : snapshot[snake];
};

/**
 * Change history for one plan.
 *
 * `cob_plan_profile_version` is append-only: a change writes a new SNAPSHOT of
 * the fields after it, and nothing is ever updated or deleted. That is what
 * lets a biller answer "what did we think this plan's coordination provision
 * was when we billed in March?" — the question a payer appeal actually turns
 * on.
 *
 * Because the stored rows are snapshots rather than diffs, the diff shown here
 * is computed by comparing each version against the one below it. The oldest
 * version has nothing to compare against and is labelled as the starting
 * point rather than being rendered as a change from nothing.
 */
const PlanMasterHistoryDialog = ({ open, onClose, plan }) => {
  // The plan detail endpoint carries `history`; there is no separate call.
  const planQuery = useCobPlan(plan?.planId, { enabled: open && !!plan?.planId });

  const versions = useMemo(() => {
    const raw = planQuery.data?.plan?.history || [];
    // Newest first from the API. Pair each with its predecessor to diff.
    return raw.map((version, index) => {
      const previous = raw[index + 1];
      const changes = Object.keys(FIELD_LABELS)
        .map((field) => ({
          field,
          from: fromSnapshot(previous?.snapshot, field),
          to: fromSnapshot(version.snapshot, field),
        }))
        .filter((change) => previous && change.from !== change.to);

      return { ...version, changes, isFirst: !previous };
    });
  }, [planQuery.data]);

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={`Change history — ${plan?.planName || 'plan'}`}
      maxWidth="sm"
      showCloseButton
    >
      {planQuery.isLoading ? (
        <Stack alignItems="center" sx={{ py: 3 }} data-testid="plan-history-loading">
          <CircularProgress size={22} />
        </Stack>
      ) : planQuery.isError ? (
        <Alert severity="error" data-testid="plan-history-error" sx={{ fontFamily: 'Inter', fontSize: fontSize.base }}>
          We couldn&apos;t load the change history.
        </Alert>
      ) : !versions.length ? (
        <Typography
          data-testid="plan-history-empty"
          sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, py: 2 }}
        >
          Nobody has changed this plan&apos;s coordination settings yet.
        </Typography>
      ) : (
        <Box component="ol" sx={{ m: 0, p: 0 }} data-testid="plan-history-list">
          {versions.map((version) => (
            <Box
              component="li"
              key={version.version}
              data-testid={`plan-history-version-${version.version}`}
              sx={{
                listStyle: 'none',
                border: `1px solid ${COLORS.BORDER}`,
                borderRadius: radius.md,
                p: 1.5,
                mb: 1.25,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 0.75 }}>
                <Chip
                  size="small"
                  label={`v${version.version}`}
                  sx={{
                    height: 20,
                    fontFamily: 'Inter',
                    fontSize: fontSize.xs,
                    fontWeight: fontWeight.semibold,
                    borderRadius: radius.pill,
                    color: COLORS.ACCENT,
                    backgroundColor: COLORS.ACCENT_BG,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: fontSize.base,
                    color: COLORS.TEXT_PRIMARY,
                    fontWeight: fontWeight.medium,
                  }}
                >
                  {/* The API returns the user NUMBER, not a name. Showing the
                      raw id beats implying we know who it was. */}
                  {version.changedBy ? `User ${version.changedBy}` : 'Unknown user'}
                </Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}>
                  {formatDate(version.changedAt)}
                </Typography>
              </Stack>

              {version.isFirst ? (
                <Box component="ul" sx={{ m: 0, pl: 2.25 }}>
                  {Object.keys(FIELD_LABELS).map((field) => (
                    <Typography
                      component="li"
                      key={field}
                      sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_BODY }}
                    >
                      {FIELD_LABELS[field]}:{' '}
                      <strong>{describe(field, fromSnapshot(version.snapshot, field))}</strong>
                    </Typography>
                  ))}
                  <Typography
                    sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, mt: 0.5 }}
                  >
                    First recorded settings for this plan.
                  </Typography>
                </Box>
              ) : version.changes.length ? (
                <Box component="ul" sx={{ m: 0, pl: 2.25 }}>
                  {version.changes.map((change) => (
                    <Typography
                      component="li"
                      key={change.field}
                      sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_BODY }}
                    >
                      {FIELD_LABELS[change.field]}: {describe(change.field, change.from)} →{' '}
                      <strong>{describe(change.field, change.to)}</strong>
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
                  Re-saved with no change to the coordination fields.
                </Typography>
              )}

              {version.changeNote && (
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: fontSize.sm,
                    color: COLORS.TEXT_SECONDARY,
                    mt: 0.75,
                    fontStyle: 'italic',
                  }}
                >
                  “{version.changeNote}”
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </BaseDialog>
  );
};

export default PlanMasterHistoryDialog;
