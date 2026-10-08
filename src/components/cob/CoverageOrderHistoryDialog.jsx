import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import BaseDialog from '../shared/BaseDialog';
import CoverageOrderStatusBadge from './CoverageOrderStatusBadge';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import { positionLabel, VERIFICATION_STATUS } from '../../constants/cobConstants';
import { splitOrderPositions } from '../../utils/cobUtils';
import { formatDate } from '../../utils/dateUtils';
import { useCoverageOrderHistory } from '../../hooks/queries/useCob';

/**
 * Every version of this patient's coverage order, newest first.
 *
 * `cob_coverage_order` is never overwritten: a re-evaluation closes the
 * previous version's effective range and inserts a new one. That is what makes
 * a disputed order defensible months later — "this is the order we billed in
 * March, this is why, and this is who changed it" — and it is also the record
 * a payer appeal is argued from, so an override's reason is shown in full.
 */
const CoverageOrderHistoryDialog = ({ open, onClose, patientId, coveragesById = {} }) => {
  const history = useCoverageOrderHistory(patientId, { enabled: open && !!patientId });
  // GET .../coverage-order/history -> { orders: [ShapedOrder] }, newest first.
  const versions = history.data?.orders || [];

  const nameFor = (position) =>
    coveragesById[position.coverageId]?.displayName ||
    position.carrierName ||
    position.coverageId;

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Insurance order history"
      maxWidth="sm"
      showCloseButton
    >
      {history.isLoading ? (
        <Stack alignItems="center" sx={{ py: 3 }} data-testid="cob-order-history-loading">
          <CircularProgress size={22} />
        </Stack>
      ) : history.isError ? (
        <Alert
          severity="error"
          data-testid="cob-order-history-error"
          sx={{ fontFamily: 'Inter', fontSize: fontSize.base }}
        >
          We couldn&apos;t load the order history.
        </Alert>
      ) : !versions.length ? (
        <Typography
          data-testid="cob-order-history-empty"
          sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, py: 2 }}
        >
          There is no order history for this patient yet.
        </Typography>
      ) : (
        <Box component="ol" sx={{ m: 0, p: 0 }} data-testid="cob-order-history-list">
          {versions.map((version) => {
            const { ranked } = splitOrderPositions(version);
            const badges = [version.status];
            if (version.verification?.status === VERIFICATION_STATUS.VERIFIED_WITH_PAYER) {
              badges.push('VERIFIED_WITH_PAYER');
            }

            return (
              <Box
                component="li"
                key={version.version}
                data-testid={`cob-order-history-version-${version.version}`}
                sx={{
                  listStyle: 'none',
                  border: `1px solid ${COLORS.BORDER}`,
                  borderRadius: radius.md,
                  p: 1.5,
                  mb: 1.25,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mb: 0.75 }}
                >
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
                  <CoverageOrderStatusBadge codes={badges} />
                  <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED }}>
                    {/* An open-ended range is the version in force now. */}
                    {formatDate(version.effectiveFrom)}
                    {version.effectiveTo ? ` – ${formatDate(version.effectiveTo)}` : ' – now'}
                  </Typography>
                </Stack>

                <Box component="ol" sx={{ m: 0, p: 0 }}>
                  {ranked.map((position) => (
                    <Box component="li" key={position.coverageId} sx={{ listStyle: 'none' }}>
                      <Typography
                        sx={{
                          fontFamily: 'Inter',
                          fontSize: fontSize.base,
                          color: COLORS.TEXT_PRIMARY,
                          fontWeight: fontWeight.medium,
                        }}
                      >
                        {positionLabel(position.position)}: {nameFor(position)}
                      </Typography>
                      <Typography
                        sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}
                      >
                        {position.explanation}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {version.triggerReason && (
                  <Typography
                    sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, mt: 0.75 }}
                  >
                    Worked out again because: {version.triggerReason}
                  </Typography>
                )}

                {version.override?.reason && (
                  <Typography
                    data-testid={`cob-order-history-override-${version.version}`}
                    sx={{
                      fontFamily: 'Inter',
                      fontSize: fontSize.sm,
                      color: COLORS.TEXT_SECONDARY,
                      mt: 0.5,
                      fontStyle: 'italic',
                    }}
                  >
                    Set by hand: “{version.override.reason}”
                  </Typography>
                )}

                {/* Resolved flags are the audit trail of how a dispute was
                    settled, which is the question this dialog is usually open
                    to answer. */}
                {(version.flags || [])
                  .filter((f) => f.resolvedAt && f.resolutionNote)
                  .map((f) => (
                    <Typography
                      key={f.id}
                      data-testid={`cob-order-history-flag-${version.version}-${f.flag}`}
                      sx={{
                        fontFamily: 'Inter',
                        fontSize: fontSize.sm,
                        color: COLORS.TEXT_SECONDARY,
                        mt: 0.5,
                      }}
                    >
                      {f.flag.toLowerCase().replace(/_/g, ' ')} resolved: “{f.resolutionNote}”
                    </Typography>
                  ))}
              </Box>
            );
          })}
        </Box>
      )}
    </BaseDialog>
  );
};

export default CoverageOrderHistoryDialog;
