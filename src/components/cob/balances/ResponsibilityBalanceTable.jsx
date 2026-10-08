import { useMemo } from 'react';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import {
  RESPONSIBLE_PARTIES,
  CONTRACTUAL_ADJUSTMENT_LABEL,
  ESTIMATE_LABEL,
} from '../../../constants/cobConstants';
import { formatMoney, formatEstimate } from '../../../utils/cobUtils';

const partyLabel = (party) =>
  RESPONSIBLE_PARTIES.find((p) => p.value === party)?.label || party;

/** Insurance before patient, in billing order — never alphabetical. */
const PARTY_ORDER = ['PRIMARY', 'SECONDARY', 'TERTIARY', 'PATIENT'];
const partyRank = (party) => {
  const index = PARTY_ORDER.indexOf(party);
  return index === -1 ? PARTY_ORDER.length : index;
};

const headCellSx = {
  fontFamily: 'Inter',
  fontSize: fontSize.xs,
  fontWeight: fontWeight.bold,
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
  color: COLORS.TEXT_MUTED,
  borderBottom: `1px solid ${COLORS.BORDER}`,
  whiteSpace: 'nowrap',
};

const bodyCellSx = {
  fontFamily: 'Inter',
  fontSize: fontSize.base,
  color: COLORS.TEXT_BODY,
  borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
};

/**
 * Balance by who owes it.
 *
 * Reads `GET /cob/invoices/:invoiceId/responsibility`, whose rows are
 * per-party totals from `cob_responsibility_ledger`:
 * `{ responsibleParty, charges, payments, contractualAdjustments, balance }`.
 *
 * Three things this table exists to get right:
 *
 * 1. CONTRACTUAL ADJUSTMENTS ARE THEIR OWN COLUMN AND THEIR OWN TOTAL LINE,
 *    labelled in full. A write-off of the contracted difference is not a
 *    payment and not a patient discount; a patient reading a statement must
 *    not be able to mistake it for either. The endpoint even returns
 *    `contractualAdjustmentsAreBillableToPatient: false` explicitly, and that
 *    is rendered rather than assumed.
 *
 * 2. ESTIMATES ARE MARKED. A party that has not remitted yet is a guess, and
 *    the caller passes those in `estimatesByParty` from the secondary-estimate
 *    endpoint.
 *
 * 3. AN UNKNOWN PAYMENT METHOD SHOWS A RANGE, not a midpoint — a
 *    non-duplication plan might pay nothing where a standard plan pays the
 *    lot, and a single number there is a figure the front desk would quote to
 *    a patient and then have to take back.
 */
const ResponsibilityBalanceTable = ({
  data,
  estimatesByParty = {},
  loading = false,
  error = null,
}) => {
  const rows = useMemo(
    () => [...(data?.byParty || [])].sort((a, b) => partyRank(a.responsibleParty) - partyRank(b.responsibleParty)),
    [data]
  );

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 3 }} data-testid="cob-balance-loading">
        <CircularProgress size={22} />
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error" data-testid="cob-balance-error" sx={{ fontFamily: 'Inter', fontSize: fontSize.base }}>
        We couldn&apos;t load the balance breakdown.
      </Alert>
    );
  }

  if (!rows.length) {
    return (
      <Typography
        data-testid="cob-balance-empty"
        sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, py: 2 }}
      >
        Nothing has been billed on this invoice yet, so there is no balance to split.
      </Typography>
    );
  }

  return (
    <Box
      sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.lg, overflowX: 'auto' }}
      data-testid="cob-balance-table"
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={headCellSx}>Responsible party</TableCell>
            <TableCell sx={{ ...headCellSx, textAlign: 'right' }}>Charges</TableCell>
            <TableCell sx={{ ...headCellSx, textAlign: 'right' }}>Paid</TableCell>
            <TableCell sx={{ ...headCellSx, textAlign: 'right' }}>Agreed-price adjustment</TableCell>
            <TableCell sx={{ ...headCellSx, textAlign: 'right' }}>Balance</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => {
            const estimate = estimatesByParty[row.responsibleParty];
            const isEstimated = !!estimate;
            // The server says whether this is a range; the value comparison is
            // the fallback for a caller that supplies estimates directly.
            const isRange =
              isEstimated &&
              (estimate.isRange === true ||
                (estimate.low != null &&
                  estimate.high != null &&
                  Number(estimate.low) !== Number(estimate.high)));

            return (
              <TableRow key={row.responsibleParty} data-testid={`cob-balance-row-${row.responsibleParty}`}>
                <TableCell sx={{ ...bodyCellSx, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}>
                  <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                    <span>{partyLabel(row.responsibleParty)}</span>

                    {isEstimated && (
                      <Chip
                        size="small"
                        label={ESTIMATE_LABEL}
                        data-testid={`cob-estimate-badge-${row.responsibleParty}`}
                        sx={{
                          height: 20,
                          fontFamily: 'Inter',
                          fontSize: fontSize.xs,
                          fontWeight: fontWeight.semibold,
                          borderRadius: radius.pill,
                          color: COLORS.STATUS_UNCONFIRMED,
                          backgroundColor: 'rgba(217, 119, 6, 0.10)',
                          border: '1px solid rgba(217, 119, 6, 0.3)',
                        }}
                      />
                    )}

                    {isRange && (
                      <Tooltip
                        title={
                          // The backend's explanation names the actual spread
                          // and the one question worth asking the payer, which
                          // is more use than our generic sentence.
                          estimate.explanation ||
                          "We haven't confirmed how this plan calculates a secondary payment, so we show the whole possible range."
                        }
                      >
                        <InfoIcon
                          data-testid={`cob-estimate-range-info-${row.responsibleParty}`}
                          sx={{ fontSize: 15, color: COLORS.TEXT_MUTED }}
                        />
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>

                <TableCell sx={{ ...bodyCellSx, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {formatMoney(row.charges)}
                </TableCell>

                <TableCell
                  sx={{ ...bodyCellSx, textAlign: 'right', whiteSpace: 'nowrap' }}
                  data-testid={`cob-balance-paid-${row.responsibleParty}`}
                >
                  {/* Before the remittance arrives there is no payment, so the
                      estimate goes here — clearly as an estimate. */}
                  {isEstimated
                    ? formatEstimate({ estimateLow: estimate.low, estimateHigh: estimate.high })
                    : formatMoney(row.payments)}
                </TableCell>

                <TableCell
                  sx={{ ...bodyCellSx, textAlign: 'right', whiteSpace: 'nowrap', color: COLORS.TEXT_MUTED }}
                  data-testid={`cob-balance-adjustment-${row.responsibleParty}`}
                >
                  {row.contractualAdjustments ? `−${formatMoney(Math.abs(row.contractualAdjustments))}` : '—'}
                </TableCell>

                <TableCell
                  sx={{
                    ...bodyCellSx,
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                    fontWeight: fontWeight.semibold,
                    color: COLORS.TEXT_PRIMARY,
                  }}
                  data-testid={`cob-balance-amount-${row.responsibleParty}`}
                >
                  {formatMoney(row.balance)}
                </TableCell>
              </TableRow>
            );
          })}

          {/* The adjustment total gets the full compliance wording, once. */}
          {data?.contractualAdjustmentsTotal ? (
            <TableRow data-testid="cob-contractual-adjustment">
              <TableCell colSpan={4} sx={{ ...bodyCellSx, color: COLORS.TEXT_MUTED, borderBottom: 'none' }}>
                {CONTRACTUAL_ADJUSTMENT_LABEL}
              </TableCell>
              <TableCell
                sx={{
                  ...bodyCellSx,
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                  color: COLORS.TEXT_MUTED,
                  borderBottom: 'none',
                }}
              >
                −{formatMoney(Math.abs(data.contractualAdjustmentsTotal))}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ResponsibilityBalanceTable;
